/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { editImage, getEditPrompt, ImageEditFailedError, ImageEditTimeoutError, saveEditedImage } from './imageEditing.ts'

const { axios, davClient, fetchPhotoExif } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
	davClient: { putFileContents: vi.fn(), customRequest: vi.fn() },
	fetchPhotoExif: vi.fn(),
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/router', () => ({
	generateOcsUrl: (url: string, params: Record<string, number> = {}) => '/ocs/v2.php/' + url.replace(/{(\w+)}/g, (_, key) => String(params[key])),
}))
vi.mock('./DavClient.ts', () => ({ davClient }))
vi.mock('./exifFetcher.ts', () => ({ fetchPhotoExif }))

/**
 * @param data - Payload of the OCS response
 */
function ocs(data: unknown) {
	return { data: { ocs: { meta: { status: 'ok' }, data } } }
}

/**
 * @param status - Status of the task
 * @param fields - Other fields of the task
 */
function task(status: string, fields: Record<string, unknown> = {}) {
	return ocs({ task: { id: 42, status, progress: null, output: null, userFacingErrorMessage: null, ...fields } })
}

const editedImage = new Blob(['edited'], { type: 'image/png' })

const photo: PhotoTarget = {
	fileid: 7,
	basename: 'Beach.jpeg',
	davPath: '/files/alice/Photos/Beach.jpeg',
	permissions: 31,
	favorite: false,
	mime: 'image/jpeg',
}

describe('getEditPrompt', () => {
	test('uses a fixed prompt for enhancing and restoring', () => {
		expect(getEditPrompt('enhance', 'ignored')).toMatch(/^Enhance this photo/)
		expect(getEditPrompt('restore', '')).toMatch(/^Restore this old photo/)
	})

	test('names what to remove, and needs it', () => {
		expect(getEditPrompt('remove', '  the red car ')).toMatch(/^Remove .*: the red car$/)
		expect(getEditPrompt('remove', '  ')).toBe('')
	})

	test('sends a custom prompt as it is', () => {
		expect(getEditPrompt('custom', ' Make it black and white ')).toBe('Make it black and white')
	})
})

// The availability is kept for the whole page load, each test starts from a
// fresh copy of the module.
describe('isImageEditingAvailable', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.clearAllMocks()
	})

	test('is true when the server lists the image editing task type', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:image2image': {}, 'core:text2text': {} } }))
		const { isImageEditingAvailable } = await import('./imageEditing.ts')

		expect(await isImageEditingAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/tasktypes')
	})

	test('is false when no provider for image editing is set up', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:text2image': {} } }))
		const { isImageEditingAvailable } = await import('./imageEditing.ts')

		expect(await isImageEditingAvailable()).toBe(false)
	})

	test('asks the server only once', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:image2image': {} } }))
		const { isImageEditingAvailable } = await import('./imageEditing.ts')

		await Promise.all([isImageEditingAvailable(), isImageEditingAvailable()])
		await isImageEditingAvailable()

		expect(axios.get).toHaveBeenCalledTimes(1)
	})

	test('is false when the request fails, and asks again next time', async () => {
		axios.get.mockRejectedValueOnce(new Error('Network error'))
		axios.get.mockResolvedValueOnce(ocs({ types: { 'core:image2image': {} } }))
		const { isImageEditingAvailable } = await import('./imageEditing.ts')

		expect(await isImageEditingAvailable()).toBe(false)
		expect(await isImageEditingAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledTimes(2)
	})
})

describe('editImage', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		axios.post.mockImplementation(async (url: string) => url.endsWith('/schedule') ? task('STATUS_SCHEDULED') : ocs({}))
		axios.get.mockImplementation(async (url: string) => url.includes('/file/') ? { data: editedImage } : task('STATUS_RUNNING'))
		axios.delete.mockResolvedValue(ocs({}))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('schedules an image editing task for the file and the prompt', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: 99 } }))

		await editImage(7, 'Enhance')

		expect(axios.post).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/schedule', {
			type: 'core:image2image',
			appId: 'photos',
			input: { input: [7], prompt: 'Enhance' },
		}, { signal: undefined })
	})

	test('polls the task until it succeeds, returns its image and deletes the task', async () => {
		axios.get
			.mockResolvedValueOnce(task('STATUS_RUNNING', { progress: 0.5 }))
			.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: 99 } }))
		const onUpdate = vi.fn()

		const result = editImage(7, 'Enhance', { onUpdate, pollInterval: 1000 })
		await vi.advanceTimersByTimeAsync(2000)

		expect(await result).toBe(editedImage)
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/task/42', { signal: undefined })
		expect(axios.get).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/file/99', { responseType: 'blob', signal: undefined })
		expect(onUpdate.mock.calls).toEqual([['STATUS_SCHEDULED', null], ['STATUS_RUNNING', 0.5]])
		expect(axios.delete).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/task/42')
	})

	test('rejects a result which is not an image, and still deletes the task', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: 99 } }))
		axios.get.mockResolvedValueOnce({ data: new Blob(['<html>'], { type: 'text/html' }) })

		await expect(editImage(7, 'Enhance')).rejects.toBeInstanceOf(ImageEditFailedError)
		expect(axios.delete).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/task/42')
	})

	test('throws with the message of the provider when the task fails', async () => {
		axios.get.mockResolvedValueOnce(task('STATUS_FAILED', { userFacingErrorMessage: 'Image too large' }))

		const result = editImage(7, 'Enhance', { pollInterval: 1000 })
		const assertion = expect(result).rejects.toEqual(new ImageEditFailedError('Image too large'))
		await vi.advanceTimersByTimeAsync(1000)

		await assertion
		await expect(result).rejects.toHaveProperty('userFacingMessage', 'Image too large')
	})

	test('throws without a message when a successful task has no image', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: {} }))

		await expect(editImage(7, 'Enhance')).rejects.toHaveProperty('userFacingMessage', null)
	})

	test('gives up and cancels the task after the timeout', async () => {
		const result = editImage(7, 'Enhance', { pollInterval: 1000, timeout: 3500 })
		const assertion = expect(result).rejects.toBeInstanceOf(ImageEditTimeoutError)
		await vi.advanceTimersByTimeAsync(5000)

		await assertion
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})

	test('stops polling and cancels the task when aborted', async () => {
		const controller = new AbortController()

		const result = editImage(7, 'Enhance', { signal: controller.signal, pollInterval: 1000 })
		const assertion = expect(result).rejects.toThrow('Closed')
		await vi.advanceTimersByTimeAsync(0)
		controller.abort(new Error('Closed'))

		await assertion
		await vi.advanceTimersByTimeAsync(5000)
		expect(axios.get).not.toHaveBeenCalled()
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})
})

describe('saveEditedImage', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		davClient.putFileContents.mockResolvedValue(true)
		davClient.customRequest.mockResolvedValue({})
		fetchPhotoExif.mockResolvedValue({ exif: {}, ifd0: {}, takenAt: 1700000000, gps: { latitude: 38.7, longitude: -9.1 } })
	})

	test('creates a new file next to the original, never overwriting one', async () => {
		expect(await saveEditedImage(photo, editedImage)).toBe('/files/alice/Photos/Beach (AI edit).png')

		expect(davClient.putFileContents).toHaveBeenCalledWith('/files/alice/Photos/Beach (AI edit).png', expect.any(ArrayBuffer), { overwrite: false })
	})

	test('numbers the name when an edited copy already exists', async () => {
		davClient.putFileContents.mockResolvedValueOnce(false).mockResolvedValueOnce(false)

		expect(await saveEditedImage(photo, editedImage)).toBe('/files/alice/Photos/Beach (AI edit 3).png')
		expect(davClient.putFileContents).toHaveBeenCalledTimes(3)
	})

	test('copies the taken date and the position of the original to the copy', async () => {
		await saveEditedImage(photo, editedImage)

		expect(fetchPhotoExif).toHaveBeenCalledWith(photo)
		const [path, { data }] = davClient.customRequest.mock.calls[0]
		expect(path).toBe('/files/alice/Photos/Beach (AI edit).png')
		expect(data).toContain('<nc:metadata-photos-original_date_time>1700000000</nc:metadata-photos-original_date_time>')
		expect(data).toContain('<nc:latitude>38.7</nc:latitude>')
		expect(data).toContain('<nc:longitude>-9.1</nc:longitude>')
	})

	test('copies nothing when the original has no taken date', async () => {
		fetchPhotoExif.mockResolvedValue({ exif: {}, ifd0: {} })

		await saveEditedImage(photo, editedImage)

		expect(davClient.customRequest).not.toHaveBeenCalled()
	})

	test('keeps the copy when its metadata cannot be set', async () => {
		davClient.customRequest.mockRejectedValue(new Error('Forbidden'))

		expect(await saveEditedImage(photo, editedImage)).toBe('/files/alice/Photos/Beach (AI edit).png')
	})

	test('fails when the copy cannot be created', async () => {
		davClient.putFileContents.mockRejectedValue(new Error('Request failed with status code 403'))

		await expect(saveEditedImage(photo, editedImage)).rejects.toThrow('403')
		expect(davClient.customRequest).not.toHaveBeenCalled()
	})
})

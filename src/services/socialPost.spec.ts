/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
	canPostToSocial,
	downscaleImage,
	fetchPhotoCaption,
	getSocialError,
	isSocialEnabled,
	postToSocial,
} from './socialPost.ts'

const { axios, davClient, loadState } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn() },
	davClient: { stat: vi.fn() },
	loadState: vi.fn(),
}))

vi.mock('@nextcloud/axios', () => ({
	default: axios,
	isAxiosError: (error: { isAxiosError?: boolean }) => error?.isAxiosError === true,
}))
vi.mock('@nextcloud/initial-state', () => ({ loadState }))
vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string, params: Record<string, unknown> = {}) => url.replace(/{(\w+)}/g, (_, key) => String(params[key])),
}))
vi.mock('./DavClient.ts', () => ({ davClient }))

/**
 * @param fileid - Id of the photo
 * @param mime - Mime type of the photo
 */
function photo(fileid: number, mime = 'image/jpeg'): PhotoTarget {
	return { fileid, basename: `${fileid}.jpg`, davPath: `/files/alice/Photos/${fileid}.jpg`, mime, permissions: 31, favorite: false }
}

/**
 * @param status - HTTP status of the refusal
 * @param data - Body of the refusal
 */
function axiosError(status: number, data: Record<string, unknown>) {
	return { isAxiosError: true, response: { status, data } }
}

/**
 * Stand in for the image decoding and encoding of the browser.
 *
 * @param width - Width of the decoded image
 * @param height - Height of the decoded image
 */
function mockCanvas(width: number, height: number) {
	const bitmap = { width, height, close: vi.fn() }
	const context = { drawImage: vi.fn() }
	vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap))
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
	const toBlob = vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function(this: HTMLCanvasElement, callback, type) {
		callback(new Blob(['pixels'], { type }))
	})
	return { bitmap, context, toBlob }
}

beforeEach(() => {
	vi.clearAllMocks()
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('isSocialEnabled', () => {
	test('reads the initial state, off by default', () => {
		loadState.mockImplementation((_app, _key, fallback) => fallback)
		expect(isSocialEnabled()).toBe(false)
		expect(loadState).toHaveBeenCalledWith('photos', 'social', false)

		loadState.mockReturnValue(true)
		expect(isSocialEnabled()).toBe(true)
	})
})

describe('canPostToSocial', () => {
	test('takes one to four photos', () => {
		expect(canPostToSocial([])).toBe(false)
		expect(canPostToSocial([photo(1)])).toBe(true)
		expect(canPostToSocial([photo(1), photo(2), photo(3), photo(4)])).toBe(true)
		expect(canPostToSocial([photo(1), photo(2), photo(3), photo(4), photo(5)])).toBe(false)
	})

	test('refuses videos', () => {
		expect(canPostToSocial([photo(1), photo(2, 'video/mp4')])).toBe(false)
	})
})

describe('fetchPhotoCaption', () => {
	test('returns the generated description', async () => {
		davClient.stat.mockResolvedValue({ data: { props: { 'metadata-photos-caption': ' A dog on a beach ' } } })

		await expect(fetchPhotoCaption(photo(1))).resolves.toBe('A dog on a beach')
		expect(davClient.stat).toHaveBeenCalledWith('/files/alice/Photos/1.jpg', expect.objectContaining({ details: true }))
	})

	test('is empty without a description or when the request fails', async () => {
		davClient.stat.mockResolvedValueOnce({ data: { props: {} } })
		await expect(fetchPhotoCaption(photo(1))).resolves.toBe('')

		davClient.stat.mockRejectedValueOnce(new Error('404'))
		await expect(fetchPhotoCaption(photo(1))).resolves.toBe('')
	})
})

describe('downscaleImage', () => {
	test('scales the longest edge down and re-encodes as JPEG', async () => {
		const { bitmap, context, toBlob } = mockCanvas(4000, 3000)

		const result = await downscaleImage(new Blob(['x'], { type: 'image/jpeg' }), 2048)

		expect(createImageBitmap).toHaveBeenCalledWith(expect.any(Blob), { imageOrientation: 'from-image' })
		expect(context.drawImage).toHaveBeenCalledWith(bitmap, 0, 0, 2048, 1536)
		expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.9)
		expect(bitmap.close).toHaveBeenCalled()
		expect(result.type).toBe('image/jpeg')
	})

	test('keeps small images at their size and PNG as PNG', async () => {
		const { context } = mockCanvas(800, 600)

		const result = await downscaleImage(new Blob(['x'], { type: 'image/png' }), 2048)

		expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 800, 600)
		expect(result.type).toBe('image/png')
	})
})

describe('postToSocial', () => {
	test('uploads re-encoded previews with their alt text, then creates the post', async () => {
		mockCanvas(4000, 3000)
		const append = vi.spyOn(FormData.prototype, 'append')
		axios.get.mockResolvedValue({ data: new Blob(['preview'], { type: 'image/jpeg' }) })
		axios.post
			.mockResolvedValueOnce({ data: { id: '101' } })
			.mockResolvedValueOnce({ data: { id: '102' } })
			.mockResolvedValueOnce({ data: { url: 'https://cloud.example.org/@alice/7' } })

		const result = await postToSocial({
			text: ' Holidays ',
			visibility: 'unlisted',
			photos: [{ photo: photo(1), description: ' A dog ' }, { photo: photo(2), description: '' }],
			idempotencyKey: 'key',
		})

		expect(result).toEqual({ heldForReview: false, url: 'https://cloud.example.org/@alice/7' })
		expect(axios.get).toHaveBeenCalledWith('/apps/photos/api/v1/preview/1?x=2048&y=2048', { responseType: 'blob' })

		const [mediaUrl, form] = axios.post.mock.calls[0]!
		expect(mediaUrl).toBe('/apps/social/api/v1/media')
		expect(form).toBeInstanceOf(FormData)
		expect(append).toHaveBeenCalledWith('file', expect.any(Blob), 'photo-1.jpg')
		expect(append).toHaveBeenCalledWith('description', 'A dog')
		expect(append).toHaveBeenCalledWith('file', expect.any(Blob), 'photo-2.jpg')

		expect(axios.post).toHaveBeenLastCalledWith(
			'/apps/social/api/v1/statuses',
			{ status: 'Holidays', visibility: 'unlisted', media_ids: ['101', '102'] },
			{ headers: { 'Idempotency-Key': 'key' } },
		)
	})

	test('reports a post held for review without a link', async () => {
		mockCanvas(100, 100)
		axios.get.mockResolvedValue({ data: new Blob(['preview'], { type: 'image/jpeg' }) })
		axios.post
			.mockResolvedValueOnce({ data: { id: '101' } })
			.mockRejectedValueOnce(axiosError(422, { held_for_review: true }))

		await expect(postToSocial({ text: '', visibility: 'public', photos: [{ photo: photo(1), description: '' }], idempotencyKey: 'key' }))
			.resolves.toEqual({ heldForReview: true, url: null })
	})

	test('links only to a web address', async () => {
		mockCanvas(100, 100)
		axios.get.mockResolvedValue({ data: new Blob(['preview'], { type: 'image/jpeg' }) })
		axios.post
			.mockResolvedValueOnce({ data: { id: '101' } })
			.mockResolvedValueOnce({ data: { url: 'javascript:alert(1)' } })

		await expect(postToSocial({ text: '', visibility: 'public', photos: [{ photo: photo(1), description: '' }], idempotencyKey: 'key' }))
			.resolves.toEqual({ heldForReview: false, url: null })
	})

	test('does not create the post when an upload fails', async () => {
		mockCanvas(100, 100)
		axios.get.mockResolvedValue({ data: new Blob(['preview'], { type: 'image/jpeg' }) })
		axios.post.mockRejectedValueOnce(axiosError(413, { error: 'too large' }))

		await expect(postToSocial({ text: '', visibility: 'public', photos: [{ photo: photo(1), description: '' }], idempotencyKey: 'key' }))
			.rejects.toMatchObject({ response: { status: 413 } })
		expect(axios.post).toHaveBeenCalledTimes(1)
	})
})

describe('getSocialError', () => {
	test('points to the setup of a missing account', () => {
		expect(getSocialError(axiosError(403, { code: 'account-not-set-up', setup_url: 'javascript:alert(1)' })))
			.toEqual({ message: expect.any(String), setupUrl: '/apps/social/' })
	})

	test('passes the reason of the server on', () => {
		expect(getSocialError(axiosError(422, { error: 'Text too long' })).message).toContain('Text too long')
	})

	test('falls back to a generic message', () => {
		expect(getSocialError(new Error('offline'))).toEqual({ message: 'Could not post to Social' })
	})
})

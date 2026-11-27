/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { extractText, TextExtractionFailedError, TextExtractionTimeoutError } from './textExtraction.ts'

const { axios } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn() },
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/router', () => ({
	generateOcsUrl: (url: string, params: Record<string, number> = {}) => '/ocs/v2.php/' + url.replace(/{(\w+)}/g, (_, key) => String(params[key])),
}))

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

// The availability is kept for the whole page load, each test starts from a
// fresh copy of the module.
describe('isTextExtractionAvailable', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.clearAllMocks()
	})

	test('is true when the server lists the OCR task type', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:image2text:ocr': {}, 'core:text2text': {} } }))
		const { isTextExtractionAvailable } = await import('./textExtraction.ts')

		expect(await isTextExtractionAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/tasktypes')
	})

	test('is false when no provider for the OCR task type is set up', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:text2text': {} } }))
		const { isTextExtractionAvailable } = await import('./textExtraction.ts')

		expect(await isTextExtractionAvailable()).toBe(false)
	})

	test('asks the server only once', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:image2text:ocr': {} } }))
		const { isTextExtractionAvailable } = await import('./textExtraction.ts')

		await Promise.all([isTextExtractionAvailable(), isTextExtractionAvailable()])
		await isTextExtractionAvailable()

		expect(axios.get).toHaveBeenCalledTimes(1)
	})

	test('is false when the request fails, and asks again next time', async () => {
		axios.get.mockRejectedValueOnce(new Error('Network error'))
		axios.get.mockResolvedValueOnce(ocs({ types: { 'core:image2text:ocr': {} } }))
		const { isTextExtractionAvailable } = await import('./textExtraction.ts')

		expect(await isTextExtractionAvailable()).toBe(false)
		expect(await isTextExtractionAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledTimes(2)
	})
})

describe('extractText', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		axios.post.mockImplementation(async (url: string) => url.endsWith('/schedule') ? task('STATUS_SCHEDULED') : ocs({}))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('schedules an OCR task for the file', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: ['Hello'] } }))

		await extractText(7)

		expect(axios.post).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/schedule', {
			type: 'core:image2text:ocr',
			appId: 'photos',
			input: { input: [7] },
		}, { signal: undefined })
	})

	test('polls the task until it succeeds and returns its text', async () => {
		axios.get
			.mockResolvedValueOnce(task('STATUS_RUNNING', { progress: 0.5 }))
			.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: [' Hello\nWorld '] } }))
		const onUpdate = vi.fn()

		const result = extractText(7, { onUpdate, pollInterval: 1000 })
		await vi.advanceTimersByTimeAsync(2000)

		expect(await result).toBe('Hello\nWorld')
		expect(axios.get).toHaveBeenCalledTimes(2)
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/task/42', { signal: undefined })
		expect(onUpdate.mock.calls).toEqual([['STATUS_SCHEDULED', null], ['STATUS_RUNNING', 0.5]])
	})

	test('joins the texts of a multi-part output', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: ['Page 1', 'Page 2'] } }))

		expect(await extractText(7)).toBe('Page 1\n\nPage 2')
	})

	test('returns an empty text when the task found none', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: [] } }))

		expect(await extractText(7)).toBe('')
	})

	test('throws with the message of the provider when the task fails', async () => {
		axios.get.mockResolvedValueOnce(task('STATUS_FAILED', { userFacingErrorMessage: 'Image too large' }))

		const result = extractText(7, { pollInterval: 1000 })
		const assertion = expect(result).rejects.toEqual(new TextExtractionFailedError('Image too large'))
		await vi.advanceTimersByTimeAsync(1000)

		await assertion
		await expect(result).rejects.toHaveProperty('userFacingMessage', 'Image too large')
	})

	test('throws without a message when the task was cancelled', async () => {
		axios.get.mockResolvedValueOnce(task('STATUS_CANCELLED'))

		const result = extractText(7, { pollInterval: 1000 })
		const assertion = expect(result).rejects.toHaveProperty('userFacingMessage', null)
		await vi.advanceTimersByTimeAsync(1000)

		await assertion
		await expect(result).rejects.toBeInstanceOf(TextExtractionFailedError)
	})

	test('gives up and cancels the task after the timeout', async () => {
		axios.get.mockResolvedValue(task('STATUS_RUNNING'))

		const result = extractText(7, { pollInterval: 1000, timeout: 3500 })
		const assertion = expect(result).rejects.toBeInstanceOf(TextExtractionTimeoutError)
		await vi.advanceTimersByTimeAsync(5000)

		await assertion
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})

	test('stops polling and cancels the task when aborted', async () => {
		const controller = new AbortController()

		const result = extractText(7, { signal: controller.signal, pollInterval: 1000 })
		const assertion = expect(result).rejects.toThrow('Closed')
		await vi.advanceTimersByTimeAsync(0)
		controller.abort(new Error('Closed'))

		await assertion
		await vi.advanceTimersByTimeAsync(5000)
		expect(axios.get).not.toHaveBeenCalled()
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})

	test('cancels the task when polling it fails', async () => {
		axios.get.mockRejectedValueOnce(new Error('Network error'))

		const result = extractText(7, { pollInterval: 1000 })
		const assertion = expect(result).rejects.toThrow('Network error')
		await vi.advanceTimersByTimeAsync(1000)

		await assertion
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})

	test('does not cancel anything when scheduling fails', async () => {
		axios.post.mockRejectedValueOnce(new Error('Request failed with status code 401'))

		await expect(extractText(7)).rejects.toThrow('401')
		expect(axios.post).toHaveBeenCalledTimes(1)
	})
})

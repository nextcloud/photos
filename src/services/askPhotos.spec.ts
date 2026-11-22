/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { askPhotos, AskPhotosError, buildAskPrompt, parseAskResponse, runTextToTextTask } from './askPhotos.ts'

const { axios, getPlaceOptions, getTagOptions } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn() },
	getPlaceOptions: vi.fn(),
	getTagOptions: vi.fn(),
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/router', () => ({
	generateOcsUrl: (url: string, params: Record<string, number> = {}) => '/ocs/v2.php/' + url.replace(/{(\w+)}/g, (_, key) => String(params[key])),
}))
vi.mock('./PhotosFilters/placesFilter.ts', () => ({ placesFilter: { getOptions: getPlaceOptions } }))
vi.mock('./PhotosFilters/tagsFilter.ts', () => ({ tagsFilter: { getOptions: getTagOptions } }))

const vocabulary = {
	places: ['Lisbon', 'Porto', 'New York'],
	tags: ['beach', 'Dog', 'mountain'],
}

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
	return ocs({ task: { id: 42, status, output: null, userFacingErrorMessage: null, ...fields } })
}

/**
 * @param year - Full year
 * @param month - Month, starting at 1
 * @param day - Day of the month
 */
function day(year: number, month: number, day: number): number {
	return new Date(year, month - 1, day).getTime()
}

describe('buildAskPrompt', () => {
	const prompt = buildAskPrompt('Photos from "Lisbon" last summer', new Date(2026, 10, 22, 15, 30), vocabulary)

	test('includes the date of today in local time', () => {
		expect(prompt).toContain('Today is Sunday, 2026-11-22.')
	})

	test('lists the places and tags to pick from', () => {
		expect(prompt).toContain('Places: ["Lisbon","Porto","New York"]')
		expect(prompt).toContain('Tags: ["beach","Dog","mountain"]')
	})

	test('quotes the question as a JSON string', () => {
		expect(prompt).toMatch(/\nRequest: "Photos from \\"Lisbon\\" last summer"$/)
	})

	test('asks for the JSON object only and describes its keys', () => {
		expect(prompt).toContain('Reply with a single JSON object and nothing else')
		for (const key of ['"dateRange"', '"places"', '"tags"', '"name"']) {
			expect(prompt).toContain(key)
		}
	})

	test('caps the number of names', () => {
		const places = Array.from({ length: 600 }, (_, i) => `Place ${i}`)
		const longPrompt = buildAskPrompt('Anything', new Date(2026, 10, 22), { places, tags: [] })

		expect(longPrompt).toContain('"Place 499"')
		expect(longPrompt).not.toContain('"Place 500"')
	})
})

describe('parseAskResponse', () => {
	test('reads every filter', () => {
		const output = JSON.stringify({
			dateRange: { start: '2026-06-01', end: '2026-08-31' },
			places: ['Lisbon'],
			tags: ['beach'],
			name: 'IMG_',
		})

		expect(parseAskResponse(output, vocabulary)).toEqual({
			dateRange: { start: day(2026, 6, 1), end: day(2026, 8, 31) },
			places: ['Lisbon'],
			tags: ['beach'],
			name: 'IMG_',
		})
	})

	test('ignores the text around the object, code blocks and reasoning', () => {
		const output = '<think>Maybe {"places": ["Porto"]}?</think>Sure!\n```json\n{"places": ["Lisbon"]}\n```'

		expect(parseAskResponse(output, vocabulary)).toEqual({ dateRange: undefined, places: ['Lisbon'], tags: [], name: undefined })
	})

	test('only keeps the places and tags of the lists, spelled as in the lists', () => {
		const output = JSON.stringify({ places: ['lisbon', ' New York ', 'Paris', 3, 'Lisbon'], tags: ['dog', 'cat', null] })

		expect(parseAskResponse(output, vocabulary)).toMatchObject({ places: ['Lisbon', 'New York'], tags: ['Dog'] })
	})

	test('ignores unknown keys and values of the wrong type', () => {
		const output = JSON.stringify({ places: 'Lisbon', tags: { beach: true }, name: 42, people: ['Alice'], dateRange: '2026', tags2: ['beach'] })

		expect(parseAskResponse(output, vocabulary)).toBeNull()
	})

	test('orders the ends of a reversed date range', () => {
		const output = JSON.stringify({ dateRange: { start: '2023-12-31', end: '2023-01-01' } })

		expect(parseAskResponse(output, vocabulary)?.dateRange).toEqual({ start: day(2023, 1, 1), end: day(2023, 12, 31) })
	})

	test.each([
		[{ start: '2023-02-30', end: '2023-03-01' }],
		[{ start: '2023-1-1', end: '2023-12-31' }],
		[{ start: '2023-01-01T00:00:00Z', end: '2023-12-31' }],
		[{ start: '2023-01-01' }],
		[{ start: 1672531200, end: 1703980800 }],
	])('drops the invalid date range %o', (dateRange) => {
		const output = JSON.stringify({ dateRange, tags: ['beach'] })

		expect(parseAskResponse(output, vocabulary)).toEqual({ dateRange: undefined, places: [], tags: ['beach'], name: undefined })
	})

	test('drops an empty or overlong name', () => {
		expect(parseAskResponse('{"name": "  "}', vocabulary)).toBeNull()
		expect(parseAskResponse(JSON.stringify({ name: 'a'.repeat(101) }), vocabulary)).toBeNull()
		expect(parseAskResponse('{"name": " holiday "}', vocabulary)?.name).toBe('holiday')
	})

	test.each([
		[''],
		['I could not find anything.'],
		['{}'],
		['{"places": ["Lisbon"'],
		['["Lisbon"]'],
		['null'],
	])('returns null for %j', (output) => {
		expect(parseAskResponse(output, vocabulary)).toBeNull()
	})
})

describe('runTextToTextTask', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		axios.post.mockImplementation(async (url: string) => url.endsWith('/schedule') ? task('STATUS_SCHEDULED') : ocs({}))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('schedules a text to text task and polls it until it succeeds', async () => {
		axios.get
			.mockResolvedValueOnce(task('STATUS_RUNNING'))
			.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: '{}' } }))

		const result = runTextToTextTask('Prompt', { pollInterval: 1000 })
		await vi.advanceTimersByTimeAsync(2000)

		expect(await result).toBe('{}')
		expect(axios.post).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/schedule', {
			type: 'core:text2text',
			appId: 'photos',
			input: { input: 'Prompt' },
		}, { signal: undefined })
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/task/42', { signal: undefined })
	})

	test('throws with the message of the provider when the task fails', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_FAILED', { userFacingErrorMessage: 'Quota exceeded' }))

		await expect(runTextToTextTask('Prompt')).rejects.toEqual(new AskPhotosError('failed', 'Quota exceeded'))
	})

	test('throws when the output is not a text', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: ['{}'] } }))

		await expect(runTextToTextTask('Prompt')).rejects.toHaveProperty('reason', 'failed')
	})

	test('gives up and cancels the task after the timeout', async () => {
		axios.get.mockResolvedValue(task('STATUS_RUNNING'))

		const result = runTextToTextTask('Prompt', { pollInterval: 1000, timeout: 3500 })
		const assertion = expect(result).rejects.toHaveProperty('reason', 'timeout')
		await vi.advanceTimersByTimeAsync(5000)

		await assertion
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})

	test('stops polling and cancels the task when aborted', async () => {
		const controller = new AbortController()

		const result = runTextToTextTask('Prompt', { signal: controller.signal, pollInterval: 1000 })
		const assertion = expect(result).rejects.toThrow('Cancelled')
		await vi.advanceTimersByTimeAsync(0)
		controller.abort(new Error('Cancelled'))

		await assertion
		await vi.advanceTimersByTimeAsync(5000)
		expect(axios.get).not.toHaveBeenCalled()
		expect(axios.post).toHaveBeenLastCalledWith('/ocs/v2.php/taskprocessing/tasks/42/cancel')
	})
})

describe('askPhotos', () => {
	const fetchBeachFiles = vi.fn(async () => 'beach')
	const fetchDogFiles = vi.fn(async () => 'Dog')

	beforeEach(() => {
		vi.clearAllMocks()
		getPlaceOptions.mockResolvedValue([
			{ filterId: 'places', label: 'Lisbon', value: 'Lisbon' },
			{ filterId: 'places', label: 'Porto', value: 'Porto' },
		])
		getTagOptions.mockResolvedValue([
			{ filterId: 'tags', label: 'Beach', value: 'beach', getValue: fetchBeachFiles },
			{ filterId: 'tags', label: 'Dog', value: 'Dog', getValue: fetchDogFiles },
		])
	})

	test('sends the places and tags of the user and fetches the files of the answered tags', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: '{"places": ["Lisbon", "Berlin"], "tags": ["beach"]}' } }))

		expect(await askPhotos('Beach in Lisbon')).toEqual({ dateRange: undefined, places: ['Lisbon'], tags: ['beach'], name: undefined })

		const prompt = axios.post.mock.calls[0][1].input.input
		expect(prompt).toContain('Places: ["Lisbon","Porto"]')
		expect(prompt).toContain('Tags: ["beach","Dog"]')
		expect(prompt).toContain('Request: "Beach in Lisbon"')
		expect(fetchBeachFiles).toHaveBeenCalledOnce()
		expect(fetchDogFiles).not.toHaveBeenCalled()
	})

	test('throws when the answer holds no filter', async () => {
		axios.post.mockResolvedValueOnce(task('STATUS_SUCCESSFUL', { output: { output: 'Sorry, I cannot help with that.' } }))

		await expect(askPhotos('Anything')).rejects.toEqual(new AskPhotosError('unparsable'))
	})
})

// The availability is kept for the whole page load, each test starts from a
// fresh copy of the module.
describe('isAskPhotosAvailable', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.clearAllMocks()
	})

	test('is true when the server lists the text to text task type', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:text2text': {} } }))
		const { isAskPhotosAvailable } = await import('./askPhotos.ts')

		expect(await isAskPhotosAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/taskprocessing/tasktypes')
	})

	test('is false when no provider for it is set up', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:image2text:ocr': {} } }))
		const { isAskPhotosAvailable } = await import('./askPhotos.ts')

		expect(await isAskPhotosAvailable()).toBe(false)
	})

	test('asks the server only once', async () => {
		axios.get.mockResolvedValue(ocs({ types: { 'core:text2text': {} } }))
		const { isAskPhotosAvailable } = await import('./askPhotos.ts')

		await Promise.all([isAskPhotosAvailable(), isAskPhotosAvailable()])
		await isAskPhotosAvailable()

		expect(axios.get).toHaveBeenCalledTimes(1)
	})

	test('is false when the request fails, and asks again next time', async () => {
		axios.get.mockRejectedValueOnce(new Error('Network error'))
		axios.get.mockResolvedValueOnce(ocs({ types: { 'core:text2text': {} } }))
		const { isAskPhotosAvailable } = await import('./askPhotos.ts')

		expect(await isAskPhotosAvailable()).toBe(false)
		expect(await isAskPhotosAvailable()).toBe(true)
		expect(axios.get).toHaveBeenCalledTimes(2)
	})
})

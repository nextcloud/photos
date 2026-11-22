/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { DateRangeValueType } from './PhotosFilters/dateRangeFilter.ts'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { placesFilter } from './PhotosFilters/placesFilter.ts'
import { tagsFilter } from './PhotosFilters/tagsFilter.ts'

/** Id of the free text generation task type of the TaskProcessing API. */
export const TEXT_TO_TEXT_TASK_TYPE = 'core:text2text'

/** Most place and tag names sent to the assistant, to bound the prompt size. */
const MAX_NAMES = 500

/** Longest file name part accepted from the assistant. */
const MAX_NAME_LENGTH = 100

type TaskStatus = 'STATUS_UNKNOWN' | 'STATUS_SCHEDULED' | 'STATUS_RUNNING' | 'STATUS_SUCCESSFUL' | 'STATUS_FAILED' | 'STATUS_CANCELLED'

type Task = {
	id: number
	status: TaskStatus
	output: { output?: unknown } | null
	userFacingErrorMessage: string | null
}

/** Names of the places and tags of the user, the only ones the assistant may pick. */
export type AskVocabulary = {
	places: string[]
	tags: string[]
}

/** Filters understood from a question, as values of the matching photos filters. */
export type AskFilters = {
	dateRange?: DateRangeValueType
	places: string[]
	tags: string[]
	name?: string
}

export type AskOptions = {
	/** Aborts the question and cancels the task on the server. */
	signal?: AbortSignal
	/** Delay between two polls of the task, in milliseconds. */
	pollInterval?: number
	/** Time after which the task is cancelled and given up on, in milliseconds. */
	timeout?: number
}

/**
 * The question could not be turned into filters: the task failed or was
 * cancelled, took too long, or its answer held no usable filter.
 */
export class AskPhotosError extends Error {
	constructor(
		public readonly reason: 'failed' | 'timeout' | 'unparsable',
		public readonly userFacingMessage: string | null = null,
	) {
		super(`Asking the photos failed: ${reason}`)
		this.name = 'AskPhotosError'
	}
}

let availability: Promise<boolean> | undefined

/**
 * Whether a provider for the free text generation task type is set up.
 *
 * The server only lists the task types a provider is available for. The answer
 * is fetched once per page load and shared by every caller.
 */
export function isAskPhotosAvailable(): Promise<boolean> {
	availability ??= axios.get<OCSResponse<{ types: Record<string, unknown> }>>(generateOcsUrl('taskprocessing/tasktypes'))
		.then(({ data }) => TEXT_TO_TEXT_TASK_TYPE in data.ocs.data.types)
		.catch(() => {
			availability = undefined
			return false
		})

	return availability
}

/**
 * @param value - Number to pad
 */
function pad(value: number): string {
	return String(value).padStart(2, '0')
}

/**
 * @param date - Date to format as `YYYY-MM-DD`, in local time
 */
function toIsoDay(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Build the instructions turning a question into the JSON filters `parseAskResponse` reads.
 *
 * @param query - Question of the user
 * @param today - Current date, to resolve relative dates
 * @param vocabulary - Names of the places and tags the answer may use
 */
export function buildAskPrompt(query: string, today: Date, vocabulary: AskVocabulary): string {
	const weekday = today.toLocaleDateString('en-US', { weekday: 'long' })

	return [
		'You turn a search request for a personal photo library into search filters.',
		`Today is ${weekday}, ${toIsoDay(today)}.`,
		'Reply with a single JSON object and nothing else: no explanation, no Markdown.',
		'The object may only have these keys, all optional:',
		'- "dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}, the first and last day the photos were taken on, both included.',
		'- "places": array of place names, each copied exactly from the list of places below.',
		'- "tags": array of tag names, each copied exactly from the list of tags below.',
		'- "name": text the file name contains, only when the request explicitly asks for a file name.',
		'Leave out every key the request does not ask for. Never use a place or tag that is not in the lists. Reply {} when nothing applies.',
		`Places: ${JSON.stringify(vocabulary.places.slice(0, MAX_NAMES))}`,
		`Tags: ${JSON.stringify(vocabulary.tags.slice(0, MAX_NAMES))}`,
		`Request: ${JSON.stringify(query)}`,
	].join('\n')
}

/**
 * @param value - Any value
 */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * @param value - `YYYY-MM-DD` day
 * @return The start of that day in local time, in milliseconds
 */
function parseDay(value: unknown): number | undefined {
	const match = typeof value === 'string' ? value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/) : null
	if (match === null) {
		return undefined
	}

	const [year, month, day] = match.slice(1).map(Number)
	const date = new Date(year, month - 1, day)

	// Out of range days like 2025-02-30 roll over to the next month.
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
		return undefined
	}

	return date.getTime()
}

/**
 * @param value - `{ start, end }` object of `YYYY-MM-DD` days
 */
function parseDateRange(value: unknown): DateRangeValueType | undefined {
	if (!isRecord(value)) {
		return undefined
	}

	const start = parseDay(value.start)
	const end = parseDay(value.end)
	if (start === undefined || end === undefined) {
		return undefined
	}

	return { start: Math.min(start, end), end: Math.max(start, end) }
}

/**
 * Keep the names that are in the allowed ones, ignoring case and spacing.
 *
 * @param value - Names picked by the assistant
 * @param allowed - Names the assistant may pick
 * @return The picked names, spelled as in the allowed ones
 */
function pickNames(value: unknown, allowed: string[]): string[] {
	if (!Array.isArray(value)) {
		return []
	}

	const allowedNames = new Map(allowed.map((name) => [name.trim().toLowerCase(), name]))
	const names = value
		.filter((name) => typeof name === 'string')
		.map((name) => allowedNames.get(name.trim().toLowerCase()))
		.filter((name) => name !== undefined)

	return [...new Set(names)]
}

/**
 * @param value - File name part
 */
function parseName(value: unknown): string | undefined {
	const name = typeof value === 'string' ? value.trim() : ''
	return name.length > 0 && name.length <= MAX_NAME_LENGTH ? name : undefined
}

/**
 * Read the filters from the answer of the assistant.
 *
 * Only the known keys holding valid values are kept, places and tags have to be
 * in the vocabulary. Text around the JSON object and reasoning blocks are ignored.
 *
 * @param output - Answer of the assistant
 * @param vocabulary - Names of the places and tags the answer may use
 * @return The filters, or null when the answer holds none
 */
export function parseAskResponse(output: string, vocabulary: AskVocabulary): AskFilters | null {
	const text = output.replace(/<think>[\s\S]*?<\/think>/g, '')
	const start = text.indexOf('{')
	const end = text.lastIndexOf('}')
	if (start === -1 || end < start) {
		return null
	}

	let data: unknown
	try {
		data = JSON.parse(text.slice(start, end + 1))
	} catch {
		return null
	}

	if (!isRecord(data)) {
		return null
	}

	const filters: AskFilters = {
		dateRange: parseDateRange(data.dateRange),
		places: pickNames(data.places, vocabulary.places),
		tags: pickNames(data.tags, vocabulary.tags),
		name: parseName(data.name),
	}

	const isEmpty = filters.dateRange === undefined && filters.places.length === 0 && filters.tags.length === 0 && filters.name === undefined
	return isEmpty ? null : filters
}

/**
 * Generate a text with the TaskProcessing API and wait for it.
 *
 * @param input - Prompt of the task
 * @param options - Polling options
 * @return The generated text
 * @throws {AskPhotosError} When the task fails, is cancelled or does not finish in time
 */
export async function runTextToTextTask(input: string, options: AskOptions = {}): Promise<string> {
	const { signal, pollInterval = 2000, timeout = 3 * 60 * 1000 } = options
	const deadline = Date.now() + timeout

	const { data } = await axios.post<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/schedule'), {
		type: TEXT_TO_TEXT_TASK_TYPE,
		appId: 'photos',
		input: { input },
	}, { signal })

	let task = data.ocs.data.task

	try {
		while (task.status === 'STATUS_SCHEDULED' || task.status === 'STATUS_RUNNING') {
			if (Date.now() + pollInterval > deadline) {
				throw new AskPhotosError('timeout')
			}

			await wait(pollInterval, signal)

			const { data } = await axios.get<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/task/{id}', { id: task.id }), { signal })
			task = data.ocs.data.task
		}
	} catch (error) {
		cancelTask(task.id)
		throw error
	}

	const output = task.output?.output
	if (task.status !== 'STATUS_SUCCESSFUL' || typeof output !== 'string') {
		throw new AskPhotosError('failed', task.userFacingErrorMessage || null)
	}

	return output
}

/**
 * Turn a question about the photos into filters with the assistant.
 *
 * The files of the tags in the answer are fetched, the tags filter needs them
 * to match the photos.
 *
 * @param query - Question of the user, like "beach photos from last summer"
 * @param options - Polling options
 * @throws {AskPhotosError} When no filter could be understood
 */
export async function askPhotos(query: string, options: AskOptions = {}): Promise<AskFilters> {
	const [placeOptions, tagOptions] = await Promise.all([placesFilter.getOptions(), tagsFilter.getOptions()])
	const vocabulary: AskVocabulary = {
		places: placeOptions.map((option) => option.value).filter((value) => value !== undefined),
		tags: tagOptions.map((option) => option.value).filter((value) => value !== undefined),
	}

	const output = await runTextToTextTask(buildAskPrompt(query, new Date(), vocabulary), options)
	const filters = parseAskResponse(output, vocabulary)
	if (filters === null) {
		throw new AskPhotosError('unparsable')
	}

	await Promise.all(tagOptions
		.filter((option) => option.value !== undefined && filters.tags.includes(option.value))
		.map((option) => option.getValue?.()))

	return filters
}

/**
 * Cancel a task the result of which is no longer awaited, without waiting for
 * the server: a task which already ended cannot be cancelled anymore.
 *
 * @param taskId - Id of the task
 */
function cancelTask(taskId: number): void {
	axios.post(generateOcsUrl('taskprocessing/tasks/{taskId}/cancel', { taskId }))
		.catch(() => {})
}

/**
 * @param delay - Time to wait, in milliseconds
 * @param signal - Signal ending the wait early with its abort reason
 */
function wait(delay: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(signal.reason)
			return
		}

		const timer = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort)
			resolve()
		}, delay)

		/**
		 * Stop waiting with the abort reason.
		 */
		function onAbort() {
			clearTimeout(timer)
			reject(signal?.reason)
		}

		signal?.addEventListener('abort', onAbort, { once: true })
	})
}

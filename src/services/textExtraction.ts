/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

/** Id of the optical character recognition task type of the TaskProcessing API. */
export const OCR_TASK_TYPE = 'core:image2text:ocr'

export type TaskStatus = 'STATUS_UNKNOWN' | 'STATUS_SCHEDULED' | 'STATUS_RUNNING' | 'STATUS_SUCCESSFUL' | 'STATUS_FAILED' | 'STATUS_CANCELLED'

type Task = {
	id: number
	status: TaskStatus
	/** Share of the work done, between 0 and 1, when the provider reports it. */
	progress: number | null
	output: { output?: string[] } | null
	userFacingErrorMessage: string | null
}

export type TextExtractionOptions = {
	/** Aborts the extraction and cancels the task on the server. */
	signal?: AbortSignal
	/** Called with the state of the task each time it is polled. */
	onUpdate?: (status: TaskStatus, progress: number | null) => void
	/** Delay between two polls of the task, in milliseconds. */
	pollInterval?: number
	/** Time after which the task is cancelled and given up on, in milliseconds. */
	timeout?: number
}

/**
 * The task ended without a result, `userFacingMessage` holds the reason when
 * the provider gave one meant for users.
 */
export class TextExtractionFailedError extends Error {
	constructor(public readonly userFacingMessage: string | null) {
		super('The text extraction task did not succeed')
		this.name = 'TextExtractionFailedError'
	}
}

/** The task did not finish within the given time. */
export class TextExtractionTimeoutError extends Error {
	constructor() {
		super('The text extraction task did not finish in time')
		this.name = 'TextExtractionTimeoutError'
	}
}

let availability: Promise<boolean> | undefined

/**
 * Whether a provider for the optical character recognition task type is set up.
 *
 * The server only lists the task types a provider is available for. The answer
 * is fetched once per page load and shared by every caller.
 */
export function isTextExtractionAvailable(): Promise<boolean> {
	availability ??= axios.get<OCSResponse<{ types: Record<string, unknown> }>>(generateOcsUrl('taskprocessing/tasktypes'))
		.then(({ data }) => OCR_TASK_TYPE in data.ocs.data.types)
		.catch(() => {
			availability = undefined
			return false
		})

	return availability
}

/**
 * Recognize the text in a file with the TaskProcessing API.
 *
 * The task is scheduled for the current user, the server refuses it when that
 * user cannot access the file.
 *
 * @param fileId - Id of the file to read the text of
 * @param options - Polling options
 * @return The recognized text, empty when the file holds none
 * @throws {TextExtractionFailedError} When the task fails or is cancelled
 * @throws {TextExtractionTimeoutError} When the task does not finish in time
 */
export async function extractText(fileId: number, options: TextExtractionOptions = {}): Promise<string> {
	const { signal, onUpdate, pollInterval = 2000, timeout = 10 * 60 * 1000 } = options
	const deadline = Date.now() + timeout

	const { data } = await axios.post<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/schedule'), {
		type: OCR_TASK_TYPE,
		appId: 'photos',
		input: { input: [fileId] },
	}, { signal })

	let task = data.ocs.data.task

	try {
		while (task.status === 'STATUS_SCHEDULED' || task.status === 'STATUS_RUNNING') {
			onUpdate?.(task.status, task.progress)

			if (Date.now() + pollInterval > deadline) {
				throw new TextExtractionTimeoutError()
			}

			await wait(pollInterval, signal)

			const { data } = await axios.get<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/task/{id}', { id: task.id }), { signal })
			task = data.ocs.data.task
		}
	} catch (error) {
		cancelTask(task.id)
		throw error
	}

	if (task.status !== 'STATUS_SUCCESSFUL') {
		throw new TextExtractionFailedError(task.userFacingErrorMessage || null)
	}

	return (task.output?.output ?? []).join('\n\n').trim()
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

		function onAbort() {
			clearTimeout(timer)
			reject(signal?.reason)
		}

		signal?.addEventListener('abort', onAbort, { once: true })
	})
}

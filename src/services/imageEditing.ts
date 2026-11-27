/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import axios from '@nextcloud/axios'
import { basename, dirname, extname, join } from '@nextcloud/paths'
import { generateOcsUrl } from '@nextcloud/router'
import { getPhotoLocation } from '../utils/exif.ts'
import { davClient } from './DavClient.ts'
import { fetchPhotoExif } from './exifFetcher.ts'
import { logger } from './logger.ts'
import { savePhotoMetadata } from './photoActions.ts'

/** Id of the image editing task type of the TaskProcessing API. */
export const IMAGE_EDIT_TASK_TYPE = 'core:image2image'

export type TaskStatus = 'STATUS_UNKNOWN' | 'STATUS_SCHEDULED' | 'STATUS_RUNNING' | 'STATUS_SUCCESSFUL' | 'STATUS_FAILED' | 'STATUS_CANCELLED'

type Task = {
	id: number
	status: TaskStatus
	/** Share of the work done, between 0 and 1, when the provider reports it. */
	progress: number | null
	/** Id of the edited image, in the storage of the task. */
	output: { output?: number } | null
	userFacingErrorMessage: string | null
}

export type ImageEditOptions = {
	/** Aborts the edit and cancels the task on the server. */
	signal?: AbortSignal
	/** Called with the state of the task each time it is polled. */
	onUpdate?: (status: TaskStatus, progress: number | null) => void
	/** Delay between two polls of the task, in milliseconds. */
	pollInterval?: number
	/** Time after which the task is cancelled and given up on, in milliseconds. */
	timeout?: number
}

/** Extensions of the image formats an edited photo is accepted in. */
const EXTENSIONS: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
}

/** Number of names tried for the edited copy before giving up. */
const MAX_NAME_ATTEMPTS = 100

export type ImageEditPreset = 'enhance' | 'remove' | 'restore' | 'custom'

/**
 * Instructions sent to the provider for each preset. They are not translated:
 * models follow English instructions best, whatever language the user speaks.
 */
const PRESET_PROMPTS: Record<Exclude<ImageEditPreset, 'custom'>, string> = {
	enhance: 'Enhance this photo: improve exposure, contrast, color balance and sharpness so that it looks natural. Do not add, remove or move anything.',
	remove: 'Remove the following from this photo and fill the area so that it blends naturally with its surroundings, leaving everything else unchanged: ',
	restore: 'Restore this old photo: remove scratches, dust, stains and noise, revive faded colors and sharpen details, staying faithful to the people and the scene.',
}

/**
 * Build the instructions for the provider out of a preset and the text the
 * user entered for it.
 *
 * @param preset - Chosen preset
 * @param details - What to remove for `remove`, the whole prompt for `custom`, ignored otherwise
 * @return The prompt, empty when the preset needs details which are missing
 */
export function getEditPrompt(preset: ImageEditPreset, details: string): string {
	const text = details.trim()

	switch (preset) {
		case 'custom':
			return text
		case 'remove':
			return text === '' ? '' : PRESET_PROMPTS.remove + text
		default:
			return PRESET_PROMPTS[preset]
	}
}

/**
 * The task ended without a usable image, `userFacingMessage` holds the reason
 * when the provider gave one meant for users.
 */
export class ImageEditFailedError extends Error {
	constructor(public readonly userFacingMessage: string | null) {
		super('The image editing task did not succeed')
		this.name = 'ImageEditFailedError'
	}
}

/** The task did not finish within the given time. */
export class ImageEditTimeoutError extends Error {
	constructor() {
		super('The image editing task did not finish in time')
		this.name = 'ImageEditTimeoutError'
	}
}

let availability: Promise<boolean> | undefined

/**
 * Whether a provider for the image editing task type is set up.
 *
 * The server only lists the task types a provider is available for. The answer
 * is fetched once per page load and shared by every caller.
 */
export function isImageEditingAvailable(): Promise<boolean> {
	availability ??= axios.get<OCSResponse<{ types: Record<string, unknown> }>>(generateOcsUrl('taskprocessing/tasktypes'))
		.then(({ data }) => IMAGE_EDIT_TASK_TYPE in data.ocs.data.types)
		.catch(() => {
			availability = undefined
			return false
		})

	return availability
}

/**
 * Edit an image with the TaskProcessing API, following a text description.
 *
 * The task is scheduled for the current user, the server refuses it when that
 * user cannot access the file. The task is deleted once its result is fetched.
 *
 * @param fileId - Id of the image to edit
 * @param prompt - Description of the changes to make
 * @param options - Polling options
 * @return The edited image
 * @throws {ImageEditFailedError} When the task fails, is cancelled or does not return an image
 * @throws {ImageEditTimeoutError} When the task does not finish in time
 */
export async function editImage(fileId: number, prompt: string, options: ImageEditOptions = {}): Promise<Blob> {
	const { signal, onUpdate, pollInterval = 2000, timeout = 10 * 60 * 1000 } = options
	const deadline = Date.now() + timeout

	const { data } = await axios.post<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/schedule'), {
		type: IMAGE_EDIT_TASK_TYPE,
		appId: 'photos',
		input: { input: [fileId], prompt },
	}, { signal })

	let task = data.ocs.data.task

	try {
		while (task.status === 'STATUS_SCHEDULED' || task.status === 'STATUS_RUNNING') {
			onUpdate?.(task.status, task.progress)

			if (Date.now() + pollInterval > deadline) {
				throw new ImageEditTimeoutError()
			}

			await wait(pollInterval, signal)

			const { data } = await axios.get<OCSResponse<{ task: Task }>>(generateOcsUrl('taskprocessing/task/{id}', { id: task.id }), { signal })
			task = data.ocs.data.task
		}
	} catch (error) {
		cancelTask(task.id)
		throw error
	}

	const outputId = task.output?.output
	if (task.status !== 'STATUS_SUCCESSFUL' || typeof outputId !== 'number') {
		throw new ImageEditFailedError(task.userFacingErrorMessage || null)
	}

	try {
		const { data: image } = await axios.get<Blob>(
			generateOcsUrl('taskprocessing/tasks/{taskId}/file/{fileId}', { taskId: task.id, fileId: outputId }),
			{ responseType: 'blob', signal },
		)

		if (!(image.type in EXTENSIONS)) {
			throw new ImageEditFailedError(null)
		}

		return image
	} finally {
		deleteTask(task.id)
	}
}

/**
 * Store an edited photo as a new file next to the original one, which is never
 * overwritten, and give it the taken date and the position of the original so
 * that both sort and show up together.
 *
 * @param photo - Original photo
 * @param image - Edited image, as returned by `editImage`
 * @return The DAV path of the new file
 * @throws {Error} When the file cannot be created
 */
export async function saveEditedImage(photo: PhotoTarget, image: Blob): Promise<string> {
	const folder = dirname(photo.davPath)
	const name = basename(photo.basename, extname(photo.basename))
	const extension = EXTENSIONS[image.type] ?? extname(photo.basename)
	const content = await image.arrayBuffer()

	for (let attempt = 1; attempt <= MAX_NAME_ATTEMPTS; attempt++) {
		const suffix = attempt === 1 ? '(AI edit)' : `(AI edit ${attempt})`
		const davPath = join(folder, `${name} ${suffix}${extension}`)

		// Refuses to replace an existing file rather than overwriting it.
		if (await davClient.putFileContents(davPath, content, { overwrite: false })) {
			await copyMetadata(photo, davPath)
			return davPath
		}
	}

	throw new Error('No free name left for the edited photo')
}

/**
 * Give a copy of a photo the taken date and the position of the original.
 * The copy is kept when this fails, it then sorts by its own dates.
 *
 * @param photo - Original photo
 * @param davPath - Path of the copy
 */
async function copyMetadata(photo: PhotoTarget, davPath: string): Promise<void> {
	try {
		const metadata = await fetchPhotoExif(photo)
		if (metadata.takenAt !== undefined) {
			await savePhotoMetadata({ ...photo, davPath }, {
				takenAt: metadata.takenAt,
				location: getPhotoLocation(metadata.gps),
			})
		}
	} catch (error) {
		logger.warn('Could not copy the metadata of a photo to its edited copy', { error, davPath })
	}
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
 * Delete an ended task along with the image it produced, without waiting for
 * the server.
 *
 * @param taskId - Id of the task
 */
function deleteTask(taskId: number): void {
	axios.delete(generateOcsUrl('taskprocessing/task/{id}', { id: taskId }))
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

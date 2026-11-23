/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { pickVideoMimeType } from './memoryVideo.ts'

export type VideoRecording = {
	/** Stop recording and resolve with the recorded video. */
	stop: () => Promise<Blob>
}

/**
 * Whether the browser can record a canvas into a video.
 */
export function isVideoRecordingSupported(): boolean {
	return typeof MediaRecorder !== 'undefined'
		&& typeof HTMLCanvasElement.prototype.captureStream === 'function'
		&& getRecordingMimeType(false) !== undefined
}

/**
 * @param withAudio - Whether the video has a sound track
 */
export function getRecordingMimeType(withAudio: boolean): string | undefined {
	return pickVideoMimeType((mimeType) => MediaRecorder.isTypeSupported(mimeType), withAudio)
}

/**
 * @param stream - Stream to record
 * @param mimeType - Format to record in
 */
export function startRecording(stream: MediaStream, mimeType: string): VideoRecording {
	const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 })
	const chunks: Blob[] = []

	recorder.addEventListener('dataavailable', (event) => {
		if (event.data.size > 0) {
			chunks.push(event.data)
		}
	})
	recorder.start(1000)

	return {
		stop: () => new Promise((resolve, reject) => {
			recorder.addEventListener('stop', () => resolve(new Blob(chunks, { type: mimeType })), { once: true })
			recorder.addEventListener('error', (event) => reject((event as ErrorEvent).error), { once: true })
			recorder.stop()
		}),
	}
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { getPreviewUrl } from '../utils/fileUtils.ts'
import { laplacianVariance } from '../utils/sharpness.ts'
import { logger } from './logger.ts'

/**
 * Edge of the preview the sharpness is measured on, in pixels. Large enough for
 * a missed focus to still show, small enough to measure in a few milliseconds.
 */
const PREVIEW_SIZE = 512

/**
 * How long the pointer has to rest on the tile of a burst before its photos are
 * measured, in milliseconds, so that sweeping across the grid loads nothing.
 */
export const BEST_SHOT_HOVER_DELAY = 600

export type Pixels = { data: ArrayLike<number>, width: number, height: number }
type PixelLoader = (file: PhotoFile) => Promise<Pixels>

// Sharpness by file id and etag: a photo that was edited is measured again,
// one that was not is never measured twice in a session.
const scores = new Map<string, Promise<number | null>>()

/**
 * Whether the photos of a burst can be ranked by sharpness: only still images
 * are, as the video half of a live photo is not a shot to pick or to drop.
 *
 * @param files - The photos of the burst.
 */
export function isComparableBurst(files: PhotoFile[]): boolean {
	return files.length > 1 && files.every((file) => file.mime?.startsWith('image/') && file.attributes['metadata-files-live-photo'] === undefined)
}

/**
 * Measure how sharp each of the given photos is, from their previews and in the
 * browser. Each photo is measured in an idle period of its own, so a long burst
 * never holds up a frame.
 *
 * @param files - The photos to measure.
 * @param loadPixels - Reads the pixels of the preview of a photo.
 * @return The sharpness of each photo, null where its preview could not be read.
 */
export function scoreSharpness(files: PhotoFile[], loadPixels: PixelLoader = loadPreviewPixels): Promise<Array<number | null>> {
	return Promise.all(files.map((file) => {
		const key = `${file.fileid}:${file.attributes.etag}`
		let score = scores.get(key)
		if (score === undefined) {
			score = measure(file, loadPixels)
			scores.set(key, score)
			// A preview that failed to load may load the next time.
			score.then((value) => value === null && scores.delete(key))
		}
		return score
	}))
}

/**
 * @param file - The photo to measure.
 * @param loadPixels - Reads the pixels of the preview of a photo.
 */
async function measure(file: PhotoFile, loadPixels: PixelLoader): Promise<number | null> {
	try {
		const { data, width, height } = await loadPixels(file)
		await idle()
		return laplacianVariance(data, width, height)
	} catch (error) {
		logger.debug('Could not measure the sharpness of a photo', { error, filename: file.basename })
		return null
	}
}

/**
 * Wait until the browser has nothing more urgent to do.
 */
function idle(): Promise<void> {
	return new Promise((resolve) => {
		if (typeof window.requestIdleCallback === 'function') {
			window.requestIdleCallback(() => resolve(), { timeout: 500 })
		} else {
			setTimeout(resolve, 0)
		}
	})
}

/**
 * @param file - The photo whose preview is read.
 */
async function loadPreviewPixels(file: PhotoFile): Promise<Pixels> {
	const image = new Image()
	image.decoding = 'async'
	image.src = getPreviewUrl(file, PREVIEW_SIZE)
	await image.decode()

	const canvas = document.createElement('canvas')
	canvas.width = image.naturalWidth
	canvas.height = image.naturalHeight
	const context = canvas.getContext('2d', { willReadFrequently: true })
	if (context === null) {
		throw new Error('No 2D canvas available')
	}
	context.drawImage(image, 0, 0)
	return context.getImageData(0, 0, canvas.width, canvas.height)
}

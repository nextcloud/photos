/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat } from 'webdav'
import type { PhotoFile } from '../store/files.ts'

import { getUniqueName } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import { join } from '@nextcloud/paths'
import { getFolder } from '../store/userConfig.ts'
import { davClient } from './DavClient.ts'

/** Number of photos a memory video holds at most, to keep it short. */
export const MAX_VIDEO_PHOTOS = 25

/**
 * Pick the photos of a memory video: the favorites first, then photos spread
 * evenly over the memory until the video is full.
 *
 * @param photos - Photos of the memory
 * @param max - Maximum number of photos to pick
 * @return The picked photos, in chronological order
 */
export function sampleVideoPhotos(photos: PhotoFile[], max: number = MAX_VIDEO_PHOTOS): PhotoFile[] {
	const chronological = [...photos].sort((photo1, photo2) => photo1.attributes.timestamp - photo2.attributes.timestamp)

	const favorites = chronological.filter((photo) => photo.attributes.favorite === 1)
	const picks = new Set(spreadPick(favorites, max))
	const others = chronological.filter((photo) => !picks.has(photo))
	spreadPick(others, max - picks.size).forEach((photo) => picks.add(photo))

	return chronological.filter((photo) => picks.has(photo))
}

/**
 * @param items - Items to pick from
 * @param count - Number of items to pick
 * @return `count` items evenly spread over `items`, or all of them when there are not more
 */
function spreadPick<Item>(items: Item[], count: number): Item[] {
	if (items.length <= count) {
		return items
	}

	return Array.from({ length: count }, (_, index) => items[Math.floor(((index + 0.5) * items.length) / count)])
}

export type VideoTimeline = {
	/** Number of slides, the title card included. */
	slideCount: number
	/** Time each slide is shown, its fade-in included, in milliseconds. */
	slideDuration: number
	/** Time a slide takes to fade over the previous one, in milliseconds. */
	fadeDuration: number
	/** Length of the whole video, in milliseconds. */
	duration: number
}

/**
 * @param slideCount - Number of slides, the title card included
 * @param slideDuration - Time each slide is shown, in milliseconds
 * @param fadeDuration - Time of the cross-fade between two slides, in milliseconds
 */
export function buildTimeline(slideCount: number, slideDuration: number = 3000, fadeDuration: number = 800): VideoTimeline {
	return {
		slideCount,
		slideDuration,
		fadeDuration,
		duration: slideCount === 0 ? 0 : (slideCount - 1) * (slideDuration - fadeDuration) + slideDuration,
	}
}

export type SlideLayer = {
	/** Index of the slide, 0 being the title card. */
	slide: number
	opacity: number
	/** Zoom of the slide, 1 being the size that fills the frame. */
	scale: number
	/** Horizontal shift of the slide centre, as a fraction of the frame width. */
	offsetX: number
	/** Vertical shift of the slide centre, as a fraction of the frame height. */
	offsetY: number
}

/** Directions the slides pan to, cycled through so consecutive slides differ. */
const PAN_DIRECTIONS = [[1, 0.5], [-1, -0.5], [0.5, -1], [-0.5, 1]]

/** Largest pan, as a fraction of the frame; it stays within the margin left by the smallest zoom. */
const PAN_AMOUNT = 0.025
const MIN_ZOOM = 1.06
const MAX_ZOOM = 1.16

/**
 * Describe what a frame of the video shows: the slides on screen, bottom
 * first, with their opacity and their "Ken Burns" pan and zoom.
 *
 * @param timeline - Timeline of the video
 * @param time - Time of the frame, in milliseconds
 * @param animate - Whether the slides pan and zoom; static slides otherwise
 */
export function getFrameLayers(timeline: VideoTimeline, time: number, animate: boolean): SlideLayer[] {
	const { slideCount, slideDuration, fadeDuration, duration } = timeline
	const step = slideDuration - fadeDuration
	const layers: SlideLayer[] = []

	if (slideCount === 0 || time < 0 || time > duration) {
		return layers
	}

	const last = Math.min(slideCount - 1, Math.floor(time / step))
	for (let slide = Math.max(0, last - 1); slide <= last; slide++) {
		const elapsed = time - slide * step
		if (elapsed > slideDuration) {
			continue
		}

		const fadeIn = fadeDuration > 0 ? Math.min(1, elapsed / fadeDuration) : 1
		const fadeOut = fadeDuration > 0 ? Math.min(1, (duration - time) / fadeDuration) : 1
		const progress = elapsed / slideDuration

		const zoomIn = slide % 2 === 0
		const zoom = zoomIn ? progress : 1 - progress
		const [directionX, directionY] = PAN_DIRECTIONS[slide % PAN_DIRECTIONS.length]

		layers.push({
			slide,
			opacity: slide === slideCount - 1 ? Math.min(fadeIn, fadeOut) : fadeIn,
			scale: animate ? MIN_ZOOM + (MAX_ZOOM - MIN_ZOOM) * zoom : 1,
			offsetX: animate ? (progress - 0.5) * 2 * PAN_AMOUNT * directionX : 0,
			offsetY: animate ? (progress - 0.5) * 2 * PAN_AMOUNT * directionY : 0,
		})
	}

	return layers
}

/** Recording formats, the most widely playable first. */
const MIME_TYPES = [
	['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1.42E01F,mp4a.40.2'],
	['video/mp4', 'video/mp4'],
	['video/webm;codecs=vp9', 'video/webm;codecs=vp9,opus'],
	['video/webm;codecs=vp8', 'video/webm;codecs=vp8,opus'],
	['video/webm', 'video/webm'],
]

/**
 * @param isTypeSupported - Tells whether the recorder supports a format
 * @param withAudio - Whether the video has a sound track
 * @return The best supported recording format, `undefined` when none is
 */
export function pickVideoMimeType(isTypeSupported: (mimeType: string) => boolean, withAudio: boolean): string | undefined {
	return MIME_TYPES
		.map(([videoOnly, audioVideo]) => withAudio ? audioVideo : videoOnly)
		.find((mimeType) => isTypeSupported(mimeType))
}

/**
 * @param title - Title of the video
 * @param mimeType - Format the video was recorded in
 * @return A file name for the video, safe on every platform
 */
export function getVideoFilename(title: string, mimeType: string): string {
	const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'
	const name = title.replace(/[\\/:*?"<>|\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim()
	return `${name || 'Memory'}.${extension}`
}

/** Folder the videos are saved to, inside the upload location of the user. */
const MEMORIES_FOLDER = 'Memories'

/**
 * Save a video into the files of the user, next to their uploaded photos,
 * without replacing an existing file.
 *
 * @param blob - The video
 * @param filename - Name to save the video under
 * @param photosLocation - Upload location of the user
 * @return The path of the saved video, relative to the files of the user
 */
export async function saveVideoToFiles(blob: Blob, filename: string, photosLocation: string): Promise<string> {
	const folder = join(photosLocation, MEMORIES_FOLDER)
	await getFolder(folder)

	const davFolder = join(defaultRootPath, folder)
	const contents = await davClient.getDirectoryContents(davFolder) as FileStat[]
	const name = getUniqueName(filename, contents.map(({ basename }) => basename))

	await davClient.putFileContents(join(davFolder, name), await blob.arrayBuffer(), { overwrite: false })
	return join(folder, name)
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { Permission } from '@nextcloud/files'

export type CleanupCategoryId = 'screenshots' | 'largeVideos' | 'screenRecordings'

/** Size above which a video is suggested for cleanup, in bytes. */
export const LARGE_VIDEO_SIZE = 100 * 1024 * 1024

/**
 * Parts of the names given to screenshots by common systems, as DAV `LIKE`
 * patterns: `%` stands for any run of characters, which also covers the
 * different apostrophes and the decomposed accents of some file systems.
 */
export const SCREENSHOT_NAME_PATTERNS = [
	'screen%shot', // Screenshot, Screen Shot, Screen_Shot
	'bildschirmfoto',
	'capture d%cran', // Capture d'écran
	'captura de pantalla',
	'schermafbeelding',
]

/** Parts of the names given to screen recordings, in the same form. */
export const SCREEN_RECORDING_NAME_PATTERNS = [
	'screen%record', // Screen Recording, Screen_Recording, Screenrecorder
	'screencast',
	'bildschirmaufnahme',
	'enregistrement de l%cran', // Enregistrement de l'écran
	'grabaci%n de pantalla', // Grabación de pantalla
]

/** Resolutions of common phone screens, in pixels, portrait. */
export const PHONE_SCREEN_SIZES: Array<[number, number]> = [
	// iPhone
	[640, 1136],
	[750, 1334],
	[828, 1792],
	[1080, 2340],
	[1125, 2436],
	[1170, 2532],
	[1179, 2556],
	[1206, 2622],
	[1242, 2208],
	[1242, 2688],
	[1284, 2778],
	[1290, 2796],
	[1320, 2868],
	// Android
	[720, 1280],
	[720, 1600],
	[1080, 1920],
	[1080, 2160],
	[1080, 2280],
	[1080, 2400],
	[1440, 2560],
	[1440, 2960],
	[1440, 3040],
	[1440, 3120],
	[1440, 3200],
]

/**
 * @param pattern - DAV `LIKE` pattern, without the surrounding wildcards
 */
function likeToRegExp(pattern: string): RegExp {
	const source = pattern
		.split('%')
		.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('.*')
	return new RegExp(source, 'i')
}

/**
 * Whether a file name contains one of the given patterns, ignoring the case.
 *
 * @param name - File name
 * @param patterns - DAV `LIKE` patterns
 */
export function matchesNamePattern(name: string, patterns: string[]): boolean {
	const normalizedName = name.normalize('NFC')
	return patterns.some((pattern) => likeToRegExp(pattern).test(normalizedName))
}

/**
 * Whether the dimensions are the ones of a phone screen, in either orientation.
 *
 * @param size - Dimensions of the picture
 * @param size.width - Width in pixels
 * @param size.height - Height in pixels
 */
export function isPhoneScreenSize({ width, height }: { width: number, height: number }): boolean {
	return PHONE_SCREEN_SIZES.some(([short, long]) => (width === short && height === long) || (width === long && height === short))
}

/**
 * A screenshot is a picture named like one, or a PNG with the size of a phone screen.
 *
 * @param file - File to check
 */
export function isScreenshot(file: PhotoFile): boolean {
	if (!file.mime?.startsWith('image/')) {
		return false
	}

	if (matchesNamePattern(file.basename, SCREENSHOT_NAME_PATTERNS)) {
		return true
	}

	const size = file.attributes['metadata-photos-size']
	return file.mime === 'image/png' && size !== undefined && isPhoneScreenSize(size)
}

/**
 * @param file - File to check
 */
export function isScreenRecording(file: PhotoFile): boolean {
	return (file.mime?.startsWith('video/') ?? false) && matchesNamePattern(file.basename, SCREEN_RECORDING_NAME_PATTERNS)
}

/**
 * @param file - File to check
 * @param threshold - Size above which a video is large, in bytes
 */
export function isLargeVideo(file: PhotoFile, threshold: number = LARGE_VIDEO_SIZE): boolean {
	return (file.mime?.startsWith('video/') ?? false) && (file.size ?? 0) > threshold
}

/**
 * @param files - Files to add up
 */
export function getTotalSize(files: PhotoFile[]): number {
	return files.reduce((total, file) => total + (file.size ?? 0), 0)
}

/**
 * Sort the files of every cleanup category, the largest first.
 *
 * Each file lands in one category at most, so that the sizes of the
 * categories add up: a screen recording is not listed again among the large
 * videos. Files the user cannot delete are left out.
 *
 * @param files - Candidate files
 * @param threshold - Size above which a video is large, in bytes
 */
export function groupCleanupCandidates(files: PhotoFile[], threshold: number = LARGE_VIDEO_SIZE): Record<CleanupCategoryId, PhotoFile[]> {
	const categories: Record<CleanupCategoryId, PhotoFile[]> = {
		screenshots: [],
		screenRecordings: [],
		largeVideos: [],
	}

	const seen = new Set<number>()
	for (const file of files) {
		if (seen.has(file.fileid) || (file.permissions & Permission.DELETE) === 0) {
			continue
		}
		seen.add(file.fileid)

		if (isScreenshot(file)) {
			categories.screenshots.push(file)
		} else if (isScreenRecording(file)) {
			categories.screenRecordings.push(file)
		} else if (isLargeVideo(file, threshold)) {
			categories.largeVideos.push(file)
		}
	}

	for (const category of Object.values(categories)) {
		category.sort((file1, file2) => (file2.size ?? 0) - (file1.size ?? 0))
	}

	return categories
}

/**
 * DAV condition matching the file names containing one of the patterns.
 *
 * @param patterns - DAV `LIKE` patterns, which must not contain XML special characters
 */
function getNameCondition(patterns: string[]): string {
	return patterns
		.map((pattern) => `<d:like><d:prop><d:displayname/></d:prop><d:literal>%${pattern}%</d:literal></d:like>`)
		.join('')
}

/**
 * DAV condition narrowing a search of pictures down to the possible screenshots:
 * the PNG files, whose dimensions are checked afterwards, and the files named
 * like screenshots.
 */
export function getScreenshotSearchFilter(): string {
	return `<d:or>
		<d:eq><d:prop><d:getcontenttype/></d:prop><d:literal>image/png</d:literal></d:eq>
		${getNameCondition(SCREENSHOT_NAME_PATTERNS)}
	</d:or>`
}

/**
 * DAV condition narrowing a search of videos down to the large ones and the
 * ones named like screen recordings.
 *
 * @param threshold - Size above which a video is large, in bytes
 */
export function getVideoSearchFilter(threshold: number = LARGE_VIDEO_SIZE): string {
	return `<d:or>
		<d:gt><d:prop><oc:size/></d:prop><d:literal>${threshold}</d:literal></d:gt>
		${getNameCondition(SCREEN_RECORDING_NAME_PATTERNS)}
	</d:or>`
}

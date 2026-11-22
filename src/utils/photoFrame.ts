/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type FrameSource = 'onThisDay' | 'favorites' | 'album' | 'all'

export type FrameSettings = {
	source: FrameSource
	/** Album played when the source is `album`. */
	albumName: string
	/** Time each photo stays on screen, in seconds. */
	interval: number
	shuffle: boolean
}

export const FRAME_SOURCES: FrameSource[] = ['onThisDay', 'favorites', 'album', 'all']

export const FRAME_INTERVALS = [10, 30, 60, 300]

export const DEFAULT_FRAME_SETTINGS: FrameSettings = {
	source: 'all',
	albumName: '',
	interval: 30,
	shuffle: true,
}

const SETTINGS_KEY = 'photos:frame-settings'

/**
 * @return The local storage, or null where the browser denies access to it
 */
function getStorage(): Storage | null {
	try {
		return window.localStorage
	} catch {
		return null
	}
}

/**
 * Read the settings of the photo frame, falling back to the defaults for
 * anything missing or invalid.
 *
 * @param storage - Storage to read from
 */
export function loadFrameSettings(storage: Storage | null = getStorage()): FrameSettings {
	let stored: Partial<FrameSettings> = {}
	try {
		stored = JSON.parse(storage?.getItem(SETTINGS_KEY) ?? '{}') ?? {}
	} catch {
		// Unreadable settings are replaced by the defaults.
	}

	return {
		source: FRAME_SOURCES.includes(stored.source as FrameSource) ? stored.source as FrameSource : DEFAULT_FRAME_SETTINGS.source,
		albumName: typeof stored.albumName === 'string' ? stored.albumName : DEFAULT_FRAME_SETTINGS.albumName,
		interval: FRAME_INTERVALS.includes(stored.interval as number) ? stored.interval as number : DEFAULT_FRAME_SETTINGS.interval,
		shuffle: typeof stored.shuffle === 'boolean' ? stored.shuffle : DEFAULT_FRAME_SETTINGS.shuffle,
	}
}

/**
 * @param settings - Settings to remember on this device
 * @param storage - Storage to write to
 */
export function saveFrameSettings(settings: FrameSettings, storage: Storage | null = getStorage()): void {
	try {
		storage?.setItem(SETTINGS_KEY, JSON.stringify(settings))
	} catch {
		// Private browsing or a full storage: the settings last for this visit only.
	}
}

/**
 * Shuffle a copy of the given items (Fisher-Yates).
 *
 * @param items - Items to shuffle
 * @param random - Source of random numbers in [0, 1)
 */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
	const result = [...items]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

/**
 * Order the photos of the frame for one round.
 *
 * A shuffled round never starts with the photo the previous round ended on, so
 * the same photo is not shown twice in a row.
 *
 * @param items - Photos to play
 * @param options - How to order them
 * @param options.shuffled - Whether to play them in random order
 * @param options.avoidFirst - Key of the photo that must not come first
 * @param options.key - Identifies a photo across fetches
 * @param options.random - Source of random numbers in [0, 1)
 */
export function createPlaylist<T>(items: T[], { shuffled, avoidFirst, key = (item) => item, random = Math.random }: { shuffled: boolean, avoidFirst?: unknown, key?: (item: T) => unknown, random?: () => number }): T[] {
	if (!shuffled) {
		return [...items]
	}

	const result = shuffle(items, random)
	if (result.length > 1 && avoidFirst !== undefined && key(result[0]) === avoidFirst) {
		const swapWith = 1 + Math.floor(random() * (result.length - 1))
		;[result[0], result[swapWith]] = [result[swapWith], result[0]]
	}
	return result
}

/** Preview sizes requested by the frame, matching the steps the server caches previews at. */
const PREVIEW_SIZES = [1024, 2048, 4096]

/**
 * Size of the previews to request so they are sharp on the screen without
 * downloading more than it can show.
 *
 * @param width - Width of the screen in CSS pixels
 * @param height - Height of the screen in CSS pixels
 * @param pixelRatio - Device pixel ratio, capped at 2 as phones gain little from more
 */
export function getPreviewSize(width: number, height: number, pixelRatio: number = 1): number {
	const needed = Math.max(width, height) * Math.min(Math.max(pixelRatio, 1), 2)
	return PREVIEW_SIZES.find((size) => size >= needed) ?? PREVIEW_SIZES[PREVIEW_SIZES.length - 1]
}

/**
 * Whether a photo fills the screen, cropping a little of it, or is fit whole
 * inside it. Photos close to the shape of the screen fill it; the others would
 * lose too much, like a portrait photo on a landscape screen.
 *
 * @param photo - Size of the photo
 * @param photo.width - Width of the photo
 * @param photo.height - Height of the photo
 * @param screen - Size of the screen
 * @param screen.width - Width of the screen
 * @param screen.height - Height of the screen
 */
export function getPhotoFit(photo: { width: number, height: number } | undefined, screen: { width: number, height: number }): 'cover' | 'contain' {
	if (!photo?.width || !photo?.height || !screen.width || !screen.height) {
		return 'contain'
	}

	const ratio = (photo.width / photo.height) / (screen.width / screen.height)
	return ratio > 0.8 && ratio < 1.25 ? 'cover' : 'contain'
}

/**
 * Load and decode an image, so it can be shown without flashing.
 *
 * @param url - URL of the image
 */
export async function loadImage(url: string): Promise<void> {
	const image = new Image()
	image.src = url
	await image.decode()
}

/**
 * Wrap an image loader so the images loaded last are kept and not requested
 * twice: the next photo is preloaded while the current one is on screen, and
 * stepping back shows the previous one again right away.
 *
 * @param load - Loads one image
 * @param keep - Number of images to keep
 */
export function createPreloader(load: (url: string) => Promise<void>, keep: number = 3): (url: string) => Promise<void> {
	const loaded = new Map<string, Promise<void>>()

	return (url: string) => {
		let promise = loaded.get(url)
		if (promise === undefined) {
			promise = load(url)
			// A failed image is tried again the next time.
			const failed = promise
			failed.catch(() => {
				if (loaded.get(url) === failed) {
					loaded.delete(url)
				}
			})
		}

		// Most recently used last.
		loaded.delete(url)
		loaded.set(url, promise)
		while (loaded.size > keep) {
			loaded.delete(loaded.keys().next().value as string)
		}

		return promise
	}
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoSearchOptions } from './PhotoSearch.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { File } from '@nextcloud/files'
import { generateUrl } from '@nextcloud/router'
import { allMimes } from './AllowedMimes.ts'
import { logger } from './logger.ts'
import { getPhotos } from './PhotoSearch.ts'
import { getPreviewUrl, isCachedPreview } from './PreviewService.ts'

// How many of the most recent photos, and how many favorites, are kept for offline use.
export const offlineRecentLimit = 200
export const offlineFavoritesLimit = 200

const cacheName = 'photos-offline'

type OfflineQuery = Partial<Pick<PhotoSearchOptions, 'mimesType' | 'onlyFavorites' | 'onThisDay' | 'extraFilters'>>

/**
 * Pick the files kept for offline use: the most recent ones and the
 * favorites, each of them once.
 *
 * @param recent - The files of the timeline, most recent first
 * @param favorites - The favorite files, most recent first
 */
export function selectOfflineFiles(recent: File[], favorites: File[]): File[] {
	const selection = new Map<number, File>()
	for (const file of [...recent.slice(0, offlineRecentLimit), ...favorites.slice(0, offlineFavoritesLimit)]) {
		if (file.fileid !== undefined && !selection.has(file.fileid)) {
			selection.set(file.fileid, file)
		}
	}
	return [...selection.values()]
}

/**
 * Whether a query asks for the plain timeline, the one the offline copy is taken from.
 *
 * @param query - The options of the photo search
 */
export function isPlainTimelineQuery(query: OfflineQuery): boolean {
	return !query.onlyFavorites && !query.onThisDay && !query.extraFilters
		&& (query.mimesType === undefined || query.mimesType.length === allMimes.length)
}

/**
 * The saved files that answer a query. Queries the saved files cannot
 * answer faithfully, like a filtered timeline, get nothing.
 *
 * @param files - The saved files
 * @param query - The options of the photo search
 */
export function filterOfflineFiles(files: File[], query: OfflineQuery): File[] {
	if (query.onThisDay || query.extraFilters) {
		return []
	}

	const mimes = query.mimesType ?? allMimes
	return files
		.filter((file) => mimes.includes(file.mime))
		.filter((file) => !query.onlyFavorites || file.attributes.favorite === 1)
}

/**
 * The preview urls the timeline requests for the given files.
 *
 * @param files - The files to show
 * @param largeSize - Size of the preview shown once the tile is loaded
 */
export function getOfflinePreviewUrls(files: File[], largeSize: number): string[] {
	return files.flatMap((file) => [64, largeSize]
		.map((size) => getPreviewUrl(file.fileid as number, file.attributes.etag, size)))
}

/**
 * The cache entry holding the saved files of the current user.
 */
function savedFilesUrl(): string {
	return generateUrl('/apps/photos/offline/{user}', { user: getCurrentUser()?.uid ?? '' })
}

/**
 * Save the files to show when the timeline is opened offline.
 *
 * @param files - The files to save
 */
export async function saveOfflineFiles(files: File[]): Promise<void> {
	const cache = await window.caches.open(cacheName)
	const body = JSON.stringify(files.map((file) => file.toJSON()))
	await cache.put(savedFilesUrl(), new Response(body, { headers: { 'Content-Type': 'application/json' } }))
}

/**
 * The files saved for offline use, empty when there are none.
 */
export async function loadOfflineFiles(): Promise<File[]> {
	try {
		const cache = await window.caches.open(cacheName)
		const response = await cache.match(savedFilesUrl())
		const savedFiles: string[] = await response?.json() ?? []
		return savedFiles.map((savedFile) => {
			const [data, davService] = JSON.parse(savedFile)
			return new File(data, davService ? new RegExp(davService) : undefined)
		})
	} catch (error) {
		logger.debug('No saved files to show offline', { error })
		return []
	}
}

/**
 * Save the most recent photos and the favorites, and let the service worker
 * cache their previews, so the timeline can be opened offline.
 *
 * @param recent - The first batch of the timeline
 * @param largeSize - Size of the preview shown once the tile is loaded
 */
export async function refreshOfflineCopy(recent: File[], largeSize: number): Promise<void> {
	// Previews only end up in the cache through the service worker.
	if (window.caches === undefined || !navigator.serviceWorker?.controller) {
		return
	}

	try {
		const favorites = await getPhotos({ onlyFavorites: true, nbResults: offlineFavoritesLimit })
		const files = selectOfflineFiles(recent, favorites)
		await saveOfflineFiles(files)

		if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
			return
		}

		for (const url of getOfflinePreviewUrls(files, largeSize)) {
			if (!await isCachedPreview(url)) {
				await fetch(url).catch(() => {})
			}
		}
	} catch (error) {
		logger.debug('Failed to refresh the offline copy of the timeline', { error })
	}
}

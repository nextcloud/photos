/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { t } from '@nextcloud/l10n'

/** Order of the album lists: recently changed first, by name, or by the date of their photos. */
export type AlbumsSortOrder = 'recent' | 'name' | 'date'

/** Order of the photos inside an album. */
export type AlbumPhotosSortOrder = 'oldest' | 'newest'

/**
 * Orders the album lists can be put in, labelled for a menu.
 */
export function albumsSortOptions(): { value: AlbumsSortOrder, label: string }[] {
	return [
		{ value: 'recent', label: t('photos', 'Recently changed') },
		{ value: 'name', label: t('photos', 'Name') },
		{ value: 'date', label: t('photos', 'Date of photos') },
	]
}

/**
 * Orders the photos of an album can be put in, labelled for a menu.
 */
export function albumPhotosSortOptions(): { value: AlbumPhotosSortOrder, label: string }[] {
	return [
		{ value: 'oldest', label: t('photos', 'Oldest first') },
		{ value: 'newest', label: t('photos', 'Newest first') },
	]
}

/**
 * Order albums, keyed the way the collections store keys them.
 *
 * Albums without photos, or without a known change date, go last.
 *
 * @param albums - Albums by file name
 * @param order - Order to put them in
 */
export function sortAlbums<T extends Collection>(albums: Record<string, T>, order: AlbumsSortOrder): Record<string, T> {
	const byName = (a: T, b: T): number => a.basename.localeCompare(b.basename, undefined, { numeric: true, sensitivity: 'base' })

	const compare = {
		recent: (a: T, b: T) => changedAt(b) - changedAt(a) || byName(a, b),
		date: (a: T, b: T) => photosEndAt(b) - photosEndAt(a) || byName(a, b),
		name: byName,
	}[order] ?? byName

	return Object.fromEntries(Object.entries(albums).toSorted(([, a], [, b]) => compare(a, b)))
}

/**
 * Order the photos of an album by when they were taken.
 *
 * @param fileIds - Photos of the album
 * @param timestampOf - When a photo was taken
 * @param order - Order to put them in
 */
export function sortAlbumPhotos(fileIds: string[], timestampOf: (fileId: string) => number, order: AlbumPhotosSortOrder): string[] {
	const direction = order === 'newest' ? -1 : 1

	return fileIds.toSorted((fileId1, fileId2) => direction * (timestampOf(fileId1) - timestampOf(fileId2)))
}

/**
 * @param album - The album
 */
function changedAt(album: Collection): number {
	return album.mtime?.getTime() || Number.MIN_SAFE_INTEGER
}

/**
 * When the most recent photo of an album was taken, from its date range.
 *
 * @param album - The album
 */
function photosEndAt(album: Collection): number {
	try {
		const { end } = JSON.parse(String(album.attributes.dateRange ?? '{}').replace(/&quot;/g, '"'))
		return Number.isFinite(end) ? end : Number.MIN_SAFE_INTEGER
	} catch {
		return Number.MIN_SAFE_INTEGER
	}
}

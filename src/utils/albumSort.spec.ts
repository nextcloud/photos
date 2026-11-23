/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { describe, expect, test } from 'vitest'
import { sortAlbumPhotos, sortAlbums } from './albumSort.ts'

/**
 * Build the parts of an album it is sorted by.
 *
 * @param basename - Name of the album
 * @param changedAt - When it was last changed, in seconds
 * @param photosEnd - When its most recent photo was taken, in seconds
 */
function album(basename: string, changedAt?: number, photosEnd?: number | null): Collection {
	return {
		basename,
		mtime: changedAt === undefined ? undefined : new Date(changedAt * 1000),
		attributes: {
			dateRange: JSON.stringify({ start: photosEnd ?? null, end: photosEnd ?? null }),
		},
	} as unknown as Collection
}

/**
 * Key albums the way the collections store does.
 *
 * @param albums - Albums to key
 */
function byFileName(albums: Collection[]): Record<string, Collection> {
	return Object.fromEntries(albums.map((album) => [`/photos/alice/albums/${album.basename}`, album]))
}

/**
 * @param albums - Sorted albums
 */
function names(albums: Record<string, Collection>): string[] {
	return Object.values(albums).map((album) => album.basename)
}

describe('sortAlbums', () => {
	const albums = byFileName([
		album('Lisbon', 300, 100),
		album('album 10', 100, 300),
		album('Album 9', 200, 200),
		album('Empty'),
	])

	test('puts the most recently changed albums first', () => {
		expect(names(sortAlbums(albums, 'recent'))).toEqual(['Lisbon', 'Album 9', 'album 10', 'Empty'])
	})

	test('sorts by name, ignoring case and comparing numbers by value', () => {
		expect(names(sortAlbums(albums, 'name'))).toEqual(['Album 9', 'album 10', 'Empty', 'Lisbon'])
	})

	test('puts the albums with the most recent photos first, empty albums last', () => {
		expect(names(sortAlbums(albums, 'date'))).toEqual(['album 10', 'Album 9', 'Lisbon', 'Empty'])
	})

	test('keeps the keys of the albums', () => {
		const sorted = sortAlbums(albums, 'name')

		expect(sorted['/photos/alice/albums/Lisbon']).toBe(albums['/photos/alice/albums/Lisbon'])
	})

	test('falls back to the name for albums changed at the same time', () => {
		const sameTime = byFileName([album('b', 100), album('a', 100)])

		expect(names(sortAlbums(sameTime, 'recent'))).toEqual(['a', 'b'])
	})
})

describe('sortAlbumPhotos', () => {
	const timestamps: Record<string, number> = { 1: 300, 2: 100, 3: 200 }
	const timestampOf = (fileId: string) => timestamps[fileId]

	test('puts the oldest photos first', () => {
		expect(sortAlbumPhotos(['1', '2', '3'], timestampOf, 'oldest')).toEqual(['2', '3', '1'])
	})

	test('puts the newest photos first', () => {
		expect(sortAlbumPhotos(['1', '2', '3'], timestampOf, 'newest')).toEqual(['1', '3', '2'])
	})

	test('leaves the given list untouched', () => {
		const fileIds = ['1', '2', '3']

		sortAlbumPhotos(fileIds, timestampOf, 'newest')

		expect(fileIds).toEqual(['1', '2', '3'])
	})
})

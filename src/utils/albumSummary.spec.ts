/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../store/albums.ts'

import { describe, expect, test } from 'vitest'
import { formatAlbumDocumentTitle, formatAlbumSummary } from './albumSummary.ts'

/**
 * Build the parts of an album its summary is made of.
 *
 * @param location - Location set on the album
 * @param date - Formatted date range of its photos
 * @param nbItems - Number of photos in it
 */
function album(location: string, date: string, nbItems: number): Album {
	return { attributes: { location, date, nbItems } } as unknown as Album
}

describe('formatAlbumSummary', () => {
	test('joins the location, the date range and the photo count', () => {
		expect(formatAlbumSummary(album('Lisbon', 'May 2025 to June 2025', 12)))
			.toBe('Lisbon · May 2025 to June 2025 · 12 photos')
	})

	test('leaves out a location that is not set', () => {
		expect(formatAlbumSummary(album('', 'May 2025', 1))).toBe('May 2025 · 1 photo')
	})

	test('leaves out the date of an empty album', () => {
		expect(formatAlbumSummary(album('Lisbon', 'November 2026', 0))).toBe('Lisbon · 0 photos')
	})
})

describe('formatAlbumDocumentTitle', () => {
	test('replaces the name the route gave the page with the album name', () => {
		expect(formatAlbumDocumentTitle('Public album t0k3n - Nextcloud', 'Public album t0k3n', 'Lisbon 2025'))
			.toBe('Lisbon 2025 - Nextcloud')
	})

	test('keeps the album name as it is written', () => {
		expect(formatAlbumDocumentTitle('Public album t0k3n - Nextcloud', 'Public album t0k3n', 'Costs in $& more'))
			.toBe('Costs in $& more - Nextcloud')
	})

	test('leaves a title alone that does not carry the name of the route', () => {
		expect(formatAlbumDocumentTitle('Nextcloud', 'Public album t0k3n', 'Lisbon 2025')).toBe('Nextcloud')
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../store/albums.ts'

import { n } from '@nextcloud/l10n'

/**
 * Build the line describing an album: where and when its photos were taken,
 * and how many of them there are.
 *
 * The location is optional, and an empty album has no date to speak of, so
 * both are left out when there is nothing to show.
 *
 * @param album - The album to describe
 */
export function formatAlbumSummary(album: Album): string {
	const { location, date, nbItems } = album.attributes

	return [
		location,
		nbItems > 0 ? date : '',
		n('photos', '%n photo', '%n photos', nbItems),
	].filter((part) => part !== '').join(' · ')
}

/**
 * Name the browser tab after an album, which is what a shared link is listed
 * as in bookmarks and in the history.
 *
 * @param documentTitle - Current title of the page
 * @param routeTitle - Part of the title the route named the page with
 * @param albumName - Name of the album
 */
export function formatAlbumDocumentTitle(documentTitle: string, routeTitle: string, albumName: string): string {
	return documentTitle.replace(routeTitle, () => albumName)
}

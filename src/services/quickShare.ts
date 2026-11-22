/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../store/albums.ts'

import { t } from '@nextcloud/l10n'
import { ShareType } from '@nextcloud/sharing'
import { albumsExtraProps, buildLocalAlbum, getPublicAlbumLink, useAlbumsStore } from '../store/albums.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { formatDate } from '../utils/dateUtils.ts'
import { fetchCollection } from './collectionFetcher.ts'
import { davClient } from './DavClient.ts'
import { logger } from './logger.ts'

export type QuickShareResult = {
	/** Album holding the shared photos. */
	album: Album
	/** Public address of the album. */
	link: string
	/** Number of photos the server refused to add to the album. */
	skippedCount: number
}

/**
 * Failure of a quick share, carrying the message to show the user.
 */
export class QuickShareError extends Error {}

/**
 * Name proposed for the album of a quick share, made unique among the given names.
 *
 * @param takenNames - Names of the albums that already exist
 * @param date - Day of the share
 */
export function getQuickShareAlbumName(takenNames: string[], date = new Date()): string {
	const baseName = t('photos', 'Shared on {date}', { date: formatDate(date) })

	let name = baseName
	for (let index = 2; takenNames.includes(name); index++) {
		name = `${baseName} (${index})`
	}

	return name
}

/**
 * Put photos into a new album and share that album by public link.
 *
 * Unless the link exists in the end, the album is deleted again, so a failure
 * leaves nothing shared behind.
 *
 * @param albumName - Name of the album to create
 * @param fileIds - Photos to share
 * @throws {QuickShareError} When the album or its link could not be created
 */
export async function shareFilesByLink(albumName: string, fileIds: string[]): Promise<QuickShareResult> {
	const albumsStore = useAlbumsStore()
	const collectionsStore = useCollectionsStore()
	const albumFileName = albumsStore.getAlbumName(albumName)

	const createdAlbum = await collectionsStore.createCollection(buildLocalAlbum(albumName))
	if (createdAlbum === undefined) {
		throw new QuickShareError(t('photos', 'The album could not be created, nothing was shared.'))
	}

	try {
		await collectionsStore.addFilesToCollection(albumFileName, fileIds)

		// The server replaces the empty id of a link collaborator with the token of the link.
		await collectionsStore.updateCollection(albumFileName, {
			collaborators: [{ id: '', label: t('photos', 'Public link'), type: ShareType.Link }],
		})

		const album = await fetchCollection(albumFileName, {}, albumsExtraProps) as Album | null
		const token = album?.attributes.collaborators
			.find((collaborator) => Number(collaborator.type) === ShareType.Link)?.id
		if (album === null || !token) {
			throw new Error('The album has no public link')
		}

		const addedCount = Number(album.attributes.nbItems)
		if (!(addedCount > 0)) {
			throw new QuickShareError(t('photos', 'None of the photos could be added to the album, nothing was shared.'))
		}

		collectionsStore.addCollections([album])

		return {
			album,
			link: getPublicAlbumLink(String(token)),
			skippedCount: Math.max(0, fileIds.length - addedCount),
		}
	} catch (error) {
		logger.error('Error sharing photos by link', { error, albumFileName })

		try {
			await davClient.deleteFile(albumFileName)
			collectionsStore.removeCollections([albumFileName])
		} catch (deleteError) {
			logger.error('Error deleting the album of a failed share', { error: deleteError, albumFileName })
			throw new QuickShareError(t('photos', 'Sharing failed and the album "{albumName}" could not be removed again. Check its sharing or delete it in Albums.', { albumName }))
		}

		throw error instanceof QuickShareError
			? error
			: new QuickShareError(t('photos', 'The link could not be created, nothing was shared.'))
	}
}

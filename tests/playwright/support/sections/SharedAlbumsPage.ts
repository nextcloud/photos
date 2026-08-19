/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { SHARED_ALBUM_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'
import { COLLECTION_ENTRY } from './AlbumsPage.ts'

/**
 * The overview of the albums shared with the account.
 *
 * A shared album is stored under a name carrying its owner, so that two people
 * can share an album of the same name — {@link sharedAlbumName} builds it.
 */
export class SharedAlbumsPage {
	constructor(public readonly page: Page) {}

	public heading(): Locator {
		return this.page.getByRole('heading', { level: 1, name: 'Collaborative albums' })
	}

	/**
	 * The entry of one shared album.
	 *
	 * Found by the name the app marks the entry with rather than by an accessible
	 * name: the entry shows the album under the name its owner gave it, which is
	 * exactly the name two people sharing an album can have in common — only the
	 * storage name below tells them apart.
	 *
	 * @param albumName - Name of the album, including its owner suffix
	 */
	public getAlbum(albumName: string): Locator {
		return this.page.getByRole('main').locator(`[data-cy-collections-list-collection="${albumName}"]`)
	}

	/** Every album of the overview. */
	public getAllAlbums(): Locator {
		return this.page.getByRole('main').locator(COLLECTION_ENTRY)
	}

	/**
	 * Open the overview and wait for the listing to have been fetched, so that an
	 * "album is gone" assertion cannot pass on a list that is still loading.
	 */
	public async open(): Promise<void> {
		const listed = waitForDavRequest(this.page, 'PROPFIND', SHARED_ALBUM_ENDPOINT)
		await this.page.goto('apps/photos/sharedalbums')
		await expect(this.heading()).toBeVisible()
		await listed
	}
}

/**
 * Name a shared album is stored under for a collaborator.
 *
 * @param albumName - Name the owner gave the album
 * @param ownerId - Account id of the owner
 */
export function sharedAlbumName(albumName: string, ownerId: string): string {
	return `${albumName} (${ownerId})`
}

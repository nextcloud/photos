/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { ALBUM_ENDPOINT, expectStored, waitForDavRequest } from '../utils/requests.ts'

/** Attribute every entry of a collection list carries, holding the name of it. */
export const COLLECTION_ENTRY = '[data-cy-collections-list-collection]'
import { AlbumFormDialog } from './AlbumFormDialog.ts'

/** The overview of the albums an account owns. */
export class AlbumsPage {
	constructor(public readonly page: Page) {}

	public heading(): Locator {
		return this.page.getByRole('heading', { level: 1, name: 'Albums' })
	}

	public newAlbumButton(): Locator {
		return this.page.getByRole('button', { name: 'New album' })
	}

	/** Every album of the overview. */
	public getAllAlbums(): Locator {
		return this.page.getByRole('main').locator(COLLECTION_ENTRY)
	}

	/**
	 * The entry of one album.
	 *
	 * Found by the name the app marks the entry with rather than by an accessible
	 * name: an album without a photo shows a placeholder instead of a cover, so the
	 * only thing naming it is its title — which two albums may well share.
	 *
	 * @param albumName - Name of the album
	 */
	public getAlbum(albumName: string): Locator {
		return this.page.getByRole('main').locator(`[data-cy-collections-list-collection="${albumName}"]`)
	}

	/**
	 * The message shown while the account owns no album. An `NcEmptyContent`
	 * announces itself as a note labelled by the message it carries.
	 */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'There is no album yet!' })
	}

	/**
	 * Open the album overview and wait for the listing to have been fetched.
	 *
	 * Waiting for the request rather than for an album is what makes an "album is
	 * gone" assertion meaningful: an empty overview and one that has not loaded yet
	 * look the same.
	 */
	public async open(): Promise<void> {
		const listed = waitForDavRequest(this.page, 'PROPFIND', ALBUM_ENDPOINT)
		await this.page.goto('apps/photos/albums')
		await expect(this.heading()).toBeVisible()
		await listed
	}

	/**
	 * Create an album through the overview and wait for the app to have navigated
	 * into it.
	 *
	 * @param albumName - Name to give the album
	 */
	public async createAlbum(albumName: string): Promise<void> {
		await this.newAlbumButton().click()

		const form = new AlbumFormDialog(this.page, 'New album')
		await form.waitForOpen()
		await form.fillName(albumName)

		const created = waitForDavRequest(this.page, 'MKCOL', ALBUM_ENDPOINT)
		await form.createButton().click()
		await expectStored(await created, `create the album "${albumName}"`)

		await expect(form.dialog()).toHaveCount(0)
		// Creating an album opens it, which is where the album content page takes over.
		await expect(this.page.getByRole('heading', { level: 1, name: albumName })).toBeVisible()
	}
}

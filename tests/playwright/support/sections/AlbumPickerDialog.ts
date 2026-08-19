/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { waitForDavRequest } from '../utils/requests.ts'

/**
 * The dialog listing the albums a selection can be added to — both the own ones
 * and the ones shared with the account.
 */
export class AlbumPickerDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog')
			.filter({ has: this.page.getByRole('heading', { name: 'Add to Album' }) })
	}

	/**
	 * The entry of one album. Each entry is a link whose accessible name is the
	 * album name followed by how many photos it holds.
	 *
	 * @param albumName - Name of the album
	 */
	public getAlbum(albumName: string): Locator {
		return this.dialog().getByRole('link', { name: albumName })
	}

	/**
	 * Add the selection to an album and wait for every photo to have been copied
	 * into it.
	 *
	 * Each photo is copied on its own, so it is the number of `COPY` requests that
	 * tells a finished operation from one that is still running — the dialog closes
	 * as soon as the first one was fired.
	 *
	 * @param albumName - Name of the album to add to
	 * @param photoCount - Number of photos in the selection
	 */
	public async pickAlbum(albumName: string, photoCount: number): Promise<void> {
		const album = this.getAlbum(albumName)
		// The list is fetched when the dialog mounts, so a missing entry would
		// otherwise be reported as "album does not exist".
		await expect(album).toBeVisible()

		const copies = Array.from({ length: photoCount }, () => waitForDavRequest(this.page, 'COPY'))
		await album.click()

		await Promise.all(copies)
		await expect(this.dialog()).toHaveCount(0)
	}
}

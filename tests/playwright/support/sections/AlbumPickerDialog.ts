/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { ALBUM_ENDPOINT, SHARED_ALBUM_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'

/**
 * The dialog listing the albums a selection can be added to — both the own ones
 * and the ones shared with the account.
 */
export class AlbumPickerDialog {
	constructor(public readonly page: Page) {}

	/**
	 * Open the picker through the action that triggers it, and return it once its
	 * album list has arrived.
	 *
	 * @param page - Page the app runs on
	 * @param openPicker - The action opening the picker, armed before it runs
	 */
	public static async open(page: Page, openPicker: () => Promise<void>): Promise<AlbumPickerDialog> {
		const listings = Promise.all([
			waitForDavRequest(page, 'PROPFIND', ALBUM_ENDPOINT),
			waitForDavRequest(page, 'PROPFIND', SHARED_ALBUM_ENDPOINT),
		])
		// A picker that never opens fails on the assertion below, which leaves these
		// waits behind — and an unhandled rejection of theirs would be reported
		// against whatever test runs next. Awaiting them still throws.
		listings.catch(() => {})

		const picker = new AlbumPickerDialog(page)
		await openPicker()
		await expect(picker.dialog()).toBeVisible()
		await listings

		return picker
	}

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
		// The listings the entries are rendered from were awaited in `open`, so a
		// missing entry here really is a missing album.
		await expect(album).toBeVisible()

		const copies = Array.from({ length: photoCount }, () => waitForDavRequest(this.page, 'COPY'))
		await album.click()

		await Promise.all(copies)
		await expect(this.dialog()).toHaveCount(0)
	}
}

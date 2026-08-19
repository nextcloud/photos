/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Download, Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { PUBLIC_ALBUM_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'
import { MediaGrid } from './MediaGrid.ts'

/** An album as an anonymous visitor sees it through its public link. */
export class PublicAlbumPage {
	/** The photos of the album. Picking them is not offered here. */
	public readonly grid: MediaGrid

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
	}

	/**
	 * The heading naming the album, which the public listing carries as its
	 * original name.
	 *
	 * @param albumName - Name the owner gave the album
	 */
	public heading(albumName: string): Locator {
		return this.page.getByRole('heading', { level: 1, name: albumName })
	}

	/** The message shown once the link was revoked. */
	public notFoundMessage(): Locator {
		return this.page.getByRole('note', { name: 'This collection does not exist' })
	}

	/**
	 * Open a public link and wait for the album listing to have been answered.
	 *
	 * The wait also covers a revoked link: the request comes back either way, and
	 * only then is "the album is gone" a statement about the server rather than
	 * about a page that has not loaded yet.
	 *
	 * @param link - The public link, as the sharing dialog handed it out
	 */
	public async open(link: string): Promise<void> {
		const listed = waitForDavRequest(this.page, 'PROPFIND', PUBLIC_ALBUM_ENDPOINT)
		await this.page.goto(link)
		await listed
	}

	/**
	 * Open a photo in the viewer and download it from there.
	 *
	 * The viewer is a separate app, so it is addressed through the roles of its
	 * dialog rather than through anything the photos app owns.
	 *
	 * @param name - Name of the photo file, as it is named inside the album
	 */
	public async downloadPhoto(name: string): Promise<Download> {
		await this.grid.getMedia(name).click()

		const viewer = this.page.locator('.viewer')
		await expect(viewer).toBeVisible()

		await viewer.getByRole('button', { name: 'Actions' }).click()
		const download = this.page.waitForEvent('download')
		await this.page.getByRole('menuitem', { name: 'Download' }).click()

		return download
	}
}

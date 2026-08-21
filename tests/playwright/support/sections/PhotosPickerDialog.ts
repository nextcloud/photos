/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { waitForDavRequest } from '../utils/requests.ts'
import { MediaGrid } from './MediaGrid.ts'

/**
 * The dialog picking photos of the library to add to a collection.
 *
 * Its grid renders the very same tiles as the timeline, which is why it is
 * scoped to the dialog: the timeline behind it is still in the DOM.
 */
export class PhotosPickerDialog {
	/** The photos offered for picking. */
	public readonly grid: MediaGrid

	constructor(
		public readonly page: Page,
		/** Name of the collection the photos are added to. */
		private readonly destination: string,
	) {
		this.grid = new MediaGrid(page, this.dialog())
	}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: `Add photos to ${this.destination}` })
	}

	/** The button adding what is picked. Disabled while nothing is picked. */
	public addButton(): Locator {
		return this.dialog().getByRole('button', { name: `Add to ${this.destination}` })
	}

	/**
	 * Wait for the dialog to have loaded the photos it offers.
	 *
	 * The listing is fetched when the dialog mounts, so picking before that would
	 * be picking from an empty grid.
	 */
	public async waitForOpen(): Promise<void> {
		await expect(this.dialog()).toBeVisible()
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}

	/**
	 * Pick photos and add them to the collection, waiting for each of them to have
	 * been copied into it.
	 *
	 * Each photo is copied on its own, so it is the number of `COPY` requests that
	 * tells a finished operation from one that is still running.
	 *
	 * @param names - Names of the photo files to add
	 */
	public async addPhotos(...names: string[]): Promise<void> {
		await this.waitForOpen()
		await this.grid.select(...names)

		await expect(this.addButton()).toBeEnabled()
		const copies = names.map(() => waitForDavRequest(this.page, 'COPY'))
		await this.addButton().click()

		await Promise.all(copies)
		await expect(this.dialog()).toHaveCount(0)
	}
}

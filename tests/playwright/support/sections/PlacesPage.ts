/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { MediaGrid } from './MediaGrid.ts'

/**
 * The places the app resolved out of the coordinates of the photos, and the
 * photos of a single place.
 */
export class PlacesPage {
	/** The photos of the open place. */
	public readonly grid: MediaGrid

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
	}

	public heading(): Locator {
		return this.page.getByRole('heading', { level: 1, name: 'Places' })
	}

	/** Every place of the overview. */
	public getAllPlaces(): Locator {
		return this.page.getByRole('main').getByRole('link', { name: /^Cover photo for place / })
	}

	/**
	 * The cover of one place, which is also the link opening it.
	 *
	 * @param placeName - Name of the place
	 */
	public getPlace(placeName: string): Locator {
		return this.page.getByRole('main').getByRole('link', { name: `Cover photo for place ${placeName}` })
	}

	/** Open the overview of the places. */
	public async open(): Promise<void> {
		await this.page.goto('apps/photos/places')
		await expect(this.heading()).toBeVisible()
	}

	/**
	 * Open a place and wait for its photos to be rendered.
	 *
	 * @param placeName - Name of the place to open
	 */
	public async openPlace(placeName: string): Promise<void> {
		await this.page.goto(`apps/photos/places/${encodeURIComponent(placeName)}`)
		await expect(this.page.getByRole('heading', { level: 1, name: placeName })).toBeVisible()
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}
}

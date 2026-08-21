/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { waitForTimelineSearch } from '../utils/requests.ts'

/** The map view, plotting the photos which carry a position. */
export class MapPage {
	constructor(public readonly page: Page) {}

	/**
	 * Open the map view and wait for the photos it plots.
	 */
	public async open(): Promise<void> {
		const loaded = waitForTimelineSearch(this.page)
		await this.page.goto('apps/photos/map')
		await expect(this.heading()).toBeVisible()
		await loaded
	}

	public heading(): Locator {
		return this.page.getByRole('heading', { level: 1, name: 'Map' })
	}

	/** The message shown while no photo of the library carries a position. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'No geotagged photos' })
	}

	/**
	 * The drawing that stands in for an icon in the empty state.
	 */
	public emptyIllustration(): Locator {
		// the image is used here as pure decoration so its wrapped in aria-hidden and thus byRole does not work here
		return this.page.locator('.photos-illustration[aria-label="Map illustration"]')
	}

	/** The map itself, which carries no accessible name of its own. */
	public map(): Locator {
		return this.page.locator('.leaflet-container')
	}

	/** The markers of the photos, which the map labels with their file name. */
	public markers(): Locator {
		return this.map().locator('.leaflet-marker-icon')
	}
}

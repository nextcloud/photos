/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { waitForTimelineSearch } from '../utils/requests.ts'
import { ViewerModal } from './ViewerModal.ts'

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

	/** The tiles the map is drawn out of, which Leaflet marks with its own class. */
	public tiles(): Locator {
		return this.map().locator('img.leaflet-tile')
	}

	/** The markers of the photos, which the map labels with their file name. */
	public markers(): Locator {
		return this.map().locator('.leaflet-marker-icon')
	}

	/**
	 * The marker of one photo. Leaflet renders a marker as an image with the label
	 * it was given as its title, which is the only handle it offers.
	 *
	 * @param name - Name of the photo file
	 */
	public marker(name: string): Locator {
		return this.map().getByTitle(name)
	}

	/**
	 * Open a photo through its marker.
	 *
	 * @param name - Name of the photo file
	 * @return The viewer, showing that photo
	 */
	public async openMarker(name: string): Promise<ViewerModal> {
		await this.marker(name).click()

		const viewer = new ViewerModal(this.page)
		await viewer.waitForPhoto(name)
		return viewer
	}

	/** The button leading to the maps app, only offered when it is installed. */
	public mapsAppButton(): Locator {
		return this.page.getByRole('link', { name: 'Open the Maps app' })
	}
}

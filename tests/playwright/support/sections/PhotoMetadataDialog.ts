/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

/** The read-only metadata summary of a photo. */
export class PhotoMetadataDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Photo metadata' })
	}

	/**
	 * The value of a metadata entry, by the name it is listed under.
	 *
	 * The summary is a description list, which carries the association between a
	 * name and its value — so the value is the `dd` following the `dt` of that
	 * name rather than anything found by position.
	 *
	 * @param label - Name of the entry, e.g. "Place"
	 */
	public getEntry(label: string): Locator {
		return this.dialog()
			.locator('.photo-metadata__entry')
			.filter({ has: this.page.locator('dt', { hasText: new RegExp(`^${label}$`) }) })
			.locator('dd')
	}

	/** The map the position of the photo is shown on. */
	public map(): Locator {
		return this.dialog().locator('.leaflet-container')
	}

	/** The label of the marker on the map, which names the place. */
	public mapMarkerLabel(): Locator {
		return this.dialog().locator('.leaflet-tooltip')
	}
}

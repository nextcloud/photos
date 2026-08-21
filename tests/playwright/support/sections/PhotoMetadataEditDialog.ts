/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { DAV_ENDPOINT, expectStored } from '../utils/requests.ts'

/** The editor for the taken date and the position of a photo. */
export class PhotoMetadataEditDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Edit metadata' })
	}

	public latitudeInput(): Locator {
		return this.dialog().getByRole('textbox', { name: 'Latitude' })
	}

	public longitudeInput(): Locator {
		return this.dialog().getByRole('textbox', { name: 'Longitude' })
	}

	/**
	 * The taken date field. It is a native `datetime-local` input, which has no
	 * role of its own, so it is addressed through its label.
	 */
	public takenAtInput(): Locator {
		return this.dialog().getByLabel('Date and time the photo was taken')
	}

	public saveButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Save' })
	}

	public removeLocationButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Remove location' })
	}

	/**
	 * Wait for the dialog to have loaded the metadata it edits.
	 *
	 * The coordinates and the taken date are not part of the file listings, so the
	 * form only replaces its spinner once they have been fetched — filling a field
	 * before that would be typing into an element that is about to be replaced.
	 */
	public async waitForLoaded(): Promise<void> {
		await expect(this.dialog()).toBeVisible()
		await expect(this.latitudeInput()).toBeVisible()
	}

	/**
	 * Replace the coordinates of the photo.
	 *
	 * @param latitude - Latitude in decimal degrees, as typed by a user
	 * @param longitude - Longitude in decimal degrees, as typed by a user
	 */
	public async fillCoordinates(latitude: string, longitude: string): Promise<void> {
		await this.latitudeInput().fill(latitude)
		await this.longitudeInput().fill(longitude)
	}

	/**
	 * Replace the taken date of the photo.
	 *
	 * @param value - The moment, in the `YYYY-MM-DDTHH:mm` format of the input
	 */
	public async fillTakenAt(value: string): Promise<void> {
		await this.takenAtInput().fill(value)
	}

	/**
	 * Save the metadata and wait for the server to have stored it.
	 *
	 * The dialog closes as soon as the request resolved, so the wait is what makes
	 * a following reload read back what was just written instead of racing it.
	 */
	public async save(): Promise<void> {
		const saved = this.page.waitForResponse((response) => response.request().method() === 'PROPPATCH'
			&& DAV_ENDPOINT.test(response.url()))

		await expect(this.saveButton()).toBeEnabled()
		await this.saveButton().click()

		await expectStored(await saved, 'save the metadata of the photo')
		await expect(this.dialog()).toHaveCount(0)
	}
}

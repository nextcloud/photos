/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { PhotosFilters } from './PhotosFilters.ts'

/**
 * The form creating an album and the one editing its details are the same
 * component, only the label of its submit button differs.
 *
 * It is rendered inside a dialog whose accessible name the app does not always
 * set, so the dialog is identified by the heading it shows instead.
 */
export class AlbumFormDialog {
	/** The filters of the album, which turn it into a smart album. */
	public readonly filters: PhotosFilters

	constructor(
		public readonly page: Page,
		/** Heading of the dialog holding the form, e.g. "New album". */
		private readonly heading: string,
	) {
		this.filters = new PhotosFilters(page, this.dialog())
	}

	public dialog(): Locator {
		return this.page.getByRole('dialog')
			.filter({ has: this.page.getByRole('heading', { name: this.heading, exact: true }) })
	}

	public nameInput(): Locator {
		return this.dialog().getByRole('textbox', { name: 'Name of the album' })
	}

	public locationInput(): Locator {
		return this.dialog().getByRole('textbox', { name: 'Location of the album' })
	}

	/** The button creating the album. Only rendered while creating one. */
	public createButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Create album' })
	}

	/** The button saving the changes. Only rendered while editing an album. */
	public saveButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Save' })
	}

	public addCollaboratorsButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Add collaborators' })
	}

	/**
	 * Wait for the form to be ready to be filled in.
	 *
	 * @param options - `mounted` to only wait for the dialog, which is what the
	 * edit form needs — it comes up with the album's values already in place
	 * @param options.mounted - Whether to skip waiting for the name to be empty
	 */
	public async waitForOpen({ mounted = false } = {}): Promise<void> {
		await expect(this.dialog()).toBeVisible()
		await expect(this.nameInput()).toBeVisible()
		if (!mounted) {
			await expect(this.nameInput()).toHaveValue('')
		}
	}

	/**
	 * Fill in the name of the album.
	 *
	 * @param name - Name to give the album
	 */
	public async fillName(name: string): Promise<void> {
		await this.nameInput().fill(name)
		// The submit button stays disabled while the name is empty or rejected, so
		// this also asserts the name was accepted.
		await expect(this.nameInput()).toHaveValue(name)
	}

	/**
	 * Fill in the location of the album.
	 *
	 * @param location - Location to give the album
	 */
	public async fillLocation(location: string): Promise<void> {
		await this.locationInput().fill(location)
	}
}

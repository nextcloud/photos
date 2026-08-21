/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { AlbumPickerDialog } from './AlbumPickerDialog.ts'
import { PhotoMetadataDialog } from './PhotoMetadataDialog.ts'
import { PhotoMetadataEditDialog } from './PhotoMetadataEditDialog.ts'

/**
 * The actions menu a single photo carries, laid over its tile.
 *
 * The menu is named after the photo it belongs to, so several of them on the
 * same page stay distinguishable — but it is looked up page wide because the
 * popover is rendered outside of the tile.
 */
export class PhotoActionsMenu {
	constructor(
		public readonly page: Page,
		/** Name of the photo file the menu belongs to. */
		private readonly photoName: string,
	) {}

	public menu(): Locator {
		return this.page.getByRole('menu', { name: `Actions for ${this.photoName}` })
	}

	public getEntry(name: string | RegExp): Locator {
		return this.menu().getByRole('menuitem', { name })
	}

	/** Open the read-only metadata of the photo. */
	public async viewMetadata(): Promise<PhotoMetadataDialog> {
		await this.getEntry('View metadata').click()
		const dialog = new PhotoMetadataDialog(this.page)
		await expect(dialog.dialog()).toBeVisible()
		return dialog
	}

	/** Open the metadata editor of the photo. */
	public async editMetadata(): Promise<PhotoMetadataEditDialog> {
		await this.getEntry('Edit metadata').click()
		const dialog = new PhotoMetadataEditDialog(this.page)
		await dialog.waitForLoaded()
		return dialog
	}

	/** Open the album picker to add the photo to an album. */
	public async addToAlbum(): Promise<AlbumPickerDialog> {
		return await AlbumPickerDialog.open(this.page, () => this.getEntry('Add to album').click())
	}

	/** The confirmation dialog of the delete entry. */
	public deleteConfirmation(): Locator {
		return this.page.getByRole('dialog', { name: 'Delete photo' })
	}

	/**
	 * Move the photo to the trash, through the menu and its confirmation dialog.
	 */
	public async delete(): Promise<void> {
		await this.getEntry('Delete').click()
		const confirmation = this.deleteConfirmation()
		await expect(confirmation).toBeVisible()
		await confirmation.getByRole('button', { name: 'Move to trash' }).click()
		await expect(confirmation).toHaveCount(0)
	}
}

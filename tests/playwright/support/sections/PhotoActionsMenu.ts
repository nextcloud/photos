/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { expectStored, waitForDavRequest } from '../utils/requests.ts'
import { AlbumPickerDialog } from './AlbumPickerDialog.ts'
import { PhotoMetadataDialog } from './PhotoMetadataDialog.ts'
import { PhotoMetadataEditDialog } from './PhotoMetadataEditDialog.ts'
import { PhotoTagsDialog } from './PhotoTagsDialog.ts'

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

	/**
	 * Click an entry that opens a dialog, and wait for the menu to be gone.
	 *
	 * The menu fades out while the dialog is already shown, and it is layered
	 * above the dialog: a click landing on the dialog during that fade hits the
	 * menu instead.
	 *
	 * @param name - Name of the entry
	 */
	private async openDialog(name: string): Promise<void> {
		await this.getEntry(name).click()
		await expect(this.menu()).toBeHidden()
	}

	/** Open the read-only metadata of the photo. */
	public async viewMetadata(): Promise<PhotoMetadataDialog> {
		await this.openDialog('View metadata')
		const dialog = new PhotoMetadataDialog(this.page)
		await expect(dialog.dialog()).toBeVisible()
		return dialog
	}

	/** Open the metadata editor of the photo. */
	public async editMetadata(): Promise<PhotoMetadataEditDialog> {
		await this.openDialog('Edit metadata')
		const dialog = new PhotoMetadataEditDialog(this.page)
		await dialog.waitForLoaded()
		return dialog
	}

	/** Open the album picker to add the photo to an album. */
	public async addToAlbum(): Promise<AlbumPickerDialog> {
		return await AlbumPickerDialog.open(this.page, () => this.openDialog('Add to album'))
	}

	/**
	 * The entry marking the photo as a favorite. It is replaced by
	 * {@link removeFromFavoritesEntry} once the photo is one.
	 */
	public addToFavoritesEntry(): Locator {
		return this.getEntry('Add to favorites')
	}

	public removeFromFavoritesEntry(): Locator {
		return this.getEntry('Remove from favorites')
	}

	public manageTagsEntry(): Locator {
		return this.getEntry('Manage tags')
	}

	/** Mark the photo as a favorite and wait for the server to have stored it. */
	public async favorite(): Promise<void> {
		await this.storeFavorite(this.addToFavoritesEntry(), 'mark the photo as a favorite')
	}

	/** Take the photo out of the favorites and wait for the server to have stored it. */
	public async unfavorite(): Promise<void> {
		await this.storeFavorite(this.removeFromFavoritesEntry(), 'take the photo out of the favorites')
	}

	/** Open the dialog managing the tags of the photo. */
	public async manageTags(): Promise<PhotoTagsDialog> {
		await this.openDialog('Manage tags')

		const dialog = new PhotoTagsDialog(this.page)
		await dialog.waitForLoaded()
		return dialog
	}

	/**
	 * Click an entry of the favorites and wait for the state to be written.
	 *
	 * @param entry - The entry to click
	 * @param description - What the entry does, for the message of a failure
	 */
	private async storeFavorite(entry: Locator, description: string): Promise<void> {
		const stored = waitForDavRequest(this.page, 'PROPPATCH')
		await entry.click()
		await expectStored(await stored, description)
	}

	/** The confirmation dialog of the delete entry. */
	public deleteConfirmation(): Locator {
		return this.page.getByRole('dialog', { name: 'Delete photo' })
	}

	/**
	 * Move the photo to the trash, through the menu and its confirmation dialog.
	 */
	public async delete(): Promise<void> {
		await this.openDialog('Delete')
		const confirmation = this.deleteConfirmation()
		await expect(confirmation).toBeVisible()
		await confirmation.getByRole('button', { name: 'Move to trash' }).click()
		await expect(confirmation).toHaveCount(0)
	}
}

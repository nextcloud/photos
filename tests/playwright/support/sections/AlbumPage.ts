/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { openMenu } from '../utils/menus.ts'
import { ALBUM_ENDPOINT, expectStored, waitForCollectionContents, waitForDavRequest } from '../utils/requests.ts'
import { ActionsMenu } from './ActionsMenu.ts'
import { AlbumFormDialog } from './AlbumFormDialog.ts'
import { CollaboratorsDialog } from './CollaboratorsDialog.ts'
import { MediaGrid } from './MediaGrid.ts'
import { PhotosPickerDialog } from './PhotosPickerDialog.ts'

/** The contents of an album the account owns. */
export class AlbumPage {
	/** The photos of the album. */
	public readonly grid: MediaGrid

	/** The actions menu of the album, in the header. */
	public readonly actions: ActionsMenu

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
		this.actions = new ActionsMenu(page)
	}

	/**
	 * The heading naming the open album.
	 *
	 * @param albumName - Name of the album
	 */
	public heading(albumName: string): Locator {
		return this.page.getByRole('heading', { level: 1, name: albumName })
	}

	public addPhotosButton(): Locator {
		return this.page.getByRole('button', { name: 'Add photos to this album' })
	}

	public manageCollaboratorsButton(): Locator {
		return this.page.getByRole('button', { name: 'Manage collaborators for this album' })
	}

	/** The message shown while the album holds no photo. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'This album does not have any photos or videos yet!' })
	}

	/**
	 * Open an album and wait for its contents to have been fetched.
	 *
	 * Both the album and its contents are fetched, and it is the contents listing
	 * that fills the grid — so that is the one worth waiting for.
	 *
	 * @param albumName - Name of the album to open
	 */
	public async open(albumName: string): Promise<void> {
		const listed = this.waitForContents(albumName)
		await this.page.goto(`apps/photos/albums/${encodeURIComponent(albumName)}`)
		await expect(this.heading(albumName)).toBeVisible()
		await listed
	}

	/**
	 * Wait for the contents listing of an album, which is what fills its grid.
	 *
	 * @param albumName - Name of the album
	 */
	public waitForContents(albumName: string): Promise<unknown> {
		return waitForCollectionContents(this.page, 'albums', albumName)
	}

	/** Open the actions menu of the album. */
	public async openActionsMenu(): Promise<ActionsMenu> {
		await openMenu(this.actions.trigger(), this.actions.menu())
		return this.actions
	}

	/** Open the picker adding photos of the library to the album. */
	public async openPhotosPicker(albumName: string): Promise<PhotosPickerDialog> {
		await this.addPhotosButton().first().click()

		const picker = new PhotosPickerDialog(this.page, albumName)
		await picker.waitForOpen()
		return picker
	}

	/**
	 * Add photos of the library to the album and wait for the album to have been
	 * re-read, which is what gives its photos the names they carry inside it.
	 *
	 * @param albumName - Name of the album
	 * @param names - Names of the photo files to add
	 */
	public async addPhotos(albumName: string, names: string[]): Promise<void> {
		const picker = await this.openPhotosPicker(albumName)

		const refetched = this.waitForContents(albumName)
		await picker.addPhotos(...names)
		await refetched
	}

	/** Open the dialog managing who the album is shared with. */
	public async openCollaborators(): Promise<CollaboratorsDialog> {
		await this.manageCollaboratorsButton().click()

		const dialog = new CollaboratorsDialog(this.page)
		await expect(dialog.dialog()).toBeVisible()
		return dialog
	}

	/** Open the form editing name, location and filters of the album. */
	public async openDetailsForm(): Promise<AlbumFormDialog> {
		const menu = await this.openActionsMenu()
		await menu.editAlbumDetailsEntry().click()

		const form = new AlbumFormDialog(this.page, 'Edit album details')
		await form.waitForOpen({ mounted: true })
		return form
	}

	/**
	 * Rename the album and wait for the app to have navigated to its new name.
	 *
	 * @param newName - Name to give the album
	 */
	public async rename(newName: string): Promise<void> {
		const form = await this.openDetailsForm()
		await form.fillName(newName)

		const renamed = waitForDavRequest(this.page, 'MOVE', ALBUM_ENDPOINT)
		await form.saveButton().click()
		await expectStored(await renamed, `rename the album to "${newName}"`)

		await expect(form.dialog()).toHaveCount(0)
		await expect(this.heading(newName)).toBeVisible()
	}

	/**
	 * Set the location of the album and wait for the server to have stored it.
	 *
	 * @param location - Location to give the album, an empty string clears it
	 */
	public async setLocation(location: string): Promise<void> {
		const form = await this.openDetailsForm()
		await form.fillLocation(location)

		const saved = waitForDavRequest(this.page, 'PROPPATCH', ALBUM_ENDPOINT)
		await form.saveButton().click()
		await expectStored(await saved, 'save the location of the album')

		await expect(form.dialog()).toHaveCount(0)
	}

	/**
	 * Set the filters of the album, turning it into a smart album, and wait for the
	 * contents to have been re-read with them applied.
	 *
	 * @param albumName - Name of the album
	 * @param apply - The filters to set on the open form
	 */
	public async setFilters(albumName: string, apply: (form: AlbumFormDialog) => Promise<void>): Promise<void> {
		const form = await this.openDetailsForm()
		await apply(form)

		const saved = waitForDavRequest(this.page, 'PROPPATCH', ALBUM_ENDPOINT)
		const refetched = this.waitForContents(albumName)
		await form.saveButton().click()
		await expectStored(await saved, 'save the filters of the album')
		await refetched

		await expect(form.dialog()).toHaveCount(0)
	}

	/**
	 * The location shown under the name of the album. It is a subtitle next to a
	 * marker icon and carries no accessible name of its own, hence the class.
	 */
	public location(): Locator {
		return this.page.locator('.album__location')
	}

	/**
	 * Remove the selected photos from the album and wait for them to be gone.
	 *
	 * @param names - Names of the selected photo files, as they are named inside
	 * the album
	 */
	public async removeSelectionFromAlbum(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()

		const removals = names.map(() => waitForDavRequest(this.page, 'DELETE', ALBUM_ENDPOINT))
		await menu.removeFromAlbumEntry().click()
		await Promise.all(removals)

		for (const name of names) {
			await expect(this.grid.getMedia(name)).toHaveCount(0)
		}
	}

	/**
	 * Delete the album, confirming the dialog that asks about it.
	 *
	 * @param albumName - Name of the album
	 */
	public async deleteAlbum(albumName: string): Promise<void> {
		const menu = await this.openActionsMenu()
		await menu.deleteAlbumEntry().click()

		const confirmation = this.page.getByRole('dialog', { name: 'Delete album' })
		await expect(confirmation).toBeVisible()
		await expect(confirmation).toContainText(`Are you sure you want to delete ${albumName}?`)

		const deleted = waitForDavRequest(this.page, 'DELETE', ALBUM_ENDPOINT)
		await confirmation.getByRole('button', { name: 'Confirm' }).click()
		await expectStored(await deleted, `delete the album "${albumName}"`)

		// Deleting an album sends the app back to the overview.
		await expect(this.page.getByRole('heading', { level: 1, name: 'Albums' })).toBeVisible()
	}

	/**
	 * Mark the selected photos as favorite and wait for the server to have stored
	 * it.
	 *
	 * @param names - Names of the selected photo files, as named inside the album
	 */
	public async favoriteSelection(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()
		await this.withFavoriteUpdates(names.length, () => menu.addToFavoritesEntry().click())
		await this.grid.deselect(...names)
	}

	/**
	 * Remove the selected photos from the favorites and wait for the server to have
	 * stored it.
	 *
	 * @param names - Names of the selected photo files, as named inside the album
	 */
	public async unfavoriteSelection(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()
		await this.withFavoriteUpdates(names.length, () => menu.removeFromFavoritesEntry().click())
		await this.grid.deselect(...names)
	}

	/**
	 * Await the favorite state of every photo of a selection to have been written.
	 *
	 * The app marks the tiles optimistically and only rolls back on failure, so
	 * without awaiting the requests a following reload could read the old state.
	 *
	 * @param photoCount - Number of photos in the selection
	 * @param action - The action triggering the updates
	 */
	private async withFavoriteUpdates(photoCount: number, action: () => Promise<void>): Promise<void> {
		const updates = Array.from({ length: photoCount }, () => this.page.waitForResponse((response) => response.request().method() === 'PROPPATCH'))
		await action()
		await Promise.all(updates)
	}
}

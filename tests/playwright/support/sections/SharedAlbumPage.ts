/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { openMenu } from '../utils/menus.ts'
import { expectStored, SHARED_ALBUM_ENDPOINT, waitForCollectionContents, waitForDavRequest } from '../utils/requests.ts'
import { ActionsMenu } from './ActionsMenu.ts'
import { MediaGrid } from './MediaGrid.ts'
import { PhotosPickerDialog } from './PhotosPickerDialog.ts'

/**
 * The contents of an album shared with the account.
 *
 * The header names the album without the owner suffix its storage name carries,
 * which is why `open` takes both.
 */
export class SharedAlbumPage {
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
	 * @param albumName - Name the owner gave the album, without the owner suffix
	 */
	public heading(albumName: string): Locator {
		return this.page.getByRole('heading', { level: 1, name: albumName })
	}

	/**
	 * The button adding photos to the album. The header renders it as "Add", and
	 * an empty album offers a second one in its placeholder.
	 */
	public addPhotosButton(): Locator {
		return this.page.getByRole('button', { name: 'Add photos to this album' })
	}

	/** The message shown while the album holds no photo. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'This album does not have any photos or videos yet!' })
	}

	/**
	 * Open a shared album and wait for its contents to have been fetched.
	 *
	 * @param albumName - Name the owner gave the album
	 * @param ownerId - Account id of the owner, which the storage name carries
	 */
	public async open(albumName: string, ownerId: string): Promise<void> {
		const storageName = `${albumName} (${ownerId})`
		const listed = this.waitForContents(storageName)
		await this.page.goto(`apps/photos/sharedalbums/${encodeURIComponent(storageName)}`)
		await expect(this.heading(albumName)).toBeVisible()
		await listed
	}

	/**
	 * Wait for the contents listing of a shared album, which is what fills its grid.
	 *
	 * @param storageName - Name of the album including its owner suffix
	 */
	public waitForContents(storageName: string): Promise<unknown> {
		return waitForCollectionContents(this.page, 'sharedalbums', storageName)
	}

	/** Open the actions menu of the album. */
	public async openActionsMenu(): Promise<ActionsMenu> {
		await openMenu(this.actions.trigger(), this.actions.menu())
		return this.actions
	}

	/**
	 * Add photos of the library to the shared album and wait for the album to have
	 * been re-read.
	 *
	 * @param albumName - Name the owner gave the album, which the picker is titled after
	 * @param ownerId - Account id of the owner
	 * @param names - Names of the photo files to add
	 */
	public async addPhotos(albumName: string, ownerId: string, names: string[]): Promise<void> {
		await this.addPhotosButton().first().click()

		const picker = new PhotosPickerDialog(this.page, albumName)
		const refetched = this.waitForContents(`${albumName} (${ownerId})`)
		await picker.addPhotos(...names)
		await refetched
	}

	/**
	 * Remove the selected photos from the album and wait for them to be gone.
	 *
	 * @param names - Names of the selected photo files, as named inside the album
	 */
	public async removeSelectionFromAlbum(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()

		const removals = names.map(() => waitForDavRequest(this.page, 'DELETE', SHARED_ALBUM_ENDPOINT))
		await menu.removeFromAlbumEntry().click()
		await Promise.all(removals)

		for (const name of names) {
			await expect(this.grid.getMedia(name)).toHaveCount(0)
		}
	}

	/**
	 * Leave the shared album, confirming the dialog that asks about it.
	 *
	 * The entry is worded "Delete album" but the confirmation is not: for a
	 * collaborator the album is only unshared, which is what "Leave" says.
	 *
	 * @param albumName - Name the owner gave the album
	 * @param ownerId - Account id of the owner
	 */
	public async leaveAlbum(albumName: string, ownerId: string): Promise<void> {
		const storageName = `${albumName} (${ownerId})`

		const menu = await this.openActionsMenu()
		await menu.deleteAlbumEntry().click()

		const confirmation = this.page.getByRole('dialog', { name: 'Leave shared album' })
		await expect(confirmation).toBeVisible()
		await expect(confirmation).toContainText(`Are you sure you want to delete ${storageName}?`)

		const left = waitForDavRequest(this.page, 'DELETE', SHARED_ALBUM_ENDPOINT)
		await confirmation.getByRole('button', { name: 'Confirm' }).click()
		await expectStored(await left, `leave the shared album "${storageName}"`)

		// Leaving sends the app back to the overview of the shared albums.
		await expect(this.page.getByRole('heading', { level: 1, name: 'Collaborative albums' })).toBeVisible()
	}
}

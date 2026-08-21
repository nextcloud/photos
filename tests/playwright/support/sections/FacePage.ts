/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page, Response } from '@playwright/test'

import { expect } from '@playwright/test'
import { openMenu } from '../utils/menus.ts'
import { FACES_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'
import { MediaGrid } from './MediaGrid.ts'

/** The photos of one recognized person, and what can be done with them. */
export class FacePage {
	/** The photos the person was recognized on. */
	public readonly grid: MediaGrid

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
	}

	/** The name of the person, hidden for a cluster nobody named yet. */
	public name(): Locator {
		return this.page.locator('.face-name')
	}

	/**
	 * The button opening the rename dialog. Its `NcActions` holds a single entry,
	 * which is why it is rendered as a plain button rather than a menu.
	 */
	public renameButton(): Locator {
		return this.page.getByRole('button', { name: 'Rename person' })
	}

	public renameDialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Rename person' })
	}

	public mergeDialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Merge person' })
	}

	public moveDialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Move to different person' })
	}

	/**
	 * The actions menu of the person. It carries no name of its own, so it falls
	 * back to the default label of an `NcActions`.
	 */
	public actionsTrigger(): Locator {
		return this.page.getByRole('main').getByRole('button', { name: 'Actions', exact: true })
	}

	public actionsMenu(): Locator {
		return this.page.getByRole('menu', { name: 'Actions' })
	}

	/**
	 * Open a person and wait for their photos to be rendered.
	 *
	 * @param faceName - Name of the person, or the id of an unnamed cluster
	 */
	public async open(faceName: string): Promise<void> {
		const listed = waitForDavRequest(this.page, 'PROPFIND', FACES_ENDPOINT)
		await this.page.goto(`apps/photos/faces/${encodeURIComponent(faceName)}`)
		await listed
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}

	/** Open the actions menu of the person. */
	public async openActionsMenu(): Promise<void> {
		await openMenu(this.actionsTrigger(), this.actionsMenu())
	}

	/**
	 * An entry of the actions menu of the person.
	 *
	 * @param name - Label of the entry
	 */
	public getActionEntry(name: string | RegExp): Locator {
		return this.actionsMenu().getByRole('menuitem', { name })
	}

	/**
	 * Rename the person and wait for recognize to have accepted it.
	 *
	 * @param newName - Name to give the person
	 * @return The response of the rename, so its status can be asserted
	 */
	public async rename(newName: string): Promise<Response> {
		await this.renameButton().click()

		const dialog = this.renameDialog()
		await expect(dialog).toBeVisible()
		await dialog.getByRole('textbox').fill(newName)

		const renamed = waitForDavRequest(this.page, 'MOVE', FACES_ENDPOINT)
		await dialog.getByRole('button', { name: 'Save' }).click()

		return renamed
	}

	/**
	 * Move the selected photos onto the first other person offered.
	 *
	 * The dialog lists the other people as covers without a name of their own — an
	 * unnamed cluster has nothing to show — so the target is picked by position.
	 *
	 * @return The response of the move, so its status can be asserted
	 */
	public async moveSelectionToFirstOtherPerson(): Promise<Response> {
		await this.openActionsMenu()
		await this.getActionEntry(/^Move photos? to a different person$/).click()

		const dialog = this.moveDialog()
		await expect(dialog).toBeVisible()

		const moved = waitForDavRequest(this.page, 'MOVE', FACES_ENDPOINT)
		await dialog.locator('.face-cover').first().click()

		return moved
	}

	/**
	 * Merge the person into the first other person offered.
	 *
	 * @return The response of the first move the merge is made of
	 */
	public async mergeIntoFirstOtherPerson(): Promise<Response> {
		await this.openActionsMenu()
		await this.getActionEntry('Merge with different person').click()

		const dialog = this.mergeDialog()
		await expect(dialog).toBeVisible()

		const merged = waitForDavRequest(this.page, 'MOVE', FACES_ENDPOINT)
		await dialog.locator('.face-cover').first().click()

		return merged
	}

	/**
	 * Remove the selected photos from the person.
	 *
	 * @return The response of the removal, so its status can be asserted
	 */
	public async removeSelectionFromPerson(): Promise<Response> {
		const removed = waitForDavRequest(this.page, 'DELETE', FACES_ENDPOINT)

		await this.openActionsMenu()
		await this.getActionEntry(/^Remove photos? from person$/).click()

		return removed
	}
}

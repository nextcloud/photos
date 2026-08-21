/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { expectStored, SYSTEMTAGS_ENDPOINT, TAG_ASSIGNMENT_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'

/**
 * The dialog managing the tags of a single photo.
 *
 * Every tag is a checkbox, and ticking one stores it right away — there is no
 * save step, so each toggle is awaited on its own.
 */
export class PhotoTagsDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Manage tags' })
	}

	/**
	 * The checkbox of a tag, ticked when the photo carries it.
	 *
	 * @param displayName - Name of the tag
	 */
	public getTag(displayName: string): Locator {
		return this.dialog().getByRole('checkbox', { name: displayName })
	}

	/** The field naming a tag to create. */
	public newTagInput(): Locator {
		return this.dialog().getByRole('textbox', { name: 'Create new tag' })
	}

	/** The button creating the tag that was named. */
	public addButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Add' })
	}

	/**
	 * Wait for the dialog to have loaded the tags it manages.
	 */
	public async waitForLoaded(): Promise<void> {
		await expect(this.dialog()).toBeVisible()
		await expect(this.newTagInput()).toBeVisible()
	}

	/**
	 * Put a tag on the photo and wait for the server to have stored it.
	 *
	 * @param displayName - Name of the tag
	 */
	public async assign(displayName: string): Promise<void> {
		await this.toggle(displayName, true)
	}

	/**
	 * Take a tag off the photo and wait for the server to have stored it.
	 *
	 * @param displayName - Name of the tag
	 */
	public async unassign(displayName: string): Promise<void> {
		await this.toggle(displayName, false)
	}

	/**
	 * Create a tag, which lands on the photo right away, and wait for both to
	 * have been stored.
	 *
	 * @param displayName - Name of the tag to create
	 */
	public async createTag(displayName: string): Promise<void> {
		const created = waitForDavRequest(this.page, 'POST', SYSTEMTAGS_ENDPOINT)
		const assigned = waitForDavRequest(this.page, 'PUT', TAG_ASSIGNMENT_ENDPOINT)

		await this.newTagInput().fill(displayName)
		await this.addButton().click()

		await expectStored(await created, `create the tag "${displayName}"`)
		await expectStored(await assigned, `put the tag "${displayName}" on the photo`)
	}

	/** Close the dialog and wait for it to be gone. */
	public async close(): Promise<void> {
		await this.dialog().getByRole('button', { name: 'Close' }).click()
		await expect(this.dialog()).toHaveCount(0)
	}

	/**
	 * Bring a tag to the state it should be in and wait for the request that
	 * stores it.
	 *
	 * @param displayName - Name of the tag
	 * @param assigned - Whether the photo should end up carrying it
	 */
	private async toggle(displayName: string, assigned: boolean): Promise<void> {
		const checkbox = this.getTag(displayName)
		const stored = waitForDavRequest(this.page, assigned ? 'PUT' : 'DELETE', TAG_ASSIGNMENT_ENDPOINT)

		// The checkbox of an NcCheckboxRadioSwitch is covered by its own label,
		// which is what a user clicks, hence the forced click.
		await checkbox.click({ force: true })

		await expectStored(await stored, assigned
			? `put the tag "${displayName}" on the photo`
			: `take the tag "${displayName}" off the photo`)
		await expect(checkbox).toBeChecked({ checked: assigned })
	}
}

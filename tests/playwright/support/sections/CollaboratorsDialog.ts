/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { ALBUM_ENDPOINT, expectStored, waitForDavRequest } from '../utils/requests.ts'

/** Where the dialog looks up the accounts and groups it offers. */
const AUTOCOMPLETE_ENDPOINT = '/core/autocomplete/get'

/** The dialog managing who an album is shared with. */
export class CollaboratorsDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Manage collaborators' })
	}

	/** The combobox searching for accounts and groups. */
	public searchInput(): Locator {
		return this.dialog().getByRole('combobox', { name: 'Add people or groups who can edit your album' })
	}

	/**
	 * A recipient offered by the open combobox.
	 *
	 * Looked up page wide: the list of an `NcSelect` is positioned absolutely and
	 * ends up outside of the dialog the combobox itself sits in. Only one combobox
	 * is open at a time, which is what makes that unambiguous.
	 *
	 * @param collaborator - Display name of the account or group
	 */
	public getOption(collaborator: string): Locator {
		return this.page.getByRole('option', { name: collaborator })
	}

	/**
	 * The button removing a collaborator from the selection.
	 *
	 * @param collaborator - Display name of the account or group
	 */
	public getRemoveCollaboratorButton(collaborator: string): Locator {
		return this.dialog().getByRole('button', { name: `Deselect ${collaborator}` })
	}

	/** The collaborators currently in the selection. */
	public getSelectedCollaborators(): Locator {
		return this.dialog().getByRole('button', { name: /^Deselect / })
	}

	public createPublicLinkButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Create public link share' })
	}

	public copyPublicLinkButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Copy the public link' })
	}

	public deletePublicLinkButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Delete the public link' })
	}

	public saveButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Save collaborators for this album.' })
	}

	/**
	 * Wait for the lookup of one search term to be answered.
	 *
	 * @param search - The term that was typed
	 */
	private searchAnswered(search: string): Promise<unknown> {
		return this.page.waitForResponse((response) => response.url().includes(AUTOCOMPLETE_ENDPOINT)
			&& new URL(response.url()).searchParams.get('search') === search)
	}

	/**
	 * Add collaborators to the album and save.
	 *
	 * The recipients are looked up on the server, so the answer to that lookup is
	 * awaited before the option is expected — an option that is simply not there
	 * yet would otherwise be reported as an account that cannot be shared with.
	 *
	 * @param collaborators - Ids of the accounts to share with
	 */
	public async addCollaborators(...collaborators: string[]): Promise<void> {
		await expect(this.dialog()).toBeVisible()

		for (const collaborator of collaborators) {
			const searched = this.searchAnswered(collaborator)
			await this.searchInput().fill(collaborator)
			await searched

			const option = this.getOption(collaborator)
			await expect(option).toBeVisible()
			await option.click()
			await expect(this.getRemoveCollaboratorButton(collaborator)).toBeVisible()
		}

		await this.save()
	}

	/**
	 * Remove collaborators from the album and save.
	 *
	 * @param collaborators - Ids of the accounts to stop sharing with
	 */
	public async removeCollaborators(...collaborators: string[]): Promise<void> {
		await expect(this.dialog()).toBeVisible()

		for (const collaborator of collaborators) {
			const remove = this.getRemoveCollaboratorButton(collaborator)
			await expect(remove).toBeVisible()
			await remove.click()
			await expect(remove).toHaveCount(0)
		}

		await this.save()
	}

	/**
	 * Save the collaborators and wait for the album to have been updated.
	 *
	 * The dialog closes as soon as the request was fired, so without the wait a
	 * following navigation would race the update.
	 */
	public async save(): Promise<void> {
		const saved = waitForDavRequest(this.page, 'PROPPATCH', ALBUM_ENDPOINT)
		await this.saveButton().click()
		await expectStored(await saved, 'save the collaborators of the album')
		await expect(this.dialog()).toHaveCount(0)
	}

	/**
	 * Share the album through a public link and return that link.
	 *
	 * The link is minted by the server, so it is read back from the copy button —
	 * which carries it as its tooltip, the only place the UI exposes it as text.
	 */
	public async createPublicLink(): Promise<string> {
		await expect(this.dialog()).toBeVisible()

		const saved = waitForDavRequest(this.page, 'PROPPATCH', ALBUM_ENDPOINT)
		const refetched = waitForDavRequest(this.page, 'PROPFIND', ALBUM_ENDPOINT)
		await this.createPublicLinkButton().click()
		await expectStored(await saved, 'create the public link of the album')
		await refetched

		const copyButton = this.copyPublicLinkButton()
		await expect(copyButton).toBeVisible()

		const link = await copyButton.getAttribute('title')
		expect(link, 'the copy button carries the public link as its tooltip').toBeTruthy()

		return link as string
	}

	/** Stop sharing the album through its public link. */
	public async deletePublicLink(): Promise<void> {
		await expect(this.dialog()).toBeVisible()

		const saved = waitForDavRequest(this.page, 'PROPPATCH', ALBUM_ENDPOINT)
		await this.deletePublicLinkButton().click()
		await expectStored(await saved, 'delete the public link of the album')

		await expect(this.createPublicLinkButton()).toBeVisible()
	}
}

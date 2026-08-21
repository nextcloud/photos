/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { FACES_ENDPOINT, waitForDavRequest } from '../utils/requests.ts'

/**
 * The people recognize detected in the library.
 *
 * A cluster it has not been given a name for is shown with its numeric id
 * hidden, so its cover carries no name to look it up by — hence the fallback to
 * the attribute the app marks the entries with.
 */
export class FacesPage {
	constructor(public readonly page: Page) {}

	/** Every recognized person. */
	public getAllFaces(): Locator {
		return this.page.getByRole('main').locator('[data-test="face"]')
	}

	/**
	 * The entry of one person.
	 *
	 * @param faceName - Name of the person, or the id of an unnamed cluster
	 */
	public getFace(faceName: string): Locator {
		return this.page.getByRole('main').locator(`[data-test-face-name="${faceName}"]`)
	}

	/** The entry gathering the faces that were not assigned to a person. */
	public unassignedFaces(): Locator {
		return this.page.getByRole('main').locator('[data-test="unassigned-faces"]')
	}

	/** The message shown while recognize has not clustered anything yet. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'Recognized people will show up here' })
	}

	/**
	 * Open the people view and wait for the clusters to have been fetched.
	 */
	public async open(): Promise<void> {
		const listed = waitForDavRequest(this.page, 'PROPFIND', FACES_ENDPOINT)
		await this.page.goto('apps/photos/faces')
		await listed
		await expect(this.getAllFaces().first()).toBeVisible()
	}

	/**
	 * The id of a cluster, which is the name it is stored under as long as nobody
	 * renamed it.
	 *
	 * @param index - Position of the person in the list, ordered by photo count
	 */
	public async getFaceName(index: number): Promise<string> {
		const name = await this.getAllFaces().nth(index).getAttribute('data-test-face-name')
		expect(name, `person #${index} has a name to be addressed by`).toBeTruthy()
		return name as string
	}
}

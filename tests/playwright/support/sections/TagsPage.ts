/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { MediaGrid } from './MediaGrid.ts'

/**
 * The tags carried by the photos of the account, and the photos of a single tag.
 *
 * Tags belong to the whole instance, but the overview only lists the ones put on
 * a photo of the account, which is what keeps the accounts of parallel tests
 * from seeing each other's tags.
 */
export class TagsPage {
	/** The photos of the open tag. */
	public readonly grid: MediaGrid

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
	}

	/** The heading above the list of every tag. */
	public allTagsHeading(): Locator {
		return this.page.getByRole('heading', { level: 2, name: 'All tags' })
	}

	/** The message shown in place of the overview while no photo carries a tag. */
	public emptyState(): Locator {
		return this.page.getByRole('main').getByText('No tags yet', { exact: true })
	}

	/**
	 * The cover of one tag, which is also the link opening it. It is named after
	 * the tag and the number of photos carrying it.
	 *
	 * @param tagName - Name of the tag
	 */
	public getTag(tagName: string): Locator {
		return this.page.getByRole('main').getByRole('link').filter({
			has: this.page.getByRole('heading', { level: 3, name: tagName, exact: true }),
		})
	}

	/** The heading naming the open tag. */
	public tagHeading(tagName: string): Locator {
		return this.page.getByRole('heading', { level: 2, name: tagName, exact: true })
	}

	/** The line under the heading counting the photos of the open tag. */
	public photoCount(): Locator {
		return this.page.getByRole('main').locator('.heading-subline')
	}

	public backButton(): Locator {
		return this.page.getByRole('main').getByRole('button', { name: 'Back to tags overview' })
	}

	/** Open the overview of the tags. */
	public async open(): Promise<void> {
		await this.page.goto('apps/photos/tags/')
		await expect(this.page.getByRole('main')).toBeVisible()
	}

	/**
	 * Open a tag and wait for its photos to be rendered.
	 *
	 * @param tagName - Name of the tag to open
	 */
	public async openTag(tagName: string): Promise<void> {
		await this.page.goto(`apps/photos/tags/${encodeURIComponent(tagName)}`)
		await expect(this.tagHeading(tagName)).toBeVisible()
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}
}

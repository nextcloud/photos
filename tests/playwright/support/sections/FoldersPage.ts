/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { MediaGrid } from './MediaGrid.ts'

/**
 * The folders view, which browses the photos as they are laid out in the files
 * of the account.
 *
 * Its listing comes from an endpoint of its own rather than from DAV, but the
 * photos in it are shown on the very tile of the timeline — so the same grid
 * section drives both.
 */
export class FoldersPage {
	/** The photos of the open folder. */
	public readonly grid: MediaGrid

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
	}

	/**
	 * The heading naming the open folder.
	 *
	 * @param folderName - Name of the folder
	 */
	public heading(folderName: string): Locator {
		return this.page.getByRole('heading', { level: 1, name: folderName })
	}

	/**
	 * Open a folder and wait for its photos to be rendered.
	 *
	 * @param path - Path of the folder, relative to the account's root
	 */
	public async open(path: string): Promise<void> {
		await this.page.goto(`apps/photos/folders/${path.split('/').map(encodeURIComponent).join('/')}`)
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}
}

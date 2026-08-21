/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The viewer a photo is opened in.
 */
export class ViewerModal {
	constructor(public readonly page: Page) {}

	/**
	 * The viewer itself. Its class tells it apart from the slideshow of the photos
	 * app, which is a dialog of its own.
	 */
	public dialog(): Locator {
		return this.page.locator('.viewer')
	}

	/**
	 * The name of the photo on screen, which the viewer shows as its heading.
	 *
	 * @param name - Name of the photo file
	 */
	public heading(name: string): Locator {
		return this.dialog().getByRole('heading', { name })
	}

	/** Name of the photo on screen, as the viewer heads its dialog with it. */
	public async currentPhotoName(): Promise<string> {
		return (await this.dialog().getByRole('heading').first().textContent() ?? '').trim()
	}

	public nextButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Next' })
	}

	public previousButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Previous' })
	}

	public closeButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Close' })
	}

	/**
	 * Wait for the viewer to show a photo.
	 *
	 * @param name - Name of the photo file it is expected to open on
	 */
	public async waitForPhoto(name: string): Promise<void> {
		await expect(this.heading(name)).toBeVisible()
	}

	/** Close the viewer and wait for it to be gone. */
	public async close(): Promise<void> {
		await this.closeButton().click()
		await expect(this.dialog()).toHaveCount(0)
	}
}

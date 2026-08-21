/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The slideshow playing a set of photos full screen, opened from the timeline
 * and from the year recap of the memories view.
 */
export class SlideshowModal {
	constructor(public readonly page: Page) {}

	/**
	 * The slideshow itself. It is the only modal open while it plays, and it is
	 * named after the photo that is on screen.
	 */
	public dialog(): Locator {
		return this.page.getByRole('dialog')
	}

	/**
	 * The photo that is on screen. It carries its file name as its alternative
	 * text, which is also what names the slideshow.
	 *
	 * @param name - Name of the photo file, omit for whichever photo is shown
	 */
	public photo(name?: string): Locator {
		return name === undefined
			? this.dialog().locator('img')
			: this.dialog().getByRole('img', { name })
	}

	/**
	 * Name of the photo file that is on screen, which the photo carries as its
	 * alternative text.
	 */
	public async currentPhotoName(): Promise<string> {
		return await this.photo().getAttribute('alt') ?? ''
	}

	/** The button pausing the slideshow, which is only there while it plays. */
	public pauseButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Pause slideshow' })
	}

	/** The button resuming the slideshow, which is only there while it is paused. */
	public playButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Start slideshow' })
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

	/** Close the slideshow and wait for it to be gone. */
	public async close(): Promise<void> {
		await this.closeButton().click()
		await expect(this.dialog()).toHaveCount(0)
	}

	/**
	 * Show the next photo and wait for it to be the one on screen.
	 *
	 * @param nextPhotoName - Name of the photo file that comes next
	 */
	public async showNext(nextPhotoName: string): Promise<void> {
		await this.nextButton().click()
		await expect(this.photo(nextPhotoName)).toBeVisible()
	}

	/**
	 * Show the previous photo and wait for it to be the one on screen.
	 *
	 * @param previousPhotoName - Name of the photo file that comes before
	 */
	public async showPrevious(previousPhotoName: string): Promise<void> {
		await this.previousButton().click()
		await expect(this.photo(previousPhotoName)).toBeVisible()
	}

	/**
	 * Toggle the metadata of the photo on screen, which the slideshow binds to the
	 * `i` key.
	 */
	public async toggleMetadata(): Promise<void> {
		await this.page.keyboard.press('i')
	}

	/** The panel listing the camera settings of the photo on screen. */
	public metadataPanel(): Locator {
		return this.dialog().getByRole('complementary', { name: 'Photo metadata' })
	}

	/** The names the panel lists its entries under, in the order they are shown. */
	public metadataLabels(): Locator {
		return this.metadataPanel().locator('dt')
	}

	/**
	 * The value of a metadata entry, by the name it is listed under.
	 *
	 * @param label - Name of the entry, e.g. "Camera"
	 */
	public getEntry(label: string): Locator {
		return this.metadataPanel()
			.locator('.slideshow__exif__entry')
			.filter({ has: this.page.getByText(label, { exact: true }) })
			.locator('dd')
	}
}

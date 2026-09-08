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

	/** The button pausing the slideshow, which is only there while it plays. */
	public pauseButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Pause slideshow' })
	}

	/** The button resuming the slideshow, which is only there while it is paused. */
	public playButton(): Locator {
		return this.dialog().getByRole('button', { name: 'Start slideshow' })
	}

	/** The player of the video on screen, if the file on screen is one. */
	public video(): Locator {
		return this.dialog().locator('.viewer__file--active video')
	}

	/**
   * Whether the slideshow is held on the file that is on screen, which the
   * button carries as a class rather than as a state of its own.
   */
	public async isSlideshowHeld(): Promise<boolean> {
		const classes = (await this.pauseButton().getAttribute('class')) ?? ''
		return classes.includes('play-pause-icons--paused')
	}

	/**
   * Hold the slideshow on the file that is on screen, so that the test moves on
   * from that one rather than from whichever the slideshow reached meanwhile.
   */
	public async pause(): Promise<void> {
		await this.pauseButton().click()
		await expect(this.playButton()).toBeVisible()
	}

	/**
   * Send a key press to the viewer itself, rather than to whichever of its
   * controls happens to hold the focus.
   *
   * @param key - The key to press
   */
	public async press(key: string): Promise<void> {
		await this.dialog().press(key)
	}

	/**
	 * Wait for the viewer to show a photo.
	 *
	 * @param name - Name of the photo file it is expected to open on
	 */
	public async waitForPhoto(name: string): Promise<void> {
		await expect(this.heading(name)).toBeVisible()
	}

	/**
   * Show the next photo and wait for it to be the one on screen.
   *
   * @param nextPhotoName - Name of the photo file that comes next
   */
	public async showNext(nextPhotoName: string): Promise<void> {
		await this.nextButton().click()
		await this.waitForPhoto(nextPhotoName)
	}

	/**
   * Show the previous photo and wait for it to be the one on screen.
   *
   * @param previousPhotoName - Name of the photo file that comes before
   */
	public async showPrevious(previousPhotoName: string): Promise<void> {
		await this.previousButton().click()
		await this.waitForPhoto(previousPhotoName)
	}

	/** Close the viewer and wait for it to be gone. */
	public async close(): Promise<void> {
		await this.closeButton().click()
		await expect(this.dialog()).toHaveCount(0)
	}
}

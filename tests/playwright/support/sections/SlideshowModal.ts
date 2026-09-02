/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * How long the slideshow leaves a still photo on screen, as `PhotoSlideshow`
 * sets it. Keep it in sync with the component: it is the delay a video must
 * not be cut off after.
 */
const SLIDESHOW_DELAY = 4000

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
	 * The video that is on screen. A video of the set is played rather than shown
	 * as the still a photo is, and it carries its file name as its label.
	 *
	 * @param name - Name of the video file, omit for whichever video is shown
	 */
	public video(name?: string): Locator {
		return name === undefined
			? this.dialog().locator('video')
			: this.dialog().locator('video').and(this.page.getByLabel(name))
	}

	/**
	 * Whatever the slideshow has on screen, the still of a photo or the video of
	 * a video.
	 */
	public media(): Locator {
		return this.dialog().locator('img, video')
	}

	/**
	 * Name of the file that is on screen, which a photo carries as its alternative
	 * text and a video as its label.
	 */
	public async currentPhotoName(): Promise<string> {
		const media = this.media()
		return await media.getAttribute('alt') ?? await media.getAttribute('aria-label') ?? ''
	}

	/**
	 * Assert that the video on screen is playing, which is what the slideshow
	 * asks it to do as it arrives.
	 *
	 * @param name - Name of the video file
	 */
	public async expectVideoPlaying(name: string): Promise<void> {
		await expect.poll(() => this.video(name).evaluate((element: HTMLVideoElement) => ({
			paused: element.paused,
			ended: element.ended,
			// HAVE_CURRENT_DATA, i.e. the browser has decoded a frame to show.
			hasFrame: element.readyState >= 2,
		}))).toEqual({ paused: false, ended: false, hasFrame: true })
	}

	/**
	 * Hold the video on screen where it is, the way the reader does with the
	 * controls of the video itself.
	 *
	 * @param name - Name of the video file
	 */
	public async pauseVideo(name: string): Promise<void> {
		await this.video(name).evaluate((element: HTMLVideoElement) => element.pause())
		await this.expectVideoPaused(name, true)
	}

	/**
	 * Assert whether the video on screen is being held rather than played.
	 *
	 * @param name - Name of the video file
	 * @param paused - Whether it is expected to be held
	 */
	public async expectVideoPaused(name: string, paused: boolean): Promise<void> {
		await expect
			.poll(() => this.video(name).evaluate((element: HTMLVideoElement) => element.paused))
			.toBe(paused)
	}

	/**
	 * Wait for the slideshow to come round to a video, whichever file of the set
	 * it started with.
	 *
	 * @param name - Name of the video file
	 */
	public async showVideo(name: string): Promise<void> {
		await expect(this.video(name)).toBeVisible({ timeout: 15_000 })
	}

	/**
	 * Assert that the slideshow keeps the video on screen well past the delay a
	 * still photo is taken away after.
	 *
	 * @param name - Name of the video file
	 */
	public async expectVideoHeld(name: string): Promise<void> {
		const moment = await this.video(name).evaluate((element: HTMLVideoElement) => element.currentTime)

		// There is nothing to wait for other than the delay running out, twice
		// over — which is the point of the assertion.
		await this.page.waitForTimeout(SLIDESHOW_DELAY * 2)

		await expect(this.video(name)).toBeVisible()
		// A slideshow which had moved on and come round again would have started
		// the video over rather than left it where it was.
		await expect
			.poll(() => this.video(name).evaluate((element: HTMLVideoElement) => element.currentTime))
			.toBe(moment)
	}

	/**
	 * Let the video on screen run out, the way it does once it has been watched.
	 * Seeking to its last moment keeps a test from waiting out the whole file.
	 *
	 * @param name - Name of the video file
	 */
	public async playVideoToEnd(name: string): Promise<void> {
		await this.video(name).evaluate(async (element: HTMLVideoElement) => {
			element.currentTime = Math.max(element.duration - 0.05, 0)
			await element.play()
		})
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

	/**
	 * How far into the set of photos the slideshow is, e.g. `2 of 5`. It is a line
	 * of text carrying no role and no name of its own, hence the class.
	 */
	public position(): Locator {
		return this.dialog().locator('.slideshow__position')
	}

	/** Close the slideshow and wait for it to be gone. */
	public async close(): Promise<void> {
		await this.closeButton().click()
		await expect(this.dialog()).toHaveCount(0)
	}

	/**
	 * Send a key press to the slideshow itself, rather than to whichever of its
	 * controls happens to hold the focus — the shortcuts are bound to the document
	 * and a control would swallow the press.
	 *
	 * @param key - The key to press
	 */
	public async press(key: string): Promise<void> {
		await this.dialog().press(key)
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

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { Timeline } from '../support/sections/TimelinePage.ts'
import { PLAYABLE_VIDEO } from '../support/utils/media.ts'

test.describe('The slideshow of the timeline', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('starts with the first photo of the timeline and plays on its own', async ({ photosApp }) => {
		const { timeline } = photosApp
		const firstPhoto = await timeline.grid.getFirstMediaName()

		const slideshow = await timeline.startSlideshow()

		await slideshow.waitForPhoto(firstPhoto)
		// It plays without being asked to, which is what the pause button says.
		await expect(slideshow.pauseButton()).toBeVisible()
	})

	test('moves on to the next photo on its own', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		const firstShown = await slideshow.currentPhotoName()

		// A photo stays on screen for a few seconds, so the wait is a generous one.
		await expect.poll(() => slideshow.currentPhotoName(), { timeout: 15_000 }).not.toBe(firstShown)
	})

	test('walks through the photos and closes again', async ({ photosApp }) => {
		const { timeline } = photosApp
		const slideshow = await timeline.startSlideshow()

		await slideshow.pause()
		const shown = await slideshow.currentPhotoName()

		await slideshow.nextButton().click()
		await expect.poll(() => slideshow.currentPhotoName()).not.toBe(shown)

		// Back to where it started, i.e. the two directions are each other's undo.
		await slideshow.showPrevious(shown)

		await slideshow.close()
		await timeline.waitForPhotos()
	})

	test('walks through the photos with the arrow keys', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.pause()
		const shown = await slideshow.currentPhotoName()

		await slideshow.press('ArrowRight')
		await expect.poll(() => slideshow.currentPhotoName()).not.toBe(shown)

		await slideshow.press('ArrowLeft')
		await expect.poll(() => slideshow.currentPhotoName()).toBe(shown)
	})

	test('plays and pauses on demand', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		// It comes up playing, so the first press is the one that holds it.
		await expect(slideshow.pauseButton()).toBeVisible()

		await slideshow.pause()

		await slideshow.playButton().click()
		await expect(slideshow.pauseButton()).toBeVisible()
	})

	test('closes with the escape key', async ({ photosApp }) => {
		const { timeline } = photosApp
		const slideshow = await timeline.startSlideshow()

		await slideshow.press('Escape')

		await expect(slideshow.dialog()).toHaveCount(0)
		await timeline.waitForPhotos()
	})
})

test.describe('The slideshow of the videos view', () => {
	test.beforeEach(async ({ photosApp, seedVideos }) => {
		await seedVideos()
		await photosApp.timeline.open(Timeline.videos)
	})

	test('plays the video rather than showing a still of it', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.waitForPhoto(PLAYABLE_VIDEO)
		// Held first, so that the slideshow does not move on while the player is
		// being looked at.
		await slideshow.pause()

		// The slideshow is the one of the viewer, so a video is played back the way
		// the viewer plays it instead of being reduced to its still preview.
		await expect(slideshow.video()).toBeVisible()
		await expect.poll(() => slideshow.video().evaluate((element: HTMLVideoElement) => ({
			paused: element.paused,
			// HAVE_CURRENT_DATA, i.e. the browser has decoded a frame to show.
			hasFrame: element.readyState >= 2,
		}))).toEqual({ paused: false, hasFrame: true })
	})

	test('holds on the video until it has played out', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.waitForPhoto(PLAYABLE_VIDEO)

		// The slide is not counted down while the video plays, or a video longer
		// than the delay of the slideshow would be cut off in the middle.
		await expect.poll(() => slideshow.isSlideshowHeld()).toBe(true)

		// And it is counted down again once the video has played out.
		await expect.poll(() => slideshow.isSlideshowHeld(), { timeout: 15_000 }).toBe(false)
	})
})

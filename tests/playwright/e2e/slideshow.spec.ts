/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_COUNT } from '../support/utils/media.ts'

/**
 * The camera settings the fixtures share, as they were all taken with the same
 * phone. Exposure and sensitivity differ between them, so they are only asserted
 * on by being listed — which photo the timeline starts with depends on the dates
 * the fixtures carry.
 */
const CAMERA = 'ONEPLUS A5000'
const APERTURE = 'ƒ/1.7'
const FOCAL_LENGTH = '4 mm'

/** The settings the panel lists, in the order it lists them. */
const METADATA_LABELS = ['Camera', 'Aperture', 'Focal length', 'Exposure', 'ISO']

test.describe('The slideshow of the timeline', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('starts with the first photo of the timeline and plays on its own', async ({ photosApp }) => {
		const { timeline } = photosApp
		const firstPhoto = await timeline.grid.getFirstMediaName()

		const slideshow = await timeline.startSlideshow()

		await expect(slideshow.photo(firstPhoto)).toBeVisible()
		// It plays without being asked to, which is what the pause button says.
		await expect(slideshow.pauseButton()).toBeVisible()
	})

	test('walks through the photos and closes again', async ({ photosApp }) => {
		const { timeline } = photosApp
		const slideshow = await timeline.startSlideshow()

		// Pausing first, so that the photo on screen is the one the test moves on
		// from rather than whichever the slideshow reached in the meantime.
		await slideshow.pauseButton().click()
		await expect(slideshow.playButton()).toBeVisible()
		const shown = await slideshow.currentPhotoName()

		await slideshow.nextButton().click()
		await expect.poll(() => slideshow.currentPhotoName()).not.toBe(shown)

		// Back to where it started, i.e. the two directions are each other's undo.
		await slideshow.showPrevious(shown)

		await slideshow.close()
		await timeline.waitForPhotos()
	})

	test('says how far into the timeline it is', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.pauseButton().click()
		await expect(slideshow.playButton()).toBeVisible()
		await expect(slideshow.position()).toHaveText(`1 of ${MEDIA_COUNT}`)

		await slideshow.nextButton().click()
		await expect(slideshow.position()).toHaveText(`2 of ${MEDIA_COUNT}`)

		// Going back past the first photo wraps around to the last one, as the
		// slideshow plays the set in a loop.
		await slideshow.previousButton().click()
		await slideshow.previousButton().click()
		await expect(slideshow.position()).toHaveText(`${MEDIA_COUNT} of ${MEDIA_COUNT}`)
	})

	test('walks through the photos with the arrow keys', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.pauseButton().click()
		await expect(slideshow.playButton()).toBeVisible()

		await slideshow.press('ArrowRight')
		await expect(slideshow.position()).toHaveText(`2 of ${MEDIA_COUNT}`)

		await slideshow.press('ArrowLeft')
		await expect(slideshow.position()).toHaveText(`1 of ${MEDIA_COUNT}`)
	})

	test('plays and pauses with the space bar', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		// It comes up playing, so the first press is the one that holds it.
		await expect(slideshow.pauseButton()).toBeVisible()

		await slideshow.press(' ')
		await expect(slideshow.playButton()).toBeVisible()

		await slideshow.press(' ')
		await expect(slideshow.pauseButton()).toBeVisible()
	})

	test('closes with the escape key', async ({ photosApp }) => {
		const { timeline } = photosApp
		const slideshow = await timeline.startSlideshow()

		await slideshow.press('Escape')

		await expect(slideshow.dialog()).toHaveCount(0)
		await timeline.waitForPhotos()
	})

	test('shows the camera settings of the photo on demand', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		// The panel stays out of the way until it is asked for.
		await expect(slideshow.metadataPanel()).toHaveCount(0)

		await slideshow.toggleMetadata()

		await expect(slideshow.metadataPanel()).toBeVisible()
		await expect(slideshow.getEntry('Camera')).toHaveText(CAMERA)
		await expect(slideshow.getEntry('Aperture')).toHaveText(APERTURE)
		await expect(slideshow.getEntry('Focal length')).toHaveText(FOCAL_LENGTH)
		// The exposure and the sensitivity are read from the picture as well — each
		// setting is only listed once it could be made sense of.
		await expect(slideshow.metadataLabels()).toHaveText(METADATA_LABELS)
	})

	test('takes the camera settings away again', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.toggleMetadata()
		await expect(slideshow.metadataPanel()).toBeVisible()

		await slideshow.toggleMetadata()
		await expect(slideshow.metadataPanel()).toHaveCount(0)
	})

	test('shows the settings of the photo that is on screen', async ({ photosApp }) => {
		const slideshow = await photosApp.timeline.startSlideshow()

		await slideshow.pauseButton().click()
		await expect(slideshow.playButton()).toBeVisible()

		await slideshow.toggleMetadata()
		await expect(slideshow.getEntry('Camera')).toHaveText(CAMERA)

		// Moving on fetches the settings of the photo that arrives rather than
		// leaving the ones of the photo before on screen.
		const shown = await slideshow.currentPhotoName()
		await slideshow.nextButton().click()
		await expect.poll(() => slideshow.currentPhotoName()).not.toBe(shown)

		await expect(slideshow.getEntry('Camera')).toHaveText(CAMERA)
		await expect(slideshow.metadataLabels()).toHaveText(METADATA_LABELS)
	})
})

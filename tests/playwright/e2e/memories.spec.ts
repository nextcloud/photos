/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'

/**
 * Year the photos of these tests are taken in.
 *
 * It has to be the most recent year of the library holding enough photos, which
 * it is: the fixtures every account is seeded with are from 2019 and 2020, and
 * neither of them holds thirty.
 */
const RECAP_YEAR = 2024

/** Photos a year needs before the app sums it up, as `buildYearRecap` counts them. */
const RECAP_PHOTO_COUNT = 30

/** Photos of the one trip among them, as `detectTrips` counts them. */
const TRIP_PHOTO_COUNT = 8

/**
 * The photos that are not part of the trip, one every ten days from the 5th of
 * January on — far enough apart for none of them to be clustered into a trip.
 */
const SPREAD_DATES = Array.from(
	{ length: RECAP_PHOTO_COUNT - TRIP_PHOTO_COUNT },
	(_, index) => new Date(Date.UTC(RECAP_YEAR, 0, 5 + index * 10, 12)),
)

/**
 * The photos of the trip: two days in December, one photo every four hours.
 *
 * They are dated at noon and after, so that the days they count as taken on do
 * not depend on the timezone the browser happens to run in.
 */
const TRIP_DATES = Array.from(
	{ length: TRIP_PHOTO_COUNT },
	(_, index) => new Date(Date.UTC(RECAP_YEAR, 11, 10, 12 + index * 4)),
)

test.describe('The memories of a library', () => {
	/**
	 * Names of the seeded photos, oldest first — which is also the order the recap
	 * plays them in.
	 */
	let photoNames: string[] = []

	test.beforeEach(async ({ seedPhotos, photosApp }) => {
		photoNames = await seedPhotos('recap', [...SPREAD_DATES, ...TRIP_DATES])
		await photosApp.memories.open()
	})

	test('sums up the most recent year holding enough photos', async ({ photosApp }) => {
		const { memories } = photosApp

		await expect(memories.recapCard(RECAP_YEAR)).toBeVisible()
		await expect(memories.recapEyebrow(RECAP_YEAR)).toHaveText('Year in review')
		await expect(memories.recapTitle(RECAP_YEAR)).toHaveText(`Your ${RECAP_YEAR} in photos`)

		// Every photo of the year makes it into the recap, as it aims for sixty.
		await expect(memories.recapCounters(RECAP_YEAR))
			.toHaveText(`${RECAP_PHOTO_COUNT} highlights · ${RECAP_PHOTO_COUNT} photos this year`)
	})

	test('gathers the photos of consecutive days into a trip', async ({ photosApp }) => {
		const { memories } = photosApp

		// Only the December photos are close enough to one another to be a trip.
		await expect(memories.tripCards()).toHaveCount(1)
		await expect(memories.tripCounters()).toHaveText(`${TRIP_PHOTO_COUNT} photos`)
	})

	test('opens the photos of a trip in the viewer', async ({ photosApp }) => {
		const { memories } = photosApp
		const tripPhotoNames = photoNames.slice(-TRIP_PHOTO_COUNT)

		const viewer = await memories.openTrip()

		// It opens on the cover of the trip, which is one of its December photos
		// rather than one of the single ones the year is otherwise made of.
		expect(tripPhotoNames).toContain(await viewer.currentPhotoName())
		// And the whole trip is handed over as the gallery to walk through.
		await expect(viewer.nextButton()).toBeVisible()
		await expect(viewer.previousButton()).toBeVisible()
	})

	test('plays the highlights of a year on its own', async ({ photosApp }) => {
		const slideshow = await photosApp.memories.openRecapSlideshow(RECAP_YEAR)

		// The recap opens playing, the point of it being that it needs no input.
		await expect(slideshow.pauseButton()).toBeVisible()

		const firstShown = await slideshow.currentPhotoName()
		expect(photoNames).toContain(firstShown)

		// A photo stays on screen for a few seconds, so the wait is a generous one.
		await expect.poll(() => slideshow.currentPhotoName(), { timeout: 15_000 }).not.toBe(firstShown)
	})

	test('walks through the highlights and closes again', async ({ photosApp }) => {
		const { memories } = photosApp
		const slideshow = await memories.openRecapSlideshow(RECAP_YEAR)

		// Pausing first, so that the photo on screen is the one the test moves on
		// from rather than whichever the slideshow reached in the meantime.
		await slideshow.pauseButton().click()
		await expect(slideshow.playButton()).toBeVisible()

		const shown = await slideshow.currentPhotoName()
		const shownIndex = photoNames.indexOf(shown)
		expect(shownIndex).toBeGreaterThanOrEqual(0)

		// The highlights are played oldest first, which is the order they were
		// seeded in.
		await slideshow.showNext(photoNames[shownIndex + 1])
		await slideshow.showPrevious(shown)

		await slideshow.close()
		await expect(memories.recapCard(RECAP_YEAR)).toBeVisible()
	})
})

test.describe('A library without memories', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.memories.open()
	})

	test('shows an illustrated empty state', async ({ photosApp }) => {
		const { memories } = photosApp

		// The seeded fixtures are neither a trip nor enough of a year.
		await expect(memories.emptyMessage()).toBeVisible()
		await expect(memories.emptyIllustration()).toBeVisible()
	})

	test('offers neither a recap nor a trip', async ({ photosApp }) => {
		const { memories } = photosApp

		await expect(memories.tripCards()).toHaveCount(0)
		await expect(memories.recapCard(RECAP_YEAR)).toHaveCount(0)
	})
})

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'

/** Prefix of the photos of these tests, so a search can narrow the library to them. */
const NAME_PREFIX = 'scrub'

/**
 * The moments the photos of these tests were taken at, newest first.
 *
 * They are dated around noon and away from the turn of a month, so which month
 * each of them counts as taken in does not depend on the timezone the browser
 * runs in — which is what lets the months below be named. They also bracket the
 * fixtures every account is seeded with, from 2019 and 2020, so the newest and
 * the oldest month of the library are known ones.
 *
 * March 2022 gets two of them, so that one month is fuller than the rest.
 */
const TAKEN_AT = [
	new Date(Date.UTC(2023, 6, 21, 12)),
	new Date(Date.UTC(2022, 10, 3, 12)),
	new Date(Date.UTC(2022, 2, 9, 12)),
	new Date(Date.UTC(2022, 2, 8, 12)),
	new Date(Date.UTC(2021, 4, 12, 12)),
	new Date(Date.UTC(2015, 5, 15, 12)),
]

/** The months the photos above fall into, in the order the timeline shows them. */
const MONTHS = ['July 2023', 'November 2022', 'March 2022', 'May 2021', 'June 2015']

/** Position of the fullest month among {@link MONTHS}. */
const FULLEST_MONTH = MONTHS.indexOf('March 2022')

/** The newest and the oldest month of the whole library, fixtures included. */
const NEWEST_MONTH = MONTHS[0]
const OLDEST_MONTH = MONTHS[MONTHS.length - 1]

/** The years of the seeded photos, one pill each — 2022 holds two months. */
const YEARS = [2023, 2022, 2021, 2015]

test.describe('The date scrubber of the timeline', () => {
	test.beforeEach(async ({ seedPhotos, photosApp }) => {
		await seedPhotos(NAME_PREFIX, TAKEN_AT)
		await photosApp.timeline.open()
	})

	test('labels the track with the years of the library', async ({ photosApp }) => {
		const { scrubber } = photosApp.timeline

		await expect(scrubber.root()).toBeVisible()
		for (const year of YEARS) {
			// One pill per year rather than per month: 2022 holds two of them.
			await expect(scrubber.yearLabel(year)).toHaveCount(1)
		}
	})

	test('graduates the track with one tick per month, the fullest one widest', async ({ photosApp }) => {
		const { timeline } = photosApp

		// Narrowed down to the photos of this test, so the months of the library are
		// exactly the ones it seeded: which month a fixture falls into depends on the
		// timezone the browser runs in, and the ticks are only tellable apart by the
		// order they are rendered in.
		await timeline.search(NAME_PREFIX)

		const ticks = timeline.scrubber.ticks()
		await expect(ticks).toHaveCount(MONTHS.length)

		const widthOf = async (index: number) => (await ticks.nth(index).boundingBox())?.width ?? 0
		expect(await widthOf(FULLEST_MONTH)).toBeGreaterThan(await widthOf(0))
	})

	test('is absent while the library holds a single month', async ({ photosApp }) => {
		const { timeline } = photosApp

		await expect(timeline.scrubber.root()).toBeVisible()

		// A single photo is left, so there is only one section to reach and nothing
		// to scrub between.
		await timeline.search(`${NAME_PREFIX}-000`)
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)

		await expect(timeline.scrubber.root()).toHaveCount(0)
	})

	test('jumps the grid to the month that is pressed', async ({ photosApp }) => {
		const { timeline } = photosApp
		const { scrubber } = timeline

		// The pill of a year sits at the first month of that year, which is the month
		// a press on it lands in.
		await scrubber.jumpToYear(2021)
		await scrubber.expectCurrentMonth('May 2021')
		await expect(timeline.monthHeading('May 2021')).toBeInViewport()

		await scrubber.jumpToYear(2022)
		await scrubber.expectCurrentMonth('November 2022')
		await expect(timeline.monthHeading('November 2022')).toBeInViewport()
	})

	test('follows the pointer from a press anywhere on the track', async ({ photosApp }) => {
		const { timeline } = photosApp
		const { scrubber } = timeline

		// A press on a bare stretch of track is both a jump and the start of a drag,
		// so the gesture works whether the handle was grabbed or not.
		await scrubber.pressTrackAtYear(2022)
		await scrubber.expectCurrentMonth('November 2022')

		// Still held: the grid follows the pointer rather than waiting for the
		// release, which is what makes crossing a library in one gesture work.
		await scrubber.dragOverYear(2021)
		await scrubber.expectCurrentMonth('May 2021')
		await expect(timeline.monthHeading('May 2021')).toBeInViewport()

		await scrubber.dragOverYear(2015)
		await scrubber.expectCurrentMonth(OLDEST_MONTH)

		await scrubber.release()

		// The release lands on the month the drag ended over.
		await scrubber.expectCurrentMonth(OLDEST_MONTH)
		await expect(timeline.monthHeading(OLDEST_MONTH)).toBeInViewport()
	})

	test('follows the pointer when the handle itself is dragged', async ({ photosApp }) => {
		const { timeline } = photosApp
		const { scrubber } = timeline

		// The handle rests at the top of the track, where the header row of the view
		// is: the track has to start below it rather than behind it, or the very first
		// grab of a freshly opened timeline lands on the header instead.
		await scrubber.expectCurrentMonth(NEWEST_MONTH)
		await scrubber.grabThumb()

		await scrubber.dragOverYear(2021)
		await scrubber.expectCurrentMonth('May 2021')

		await scrubber.release()
		await scrubber.expectCurrentMonth('May 2021')
		await expect(timeline.monthHeading('May 2021')).toBeInViewport()
	})

	test('steps through the months with the keyboard', async ({ photosApp }) => {
		const { timeline } = photosApp
		const { scrubber } = timeline

		await scrubber.thumb().focus()

		await scrubber.thumb().press('End')
		await scrubber.expectCurrentMonth(OLDEST_MONTH)
		await expect(timeline.monthHeading(OLDEST_MONTH)).toBeInViewport()

		await scrubber.thumb().press('Home')
		await scrubber.expectCurrentMonth(NEWEST_MONTH)

		await scrubber.thumb().press('ArrowDown')
		await scrubber.expectCurrentMonth(MONTHS[1])

		await scrubber.thumb().press('ArrowUp')
		await scrubber.expectCurrentMonth(NEWEST_MONTH)
	})

	test('brings the track out while it is hovered', async ({ page, photosApp }) => {
		const { scrubber } = photosApp.timeline
		const label = scrubber.yearLabel(YEARS[0])

		// Idle it is only a hairline, so it does not compete with the photos.
		await expect(label).toHaveCSS('opacity', '0')

		await scrubber.track().hover()
		await expect(label).toHaveCSS('opacity', '1')

		await page.mouse.move(0, 0)
		await expect(label).toHaveCSS('opacity', '0')
	})

	test('stays out of the way on a viewport too short for it', async ({ page, photosApp }) => {
		const { scrubber } = photosApp.timeline

		await expect(scrubber.root()).toBeVisible()

		// Below this there is no stretch of track left worth dragging, and the
		// browser's own scrolling is the better affordance.
		await page.setViewportSize({ width: 1280, height: 400 })
		await expect(scrubber.root()).toBeHidden()
	})
})

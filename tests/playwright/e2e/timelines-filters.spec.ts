/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { NavigationEntry } from '../support/sections/PhotosNavigation.ts'
import { Timeline } from '../support/sections/TimelinePage.ts'
import { MEDIA_COUNT } from '../support/utils/media.ts'

/** The filters offer one option per place, so the places have to be resolved. */
test.use({ withPlaces: true })

/** Ranges covering exactly one of the two years the fixtures were taken in. */
const YEAR_2019 = '2019-01-01 ~ 2019-12-31'
const YEAR_2020 = '2020-01-01 ~ 2020-12-31'

test.describe('Filtering the timeline', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('filters by a date range', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.filterByDateRange(YEAR_2020)
		await expect(timeline.grid.getAllMedia()).toHaveCount(2)

		await timeline.clearFilters(1)
		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('filters by a place, and by two of them at once', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.filterByPlace('Lauris')
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)

		// The places add up rather than narrowing each other down.
		await timeline.filterByPlace('Annot')
		await expect(timeline.grid.getAllMedia()).toHaveCount(3)

		await timeline.clearFilters(2)
		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('narrows a date range down with a place', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.filterByDateRange(YEAR_2019)
		await expect(timeline.grid.getAllMedia()).toHaveCount(3)

		// Filters of different kinds do narrow each other down.
		await timeline.filterByPlace('Lauris')
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)

		await timeline.clearFilters(2)
		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('drops the filters when another view is opened', async ({ page, photosApp }) => {
		const { navigation, timeline } = photosApp

		await timeline.filterByDateRange(YEAR_2020)
		await expect(timeline.grid.getAllMedia()).toHaveCount(2)

		// The filter combobox keeps its list open, which would swallow the click.
		await page.keyboard.press('Escape')

		await timeline.withRefetch(() => navigation.getEntry(NavigationEntry.photos).click())
		await expect(timeline.heading(Timeline.photos)).toBeVisible()
		await expect(timeline.filters.getChips()).toHaveCount(0)
		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('creates an album out of the filters', async ({ page, photosApp }) => {
		const { album, timeline } = photosApp
		const albumName = 'Smart album from timeline'

		await timeline.filterByDateRange(YEAR_2019)
		await timeline.filterByPlace('Lauris')
		await page.keyboard.press('Escape')

		const form = await timeline.openAlbumCreationForm({ fromFilters: true })
		await form.fillName(albumName)

		// The form comes up carrying the filters of the timeline, which is what
		// makes the album a smart one rather than a copy of the current selection.
		await expect(form.filters.getChip('January 1, 2019')).toContainText('December 31, 2019')
		await expect(form.filters.getChip('Lauris')).toBeVisible()

		await form.createButton().click()
		await expect(form.dialog()).toHaveCount(0)

		await album.open(albumName)
		await expect(album.grid.getAllMedia()).toHaveCount(1)
	})
})

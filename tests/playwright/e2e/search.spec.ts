/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { NavigationEntry } from '../support/sections/PhotosNavigation.ts'
import { Timeline } from '../support/sections/TimelinePage.ts'
import { MEDIA_COUNT, MEDIA_FIXTURES } from '../support/utils/media.ts'

/**
 * The fixtures are named after the moment they were taken — `IMG_<date>_<time>`
 * — so a piece of a date is a search term matching a known set of them: three
 * of them were taken in 2019 and two on the first day of 2020.
 */
const PHOTOS_OF_2019 = 3
const PHOTOS_OF_2020 = 2

/** The photo of the library the time part of its name belongs to alone. */
const SINGLE_PHOTO = MEDIA_FIXTURES[1]
const SINGLE_PHOTO_TERM = '134014'

/** A term no file name of the library holds. */
const UNMATCHED_TERM = 'holidays-in-rome'

test.describe('Searching the timeline by file name', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('keeps the photos whose name holds the term', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.search('2019')
		await expect(timeline.grid.getAllMedia()).toHaveCount(PHOTOS_OF_2019)

		// The term is matched anywhere in the name rather than as a prefix.
		await timeline.search(SINGLE_PHOTO_TERM)
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)
		await expect(timeline.grid.getMedia(SINGLE_PHOTO)).toBeVisible()
	})

	test('shows the empty state when no name holds the term', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.search(UNMATCHED_TERM)

		await expect(timeline.grid.getAllMedia()).toHaveCount(0)
		await expect(timeline.emptyMessage()).toBeVisible()
	})

	test('brings the whole library back when the search is cleared', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.search('20200101')
		await expect(timeline.grid.getAllMedia()).toHaveCount(PHOTOS_OF_2020)

		// The button is only offered while the field holds something, which is what
		// makes it the affordance to clear the search with.
		await expect(timeline.clearSearchButton()).toBeVisible()
		await timeline.clearSearch()

		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
		await expect(timeline.clearSearchButton()).toHaveCount(0)
	})

	test('narrows a date range down with a term', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.filterByDateRange('2019-01-01 ~ 2019-12-31')
		await expect(timeline.grid.getAllMedia()).toHaveCount(PHOTOS_OF_2019)

		// The search composes with the filters instead of replacing them: it is one
		// more condition every photo of the listing has to meet.
		await timeline.search(SINGLE_PHOTO_TERM)
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)
		await expect(timeline.filters.getChips()).toHaveCount(1)

		// And the two are dropped on their own, the date range outliving the term.
		await timeline.clearSearch()
		await expect(timeline.grid.getAllMedia()).toHaveCount(PHOTOS_OF_2019)
	})

	test('takes the wildcards of a term literally', async ({ photosApp }) => {
		const { timeline } = photosApp

		// `%` stands for any run of characters in the query the app sends, so an
		// unescaped one here would match the whole library rather than nothing.
		await timeline.search('IMG%2020')
		await expect(timeline.grid.getAllMedia()).toHaveCount(0)

		// `_` stands for a single character, and every fixture holds one where this
		// term has its first — an unescaped one would match them all.
		await timeline.search('_MG_2019')
		await expect(timeline.grid.getAllMedia()).toHaveCount(0)

		// The underscores the names do hold are matched as themselves.
		await timeline.search('IMG_2019')
		await expect(timeline.grid.getAllMedia()).toHaveCount(PHOTOS_OF_2019)
	})

	test('forgets the term when another timeline is opened', async ({ photosApp }) => {
		const { navigation, timeline } = photosApp

		await timeline.search(SINGLE_PHOTO_TERM)
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)

		await timeline.withRefetch(() => navigation.getEntry(NavigationEntry.photos).click())
		await expect(timeline.heading(Timeline.photos)).toBeVisible()

		// The filters are dropped when a view is left, and the field follows them.
		await expect(timeline.searchInput()).toHaveValue('')
		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('is only offered where it filters something', async ({ photosApp }) => {
		const { map, timeline } = photosApp

		await expect(timeline.searchInput()).toBeVisible()

		// The map is built from the whole library rather than from a listing the
		// navigation filters, so it carries no search field.
		await map.open()
		await expect(timeline.searchInput()).toHaveCount(0)
	})
})

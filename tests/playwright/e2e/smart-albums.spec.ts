/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'

/** The filters offer one option per place, so the places have to be resolved. */
test.use({ withPlaces: true })

const ALBUM_NAME = 'smart_album_test'

/** A range covering the three fixtures taken in 2019. */
const YEAR_2019 = '2019-01-01 ~ 2019-12-31'

/**
 * A smart album has no photos of its own: it holds whatever matches its filters,
 * which the server evaluates every time the album is listed.
 */
test.describe('A smart album', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.albums.open()
		await photosApp.albums.createAlbum(ALBUM_NAME)
	})

	test('holds the photos its filters match', async ({ photosApp }) => {
		const { album } = photosApp

		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectDateRange(YEAR_2019))
		await expect(album.grid.getAllMedia()).toHaveCount(3)

		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectPlace('Lauris'))
		await expect(album.grid.getAllMedia()).toHaveCount(1)
	})

	test('shows its filters when they are edited again', async ({ photosApp }) => {
		const { album } = photosApp

		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectDateRange(YEAR_2019))
		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectPlace('Lauris'))

		const form = await album.openDetailsForm()
		await expect(form.filters.getChip('January 1, 2019')).toContainText('December 31, 2019')
		await expect(form.filters.getChip('Lauris')).toBeVisible()
	})

	test('keeps its filters after a reload', async ({ photosApp }) => {
		const { album } = photosApp

		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectDateRange(YEAR_2019))
		await album.setFilters(ALBUM_NAME, (form) => form.filters.selectPlace('Lauris'))

		// Read from scratch: the filters have to have been stored on the album, not
		// only applied to the listing the browser was holding.
		await album.open(ALBUM_NAME)
		await expect(album.grid.getAllMedia()).toHaveCount(1)

		const form = await album.openDetailsForm()
		await expect(form.filters.getChip('Lauris')).toBeVisible()
	})
})

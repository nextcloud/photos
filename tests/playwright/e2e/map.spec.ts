/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { NavigationEntry } from '../support/sections/PhotosNavigation.ts'
import { MEDIA_COUNT, MEDIA_FIXTURES } from '../support/utils/media.ts'

test.describe('The map of a library', () => {
	test('plots the photos which carry a position', async ({ photosApp }) => {
		const { map } = photosApp

		await map.open()

		await expect(map.map()).toBeVisible()
		// Every fixture was taken with the location of the phone turned on.
		await expect(map.markers()).toHaveCount(MEDIA_COUNT)
	})

	test('opens a photo through its marker', async ({ photosApp }) => {
		const { map } = photosApp

		await map.open()
		const viewer = await map.openMarker(MEDIA_FIXTURES[0])

		// The viewer is handed every geotagged photo as its gallery, so it can be
		// walked through from the one whose marker was clicked.
		await expect(viewer.nextButton()).toBeVisible()
		await expect(viewer.previousButton()).toBeVisible()
	})

	test('is reached from the navigation, and through the link it used to live under', async ({ page, photosApp }) => {
		const { map, navigation, timeline } = photosApp

		await timeline.open()
		await navigation.getEntry(NavigationEntry.map).click()
		await expect(map.heading()).toBeVisible()

		// The map was handled by the maps app before, the old links keep working.
		await page.goto('apps/photos/maps')
		await expect(map.heading()).toBeVisible()
		await expect(page).toHaveURL(/\/apps\/photos\/map$/)
	})

	test('shows an illustrated empty state when no photo carries one', async ({ photosApp, removePhotoLocations }) => {
		const { map } = photosApp

		await removePhotoLocations()
		await map.open()

		await expect(map.emptyMessage()).toBeVisible()
		await expect(map.emptyIllustration()).toBeVisible()
		await expect(map.map()).toHaveCount(0)
	})
})

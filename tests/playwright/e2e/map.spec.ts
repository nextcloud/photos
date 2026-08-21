/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_COUNT } from '../support/utils/media.ts'

test.describe('The map of a library', () => {
	test('plots the photos which carry a position', async ({ photosApp }) => {
		const { map } = photosApp

		await map.open()

		await expect(map.map()).toBeVisible()
		// Every fixture was taken with the location of the phone turned on.
		await expect(map.markers()).toHaveCount(MEDIA_COUNT)
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

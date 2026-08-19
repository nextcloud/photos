/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { collectionPhotoName, PHOTO_IN_LAURIS } from '../support/utils/media.ts'

/**
 * The places are resolved out of the coordinates of the photos, which happens in
 * a pass of its own — so this spec is one of the few paying for it.
 */
test.use({ withPlaces: true })

test.describe('The places of a library', () => {
	test('lists the places the photos were taken at', async ({ photosApp }) => {
		const { places } = photosApp

		await places.open()

		// Two of the fixtures were taken in Annot and the three others each
		// somewhere of their own, which is four places for five photos.
		await expect(places.getAllPlaces()).toHaveCount(4)
		await expect(places.getPlace('Lauris')).toBeVisible()
		await expect(places.getPlace('Annot')).toBeVisible()
	})

	test('shows the photos of a place', async ({ media, photosApp }) => {
		const { places } = photosApp

		await places.open()
		await places.getPlace('Lauris').click()

		// Like the photos of an album, the ones of a place are named after their
		// file id rather than after the file itself.
		await expect(places.grid.getMedia(collectionPhotoName(media[PHOTO_IN_LAURIS], PHOTO_IN_LAURIS))).toBeVisible()
		await expect(places.grid.getAllMedia()).toHaveCount(1)
	})
})

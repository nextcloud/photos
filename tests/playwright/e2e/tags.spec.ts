/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { NavigationEntry } from '../support/sections/PhotosNavigation.ts'
import { MEDIA_FIXTURES } from '../support/utils/media.ts'

const [PHOTO, OTHER_PHOTO, UNTAGGED_PHOTO] = MEDIA_FIXTURES

test.describe('The tags view', () => {
	test('lists a tag once a photo of the account carries it', async ({ photosApp, seedTag, user }) => {
		const tag = `view-${user.userId}`
		await seedTag(tag, [PHOTO, OTHER_PHOTO])

		await photosApp.timeline.open()
		await photosApp.navigation.getEntry(NavigationEntry.tags).click()

		await expect(photosApp.tags.allTagsHeading()).toBeVisible()
		await expect(photosApp.tags.getTag(tag)).toContainText('2 photos')
	})

	test('shows the photos carrying the tag and no other', async ({ photosApp, seedTag, user }) => {
		const tag = `content-${user.userId}`
		await seedTag(tag, [PHOTO, OTHER_PHOTO])

		await photosApp.tags.openTag(tag)

		await expect(photosApp.tags.photoCount()).toHaveText('2 photos')
		await expect(photosApp.tags.grid.getMedia(PHOTO)).toBeVisible()
		await expect(photosApp.tags.grid.getMedia(OTHER_PHOTO)).toBeVisible()
		await expect(photosApp.tags.grid.getMedia(UNTAGGED_PHOTO)).toHaveCount(0)
		await expect(photosApp.tags.grid.getAllMedia()).toHaveCount(2)
	})

	test('opens a photo of the tag in the viewer', async ({ photosApp, seedTag, user }) => {
		const tag = `viewer-${user.userId}`
		await seedTag(tag, [PHOTO])

		await photosApp.tags.openTag(tag)
		await photosApp.tags.grid.open(PHOTO)

		await photosApp.viewer.waitForPhoto(PHOTO)
	})

	test('leads from the overview into a tag and back', async ({ photosApp, seedTag, user }) => {
		const tag = `roundtrip-${user.userId}`
		await seedTag(tag, [PHOTO])

		await photosApp.tags.open()
		await photosApp.tags.getTag(tag).click()
		await expect(photosApp.tags.tagHeading(tag)).toBeVisible()
		await expect(photosApp.tags.grid.getMedia(PHOTO)).toBeVisible()

		await photosApp.tags.backButton().click()

		await expect(photosApp.tags.allTagsHeading()).toBeVisible()
		await expect(photosApp.tags.getTag(tag)).toBeVisible()
		await expect(photosApp.page).toHaveURL(/\/apps\/photos\/tags\/?$/)
	})

	test('tells the account no photo carries a tag yet', async ({ photosApp }) => {
		await photosApp.tags.open()

		await expect(photosApp.tags.emptyState()).toBeVisible()
		await expect(photosApp.tags.allTagsHeading()).toHaveCount(0)
	})
})

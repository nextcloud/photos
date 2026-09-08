/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { PHOTOS_FOLDER } from '../support/utils/media.ts'

const CUSTOM_FOLDER = 'CustomSource'

test.describe('A configured source folder that was deleted outside the app', () => {
	test('is reported instead of being silently re-created', async ({ createFolder, deleteFromFiles, setPhotosSetting, readFolderListing, photosApp }) => {
		await createFolder(CUSTOM_FOLDER)
		await setPhotosSetting('photosSourceFolders', JSON.stringify([`/${PHOTOS_FOLDER}`, `/${CUSTOM_FOLDER}`]))
		await deleteFromFiles(CUSTOM_FOLDER)

		await photosApp.timeline.openExpectingMissingSourceFolder()

		const rootListing = await readFolderListing('')
		expect(rootListing.some((entry) => entry.filename === `/${CUSTOM_FOLDER}`)).toBe(false)
	})

	test('can still be removed from the media folders even as the only one left', async ({ createFolder, deleteFromFiles, setPhotosSetting, photosApp }) => {
		await createFolder(CUSTOM_FOLDER)
		await setPhotosSetting('photosSourceFolders', JSON.stringify([`/${CUSTOM_FOLDER}`]))
		await deleteFromFiles(CUSTOM_FOLDER)

		await photosApp.timeline.openExpectingMissingSourceFolder()

		const settings = await photosApp.navigation.openSettings()
		await settings.removeMediaFolder(CUSTOM_FOLDER)

		await expect(settings.removeMediaFolderButton(CUSTOM_FOLDER)).toHaveCount(0)
	})
})

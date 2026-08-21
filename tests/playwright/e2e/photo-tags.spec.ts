/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_FIXTURES, PHOTOS_FOLDER } from '../support/utils/media.ts'

/**
 * Tags are shared by the whole instance rather than owned by an account, and the
 * tests run in parallel — so each of them names its tags after the account it
 * runs as, and none of them asserts on how many tags the dialog lists.
 */

const [PHOTO, OTHER_PHOTO] = MEDIA_FIXTURES

test.describe('Managing the tags of a photo', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('puts a tag of the account on a photo', async ({ photosApp, readTags, seedTag, user }) => {
		const tag = `trip-${user.userId}`
		await seedTag(tag)

		const tags = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()
		await expect(tags.getTag(tag)).not.toBeChecked()
		await tags.assign(tag)

		expect(await readTags(PHOTO)).toEqual([tag])
	})

	test('shows the tags the photo already carries', async ({ photosApp, seedTag, user }) => {
		const tag = `sunsets-${user.userId}`
		await seedTag(tag, [PHOTO])

		const tags = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()

		await expect(tags.getTag(tag)).toBeChecked()
	})

	test('takes a tag off the photo', async ({ photosApp, readTags, seedTag, user }) => {
		const tag = `winter-${user.userId}`
		await seedTag(tag, [PHOTO])

		const tags = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()
		await tags.unassign(tag)

		expect(await readTags(PHOTO)).toEqual([])
	})

	test('creates a tag and puts it on the photo', async ({ photosApp, readTags, user }) => {
		const tag = `birthday-${user.userId}`

		const tags = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()
		await tags.createTag(tag)

		await expect(tags.getTag(tag)).toBeChecked()
		// The field is emptied so that the next tag can be typed right away.
		await expect(tags.newTagInput()).toHaveValue('')
		expect(await readTags(PHOTO)).toEqual([tag])
	})

	test('reads the tags of the photo back when it is reopened', async ({ photosApp, seedTag, user }) => {
		const tag = `holidays-${user.userId}`
		await seedTag(tag)

		const tags = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()
		await tags.assign(tag)
		await tags.close()

		const reopened = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).manageTags()

		await expect(reopened.getTag(tag)).toBeChecked()
	})

	test('tells the tags of one photo from the ones of another', async ({ photosApp, readTags, seedTag, user }) => {
		const tag = `pets-${user.userId}`
		await seedTag(tag, [PHOTO])

		const tags = await (await photosApp.timeline.grid.openActionsMenu(OTHER_PHOTO)).manageTags()
		await expect(tags.getTag(tag)).not.toBeChecked()
		await tags.assign(tag)

		expect(await readTags(PHOTO)).toEqual([tag])
		expect(await readTags(OTHER_PHOTO)).toEqual([tag])
	})
})

test.describe('Managing the tags of a photo outside of the timeline', () => {
	test('tags a photo of the folders view', async ({ photosApp, readTags, seedTag, user }) => {
		const tag = `folder-${user.userId}`
		await seedTag(tag)

		await photosApp.folders.open(PHOTOS_FOLDER)
		const tags = await (await photosApp.folders.grid.openActionsMenu(PHOTO)).manageTags()
		await tags.assign(tag)

		expect(await readTags(PHOTO)).toEqual([tag])
	})

	test('tags a photo of an album', async ({ photosApp, readTags, seedTag, user }) => {
		const { album, albums } = photosApp
		const tag = `album-${user.userId}`
		const albumName = 'Tagged'
		await seedTag(tag)

		await albums.open()
		await albums.createAlbum(albumName)
		await album.addPhotos(albumName, [PHOTO])

		// The photo is listed under a name made up of its file id, but its actions
		// are named after the original file, which is what they are about.
		const tags = await (await album.grid.openActionsMenu(PHOTO)).manageTags()
		await tags.assign(tag)

		expect(await readTags(PHOTO)).toEqual([tag])
	})
})

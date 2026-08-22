/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_COUNT, MEDIA_FIXTURES, PHOTOS_FOLDER } from '../support/utils/media.ts'

const [PHOTO, OTHER_PHOTO] = MEDIA_FIXTURES

/**
 * Previews of the core endpoint, which a folder is shown under. The photo tiles
 * read theirs from the endpoint of the app, so blocking these leaves them be.
 */
const FOLDER_COVER_ENDPOINT = /\/core\/preview\?/

/**
 * The folders view reads its listing from an endpoint of its own rather than from
 * DAV, and shows what comes back on the photo tile of the timeline. These tests
 * are about what that tile does with a photo of a folder — the actions it carries
 * are covered by the specs of the actions themselves.
 */
test.describe('The photos of a folder', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.folders.open(PHOTOS_FOLDER)
	})

	test('shows every photo of the folder', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await expect(grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
		await expect(grid.getMedia(PHOTO)).toBeVisible()
	})

	test('stacks the preview of a photo the way the timeline does', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		// More than one layer, i.e. the tile fades a sharp preview in over a small
		// one instead of waiting for the sharp one on an empty tile.
		expect(await grid.getPreviewLayers(PHOTO).count()).toBeGreaterThan(1)
	})

	test('offers the actions the account may take on a photo of its own folder', async ({ photosApp }) => {
		const menu = await photosApp.folders.grid.openActionsMenu(PHOTO)

		// The listing spells out the permissions of a photo the way the DAV endpoint
		// does, which is what says whether it may be written to at all.
		await expect(menu.getEntry('Edit metadata')).toBeVisible()
		await expect(menu.manageTagsEntry()).toBeVisible()
		await expect(menu.getEntry('Delete')).toBeVisible()
	})

	test('carries the actions of every photo', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await expect(grid.getAllActionsMenuTriggers()).toHaveCount(MEDIA_COUNT)
		await expect((await grid.openActionsMenu(PHOTO)).getEntry('View metadata')).toBeVisible()
	})

	test('offers no selection, there being nothing to do with one here', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await grid.hoverTile(PHOTO)

		await expect(grid.getSelectionCheckbox(PHOTO)).toHaveCount(0)
	})

	test('opens a photo in the viewer, with the folder as its gallery', async ({ photosApp }) => {
		const { folders, viewer } = photosApp

		await folders.grid.open(PHOTO)

		await viewer.waitForPhoto(PHOTO)
		// The arrows are what says the viewer was handed the folder rather than the
		// single photo that was clicked.
		await expect(viewer.nextButton()).toBeVisible()
		await expect(viewer.previousButton()).toBeVisible()
	})

	test('moves a photo to the trash and leaves the folder without it', async ({ photosApp }) => {
		const { folders } = photosApp

		await (await folders.grid.openActionsMenu(PHOTO)).delete()

		await expect(folders.grid.getMedia(PHOTO)).toHaveCount(0)
		await expect(folders.grid.getMedia(OTHER_PHOTO)).toBeVisible()

		// A listing fetched from scratch is what says the photo is really gone.
		await folders.open(PHOTOS_FOLDER)
		await expect(folders.grid.getAllMedia()).toHaveCount(MEDIA_COUNT - 1)
		await expect(folders.grid.getMedia(PHOTO)).toHaveCount(0)
	})
})

test.describe('The layout of a folder', () => {
	/**
	 * The tiles of a folder are squares, the listing not saying what shape the
	 * photos are — so a photo is either fit whole into its tile, leaving it partly
	 * empty, or cropped to fill it.
	 */
	test('shows a photo whole, and crops it once the cropped layout is on', async ({ photosApp, setPhotosSetting }) => {
		const { folders } = photosApp

		await folders.open(PHOTOS_FOLDER)
		await folders.grid.expectPreviewCropped(PHOTO, false)

		await setPhotosSetting('croppedLayout', 'true')

		// The setting is handed to the app when the page is loaded, so the view is
		// opened again rather than waited on.
		await folders.open(PHOTOS_FOLDER)
		await folders.grid.expectPreviewCropped(PHOTO, true)
	})
})

test.describe('A favorite photo of a folder', () => {
	test('stars the tile of a photo the account marked as a favorite', async ({ favoritePhoto, photosApp }) => {
		const { grid } = photosApp.folders
		await favoritePhoto(PHOTO)

		await photosApp.folders.open(PHOTOS_FOLDER)

		await grid.leaveTiles()
		await expect(grid.getFavoriteMarker(PHOTO)).toBeVisible()
		await grid.expectFavorite(PHOTO, true)
		await grid.expectFavorite(OTHER_PHOTO, false)
	})

	test('offers to take the mark off a photo that carries it', async ({ favoritePhoto, photosApp, readFavorite }) => {
		await favoritePhoto(PHOTO)

		await photosApp.folders.open(PHOTOS_FOLDER)
		// The entry names what it does to the photo as it is now, which the listing
		// of a folder says as well as the one of a timeline.
		const menu = await photosApp.folders.grid.openActionsMenu(PHOTO)
		await expect(menu.removeFromFavoritesEntry()).toBeVisible()
		await menu.unfavorite()

		expect(await readFavorite(PHOTO)).toBe(false)
	})

	test('stars a photo as soon as it is marked, without reading the folder again', async ({ photosApp }) => {
		const { grid } = photosApp.folders
		await photosApp.folders.open(PHOTOS_FOLDER)

		await (await grid.openActionsMenu(PHOTO)).favorite()

		await grid.leaveTiles()
		await expect(grid.getFavoriteMarker(PHOTO)).toBeVisible()
	})
})

test.describe('The listing a folder is read from', () => {
	/**
	 * The endpoint is asked straight out here: the app builds the nodes of its
	 * views out of this payload, so what a view can show at all is decided by its
	 * shape rather than by the view.
	 */
	test('describes a photo the way the files DAV endpoint describes it', async ({ media, readFolderListing, user }) => {
		const listing = await readFolderListing(PHOTOS_FOLDER)
		const photo = listing.find(({ filename }) => filename === `/${PHOTOS_FOLDER}/${PHOTO}`)
		if (photo === undefined) {
			throw new Error(`The listing of "${PHOTOS_FOLDER}" does not hold "${PHOTO}"`)
		}

		expect(photo).toMatchObject({
			id: String(media[PHOTO]),
			type: 'file',
			mime: 'image/jpeg',
			mtime: expect.any(Number),
			owner: user.userId,
		})

		// The permissions are spelled the way DAV spells them, 'W' standing for a
		// file whose content may be written — which is what the actions of a photo
		// read to tell whether it can be edited at all.
		expect(photo.permissions).toContain('W')

		// The properties a DAV listing would answer with, under the names it gives
		// them: the tiles read the favorite state and the metadata from here.
		expect(photo.attributes).toMatchObject({
			etag: expect.any(String),
			hasPreview: true,
			favorite: 0,
			'metadata-photos-original_date_time': expect.any(Number),
			'metadata-photos-size': { width: expect.any(Number), height: expect.any(Number) },
		})
	})

	test('says which photos the account marked as favorites', async ({ favoritePhoto, readFolderListing }) => {
		await favoritePhoto(PHOTO)

		const listing = await readFolderListing(PHOTOS_FOLDER)

		const favorites = listing
			.filter(({ attributes }) => attributes.favorite === 1)
			.map(({ filename }) => filename)
		expect(favorites).toEqual([`/${PHOTOS_FOLDER}/${PHOTO}`])
	})
})

test.describe('The cover of a folder', () => {
	/**
	 * The previews of the app are served by a service worker, whose requests are
	 * out of reach of the route below — so it stays out of the way here.
	 */
	test.use({ serviceWorkers: 'block' })

	test('shows a photo of the folder', async ({ photosApp }) => {
		const { folders } = photosApp

		await folders.openRoot()

		// Generating the preview of a photo of this size takes a moment, and a cover
		// that never arrives is one the folder would have dropped.
		await expect.poll(
			() => folders.getFolderCover(PHOTOS_FOLDER).evaluate((image: HTMLImageElement) => image.naturalWidth),
			{ timeout: 30_000 },
		).toBeGreaterThan(0)
	})

	test('falls back to its icon when no photo of the folder can be shown', async ({ page, photosApp }) => {
		const { folders } = photosApp
		await page.route(FOLDER_COVER_ENDPOINT, (route) => route.abort())

		await folders.openRoot()

		// Every photo of the folder is tried in turn, and the icon is what is left
		// once none of them could be shown.
		await expect(folders.getFolderCoverPlaceholder(PHOTOS_FOLDER)).toBeVisible()
		await expect(folders.getFolderCover(PHOTOS_FOLDER)).toHaveCount(0)
	})
})

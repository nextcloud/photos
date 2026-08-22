/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_FIXTURES, PHOTOS_FOLDER } from '../support/utils/media.ts'

/** The photo these tests are about, any one of the library will do. */
const PHOTO = MEDIA_FIXTURES[0]

/**
 * The photo next to it. Taken days apart from {@link PHOTO}, so the timeline
 * keeps the two on tiles of their own instead of folding them into one stack.
 */
const NEIGHBOUR = MEDIA_FIXTURES[1]

/** Previews of the photos, which the tiles fill their layers with. */
const PREVIEW_ENDPOINT = /\/apps\/photos\/api\/v1\/preview\//

test.describe('The tile of a photo', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('marks a photo as favorite with a star and takes it back', async ({ photosApp }) => {
		const { timeline } = photosApp

		await expect(timeline.grid.getFavoriteMarker(PHOTO)).toHaveCount(0)

		await timeline.grid.select(PHOTO)
		await timeline.favoriteSelection([PHOTO])

		// The tile that was just handled is still under the pointer and holds the
		// focus, both of which hide the star — the point of the test is that the
		// star follows the state of the photo without the view being read again.
		await timeline.grid.leaveTiles()
		await expect(timeline.grid.getFavoriteMarker(PHOTO)).toBeVisible()

		await timeline.grid.select(PHOTO)
		await timeline.unfavoriteSelection([PHOTO])

		await timeline.grid.leaveTiles()
		await expect(timeline.grid.getFavoriteMarker(PHOTO)).toHaveCount(0)
	})

	test('lifts a photo into a glowing frame while it is selected', async ({ photosApp }) => {
		const { timeline } = photosApp
		const tile = timeline.grid.getTile(PHOTO)

		await expect(tile).toHaveCSS('transform', 'none')
		await expect(tile).toHaveCSS('box-shadow', 'none')

		await timeline.grid.select(PHOTO)

		// The tile shrinks by a twentieth and takes a ring plus a drop shadow.
		await expect(tile).toHaveCSS('transform', 'matrix(0.97, 0, 0, 0.97, 0, 0)')
		await expect(tile).toHaveCSS('box-shadow', /0px 0px 0px 3px.+0px 6px 18px/)

		await timeline.grid.deselect(PHOTO)

		// Deselecting leaves the pointer on the tile, which lifts it in its own
		// right — so the pointer has to come off it before the frame is gone.
		await timeline.grid.leaveTiles()
		await expect(tile).toHaveCSS('transform', 'none')
		await expect(tile).toHaveCSS('box-shadow', 'none')
	})

	test('keeps the focus ring apart from the selection', async ({ photosApp }) => {
		const { timeline } = photosApp
		const tile = timeline.grid.getTile(PHOTO)

		await timeline.grid.getMedia(PHOTO).focus()

		// The ring is drawn by a pseudo element, which no locator can reach.
		const outline = () => tile.evaluate((element) => {
			return window.getComputedStyle(element, '::after').outlineStyle
		})

		await expect.poll(outline).toBe('solid')
		// Focus alone does not lift the tile, so the two states stay tellable apart.
		await expect(tile).toHaveCSS('transform', 'none')
	})
})

test.describe('The hover of a photo tile', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('magnifies the preview and lifts the tile', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.expectPreviewMagnified(PHOTO, false)
		await grid.expectTileLifted(PHOTO, false)

		await grid.hoverTile(PHOTO)

		await grid.expectPreviewMagnified(PHOTO, true)
		await grid.expectTileLifted(PHOTO, true)
	})

	test('settles the tile back once the pointer leaves it', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTile(PHOTO)
		await grid.expectPreviewMagnified(PHOTO, true)

		await grid.leaveTiles()

		await grid.expectPreviewMagnified(PHOTO, false)
		await grid.expectTileLifted(PHOTO, false)
	})

	test('only ever lifts the tile under the pointer', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTile(PHOTO)
		await grid.expectPreviewMagnified(PHOTO, true)

		await grid.expectPreviewMagnified(NEIGHBOUR, false)
		await grid.expectTileLifted(NEIGHBOUR, false)
	})

	test('magnifies inside the tile, leaving the grid where it is', async ({ photosApp }) => {
		const { grid } = photosApp.timeline
		const boxes = () => Promise.all([
			grid.getTile(PHOTO).boundingBox(),
			grid.getTile(NEIGHBOUR).boundingBox(),
		])

		const before = await boxes()

		await grid.hoverTile(PHOTO)
		await grid.expectPreviewMagnified(PHOTO, true)

		// The preview grows, the tile holding it does not — so the photo next to it
		// is not pushed aside, and the grid does not reflow under the pointer.
		expect(await boxes()).toEqual(before)
	})

	test('times every layer of the preview to magnify alike', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		// More than one layer, or there is nothing to keep in lockstep and the test
		// would pass on a tile that has stopped stacking its preview.
		expect(await grid.getPreviewLayers(PHOTO).count()).toBeGreaterThan(1)

		await grid.expectMagnifyTiming(PHOTO)
	})

	test('lets the selected state outshine the hover', async ({ photosApp }) => {
		const { grid } = photosApp.timeline
		const tile = grid.getTile(PHOTO)

		await grid.select(PHOTO)
		await grid.hoverTileAndSettle(PHOTO)

		// A selected tile shrinks into its ring rather than magnifying, so that the
		// two states never have to be told apart.
		await grid.expectPreviewMagnified(PHOTO, false)
		await expect(tile).toHaveCSS('transform', 'matrix(0.97, 0, 0, 0.97, 0, 0)')
		await expect(tile).toHaveCSS('box-shadow', /0px 0px 0px 3px.+0px 6px 18px/)
	})
})

test.describe('The hover of a photo tile, for a reader who asked for less motion', () => {
	test('lifts the tile without magnifying the preview', async ({ page, photosApp }) => {
		const { grid } = photosApp.timeline

		// The page of these tests is built by the fixture, which `test.use` does not
		// reach — so the preference is emulated on the page itself.
		await page.emulateMedia({ reducedMotion: 'reduce' })
		await photosApp.timeline.open()
		await grid.hoverTileAndSettle(PHOTO)

		// The shadow stays: it is the part of the effect that does not move.
		await grid.expectTileLifted(PHOTO, true)
		await grid.expectPreviewMagnified(PHOTO, false)
	})
})

test.describe('The hover of a photo tile of the folders view', () => {
	test('magnifies the preview and lifts the tile', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await photosApp.folders.open(PHOTOS_FOLDER)

		await grid.expectPreviewMagnified(PHOTO, false)
		await grid.expectTileLifted(PHOTO, false)

		await grid.hoverTile(PHOTO)

		// The folders view builds its tiles from a component of its own, and the
		// effect has to come out the same as on the timeline.
		await grid.expectPreviewMagnified(PHOTO, true)
		await grid.expectTileLifted(PHOTO, true)
		await grid.expectMagnifyTiming(PHOTO)
	})
})

test.describe('The tile of a photo without a preview', () => {
	/**
	 * The previews of the app are served by a service worker, whose requests are
	 * out of reach of the route below — so it stays out of the way here.
	 */
	test.use({ serviceWorkers: 'block' })

	test('sweeps a placeholder over the tile until a preview arrives', async ({ page, photosApp }) => {
		const { timeline } = photosApp

		// No preview is ever answered, which is the state the placeholder is for.
		await page.route(PREVIEW_ENDPOINT, (route) => route.abort())
		await timeline.open()

		await expect(timeline.grid.getPlaceholder(PHOTO)).toBeVisible()
	})

	test('takes the placeholder away once the preview is there', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.open()

		// Generating the previews of a photo of this size takes a moment, and the
		// placeholder is there for exactly that moment.
		await expect(timeline.grid.getPlaceholder(PHOTO)).toHaveCount(0, { timeout: 30_000 })
	})
})

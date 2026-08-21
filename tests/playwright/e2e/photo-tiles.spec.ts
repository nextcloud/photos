/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_FIXTURES } from '../support/utils/media.ts'

/** The photo these tests are about, any one of the library will do. */
const PHOTO = MEDIA_FIXTURES[0]

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

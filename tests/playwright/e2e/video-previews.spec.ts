/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { Timeline } from '../support/sections/TimelinePage.ts'
import { MEDIA_FIXTURES, PHOTOS_FOLDER, PLAYABLE_VIDEO, UNPLAYABLE_VIDEO } from '../support/utils/media.ts'

/** A photo of the library, which has no video for a tile to play. */
const PHOTO = MEDIA_FIXTURES[0]

/** The file the tiles play, matched wherever it is requested from. */
const PLAYABLE_VIDEO_SOURCE = `**/${PLAYABLE_VIDEO}`

test.describe('The tile of a video', () => {
	test.beforeEach(async ({ photosApp, seedVideos }) => {
		await seedVideos()
		await photosApp.timeline.open(Timeline.videos)
	})

	test('plays the video once the pointer rests on it', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await expect(grid.getVideoPreview(PLAYABLE_VIDEO)).toHaveCount(0)

		const video = await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		await grid.expectVideoAutoplaying(video)
	})

	test('takes the video off again once the pointer leaves', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTileAndPlay(PLAYABLE_VIDEO)
		await grid.leaveTiles()

		await expect(grid.getVideoPreview(PLAYABLE_VIDEO)).toHaveCount(0)
	})

	test('never starts the video of a tile the pointer only sweeps across', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.recordVideoPreviews()
		await grid.sweepPointerAcross(PLAYABLE_VIDEO)
		await grid.settleVideoPreviews()

		// A tile waits for the pointer to rest on it before it loads anything, so
		// crossing the grid costs nothing however many videos are on the way.
		await grid.expectVideoPreviewsStarted(0)
	})

	test('only ever plays the video under the pointer', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		await expect(grid.getVideoPreview(UNPLAYABLE_VIDEO)).toHaveCount(0)
	})

	test('keeps a format the browser cannot play on its still preview', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTileAndSettleVideo(UNPLAYABLE_VIDEO)

		// QuickTime is what iOS writes and what no browser plays without a
		// transcoding pipeline, so its tile stays a picture — one that answers the
		// hover the way any other tile does.
		await expect(grid.getVideoPreview(UNPLAYABLE_VIDEO)).toHaveCount(0)
		await grid.expectTileLifted(UNPLAYABLE_VIDEO, true)
	})

	test('leaves the playing video out of the accessibility tree', async ({ photosApp }) => {
		const { grid } = photosApp.timeline
		const link = grid.getMedia(PLAYABLE_VIDEO)

		const video = await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		// The video shows what the preview under it already stands for, so it adds
		// nothing to read and nothing to stop at on the way through the grid.
		await expect(video).toHaveAttribute('aria-hidden', 'true')
		await expect(video).toHaveAttribute('tabindex', '-1')
		await expect(link).toHaveAccessibleName(`Open the full size "${PLAYABLE_VIDEO}" image`)
	})

	test('keeps the duration of a video legible while it plays', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		await grid.expectDurationAboveVideo(PLAYABLE_VIDEO)
	})

	test('magnifies the playing video the way the hover magnifies a preview', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		const video = await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		// The layers below are magnified by the hover, so a video left unscaled on
		// top of them would read as the picture jumping back as it comes alive.
		await expect(video).toHaveCSS('transform', 'matrix(1.07, 0, 0, 1.07, 0, 0)')
	})
})

test.describe('The tile of a photo', () => {
	test('never plays a video, however long the pointer rests on it', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await photosApp.timeline.open()
		await grid.recordVideoPreviews()
		await grid.hoverTileAndSettleVideo(PHOTO)

		await grid.expectVideoPreviewsStarted(0)
	})
})

test.describe('The tile of a video the browser fails on', () => {
	/**
	 * The app answers its own requests from a service worker, which a route of the
	 * page cannot reach into — so it stays out of the way here.
	 */
	test.use({ serviceWorkers: 'block' })

	test('falls back to the still preview and does not try again', async ({ page, photosApp, seedVideos }) => {
		const { grid } = photosApp.timeline

		await seedVideos()
		await page.route(PLAYABLE_VIDEO_SOURCE, (route) => route.abort())
		await photosApp.timeline.open(Timeline.videos)

		await grid.recordVideoPreviews()
		await grid.hoverTileAndSettleVideo(PLAYABLE_VIDEO)

		// The video is started, fails to load and is taken off again, leaving the
		// still preview of the tile where it was.
		await grid.expectVideoPreviewsStarted(1)
		await expect(grid.getVideoPreview(PLAYABLE_VIDEO)).toHaveCount(0)

		await grid.leaveTiles()
		await grid.recordVideoPreviews()
		await grid.hoverTileAndSettleVideo(PLAYABLE_VIDEO)

		// A file the browser could not play once is not asked for again, or every
		// pass of the pointer would fire another load that is bound to fail.
		await grid.expectVideoPreviewsStarted(0)
	})
})

test.describe('The tile of a video, for a reader who asked for less motion', () => {
	test('keeps the still preview instead of playing it', async ({ page, photosApp, seedVideos }) => {
		const { grid } = photosApp.timeline

		await seedVideos()

		// The page of these tests is built by the fixture, which `test.use` does not
		// reach — so the preference is emulated on the page itself.
		await page.emulateMedia({ reducedMotion: 'reduce' })
		await photosApp.timeline.open(Timeline.videos)

		await grid.recordVideoPreviews()
		await grid.hoverTileAndSettleVideo(PLAYABLE_VIDEO)

		await grid.expectVideoPreviewsStarted(0)
	})
})

test.describe('The tile of a video of the folders view', () => {
	test.beforeEach(async ({ photosApp, seedVideos }) => {
		await seedVideos()
		await photosApp.folders.open(PHOTOS_FOLDER)
	})

	test('plays the video once the pointer rests on it', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		// The folders view builds its tiles from a component of its own, and a video
		// has to come alive there the same way it does on the timeline.
		const video = await grid.hoverTileAndPlay(PLAYABLE_VIDEO)

		await grid.expectVideoAutoplaying(video)
	})

	test('takes the video off again once the pointer leaves', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await grid.hoverTileAndPlay(PLAYABLE_VIDEO)
		await grid.leaveTiles()

		await expect(grid.getVideoPreview(PLAYABLE_VIDEO)).toHaveCount(0)
	})

	test('keeps a format the browser cannot play on its still preview', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await grid.hoverTileAndSettleVideo(UNPLAYABLE_VIDEO)

		await expect(grid.getVideoPreview(UNPLAYABLE_VIDEO)).toHaveCount(0)
	})
})

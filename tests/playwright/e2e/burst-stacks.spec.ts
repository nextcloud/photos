/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'

/**
 * The moments the photos of a run were taken at, newest first — the order the
 * timeline shows them in, so the first of them is the tile standing for the run.
 *
 * Two seconds apart each, inside the window the app calls one go. They are dated
 * around noon, so which day and month they count as taken in does not depend on
 * the timezone the browser runs in.
 */
const RUN_TAKEN_AT = [
	new Date(Date.UTC(2022, 4, 10, 12, 0, 4)),
	new Date(Date.UTC(2022, 4, 10, 12, 0, 2)),
	new Date(Date.UTC(2022, 4, 10, 12, 0, 0)),
]

/**
 * The moment a photo of the same month was taken at, minutes away from the run —
 * far enough for it to stand for itself.
 */
const SINGLE_TAKEN_AT = [new Date(Date.UTC(2022, 4, 10, 12, 5, 0))]

test.describe('A run of photos taken in one go', () => {
	/** The photos of the run, the tile standing for them first. */
	let run: string[] = []

	/** The photo of the same month that is part of no run. */
	let single = ''

	/** The tile the grid shows for the run. */
	let leader = ''

	test.beforeEach(async ({ seedPhotos, photosApp }) => {
		// Seeded in two batches, so the names say which photo belongs to what.
		single = (await seedPhotos('single', SINGLE_TAKEN_AT))[0]
		run = await seedPhotos('run', RUN_TAKEN_AT)
		leader = run[0]

		await photosApp.timeline.open()
	})

	test('is folded into a single tile of the grid', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await expect(grid.getMedia(leader)).toBeVisible()
		for (const photo of run.slice(1)) {
			await expect(grid.getMedia(photo)).toHaveCount(0)
		}

		// The photo taken minutes later keeps a tile of its own.
		await expect(grid.getMedia(single)).toBeVisible()
	})

	test('says on its tile how many photos it holds', async ({ photosApp }) => {
		const { grid } = photosApp.timeline

		await expect(grid.getBurstBadge(leader)).toHaveText(String(run.length))
		await expect(grid.getBurstBadge(leader)).toHaveAccessibleName(`${run.length} photos taken in one go`)

		// The only run of the library, so no other tile claims to be one.
		await expect(grid.getBurstBadge(single)).toHaveCount(0)
		await expect(grid.getAllBurstBadges()).toHaveCount(1)
	})

	test('hands the viewer the run alone', async ({ photosApp }) => {
		const { timeline, viewer } = photosApp

		await timeline.grid.open(leader)
		await viewer.waitForPhoto(leader)

		// A gallery was handed over rather than the single photo that was clicked.
		await expect(viewer.nextButton()).toBeVisible()
		await expect(viewer.previousButton()).toBeVisible()

		// Flipping through it visits the photos of the run and nothing else, so the
		// gesture stays inside the burst instead of leaving it for the timeline.
		const visited = [leader]
		for (let step = 1; step < run.length; step++) {
			const shown = visited[visited.length - 1]
			await viewer.nextButton().click()
			await expect.poll(() => viewer.currentPhotoName()).not.toBe(shown)
			visited.push(await viewer.currentPhotoName())
		}

		expect(visited.slice().sort()).toEqual(run.slice().sort())
	})

	test('hands the viewer the whole grid for a photo that is part of no run', async ({ photosApp }) => {
		const { timeline, viewer } = photosApp

		await timeline.grid.open(single)
		await viewer.waitForPhoto(single)

		// The grid holds one tile of the run and one per photo outside it, so two
		// steps cannot stay inside the run unless the gallery was scoped to it.
		const visited: string[] = []
		let shown = single
		for (let step = 0; step < 2; step++) {
			await viewer.nextButton().click()
			await expect.poll(() => viewer.currentPhotoName()).not.toBe(shown)
			shown = await viewer.currentPhotoName()
			visited.push(shown)
		}

		expect(visited.some((name) => !run.includes(name))).toBe(true)
	})

	test('takes every photo it holds along when its tile is selected', async ({ photosApp }) => {
		const albumName = 'burst_selection'
		const { albums, album, timeline } = photosApp

		await albums.open()
		await albums.createAlbum(albumName)

		await timeline.open()
		await timeline.grid.select(leader)

		// One copy per photo of the run: the photos folded into the tile have no tile
		// of their own to be selected, so an action on the tile has to take them along
		// rather than leave them behind.
		const picker = await timeline.openAlbumPicker()
		await picker.pickAlbum(albumName, run.length)

		await album.open(albumName)
		await expect(album.grid.getAllMedia()).toHaveCount(run.length)
	})

	test('is offered photo by photo where photos are picked', async ({ photosApp }) => {
		const albumName = 'burst_album'
		const { albums, album } = photosApp

		await albums.open()
		await albums.createAlbum(albumName)

		// The picker manages nothing, it only picks — so folding photos away there
		// would make them impossible to add to an album at all.
		const picker = await album.openPhotosPicker(albumName)
		for (const photo of run) {
			await expect(picker.grid.getMedia(photo)).toBeVisible()
		}
		await expect(picker.grid.getAllBurstBadges()).toHaveCount(0)

		await picker.addPhotos(...run)

		// Read back from the server, so the count is the album's rather than the one
		// the app added to it optimistically.
		await album.open(albumName)
		await expect(album.grid.getAllMedia()).toHaveCount(run.length)
	})
})

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { PhotoActionsMenu } from './PhotoActionsMenu.ts'

/** The scale a tile magnifies its preview to while it is hovered. */
const MAGNIFIED_TRANSFORM = 'matrix(1.07, 0, 0, 1.07, 0, 0)'

/**
 * How a preview layer is timed to magnify: 520ms on an ease-out-quint curve.
 *
 * A layer that also fades lists its own transition after the magnify, so only
 * the first entry of each computed value is the magnify's.
 */
const MAGNIFY_TIMING = {
	property: /^transform(,|$)/,
	duration: /^0\.52s(,|$)/,
	timingFunction: /^cubic-bezier\(0\.22, 1, 0\.36, 1\)(,|$)/,
} as const

/**
 * How long to leave a hovered tile alone before a preview found unscaled can be
 * called one that never scaled. Long enough for the magnify above to have run.
 */
const MAGNIFY_SETTLE = 800

/**
 * How long to leave a hovered tile alone before a tile found without a video can
 * be called one that never plays it. Several times the delay a tile waits out
 * before starting one, so that a slow answer is not read as a refusal.
 */
const VIDEO_PREVIEW_SETTLE = 2000

/**
 * Where the recorder of {@link MediaGrid.recordVideoPreviews} keeps its count on
 * the page, out of the way of anything the app puts on `window`.
 */
const VIDEO_PREVIEW_RECORDER = '__photosVideoPreviewsStarted'

/**
 * The video a tile plays on top of its preview. It shows the same picture the
 * still layers do, so it is hidden from assistive technology and can only be
 * addressed by its class.
 */
const VIDEO_PREVIEW_SELECTOR = 'video.file__layer--video'

/**
 * A grid of photo tiles — the timeline, the contents of a collection, the photo
 * picker and the folders view all render the same tiles, so they all use this
 * section.
 */
export class MediaGrid {
	constructor(
		public readonly page: Page,
		/** The element the grid is rendered in, so two grids cannot be confused. */
		private readonly container: Locator,
	) {}

	/** Every photo of the grid. */
	public getAllMedia(): Locator {
		return this.container.getByRole('link', { name: /open the full size ".+" image$/i })
	}

	/**
	 * A photo of the grid, favorite or not.
	 *
	 * @param name - Name of the photo file
	 */
	public getMedia(name: string): Locator {
		return this.container.getByRole('link', { name: `open the full size "${name}" image` })
	}

	/**
	 * Name of the first photo file of the grid, i.e. the newest one of a timeline.
	 */
	public async getFirstMediaName(): Promise<string> {
		const label = await this.getAllMedia().first().getAttribute('aria-label') ?? ''
		return label.match(/"(.+)"/)?.[1] ?? ''
	}

	/**
	 * The selection checkbox of a photo.
	 *
	 * @param name - Name of the photo file
	 */
	public getSelectionCheckbox(name: string): Locator {
		return this.container.getByRole('checkbox', { name: `Select image ${name}` })
	}

	/**
	 * The tile of a photo, i.e. the frame holding its preview together with its
	 * checkbox, its actions and its favorite star.
	 *
	 * @param name - Name of the photo file
	 */
	public getTile(name: string): Locator {
		// The link is looked up from the page rather than through `getMedia`: a
		// `has` locator is resolved inside the element it filters, where the grid
		// container of `getMedia` is nowhere to be found.
		return this.container.locator('.file-container').filter({
			has: this.page.getByRole('link', { name: `open the full size "${name}" image` }),
		})
	}

	/**
	 * The layers a tile stacks its preview out of. They are the picture rather
	 * than anything a reader could name, so they are hidden from assistive
	 * technology and addressed by their class.
	 *
	 * The placeholder is left out: it stands in for a preview that has not landed
	 * yet, and unlike the preview it does not follow the tile's magnify.
	 *
	 * @param name - Name of the photo file
	 */
	public getPreviewLayers(name: string): Locator {
		return this.getTile(name).locator('.file__layer--blurhash, .file__layer--small, .file__layer--large')
	}

	/**
	 * Put the pointer on a tile, which is what makes it lift and magnify.
	 *
	 * @param name - Name of the photo file
	 */
	public async hoverTile(name: string): Promise<void> {
		await this.getMedia(name).hover()
	}

	/**
	 * Put the pointer on a tile and leave it there long enough for the magnify to
	 * have run, so that a preview found unscaled afterwards is one that never
	 * scaled. Proving that something never happens takes waiting out the time in
	 * which it would have, hence a pause rather than a poll.
	 *
	 * @param name - Name of the photo file
	 */
	public async hoverTileAndSettle(name: string): Promise<void> {
		await this.hoverTile(name)
		await this.page.waitForTimeout(MAGNIFY_SETTLE)
	}

	/**
	 * The video a tile plays on top of its preview while the pointer rests on it.
	 * It shows the same picture the preview does, so it is hidden from assistive
	 * technology and addressed by its class.
	 *
	 * @param name - Name of the video file
	 */
	public getVideoPreview(name: string): Locator {
		return this.getTile(name).locator(VIDEO_PREVIEW_SELECTOR)
	}

	/**
	 * Put the pointer on a tile and wait for it to have started playing its video.
	 *
	 * @param name - Name of the video file
	 * @return The video the tile is playing
	 */
	public async hoverTileAndPlay(name: string): Promise<Locator> {
		await this.hoverTile(name)

		const video = this.getVideoPreview(name)
		await expect(video).toBeAttached()
		return video
	}

	/**
	 * Put the pointer on a tile and leave it there long enough for a video to have
	 * been started, so that a tile found without one afterwards is one that never
	 * starts it. Proving that something never happens takes waiting out the time
	 * in which it would have, hence a pause rather than a poll.
	 *
	 * @param name - Name of the media file
	 */
	public async hoverTileAndSettleVideo(name: string): Promise<void> {
		await this.hoverTile(name)
		await this.settleVideoPreviews()
	}

	/**
	 * Wait out the time in which a tile would have started a video, so that a grid
	 * found without one is one that never starts it.
	 */
	public async settleVideoPreviews(): Promise<void> {
		await this.page.waitForTimeout(VIDEO_PREVIEW_SETTLE)
	}

	/**
	 * Sweep the pointer across a tile without ever resting on it, the way a reader
	 * crosses the grid on the way somewhere else.
	 *
	 * @param name - Name of the media file
	 */
	public async sweepPointerAcross(name: string): Promise<void> {
		const box = await this.getTile(name).boundingBox()
		if (box === null) {
			throw new Error(`The tile of "${name}" is not rendered`)
		}

		const middle = box.y + box.height / 2
		await this.page.mouse.move(box.x - 10, middle)
		await this.page.mouse.move(box.x + box.width + 10, middle, { steps: 10 })
		await this.page.mouse.move(0, 0)
	}

	/**
	 * Start counting the videos the tiles of the page mount from here on, so that
	 * a test can tell a video that was never started from one that was started and
	 * taken off again — which a locator cannot, as a video that fails to load is
	 * gone again within a frame of having been mounted.
	 *
	 * Calling it again starts a fresh count.
	 */
	public async recordVideoPreviews(): Promise<void> {
		await this.page.evaluate(([property, selector]) => {
			const recorder = window as unknown as Record<string, unknown>
			;(recorder[`${property}Observer`] as MutationObserver | undefined)?.disconnect()
			recorder[property] = 0

			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const node of Array.from(record.addedNodes)) {
						if (node instanceof Element && (node.matches(selector) || node.querySelector(selector) !== null)) {
							recorder[property] = (recorder[property] as number) + 1
						}
					}
				}
			})

			observer.observe(document.body, { childList: true, subtree: true })
			recorder[`${property}Observer`] = observer
		}, [VIDEO_PREVIEW_RECORDER, VIDEO_PREVIEW_SELECTOR] as const)
	}

	/**
	 * Assert how many videos the tiles have started since
	 * {@link recordVideoPreviews}.
	 *
	 * @param count - The number of videos that should have been started
	 */
	public async expectVideoPreviewsStarted(count: number): Promise<void> {
		expect(await this.page.evaluate(
			(property) => (window as unknown as Record<string, number>)[property],
			VIDEO_PREVIEW_RECORDER,
		)).toBe(count)
	}

	/**
	 * Assert that a video is playing muted, on a loop and without a soundtrack the
	 * reader did not ask for — the terms on which a browser lets a page play a
	 * video by itself.
	 *
	 * @param video - The video of a tile, as {@link getVideoPreview} finds it
	 */
	public async expectVideoAutoplaying(video: Locator): Promise<void> {
		await expect.poll(() => video.evaluate((element: HTMLVideoElement) => ({
			paused: element.paused,
			muted: element.muted,
			loop: element.loop,
			// HAVE_CURRENT_DATA, i.e. the browser has decoded a frame to show.
			hasFrame: element.readyState >= 2,
		}))).toEqual({ paused: false, muted: true, loop: true, hasFrame: true })
	}

	/**
	 * Assert that a tile draws its duration badge on top of the video it plays,
	 * rather than letting the video cover it.
	 *
	 * @param name - Name of the video file
	 */
	public async expectDurationAboveVideo(name: string): Promise<void> {
		const badge = this.getTile(name).locator('.file__duration')
		await expect(badge).toBeVisible()

		const stacking = async (locator: Locator) => Number(await locator.evaluate((element) => window.getComputedStyle(element).zIndex))
		expect(await stacking(badge)).toBeGreaterThan(await stacking(this.getVideoPreview(name)))
	}

	/**
	 * The star a tile overlays on the preview of a favorite photo.
	 *
	 * Call `leaveTiles` before looking for it: a tile hides the star while it is
	 * hovered, selected or focused, as the checkbox takes that corner then.
	 *
	 * @param name - Name of the photo file
	 */
	public getFavoriteMarker(name: string): Locator {
		return this.getTile(name).getByRole('img', { name: 'Favorite' })
	}

	/**
	 * Take the pointer and the keyboard focus off the tiles, so that none of them
	 * is left in a state that hides what it overlays on its preview.
	 */
	public async leaveTiles(): Promise<void> {
		await this.page.mouse.move(0, 0)
		await this.page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
	}

	/**
	 * The badge a tile carries when it stands for a run of photos taken in one go,
	 * counting how many of them it holds.
	 *
	 * @param name - Name of the photo file the tile shows
	 */
	public getBurstBadge(name: string): Locator {
		return this.getTile(name).getByRole('img', { name: /photos taken in one go$/ })
	}

	/** The badges of every tile of the grid standing for a run of photos. */
	public getAllBurstBadges(): Locator {
		return this.container.getByRole('img', { name: /photos taken in one go$/ })
	}

	/**
	 * The placeholder sweeping over a tile until a preview of the photo arrives.
	 * It stands in for the picture, so it is hidden from assistive technology and
	 * addressed by its class.
	 *
	 * @param name - Name of the photo file
	 */
	public getPlaceholder(name: string): Locator {
		return this.getTile(name).locator('.file__layer--shimmer')
	}

	/**
	 * Select photos and wait for each of them to be marked as selected.
	 *
	 * @param names - Names of the photo files to select
	 */
	public async select(...names: string[]): Promise<void> {
		for (const name of names) {
			await this.setSelected(name, true)
		}
	}

	/**
	 * Select the first photo of the grid.
	 */
	public async selectFirst(): Promise<void> {
		const checkbox = this.container.getByRole('checkbox', { name: /^Select image / }).first()
		await checkbox.check({ force: true })
		await expect(checkbox).toBeChecked()
	}

	/**
	 * Deselect photos and wait for each of them to be unmarked.
	 *
	 * @param names - Names of the photo files to deselect
	 */
	public async deselect(...names: string[]): Promise<void> {
		for (const name of names) {
			await this.setSelected(name, false)
		}
	}

	/**
	 * Press a photo and hold it until its selection is toggled — the gesture that
	 * selects without aiming for the checkbox, which is a finicky target on a
	 * touch device.
	 *
	 * @param name - Name of the photo file
	 */
	public async longPress(name: string): Promise<void> {
		const checkbox = this.getSelectionCheckbox(name)
		const selected = await checkbox.isChecked()

		await this.getMedia(name).hover()
		await this.page.mouse.down()
		await expect(checkbox).toBeChecked({ checked: !selected })
		await this.page.mouse.up()

		// Releasing the press fires a click, which the app swallows. Letting the
		// browser paint once is what puts that click behind us, so that a following
		// assertion is about a viewer that stayed closed rather than about one that
		// has not opened yet.
		await this.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)))
	}

	/**
	 * Open a photo, i.e. press it and release right away.
	 *
	 * @param name - Name of the photo file
	 */
	public async open(name: string): Promise<void> {
		await this.getMedia(name).click()
	}

	/**
	 * Bring the selection state of a photo to what it should be.
	 *
	 * @param name - Name of the photo file
	 * @param selected - The state to bring it to
	 */
	private async setSelected(name: string, selected: boolean): Promise<void> {
		const checkbox = this.getSelectionCheckbox(name)

		await expect(async () => {
			if (await checkbox.isChecked() !== selected) {
				// The checkbox is visually hidden inside an NcCheckboxRadioSwitch and
				// only revealed on hover, hence the forced click.
				await checkbox.click({ force: true })
			}
			await expect(checkbox).toBeChecked({ checked: selected, timeout: 2000 })
		}).toPass({ timeout: 15_000 })
	}

	/**
	 * Assert whether a photo is shown as a favorite.
	 *
	 * @param name - Name of the photo file
	 * @param favorite - The state to assert
	 */
	public async expectFavorite(name: string, favorite: boolean): Promise<void> {
		await expect(this.getMedia(name)).toHaveAccessibleName(favorite
			? `Favorite image, open the full size "${name}" image`
			: `Open the full size "${name}" image`)
	}

	/**
	 * Assert whether the preview of a photo fills its tile, cropped to it, or is
	 * fit whole inside it.
	 *
	 * @param name - Name of the photo file
	 * @param cropped - The state to assert
	 */
	public async expectPreviewCropped(name: string, cropped: boolean): Promise<void> {
		const layers = this.getPreviewLayers(name)

		await expect(layers.first()).toBeAttached()
		const count = await layers.count()

		for (let index = 0; index < count; index++) {
			await expect(layers.nth(index)).toHaveCSS('object-fit', cropped ? 'cover' : 'contain')
		}
	}

	/**
	 * Assert whether the preview of a photo is magnified, as it is while the tile
	 * is hovered.
	 *
	 * Every layer of the preview is asserted, which is what keeps them in lockstep:
	 * a layer left behind would slide against the others during the magnify.
	 *
	 * @param name - Name of the photo file
	 * @param magnified - The state to assert
	 */
	public async expectPreviewMagnified(name: string, magnified: boolean): Promise<void> {
		const layers = this.getPreviewLayers(name)

		// The count is read first: asserting on the layers of a tile that renders
		// none of them would pass without having looked at anything.
		await expect(layers.first()).toBeAttached()
		const count = await layers.count()

		for (let index = 0; index < count; index++) {
			await expect(layers.nth(index)).toHaveCSS('transform', magnified ? MAGNIFIED_TRANSFORM : 'none')
		}
	}

	/**
	 * Assert whether a tile is lifted off the grid by the soft shadow it takes
	 * while it is hovered.
	 *
	 * @param name - Name of the photo file
	 * @param lifted - The state to assert
	 */
	public async expectTileLifted(name: string, lifted: boolean): Promise<void> {
		await expect(this.getTile(name)).toHaveCSS('box-shadow', lifted
			? /^rgba\(0, 0, 0, 0\.14\) 0px 6px 18px 0px$/
			: 'none')
	}

	/**
	 * Assert that every layer of a preview is timed to magnify on the same curve.
	 * A layer timed differently would slide against the others on the way to the
	 * magnified scale, however well they agree on where to end up.
	 *
	 * @param name - Name of the photo file
	 */
	public async expectMagnifyTiming(name: string): Promise<void> {
		const layers = this.getPreviewLayers(name)

		await expect(layers.first()).toBeAttached()
		const count = await layers.count()

		for (let index = 0; index < count; index++) {
			const layer = layers.nth(index)
			await expect(layer).toHaveCSS('transition-property', MAGNIFY_TIMING.property)
			await expect(layer).toHaveCSS('transition-duration', MAGNIFY_TIMING.duration)
			await expect(layer).toHaveCSS('transition-timing-function', MAGNIFY_TIMING.timingFunction)
		}
	}

	/**
	 * Open the actions menu of a photo.
	 *
	 * @param photoName - Name of the photo file the actions are about.
	 */
	public async openActionsMenu(photoName: string): Promise<PhotoActionsMenu> {
		const trigger = this.getActionsMenuTrigger(photoName)
		const menu = new PhotoActionsMenu(this.page, photoName)

		await expect(async () => {
			if (!(await menu.menu().isVisible())) {
				await trigger.focus()
				await trigger.press('Enter')
			}
			await expect(menu.menu()).toBeVisible({ timeout: 2000 })
		}).toPass({ timeout: 15_000 })

		return menu
	}

	/**
	 * The trigger of a photo's actions menu. Only rendered where photos are
	 * managed — the photo picker opts out of it.
	 *
	 * @param photoName - Name of the photo file the actions are about
	 */
	public getActionsMenuTrigger(photoName: string): Locator {
		return this.container.getByRole('button', { name: `Actions for ${photoName}` })
	}

	/** The actions menu triggers of every photo of the grid. */
	public getAllActionsMenuTriggers(): Locator {
		return this.container.getByRole('button', { name: /^Actions for / })
	}
}

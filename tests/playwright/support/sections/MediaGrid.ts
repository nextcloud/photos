/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { PhotoActionsMenu } from './PhotoActionsMenu.ts'

/**
 * How a grid builds a tile.
 *
 * `layered` tiles stack three preview layers — blurhash, small and large —
 * inside a frame that also holds the checkbox, the actions and the favorite
 * star. `legacy` tiles, which only the folders view still renders, are the link
 * itself with a single preview image in it.
 */
export type TileFlavour = 'layered' | 'legacy'

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
 * A grid of photo tiles — the timeline, the contents of a collection and the
 * photo picker all render the same tiles, so they all use this section.
 */
export class MediaGrid {
	constructor(
		public readonly page: Page,
		/** The element the grid is rendered in, so two grids cannot be confused. */
		private readonly container: Locator,
		/** How this grid builds its tiles. */
		private readonly flavour: TileFlavour = 'layered',
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
	 * checkbox, its actions and its favorite star. A `legacy` grid has no such
	 * frame, so there the tile is the link itself.
	 *
	 * @param name - Name of the photo file
	 */
	public getTile(name: string): Locator {
		if (this.flavour === 'legacy') {
			return this.getMedia(name)
		}

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
		return this.getTile(name).locator(this.flavour === 'legacy'
			? 'img'
			: '.file__layer--blurhash, .file__layer--small, .file__layer--large')
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

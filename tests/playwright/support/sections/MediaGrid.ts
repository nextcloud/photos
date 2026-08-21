/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { PhotoActionsMenu } from './PhotoActionsMenu.ts'

/**
 * A grid of photo tiles — the timeline, the contents of a collection and the
 * photo picker all render the same tiles, so they all use this section.
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

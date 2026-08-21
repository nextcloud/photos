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
	 * The selection checkbox of a photo.
	 *
	 * @param name - Name of the photo file
	 */
	public getSelectionCheckbox(name: string): Locator {
		return this.container.getByRole('checkbox', { name: `Select image ${name}` })
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

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The filters of a photo listing: a combobox to add one and a row of chips
 * showing the ones that are set.
 *
 * The same pair is rendered in the app navigation, where it filters the
 * timeline, and inside the album form, where it defines a smart album — hence
 * the container the section is scoped to.
 */
export class PhotosFilters {
	constructor(
		public readonly page: Page,
		/** The element the filters are rendered in. */
		private readonly container: Locator,
	) {}

	/** The combobox offering the available filters. */
	public input(): Locator {
		return this.container.getByRole('combobox', { name: 'Select filters' })
	}

	/**
	 * An option of the open combobox.
	 *
	 * Looked up page wide: the list of an `NcSelect` is positioned absolutely and
	 * ends up outside of the element the combobox itself sits in. Only one combobox
	 * is open at a time, which is what makes that unambiguous.
	 *
	 * @param name - Label of the option
	 */
	public getOption(name: string | RegExp): Locator {
		return this.page.getByRole('option', { name })
	}

	/**
	 * The chips of the filters that are set. They carry no accessible name of
	 * their own, so they are found by the attribute the app marks them with.
	 */
	public getChips(): Locator {
		return this.container.locator('[data-cy-photos-filters-option]')
	}

	/**
	 * The chip of one filter.
	 *
	 * @param text - Text the chip shows, e.g. a place name or a date range
	 */
	public getChip(text: string | RegExp): Locator {
		return this.getChips().filter({ hasText: text })
	}

	/** The dialog the "Custom…" date range option opens. */
	public customDateRangeDialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Select a custom date range' })
	}

	/**
	 * Pick an option of the combobox.
	 *
	 * The list only opens on focus and the options are fetched (the places are a
	 * listing of their own), so both the list and the option are waited for
	 * instead of assuming they are already there.
	 *
	 * @param name - Label of the option to pick
	 */
	private async pickOption(name: string | RegExp): Promise<void> {
		await this.input().click()
		// Typing narrows the list down, which matters for the places: there is one
		// option per place of the library.
		await this.input().fill(typeof name === 'string' ? name : '')

		const option = this.getOption(name)
		await expect(option).toBeVisible()
		await option.click()
	}

	/**
	 * Filter by a place.
	 *
	 * @param place - Name of the place, as the app resolved it from the coordinates
	 */
	public async selectPlace(place: string): Promise<void> {
		await this.pickOption(place)
		await expect(this.getChip(place)).toBeVisible()
	}

	/**
	 * Filter by a custom date range.
	 *
	 * The option opens a date picker dialog rather than applying a value of its
	 * own. Its input takes the range as text, which is how a range is entered
	 * without clicking through two calendars, and commits it on Enter.
	 *
	 * @param range - The range as the picker formats it, e.g. `2019-01-01 ~ 2019-12-31`
	 */
	public async selectDateRange(range: string): Promise<void> {
		await this.pickOption('Custom…')

		const dialog = this.customDateRangeDialog()
		await expect(dialog).toBeVisible()

		// The picker renders a single text input holding both ends of the range.
		const input = dialog.getByRole('textbox')
		await input.fill(range)
		await input.press('Enter')

		await expect(dialog).toHaveCount(0)
	}

	/**
	 * Remove the first filter that is set.
	 *
	 * Every chip closes itself through an entry named "Close", which an `NcChip`
	 * renders inline as long as it is the only action it has.
	 */
	public async removeFirstFilter(): Promise<void> {
		const chips = this.getChips()
		const before = await chips.count()
		expect(before, 'a filter has to be set to be removed').toBeGreaterThan(0)

		await chips.first().getByRole('button', { name: 'Close' }).click()
		await expect(chips).toHaveCount(before - 1)
	}
}

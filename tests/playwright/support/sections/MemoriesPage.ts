/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { waitForTimelineSearch } from '../utils/requests.ts'
import { ViewerModal } from './ViewerModal.ts'

/** The memories view, showing the trips and the year recap of a library. */
export class MemoriesPage {
	constructor(public readonly page: Page) {}

	/**
	 * Open the memories view and wait for the photos it is built from.
	 */
	public async open(): Promise<void> {
		const loaded = waitForTimelineSearch(this.page)
		await this.page.goto('apps/photos/memories')
		await expect(this.heading()).toBeVisible()
		await loaded
	}

	public heading(): Locator {
		return this.page.getByRole('heading', { level: 1, name: 'Memories' })
	}

	/** The message shown while the library holds neither a trip nor a recap. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'No memories yet' })
	}

	/**
	 * The drawing that stands in for an icon in the empty state.
	 */
	public emptyIllustration(): Locator {
		// the image is used here as pure decoration so its wrapped in aria-hidden and thus byRole does not work here
		return this.page.locator('.photos-illustration[aria-label="Memories illustration"]')
	}

	/**
	 * The card summing up a year, which opens its highlights as a slideshow.
	 *
	 * @param year - Year the card is about
	 */
	public recapCard(year: number): Locator {
		return this.page.getByRole('button', { name: `Play a slideshow of your ${year} highlights` })
	}

	/**
	 * The line above the title of the recap card, naming what the card is.
	 *
	 * @param year - Year the card is about
	 */
	public recapEyebrow(year: number): Locator {
		return this.recapCard(year).locator('.memories__recap__details__eyebrow')
	}

	/**
	 * The title of the recap card.
	 *
	 * @param year - Year the card is about
	 */
	public recapTitle(year: number): Locator {
		return this.recapCard(year).locator('.memories__recap__details__title')
	}

	/**
	 * The counters under the title of the recap card. They are spans of a card
	 * whose accessible name is the action it triggers, so they are addressed by
	 * their place in it.
	 *
	 * @param year - Year the card is about
	 */
	public recapCounters(year: number): Locator {
		return this.recapCard(year).locator('.memories__recap__details__meta')
	}

	/**
	 * The cover photo of the recap card.
	 *
	 * @param year - Year the card is about
	 */
	public recapCover(year: number): Locator {
		return this.recapCard(year).locator('img')
	}

	/**
	 * The cards of the trips. A trip card is named by the dates it covers, which
	 * are formatted in the locale of the browser, hence the class.
	 */
	public tripCards(): Locator {
		return this.page.locator('.memories__trip')
	}

	/** The photo counters of the trip cards, one per card. */
	public tripCounters(): Locator {
		return this.tripCards().locator('.animated-number')
	}

	/**
	 * Open the photos of a trip in the viewer.
	 *
	 * @param index - Position of the trip card, most recent trip first
	 * @return The viewer, showing the cover of the trip
	 */
	public async openTrip(index = 0): Promise<ViewerModal> {
		await this.tripCards().nth(index).getByRole('button').click()

		const viewer = new ViewerModal(this.page)
		await expect(viewer.dialog()).toBeVisible()
		return viewer
	}

	/**
	 * Play the highlights of a year as a slideshow.
	 *
	 * @param year - Year to play the recap of
	 */
	public async openRecapSlideshow(year: number): Promise<ViewerModal> {
		await this.recapCard(year).click()

		const slideshow = new ViewerModal(this.page)
		await expect(slideshow.dialog()).toBeVisible()
		return slideshow
	}
}

/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * The scrubber on the right edge of a timeline, jumping the grid from one month
 * section to another.
 *
 * Its handle is a slider and is addressed as one. The track it slides on, the
 * year pills labelling it and the density ticks graduating it carry no accessible
 * name of their own — they are the scale of that single control, and the month it
 * stands at is what the slider states — so they are addressed by their class.
 */
export class DateScrubber {
	constructor(public readonly page: Page) {}

	/** The scrubber as a whole, which is absent while the library holds one month. */
	public root(): Locator {
		return this.page.locator('.date-scrubber')
	}

	/** The part of the scrubber a press lands on. */
	public track(): Locator {
		return this.page.locator('.date-scrubber__track')
	}

	/** The handle saying which month the grid is at, and moving it. */
	public thumb(): Locator {
		return this.page.getByRole('slider', { name: 'Jump to a month' })
	}

	/**
	 * The ticks graduating the track, one per month of the library and as wide as
	 * that month is full. They come in the order the timeline shows the months,
	 * newest first, which is the only thing telling them apart.
	 */
	public ticks(): Locator {
		return this.page.locator('.date-scrubber__tick')
	}

	/** The pills labelling the years along the track. */
	public yearLabels(): Locator {
		return this.page.locator('.date-scrubber__year-label')
	}

	/**
	 * The pill labelling one year.
	 *
	 * @param year - The year the pill names
	 */
	public yearLabel(year: number): Locator {
		return this.track().getByText(String(year), { exact: true })
	}

	/**
	 * Assert which month the handle stands at — the month the slider states as its
	 * value, and the one the grid was jumped to.
	 *
	 * @param month - The month as the slider names it, e.g. `May 2021`
	 */
	public async expectCurrentMonth(month: string): Promise<void> {
		await expect(this.thumb()).toHaveAttribute('aria-valuetext', month)
	}

	/**
	 * Press the track where a year is labelled and let go right away — the gesture
	 * jumping the grid without dragging anything.
	 *
	 * @param year - The year to land in, i.e. its first month
	 */
	public async jumpToYear(year: number): Promise<void> {
		await this.track().click({ position: await this.positionOfYear(year) })
	}

	/**
	 * Press the track where a year is labelled and keep holding it — the press is a
	 * jump of its own and the start of a drag at once.
	 *
	 * @param year - The year to press at
	 */
	public async pressTrackAtYear(year: number): Promise<void> {
		const track = await this.boundingBoxOf(this.track())
		const position = await this.positionOfYear(year)

		await this.page.mouse.move(track.x + position.x, track.y + position.y)
		await this.page.mouse.down()
	}

	/** Take hold of the handle where it stands, without moving it yet. */
	public async grabThumb(): Promise<void> {
		await this.thumb().hover()
		await this.page.mouse.down()
	}

	/**
	 * Drag whatever is held over the pill of a year, and keep holding it. Moved in
	 * steps rather than in one jump, so the moves in between are delivered as well —
	 * a drag the app follows all the way is the point of it.
	 *
	 * @param year - The year to drag over
	 */
	public async dragOverYear(year: number): Promise<void> {
		const track = await this.boundingBoxOf(this.track())
		const position = await this.positionOfYear(year)

		await this.page.mouse.move(track.x + position.x, track.y + position.y, { steps: 10 })
	}

	/** Let go of whatever is held. */
	public async release(): Promise<void> {
		await this.page.mouse.up()
	}

	/**
	 * Where on the track a year is labelled, relative to the track itself — which
	 * is how Playwright wants a press positioned.
	 *
	 * @param year - The year to locate
	 */
	private async positionOfYear(year: number): Promise<{ x: number, y: number }> {
		const track = await this.boundingBoxOf(this.track())
		const label = await this.boundingBoxOf(this.yearLabel(year))

		return {
			x: track.width / 2,
			y: label.y + label.height / 2 - track.y,
		}
	}

	/**
	 * The box of an element, refusing to guess when it has none.
	 *
	 * @param locator - The element to measure
	 */
	private async boundingBoxOf(locator: Locator): Promise<{ x: number, y: number, width: number, height: number }> {
		const box = await locator.boundingBox()
		if (box === null) {
			throw new Error('The scrubber is not laid out, so it cannot be dragged')
		}
		return box
	}
}

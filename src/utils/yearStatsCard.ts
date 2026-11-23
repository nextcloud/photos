/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** Texts of the card summing up a year, already translated and formatted. */
export type YearStatsCard = {
	/** Line above the title. */
	eyebrow: string
	/** Year the card is about. */
	title: string
	/** Main numbers, shown as tiles. */
	tiles: { value: string, label: string }[]
	/** Further facts, shown as a list below the tiles. */
	facts: { label: string, value: string }[]
}

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350

const MARGIN = 80
const GAP = 24
const TILE_HEIGHT = 190

/**
 * Draw the card summing up a year. The card is an image meant to leave the
 * app, so it keeps the same look whatever the theme of the page.
 *
 * @param canvas - Canvas to draw on, resized to the size of the card
 * @param card - Texts of the card
 * @param style - Look taken from the page
 * @param style.color - Background color of the card
 * @param style.fontFamily - Font of the texts
 */
export function drawYearStatsCard(canvas: HTMLCanvasElement, card: YearStatsCard, style: { color: string, fontFamily: string }): void {
	const context = canvas.getContext('2d')
	if (context === null) {
		return
	}

	canvas.width = CARD_WIDTH
	canvas.height = CARD_HEIGHT

	context.fillStyle = style.color
	context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
	const shade = context.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
	shade.addColorStop(0, 'rgba(0, 0, 0, 0.25)')
	shade.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
	context.fillStyle = shade
	context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

	const contentWidth = CARD_WIDTH - 2 * MARGIN
	// Start aligned text follows the direction of the canvas, hence of the page.
	const rtl = getComputedStyle(canvas).direction === 'rtl'
	context.textAlign = 'start'
	context.textBaseline = 'alphabetic'

	/**
	 * Write a line of text, shrunk when it does not fit the given width.
	 *
	 * @param text - Text to write
	 * @param x - Distance of the text from the start edge of the card
	 * @param y - Baseline of the text
	 * @param size - Font size, in pixels
	 * @param options - Look of the text
	 * @param options.bold - Whether the text is bold
	 * @param options.alpha - Opacity of the text
	 * @param options.maxWidth - Width the text has to fit in
	 */
	function write(text: string, x: number, y: number, size: number, { bold = false, alpha = 1, maxWidth = contentWidth } = {}): void {
		context!.fillStyle = `rgba(255, 255, 255, ${alpha})`
		do {
			context!.font = `${bold ? 'bold ' : ''}${size}px ${style.fontFamily}`
			size -= 2
		} while (size > 16 && context!.measureText(text).width > maxWidth)
		context!.fillText(text, rtl ? CARD_WIDTH - x : x, y, maxWidth)
	}

	write(card.eyebrow.toLocaleUpperCase(), MARGIN, 150, 34, { bold: true, alpha: 0.8 })
	write(card.title, MARGIN, 350, 220, { bold: true })

	// Tiles are laid out on two columns, a last tile left alone takes the row.
	let y = 420
	for (const [index, tile] of card.tiles.entries()) {
		const alone = index % 2 === 0 && index === card.tiles.length - 1
		const width = alone ? contentWidth : (contentWidth - GAP) / 2
		const x = MARGIN + (index % 2) * (width + GAP)

		context.fillStyle = 'rgba(255, 255, 255, 0.14)'
		context.beginPath()
		context.roundRect(rtl ? CARD_WIDTH - x - width : x, y, width, TILE_HEIGHT, 28)
		context.fill()
		write(tile.value, x + 32, y + 104, 84, { bold: true, maxWidth: width - 64 })
		write(tile.label, x + 32, y + 156, 32, { alpha: 0.85, maxWidth: width - 64 })

		if (index % 2 === 1 || alone) {
			y += TILE_HEIGHT + GAP
		}
	}

	y += 50
	for (const fact of card.facts) {
		write(fact.label.toLocaleUpperCase(), MARGIN, y, 26, { bold: true, alpha: 0.7 })
		write(fact.value, MARGIN, y + 56, 44, { bold: true })
		y += 124
	}
}

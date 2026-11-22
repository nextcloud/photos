/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface YearLabel {
	year: string
	/** Position along the track, in percent. */
	percent: number
}

/**
 * The year labels of a track listing months from one end to the other: one per
 * year, at the position of the first month of it. A label that would come
 * closer than `minGap` to the one before it is left out, so that they never
 * overlap however short the track is.
 *
 * @param months - `YYYYMM` month keys, in display order.
 * @param trackHeight - Height of the track, in pixels.
 * @param minGap - Smallest distance between two labels, in pixels.
 */
export function yearLabels(months: string[], trackHeight: number, minGap: number): YearLabel[] {
	const labels: YearLabel[] = []
	const seenYears = new Set<string>()

	for (const [index, month] of months.entries()) {
		const year = month.substring(0, 4)
		if (seenYears.has(year)) {
			continue
		}
		seenYears.add(year)

		const percent = months.length > 1 ? (index / (months.length - 1)) * 100 : 0
		const previous = labels.at(-1)
		if (previous === undefined || ((percent - previous.percent) / 100) * trackHeight >= minGap) {
			labels.push({ year, percent })
		}
	}

	return labels
}

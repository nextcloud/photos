/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Normalise per-month photo counts onto a 0..1 density scale.
 *
 * The scale is capped at the 95th percentile of the non-empty months so a
 * single bursty month does not flatten every other month down to the floor.
 * Months without photos score 0.
 *
 * @param months - Month keys to score, in display order.
 * @param counts - Photo count per month key, missing keys count as 0.
 */
export function monthDensities(months: string[], counts: Record<string, number>): number[] {
	const nonEmpty = months
		.map((month) => counts[month] ?? 0)
		.filter((count) => count > 0)
		.sort((count1, count2) => count1 - count2)

	if (nonEmpty.length === 0) {
		return months.map(() => 0)
	}

	// Nearest-rank 95th percentile: the smallest count at least 95% of the
	// months stay below. Falls back to the highest count when there are too
	// few months for a percentile to exclude anything.
	const cap = nonEmpty[Math.ceil(nonEmpty.length * 0.95) - 1]

	return months.map((month) => Math.min(1, (counts[month] ?? 0) / cap))
}

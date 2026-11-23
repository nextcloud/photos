/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DateRangeValueType } from '../services/PhotosFilters/dateRangeFilter.ts'

export type RankableCommand = {
	label: string
	/** Other words the command is found by, matched less strongly than the label. */
	keywords?: string[]
}

export type DateQuery = {
	year: number
	/** Zero based month, left out when the query names a whole year. */
	month?: number
	range: DateRangeValueType
}

const OLDEST_YEAR = 1900

/**
 * Lower case a text and strip its diacritics, so `Malaga` finds `Málaga`.
 *
 * @param text - The text to normalize
 */
function normalize(text: string): string {
	return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

/**
 * Rate how well a text matches a query, zero meaning not at all.
 *
 * @param query - The normalized query
 * @param text - The text to rate
 */
function scoreText(query: string, text: string): number {
	const normalized = normalize(text)
	const words = normalized.split(/[^\p{L}\p{N}]+/u)

	if (normalized === query) {
		return 100
	}
	if (normalized.startsWith(query)) {
		return 80
	}
	if (words.some((word) => word.startsWith(query))) {
		return 60
	}
	if (normalized.includes(query)) {
		return 40
	}
	// Words typed in another order, or with other words in between.
	if (query.split(/\s+/).every((token) => normalized.includes(token))) {
		return 20
	}
	return 0
}

/**
 * Keep the commands matching a query, best match first. Commands matching
 * equally well keep the order they were given in, and an empty query keeps
 * them all.
 *
 * @param query - What the user typed
 * @param commands - The commands to search
 * @param limit - How many commands to return at most
 */
export function rankCommands<T extends RankableCommand>(query: string, commands: T[], limit = 50): T[] {
	const normalizedQuery = normalize(query)
	if (normalizedQuery === '') {
		return commands.slice(0, limit)
	}

	return commands
		.map((command, index) => ({
			command,
			index,
			score: Math.max(
				scoreText(normalizedQuery, command.label),
				...(command.keywords ?? []).map((keyword) => scoreText(normalizedQuery, keyword) / 2),
			),
		}))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score || a.index - b.index)
		.slice(0, limit)
		.map(({ command }) => command)
}

/**
 * Find the month a word names in one of the given locales.
 *
 * @param word - The normalized word, at least the first three letters of a month
 * @param locales - The locales to take the month names from
 * @return The zero based month, or -1 when the word names none
 */
function findMonth(word: string, locales: string[]): number {
	for (const locale of locales) {
		const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
		for (let month = 0; month < 12; month++) {
			const name = normalize(formatter.format(new Date(2000, month, 1)))
			if (name === word || (word.length >= 3 && name.startsWith(word))) {
				return month
			}
		}
	}
	return -1
}

/**
 * Read a query as a year or a month, like `2021`, `June 2019`, `2019-06` or
 * `June`, which is the last June that started.
 *
 * @param query - What the user typed
 * @param locales - The locales month names are accepted in
 * @param now - The current date
 * @return The period with the range the date filter takes, or null when the query is not a date
 */
export function parseDateQuery(query: string, locales: string[], now = new Date()): DateQuery | null {
	const tokens = normalize(query).split(/[\s,./-]+/).filter((token) => token !== '')
	if (tokens.length === 0 || tokens.length > 2) {
		return null
	}

	const yearToken = tokens.find((token) => /^\d{4}$/.test(token))
	const monthToken = tokens.find((token) => token !== yearToken)
	if (tokens.length === 2 && (yearToken === undefined || monthToken === undefined)) {
		return null
	}

	let month: number | undefined
	if (monthToken !== undefined) {
		month = /^\d{1,2}$/.test(monthToken) && yearToken !== undefined
			? Number.parseInt(monthToken) - 1
			: findMonth(monthToken, locales)
		if (month < 0 || month > 11) {
			return null
		}
	}

	let year = now.getFullYear()
	if (yearToken !== undefined) {
		year = Number.parseInt(yearToken)
	} else if (month !== undefined && month > now.getMonth()) {
		year--
	}
	if (year < OLDEST_YEAR || year > now.getFullYear()) {
		return null
	}

	// The date filter takes the start of the first and of the last day.
	const range = month === undefined
		? { start: new Date(year, 0, 1).getTime(), end: new Date(year, 11, 31).getTime() }
		: { start: new Date(year, month, 1).getTime(), end: new Date(year, month + 1, 0).getTime() }

	return { year, month, range }
}

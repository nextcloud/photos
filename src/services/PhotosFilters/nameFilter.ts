/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import magnifySvg from '@mdi/svg/svg/magnify.svg?raw'
import moment from '@nextcloud/moment'
import { defineComponent, h } from 'vue'

export const nameFilterId = 'name'

/**
 * Powers the search input in the timeline header. A typed term is
 * matched against three things, OR-ed together:
 *
 *  1. The file's display name (DAV `<d:displayname/>` LIKE %term%).
 *  2. Any system tag attached to the file whose name contains the
 *     term (DAV `<oc:systemtag/>` LIKE %term%). The SearchDAV builder
 *     joins `oc_systemtag_object_mapping` for us, so a tag match
 *     requires the tag to actually be assigned to the file.
 *  3. Whether the term parses as a date — either a year ("2023") or
 *     a year-month ("2023-05" / "May 2023") — and the photo's
 *     EXIF capture date falls inside that range. Falls back silently
 *     if the term doesn't look like a date.
 *
 * Multiple typed terms are AND-ed (each term must independently
 * match). So "vacation 2023" matches photos that have "vacation"
 * somewhere AND were taken in 2023, the natural narrow-as-you-type
 * behaviour.
 *
 * The render-option component is unused — this filter is driven by a
 * dedicated text input in the timeline header rather than the standard
 * "pick from a list of options" PhotosFiltersInput popup. We supply a
 * stub so the filter machinery doesn't choke on `undefined`.
 */
const NameFilterStubOption = defineComponent({
	name: 'NameFilterStubOption',
	render: () => h('span'),
})

/**
 * Escape characters that have a special meaning inside the DAV
 * literal we embed in the query body.
 *
 * @param raw - User-supplied search string
 */
function escapeDavLiteral(raw: string): string {
	return raw
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/%/g, '\\%') // SQL LIKE wildcard
		.replace(/_/g, '\\_') // SQL LIKE single-char wildcard
}

/**
 * Try to parse `term` as a date and return the [start, end) unix-
 * second range it covers. Year-only ("2023") covers the whole year;
 * year-month ("2023-05" / "May 2023" / "2023-5" / "5/2023") covers
 * that month. Returns null if the term isn't recognisably a date.
 *
 * Tight grammar on purpose — we don't want a generic "dog" to
 * accidentally match a date and OR in millions of irrelevant photos.
 *
 * @param term - User-typed search string
 */
function parseDateRange(term: string): { start: number, end: number } | null {
	const t = term.trim()

	// Year-only: 1900..2100.
	if (/^\d{4}$/.test(t)) {
		const year = Number.parseInt(t, 10)
		if (year < 1900 || year > 2100) {
			return null
		}
		const start = moment.utc({ year, month: 0, day: 1 }).unix()
		const end = moment.utc({ year: year + 1, month: 0, day: 1 }).unix()
		return { start, end }
	}

	// Year-month variants. moment understands the formats below
	// strictly so a stray "12-3" doesn't fool the parser.
	const formats = ['YYYY-MM', 'YYYY-M', 'M/YYYY', 'MM/YYYY', 'MMMM YYYY', 'MMM YYYY']
	for (const format of formats) {
		const parsed = moment.utc(t, format, true)
		if (parsed.isValid()) {
			const start = parsed.startOf('month').unix()
			const end = parsed.clone().add(1, 'month').startOf('month').unix()
			return { start, end }
		}
	}

	return null
}

function buildClauseForTerm(term: string): string {
	const escaped = escapeDavLiteral(term)
	const clauses: string[] = []

	clauses.push(`
		<d:like>
			<d:prop><d:displayname/></d:prop>
			<d:literal>%${escaped}%</d:literal>
		</d:like>`)

	clauses.push(`
		<d:like>
			<d:prop><oc:systemtag/></d:prop>
			<d:literal>%${escaped}%</d:literal>
		</d:like>`)

	const range = parseDateRange(term)
	if (range !== null) {
		clauses.push(`
			<d:and>
				<d:gte>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${range.start}</d:literal>
				</d:gte>
				<d:lt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${range.end}</d:literal>
				</d:lt>
			</d:and>`)
	}

	return `<d:or>${clauses.join('')}</d:or>`
}

export const nameFilter: PhotosFilter<string> = {
	id: nameFilterId,
	icon: magnifySvg,
	renderOptionComponent: NameFilterStubOption,
	async getOptions() {
		// No predefined options — the input is free-text.
		return []
	},
	getQuery(values: string[]): string {
		const trimmed = values
			.map((value) => value.trim())
			.filter((value) => value.length > 0)

		if (trimmed.length === 0) {
			return ''
		}

		// Each typed term becomes (name OR tag OR date) — see file-
		// level comment. Multiple terms are AND-ed across that union.
		const perTerm = trimmed.map(buildClauseForTerm)

		if (perTerm.length === 1) {
			return perTerm[0]
		}

		return `<d:and>${perTerm.join('')}</d:and>`
	},
}

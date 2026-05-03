/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import magnifySvg from '@mdi/svg/svg/magnify.svg?raw'
import { defineComponent, h } from 'vue'

export const nameFilterId = 'name'

/**
 * The "name" filter takes free-text values typed into the timeline's
 * search input and emits a DAV `<d:like>` query against the file's
 * displayname. SearchDAV translates `%query%` to a SQL LIKE so the match
 * is a substring (case-insensitive on most database backends).
 *
 * The render-option component is unused — this filter is driven by a
 * dedicated text input in the timeline header rather than the standard
 * "pick from a list of options" PhotosFiltersInput popup. We supply a
 * stub component so the filter machinery doesn't choke on `undefined`.
 */
const NameFilterStubOption = defineComponent({
	name: 'NameFilterStubOption',
	render: () => h('span'),
})

/**
 * Escape characters that have a special meaning inside the DAV literal
 * we embed in the query body.
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

		// Each typed query becomes a substring match on the file basename.
		// Multiple queries are AND-ed (all must match) to support "narrow"
		// search behaviour as the user types more terms.
		const clauses = trimmed.map((value) => `
			<d:like>
				<d:prop><d:displayname/></d:prop>
				<d:literal>%${escapeDavLiteral(value)}%</d:literal>
			</d:like>`)

		if (clauses.length === 1) {
			return clauses[0]
		}

		return `<d:and>${clauses.join('')}</d:and>`
	},
}

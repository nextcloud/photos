/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import magnifySvg from '@mdi/svg/svg/magnify.svg?raw'
import { encode } from 'he'
import NameOption from '../../components/PhotosFilters/NameOption.vue'

export type NameValueType = string

export const nameFilterId = 'name'

/**
 * Escape a search term so it can be used as a DAV literal:
 * the `LIKE` wildcards are escaped first, then the XML entities.
 *
 * @param searchTerm - Term typed by the user
 */
function escapeSearchTerm(searchTerm: string): string {
	return encode(searchTerm.replace(/[\\%_]/g, '\\$&'))
}

/**
 * Free text filter matching the name of the files.
 *
 * Its values are typed in the search field of the navigation,
 * so it does not provide any option to pick from.
 */
export const nameFilter: PhotosFilter<NameValueType> = {
	id: nameFilterId,
	icon: magnifySvg,
	renderOptionComponent: NameOption,
	async getOptions() {
		return []
	},
	getQuery(searchTerms: NameValueType[]): string {
		// A substring match on the file name, all terms have to match.
		const comparisons = searchTerms
			.map((searchTerm) => searchTerm.trim())
			.filter((searchTerm) => searchTerm.length > 0)
			.map((searchTerm) => `
				<d:like>
					<d:prop><d:displayname/></d:prop>
					<d:literal>%${escapeSearchTerm(searchTerm)}%</d:literal>
				</d:like>`)

		if (comparisons.length === 0) {
			return ''
		}

		return `<d:and>${comparisons.join('')}</d:and>`
	},
}

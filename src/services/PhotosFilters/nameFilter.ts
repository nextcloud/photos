/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import magnifySvg from '@mdi/svg/svg/magnify.svg?raw'
import { encode } from 'he'
import { isCaptionSearchEnabled } from '../../utils/photoCaption.ts'

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
 * Split search terms into words, without duplicates.
 *
 * @param searchTerms - Terms typed by the user
 */
function getSearchWords(searchTerms: string[]): string[] {
	const words = new Map<string, string>()
	for (const word of searchTerms.flatMap((searchTerm) => searchTerm.split(/\s+/))) {
		const key = word.toLocaleLowerCase()
		if (word !== '' && !words.has(key)) {
			words.set(key, word)
		}
	}

	return [...words.values()]
}

/**
 * Free text filter matching the words of the search, in any order, against
 * the name of the files and the description of the photos once the server
 * stores them.
 *
 * System tags cannot be matched, the WebDAV search does not support them.
 *
 * Its values are provided by the search field of the navigation instead of the
 * filters input, so it does not provide any option to pick from.
 */
export const nameFilter: PhotosFilter<NameValueType> = {
	id: nameFilterId,
	icon: magnifySvg,
	async getOptions() {
		return []
	},
	getQuery(searchTerms: NameValueType[]): string {
		// A substring match on the file name or description, all words have to match.
		const properties = isCaptionSearchEnabled()
			? ['<d:displayname/>', '<nc:metadata-photos-caption/>']
			: ['<d:displayname/>']

		const comparisons = getSearchWords(searchTerms)
			.map((word) => {
				const likes = properties.map((property) => `
				<d:like>
					<d:prop>${property}</d:prop>
					<d:literal>%${escapeSearchTerm(word)}%</d:literal>
				</d:like>`)

				return likes.length === 1 ? likes[0] : `<d:or>${likes.join('')}</d:or>`
			})

		if (comparisons.length === 0) {
			return ''
		}

		return `<d:and>${comparisons.join('')}</d:and>`
	},
}

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ResponseDataDetailed, SearchOptions, SearchResult } from 'webdav'

import { defaultRootPath, resultToNode } from '@nextcloud/files/dav'
import moment from '@nextcloud/moment'
import { joinPaths } from '@nextcloud/paths'
import store from '../store/index.js'
import { allMimes } from './AllowedMimes.js'
import { davClient } from './DavClient.ts'
import { getDefaultDavProps } from './DavRequest.ts'

export type PhotoSearchOptions = SearchOptions & {
	firstResult: number // Index of the first result that we want (starts at 0). Default: 0.
	nbResults: number // The number of file to fetch. Default: 200.
	mimesType: string[] // Mime type of the files. Default: allMimes.
	full: boolean // get full data of the files. Default: false.
	onThisDay: boolean // get only items from this day of year. Default: false.
	onlyFavorites: boolean // get only favorite items. Default: false.
	extraFilters: string // a raw dav string that will be added in the 'where' clause. Default: ''.
}

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param _options
 */
export default async function(_options: Partial<PhotoSearchOptions> = {}): Promise<File[]> {
	// default function options
	const options: PhotoSearchOptions = {
		firstResult: 0,
		nbResults: 200,
		mimesType: allMimes,
		onThisDay: false,
		onlyFavorites: false,
		full: false,
		extraFilters: '',
		..._options,
	}

	// generating the search or condition
	// based on the allowed mimetypes
	const orMime = options.mimesType.reduce((str, mime) => `${str}
		<d:eq>
			<d:prop>
				<d:getcontenttype/>
			</d:prop>
			<d:literal>${mime}</d:literal>
		</d:eq>
	`, '')

	const eqFavorites = options.onlyFavorites
		? `<d:eq>
				<d:prop>
					<oc:favorite/>
				</d:prop>
				<d:literal>1</d:literal>
			</d:eq>`
		: ''

	const onThisDay = options.onThisDay
		? `<d:or>${Array(20).fill(1)
			.map((_, years) => {
				const start = moment(Date.now()).startOf('day').subtract(3, 'd').subtract(years + 1, 'y')
				const end = moment(Date.now()).endOf('day').add(3, 'd').subtract(years + 1, 'y')
				return `<d:and>
				<d:gt>
					<d:prop>
						<nc:metadata-photos-original_date_time/>
					</d:prop>
					<d:literal>${start.valueOf() / 1000}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop>
						<nc:metadata-photos-original_date_time/>
					</d:prop>
					<d:literal>${end.valueOf() / 1000}</d:literal>
				</d:lt>
			</d:and>`
			}).join('\n')}</d:or>`
		: ''

	const sourceFolders = store.state.userConfig.photosSourceFolders
		.map((folder) => `
			<d:scope>
				<d:href>${joinPaths(defaultRootPath, folder)}</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>`)
		.join('\n')

	options.data = `<?xml version="1.0" encoding="UTF-8"?>
		<d:searchrequest xmlns:d="DAV:"
			xmlns:oc="http://owncloud.org/ns"
			xmlns:nc="http://nextcloud.org/ns"
			xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
			xmlns:ocs="http://open-collaboration-services.org/ns">
			<d:basicsearch>
				<d:select>
					<d:prop>
						${getDefaultDavProps()}
					</d:prop>
				</d:select>
				<d:from>
					${sourceFolders}
				</d:from>
				<d:where>
					<d:and>
						<d:or>
							${orMime}
						</d:or>
						${eqFavorites}
						${onThisDay}
						${options.extraFilters}
					</d:and>
				</d:where>
				<d:orderby>
					<d:order>
						<d:prop><nc:metadata-photos-original_date_time/></d:prop>
						<d:descending/>
					</d:order>
					<d:order>
						<d:prop><d:getlastmodified/></d:prop>
						<d:descending/>
					</d:order>
				</d:orderby>
				<d:limit>
					<d:nresults>${options.nbResults}</d:nresults>
					<ns:firstresult>${options.firstResult}</ns:firstresult>
				</d:limit>
			</d:basicsearch>
		</d:searchrequest>`

	options.details = true

	const response = await davClient.search('/', options) as ResponseDataDetailed<SearchResult>

	return response.data.results
		.map((data) => {
			data.filename = data.filename.replace(/^\/remote.php\/dav/, '')
			return data
		})
		.map((data) => resultToNode(data) as File)
}

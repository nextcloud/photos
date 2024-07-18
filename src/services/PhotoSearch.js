/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { genFileInfo } from '../utils/fileUtils.js'
import { allMimes } from './AllowedMimes.js'
import client from './DavClient.js'
import { props } from './DavRequest.js'
import moment from '@nextcloud/moment'
import store from '../store/index.js'
import { davRootPath } from '@nextcloud/files'
import { joinPaths } from '@nextcloud/paths'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {object} [options] used for the cancellable requests
 * @param {number} [options.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [options.nbResults=200] The number of file to fetch
 * @param {string[]} [options.mimesType=allMimes] Mime type of the files
 * @param {boolean} [options.full=false] get full data of the files
 * @param {boolean} [options.onThisDay=false] get only items from this day of year
 * @param {boolean} [options.onlyFavorites=false] get only favorite items
 * @return {Promise<object[]>} the file list
 */
export default async function(options = {}) {
	// default function options
	options = {
		firstResult: 0,
		nbResults: 200,
		mimesType: allMimes,
		onThisDay: false,
		onlyFavorites: false,
		...options,
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
						<d:getlastmodified />
					</d:prop>
					<d:literal>${start.format(moment.defaultFormatUtc)}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop>
						<d:getlastmodified />
					</d:prop>
					<d:literal>${end.format(moment.defaultFormatUtc)}</d:literal>
				</d:lt>
			</d:and>`
			}).join('\n')}</d:or>`
		: ''

	const sourceFolders = store.state.userConfig.photosSourceFolders
		.map(() => `
			<d:scope>
				<d:href>${joinPaths(davRootPath)}</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>`
		)
		.join('\n')

	options = Object.assign({
		method: 'SEARCH',
		headers: {
			'content-Type': 'text/xml',
		},
		data: `<?xml version="1.0" encoding="UTF-8"?>
			<d:searchrequest xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:basicsearch>
					<d:select>
						<d:prop>
							${props}
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
			</d:searchrequest>`,
		deep: true,
		details: true,
	}, options)

	const response = await client.getDirectoryContents('', options)

	return response.data.map(data => genFileInfo(data))
}

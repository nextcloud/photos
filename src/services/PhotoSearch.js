/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { genFileInfo } from '../utils/fileUtils.js'
import { getCurrentUser } from '@nextcloud/auth'
import { allMimes } from './AllowedMimes.js'
import client from './DavClient.js'
import { props } from './DavRequest.js'
import moment from '@nextcloud/moment'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {boolean} [onlyFavorites=false] not used
 * @param {object} [options] used for the cancellable requests
 * @param {number} [options.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [options.nbResults=200] The number of file to fetch
 * @param {string[]} [options.mimesType=allMimes] Mime type of the files
 * @param {boolean} [options.full=false] get full data of the files
 * @param {boolean} [options.onThisDay=false] get only items from this day of year
 * @return {Promise<object[]>} the file list
 */
export default async function(onlyFavorites = false, options = {}) {

	// default function options
	options = {
		firstResult: 0,
		nbResults: 200,
		mimesType: allMimes,
		onThisDay: false,
		...options,
	}

	const prefixPath = `/files/${getCurrentUser().uid}`

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

	const eqFavorites = onlyFavorites
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
						<d:scope>
							<d:href>${prefixPath}</d:href>
							<d:depth>infinity</d:depth>
						</d:scope>
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

	return response.data
		.map(data => genFileInfo(data))
		// remove prefix path from full file path
		.map(data => Object.assign({}, data, { filename: data.filename.replace(prefixPath, '') }))

}

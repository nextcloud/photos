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

const eqFavorites = `
	<d:eq>
		<d:prop>
			<oc:favorite/>
		</d:prop>
		<d:literal>1</d:literal>
	</d:eq>`

const metadataNotNull = `
	<d:not>
		<d:is-defined>
			<d:prop><nc:metadata-photos-original_date_time/></d:prop>
		</d:is-defined>
	</d:not>`
const orderByMetadata = `
	<d:order>
		<d:prop><nc:metadata-photos-original_date_time/></d:prop>
		<d:descending/>
	</d:order>`
const orderByLastModified = `
	<d:>
		<d:prop><d:getlastmodified/></d:prop>
		<d:descending/>
	</d: order >`

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {object} path the lookup path
 * @param {object} [opts] used for the cancellable requests
 * @param {number} [opts.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [opts.nbResults=200] The number of file to fetch
 * @param {string[]} [opts.mimesType=allMimes] Mime type of the files
 * @param {boolean} [opts.full=false] get full data of the files
 * @param {boolean} [opts.onThisDay=false] get only items from this day of year
 * @param {boolean} [opts.onlyFavorites=false] get only favorite items
 * @param {number} [opts.dateTimeUpperBound] limit the search to photos taken before this lower bound
 * @param {number} [opts.dateTimeLowerBound] limit the search to photos taken after this lower bound
 * @return {Promise<object[]>} the file list
 */
export default async function photosSearch(path = '', opts = {}) {
	// default function options
	const options = {
		firstResult: 0,
		nbResults: 200,
		mimesType: allMimes,
		onThisDay: false,
		onlyFavorites: false,
		...opts,
	}

	const prefixPath = `/files/${getCurrentUser()?.uid}`

	// generating the search or condition
	// based on the allowed mimetypes
	const orMime = getMtimeConstraint(options.mimesType)
	const favorites = options.onlyFavorites ? eqFavorites : ''
	const onThisDay = options.onThisDay ? getOnThisDayConstraint() : ''
	// To improve the performance of the request, we create time boundaries to limit the number of file that the requests handles in the DB.
	// Having constraints on both last modified (mtime) and metadata-original_taken_date in the same request does not improve performance
	// But having two requests with boundaries on one property and then the other, drastically increase the performances.
	// So here we are with this little hack.
	// We do not need this hack when onThisDay and onlyFavorites constraints are on.
	const timeBoundaries = !options.onThisDay && !options.onlyFavorites ? getTimeBoundariesConstraint(options.dateTimeUpperBound, options.dateTimeLowerBound) : [[]]

	const requests = timeBoundaries.map(([timeBoundaries]) => {
		const requestParams = {
			...options,
			method: 'SEARCH',
			headers: {
				'content-Type': 'text/xml',
			},
			deep: true,
			details: true,
			data: getSearchRequestData(
				prefixPath,
				path,
				`<d:and>${[orMime, favorites, onThisDay, ...timeBoundaries].join('\n')}</d:and>`,
				[orderByMetadata, orderByLastModified].join('\n'),
				options,
			),
		}

		return client.getDirectoryContents('', requestParams)
	})

	const responses = await Promise.all(requests)
	return responses.flat().data.map(data => genFileInfo(data))
}

/**
 *
 * @param {string} prefixPath
 * @param {string} path
 * @param {string} constraints
 * @param {string} orderBy
 * @param {object} options
 * @param {number} options.firstResult
 * @param {number} options.nbResults
 */
function getSearchRequestData(prefixPath, path, constraints, orderBy, options) {
	return `<?xml version="1.0" encoding="UTF-8"?>
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
					<d:href>${prefixPath}/${path}</d:href>
					<d:depth>infinity</d:depth>
				</d:scope>
			</d:from>
			<d:where>
				${constraints}
			</d:where>
			<d:orderby>${orderBy}</d:orderby>
			<d:limit>
				<d:nresults>${options.nbResults}</d:nresults>
				<ns:firstresult>${options.firstResult}</ns:firstresult>
			</d:limit>
		</d:basicsearch>
	</d:searchrequest>`
}

/**
 *
 * @param {string[]} mimesType
 */
function getMtimeConstraint(mimesType) {
	const mtimeConstraints = mimesType
		.map(
			(str, mime) => `${str}
				<d:eq>
					<d:prop>
						<d:getcontenttype/>
					</d:prop>
					<d:literal>${mime}</d:literal>
				</d:eq>
			`
		)
		.join('')

	return `<d:or>${mtimeConstraints}</d:or>`
}

function getOnThisDayConstraint() {
	const targetedDays = Array(20)
		.fill(1)
		.map((_, years) => {
			const start = moment(Date.now()).startOf('day').subtract(3, 'd').subtract(years + 1, 'y')
			const end = moment(Date.now()).endOf('day').add(3, 'd').subtract(years + 1, 'y')

			return `
				<d:and>
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
				</d:and>
			`
		}).join('\n')

	return `<d:or>${targetedDays}</d:or>`
}

/**
 *
 * @param {number} [upperBound]
 * @param {number} [lowerBound]
 */
function getTimeBoundariesConstraint(upperBound, lowerBound) {
	const timeBoundariesMetadata = []
	const timeBoundariesLastModified = [metadataNotNull]

	if (upperBound !== undefined) {
		timeBoundariesMetadata.push(`
			<d:lte>
				<d:prop><nc:metadata-photos-original_date_time/></d:prop>
				<d:literal>${upperBound}</d:literal>
			</d:lte>`)
		timeBoundariesLastModified.push(`
			<d:lte>
				<d:prop><d:getlastmodified/></d:prop>
				<d:literal>${upperBound}</d:literal>
			</d:lte>`)
	}
	if (lowerBound !== undefined) {
		timeBoundariesMetadata.push(`
			<d:gt>
				<d:prop><nc:metadata-photos-original_date_time/></d:prop>
				<d:literal>${lowerBound}</d:literal>
			</d:gt>`)
		timeBoundariesLastModified.push(`
			<d:gt>
				<d:prop><d:getlastmodified/></d:prop>
				<d:literal>${lowerBound}</d:literal>
			</d:gt>`)
	}

	return [timeBoundariesMetadata, timeBoundariesLastModified]
}

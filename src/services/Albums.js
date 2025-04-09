/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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

import moment from '@nextcloud/moment'
import { translate as t } from '@nextcloud/l10n'

import defaultClient from '../services/DavClient.js'
import logger from '../services/logger.js'
import DavRequest from '../services/DavRequest.js'
import { genFileInfo } from '../utils/fileUtils.js'

/**
 * @typedef {object} Album
 * @property {string} id - The id of the album.
 * @property {string} name - The name of the album.
 * @property {number} creationDate - The creation date of the album.
 * @property {string} isShared - Whether the current user as shared the album.
 * @property {string} isCollaborative - Whether the album can be edited by other users.
 * @property {number} itemCount - The number of item in the album.
 * @property {number} cover - The cover of the album.
 */

/**
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getDavRequest(extraProps = '') {
	return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					<nc:location />
					<nc:dateRange />
					<nc:collaborators />
					${extraProps}
				</d:prop>
			</d:propfind>`
}

/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album|null>}
 */
export async function fetchAlbum(path, options, extraProps = '', client = defaultClient) {
	try {
		const response = await client.stat(path, {
			data: getDavRequest(extraProps),
			details: true,
			...options,
		})

		logger.debug('[Albums] Fetched an album: ', { data: response.data })

		return formatAlbum(response.data)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return null
		}

		throw error
	}
}

/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album[]>}
 */
export async function fetchAlbums(path, options, extraProps = '', client = defaultClient) {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getDavRequest(extraProps),
			details: true,
			...options,
		})

		logger.debug(`[Albums] Fetched ${response.data.length} albums: `, { data: response.data })

		return response.data
			.filter(album => album.filename !== path)
			.map(formatAlbum)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		throw error
	}
}

/**
 *
 * @param {object} album - An album received from a webdav request.
 * @return {Album}
 */
function formatAlbum(album) {
	// Ensure that we have a proper collaborators array.
	if (album.props.collaborators === '') {
		album.props.collaborators = []
	} else if (typeof album.props.collaborators.collaborator === 'object') {
		if (Array.isArray(album.props.collaborators.collaborator)) {
			album.props.collaborators = album.props.collaborators.collaborator
		} else {
			album.props.collaborators = [album.props.collaborators.collaborator]
		}
	}

	// Extract custom props.
	album = genFileInfo(album)

	// Compute date range label.
	const dateRange = JSON.parse(album.dateRange?.replace(/&quot;/g, '"') ?? '{}')
	if (dateRange.start === null) {
		dateRange.start = moment().unix()
		dateRange.end = moment().unix()
	}
	const dateRangeFormatted = {
		startDate: moment.unix(dateRange.start).format('MMMM YYYY'),
		endDate: moment.unix(dateRange.end).format('MMMM YYYY'),
	}
	if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
		album.date = dateRangeFormatted.startDate
	} else {
		album.date = t('photos', '{startDate} to {endDate}', dateRangeFormatted)
	}

	return album
}

/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Array>}
 */
export async function fetchAlbumContent(path, options, client = defaultClient) {
	try {
		const response = await client.getDirectoryContents(path, {
			data: DavRequest,
			details: true,
			...options,
		})

		const fetchedFiles = response.data
			.map(file => genFileInfo(file))
			.filter(file => file.fileid)

		logger.debug(`[Albums] Fetched ${fetchedFiles.length} new files: `, fetchedFiles)

		return fetchedFiles
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		logger.error('Error fetching album files', { error })
		console.error(error)

		throw error
	}
}

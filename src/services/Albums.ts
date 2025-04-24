/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, ResponseDataDetailed, StatOptions, WebDAVClient } from 'webdav'

import moment from '@nextcloud/moment'
import { translate as t } from '@nextcloud/l10n'
import type { File, Folder } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'

import logger from '../services/logger.js'
import { davClient } from './DavClient.ts'
import { getPropFind } from './DavRequest.ts'
import type { RawCollection } from './collectionFetcher.ts'

type Album = Folder & {
	attributes: {
		creationDate: number // The creation date of the album.
		isShared: string // Whether the current user as shared the album.
		isCollaborative: string // Whether the album can be edited by other users.
		itemCount: number // The number of item in the album.
		cover: number // The cover of the album.
		collaborators: object[] // The list of collaborators.
		date: string // The date of the album.
	}
}

function getDavRequest(extraProps: string = ''): string {
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

export async function fetchAlbum(path: string, options: StatOptions, extraProps: string = '', client: WebDAVClient = davClient): Promise<Album|null> {
	try {
		const response = await client.stat(path, {
			data: getDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<RawCollection>

		logger.debug('[Albums] Fetched an album: ', { data: response.data })

		return formatAlbum(response.data)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return null
		}

		throw error
	}
}

export async function fetchAlbums(path: string, options: StatOptions, extraProps: string = '', client: WebDAVClient = davClient): Promise<Album[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<RawCollection>>

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

function formatAlbum(rawAlbum: RawCollection): Album {
	// Ensure that we have a proper collaborators array.
	if (rawAlbum.props.collaborators === '') {
		rawAlbum.props.collaborators = []
	} else if (typeof rawAlbum.props.collaborators.collaborator === 'object') {
		if (Array.isArray(rawAlbum.props.collaborators.collaborator)) {
			rawAlbum.props.collaborators = rawAlbum.props.collaborators.collaborator
		} else {
			rawAlbum.props.collaborators = [rawAlbum.props.collaborators.collaborator]
		}
	}

	// Compute date range label.
	const dateRange = JSON.parse(rawAlbum.props.dateRange?.replace(/&quot;/g, '"') ?? '{}')
	if (dateRange.start === null) {
		dateRange.start = moment().unix()
		dateRange.end = moment().unix()
	}
	const dateRangeFormatted = {
		startDate: moment.unix(dateRange.start).format('MMMM YYYY'),
		endDate: moment.unix(dateRange.end).format('MMMM YYYY'),
	}
	if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
		rawAlbum.props.date = dateRangeFormatted.startDate
	} else {
		rawAlbum.props.date = t('photos', '{startDate} to {endDate}', dateRangeFormatted)
	}

	return resultToNode(rawAlbum) as Album
}

export async function fetchAlbumContent(path: string, options: StatOptions, client: WebDAVClient = davClient): Promise<File[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getPropFind(),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<FileStat>>

		const fetchedFiles = response.data
			.filter(file => file['fileid'] !== undefined)
			.map(file => resultToNode(file) as File)

		logger.debug(`[Albums] Fetched ${fetchedFiles.length} new files: `, { fetchedFiles })

		return fetchedFiles
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		logger.error('Error fetching album files', { error })
		throw error
	}
}

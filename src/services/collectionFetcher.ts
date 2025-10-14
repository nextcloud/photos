/* eslint-disable @stylistic/no-tabs */
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File, Folder } from '@nextcloud/files'
import type { FileStat, ResponseDataDetailed, StatOptions, WebDAVClient } from 'webdav'

import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { davClient } from './DavClient.ts'
import logger from './logger.js'

export type Collection = Folder & {
	attributes: {
		nbItems: number // The number of item in the collection.
		'last-photo': number // The file id for the cover of the collection.
	}
}

export type RawCollection = FileStat & {
	props: {
		collaborators: '' | { collaborator: object[] | object } | object[]
		dateRange: string
	}
}

/**
 *
 * @param extraProps
 */
function getCollectionDavRequest(extraProps: string[] = []): string {
	return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`
}

/**
 *
 * @param extraProps
 */
function getCollectionFilesDavRequest(extraProps: string[] = []): string {
	return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<d:getcontentlength />
					<d:getcontenttype />
					<d:getetag />
					<d:getlastmodified />
					<d:resourcetype />
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${extraProps.join('\n					')}
				</d:prop>
			</d:propfind>`
}

/**
 *
 * @param path
 * @param options
 * @param extraProps
 * @param client
 */
export async function fetchCollection(path: string, options: StatOptions, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection | null> {
	try {
		const response = await client.stat(path, {
			data: getCollectionDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<RawCollection>

		logger.debug('[Collections] Fetched a collection: ', { data: response.data })

		return formatCollection(response.data, path.split('/').slice(0, -1).join('/'))
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return null
		}

		throw error
	}
}

/**
 *
 * @param path
 * @param options
 * @param extraProps
 * @param client
 */
export async function fetchCollections(path: string, options: StatOptions = {}, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getCollectionDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<RawCollection>>

		logger.debug(`[Collections] Fetched ${response.data.length} collections: `, { data: response.data })

		return response.data
			.filter((collection) => collection.filename !== path)
			.map((rawCollection) => formatCollection(rawCollection, path))
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		throw error
	}
}

/**
 *
 * @param rawCollection
 * @param root
 */
function formatCollection(rawCollection: RawCollection, root: string): Collection {
	// Ensure that we have a proper collaborators array.
	if (rawCollection.props.collaborators === undefined || rawCollection.props.collaborators === '') {
		rawCollection.props.collaborators = []
	} else if (typeof rawCollection.props.collaborators.collaborator === 'object') {
		if (Array.isArray(rawCollection.props.collaborators.collaborator)) {
			rawCollection.props.collaborators = rawCollection.props.collaborators.collaborator
		} else {
			rawCollection.props.collaborators = [rawCollection.props.collaborators.collaborator]
		}
	}

	// Compute date range label.
	const dateRange = JSON.parse(rawCollection.props.dateRange?.replace(/&quot;/g, '"') ?? '{}')
	if (dateRange.start === null) {
		dateRange.start = moment().unix()
		dateRange.end = moment().unix()
	}
	const dateRangeFormatted = {
		startDate: moment.unix(dateRange.start).format('MMMM YYYY'),
		endDate: moment.unix(dateRange.end).format('MMMM YYYY'),
	}
	if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
		rawCollection.props.date = dateRangeFormatted.startDate
	} else {
		rawCollection.props.date = t('photos', '{startDate} to {endDate}', dateRangeFormatted)
	}

	rawCollection.props.filters = JSON.parse((rawCollection.props.filters as string | null) ?? '{}')

	return resultToNode(rawCollection, root) as Collection
}

/**
 *
 * @param path
 * @param options
 * @param extraProps
 * @param client
 */
export async function fetchCollectionFiles(path: string, options: StatOptions, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<File[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getCollectionFilesDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<FileStat>>

		const filesRoot = path.split('/').slice(0, -1).join('/')
		const fetchedFiles = response.data
			.map((file) => resultToNode(file, filesRoot) as File)
			.filter((file) => file.fileid !== undefined)

		logger.debug(`[Collections] Fetched ${fetchedFiles.length} new files: `, { fetchedFiles })

		return fetchedFiles
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		logger.error('Error fetching collection files', { error })
		throw error
	}
}

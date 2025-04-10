/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import moment from '@nextcloud/moment'
import { translate as t } from '@nextcloud/l10n'

import logger from './logger.js'
import { genFileInfo, type PhotoNode } from '../utils/fileUtils.js'
import { davClient } from './DavClient.ts'
import type { FileStat, ResponseDataDetailed, StatOptions, WebDAVClient } from 'webdav'

type Collection = PhotoNode & {
	basename: string // The name of the collection (ex: "Athens").
	filename: string // The filename of the collection (ex: "/photos/admin/places/Athens").
	source: string // The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens").
	nbItems: number // The number of item in the collection.
	lastPhoto: number // The file id for the cover of the collection.
	date: string // The date of the collection.
	collaborators: object[] // The list of collaborators.
}

type CollectionFile = PhotoNode & {
	fileid: string // The id of the file.
	basename: string // The name of the file (ex: "790-IMG_20180906_085724.jpg").
	filename: string // The file name of the file (ex: "/photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
	source: string // The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
	metadataPhotosSize: { // The metadata of the file.
		width: number // The width of the file.
		height: number // The height of the file.
	}
}

export type RawCollaborators = ''|{collaborator: object[]|object}
export type RawCollection = FileStat & { filename: string, props: { collaborators: RawCollaborators }, dateRange: string }

export type IndexedCollections = Record<string, Collection>
export type IndexedCollectionFiles = Record<string, CollectionFile>

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
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`
}

export async function fetchCollection(path: string, options: StatOptions, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection|null> {
	try {
		const response = await client.stat(path, {
			data: getCollectionDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<RawCollection>

		logger.debug('[Collections] Fetched a collection: ', { data: response.data })

		return formatCollection(response.data)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return null
		}

		throw error
	}
}

export async function fetchCollections(path: string, options: StatOptions, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getCollectionDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<RawCollection>>

		logger.debug(`[Collections] Fetched ${response.data.length} collections: `, { data: response.data })

		return response.data
			.filter(collection => collection.filename !== path)
			.map(formatCollection)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return []
		}

		throw error
	}
}

function formatCollection(rawCollection: RawCollection): Collection {
	let collaborators: object[] = []

	// Ensure that we have a proper collaborators array.
	if (rawCollection.props.collaborators === undefined || rawCollection.props.collaborators === '') {
		collaborators = []
	} else if (typeof rawCollection.props.collaborators.collaborator === 'object') {
		if (Array.isArray(rawCollection.props.collaborators.collaborator)) {
			collaborators = rawCollection.props.collaborators.collaborator
		} else {
			collaborators = [rawCollection.props.collaborators.collaborator]
		}
	}

	// Extract custom props.
	const collection = genFileInfo(rawCollection) as Collection
	collection.collaborators = collaborators

	// Compute date range label.
	const dateRange = JSON.parse(rawCollection.dateRange?.replace(/&quot;/g, '"') ?? '{}')
	if (dateRange.start === null) {
		dateRange.start = moment().unix()
		dateRange.end = moment().unix()
	}
	const dateRangeFormatted = {
		startDate: moment.unix(dateRange.start).format('MMMM YYYY'),
		endDate: moment.unix(dateRange.end).format('MMMM YYYY'),
	}
	if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
		collection.date = dateRangeFormatted.startDate
	} else {
		collection.date = t('photos', '{startDate} to {endDate}', dateRangeFormatted)
	}

	return collection
}

export async function fetchCollectionFiles(path: string, options: StatOptions, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<PhotoNode[]> {
	try {
		const response = await client.getDirectoryContents(path, {
			data: getCollectionFilesDavRequest(extraProps),
			details: true,
			...options,
		}) as ResponseDataDetailed<Array<FileStat>>

		const fetchedFiles = response.data
			.map(file => genFileInfo(file))
			.filter(file => file.fileid)

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

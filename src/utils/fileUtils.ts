/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node } from '@nextcloud/files'

import { File, FileType } from '@nextcloud/files'
import { getRemoteURL, getRootPath } from '@nextcloud/files/dav'
import { getLanguage } from '@nextcloud/l10n'
import { basename } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { isNumber } from './numberUtils.js'

/**
 * Sorting comparison function
 *
 * @param fileInfo1
 * @param fileInfo2
 * @param key
 * @param asc
 */
export function sortCompare(fileInfo1: Node, fileInfo2: Node, key: string, asc: boolean = true): number {
	// favorite always first
	if (fileInfo1.attributes.favorite === 1 && fileInfo2.attributes.favorite === 0) {
		return -1
	} else if (fileInfo1.attributes.favorite === 0 && fileInfo2.attributes.favorite === 1) {
		return 1
	}

	// if this is a number, let's sort by integer
	if (isNumber(fileInfo1.attributes[key]) && isNumber(fileInfo2.attributes[key])) {
		return asc
			? Number(fileInfo2.attributes[key]) - Number(fileInfo1.attributes[key])
			: Number(fileInfo1.attributes[key]) - Number(fileInfo2.attributes[key])
	}

	// else we sort by string, so let's sort directories first
	if (fileInfo1.type === FileType.Folder && fileInfo2.type === FileType.File) {
		return asc ? -1 : 1
	} else if (fileInfo1.type === FileType.File && fileInfo2.type === FileType.Folder) {
		return asc ? 1 : -1
	}

	// if this is a date, let's sort by date
	if (isNumber(new Date(fileInfo1.attributes[key]).getTime()) && isNumber(new Date(fileInfo2.attributes[key]).getTime())) {
		return asc
			? new Date(fileInfo2.attributes[key]).getTime() - new Date(fileInfo1.attributes[key]).getTime()
			: new Date(fileInfo1.attributes[key]).getTime() - new Date(fileInfo2.attributes[key]).getTime()
	}

	// finally sort by name
	return asc
		? fileInfo1.attributes[key]?.toString()?.localeCompare(fileInfo2.attributes[key].toString(), getLanguage()) || 1
		: -fileInfo1.attributes[key]?.toString()?.localeCompare(fileInfo2.attributes[key].toString(), getLanguage()) || -1
}

/**
 * Sort nodes by the moment they were last modified, the most recent one first.
 *
 * @param node1 - Node to compare
 * @param node2 - Node to compare it to
 */
export function compareModificationTime(node1: Node, node2: Node): number {
	return (node2.mtime?.getTime() ?? 0) - (node1.mtime?.getTime() ?? 0)
}

/**
 * Get the URL of the photos preview endpoint for a given file.
 *
 * @param file - The file to get a preview of
 * @param size - Maximum width and height of the preview
 */
export function getPreviewUrl(file: Node, size: number): string {
	const decodedEtag = String(file.attributes.etag).replace(/(&quot;|")/g, '')
	return generateUrl(`/apps/photos/api/v1/preview/${file.fileid}?etag=${decodedEtag}&x=${size}&y=${size}`)
}

/**
 * The bits of a photo the actions need, whichever listing it was read from.
 */
export type PhotoTarget = {
	fileid: number
	basename: string
	/** Path of the photo on the files DAV endpoint. */
	davPath: string
	/** Permissions of the current user on the photo. */
	permissions: number
	/** Whether the current user marked the photo as a favorite. */
	favorite: boolean
}

/**
 * @param file - Photo of a DAV listing
 */
export function toPhotoTarget(file: Node): PhotoTarget {
	// Photos of a collection are exposed under the collection itself, with a
	// name prefixed by their id, but only the original file carries the
	// metadata and can be written to.
	const originalFilename = file.attributes['photos-collection-file-original-filename']

	if (originalFilename === undefined) {
		return {
			fileid: file.fileid as number,
			basename: file.basename,
			davPath: `${file.root}${file.path}`,
			permissions: file.permissions,
			favorite: file.attributes.favorite === 1,
		}
	}

	return {
		fileid: file.fileid as number,
		basename: basename(originalFilename),
		davPath: `${getRootPath()}${originalFilename}`,
		permissions: file.permissions,
		favorite: file.attributes.favorite === 1,
	}
}

/**
 * The node the viewer is handed for a photo.
 *
 * A photo of a collection is listed under the collection, and a request on
 * that path acts on the membership rather than on the photo itself. The viewer
 * gets the original file, so that what it deletes, renames or edits is the
 * photo. The preview comes off the endpoint of the app, which also serves the
 * photos of a shared album the account does not hold in its own files.
 *
 * @param file - Photo of a DAV listing
 */
export function toViewerNode(file: File): File {
	const originalFilename = file.attributes['photos-collection-file-original-filename']
	const location = originalFilename === undefined
		? { source: file.source, root: file.root }
		: { source: getRemoteURL() + getRootPath() + originalFilename, root: getRootPath() }

	return new File({
		...location,
		id: file.fileid,
		mtime: file.mtime,
		crtime: file.crtime,
		mime: file.mime,
		size: file.size,
		permissions: file.permissions,
		owner: file.owner,
		attributes: {
			...file.attributes,
			previewUrl: file.attributes.previewUrl ?? getPreviewUrl(file, 4096),
		},
	})
}

export async function getVideoDurationFromUrl(url): Promise<number> {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')
		video.preload = 'metadata'

		const cleanup = () => {
			video.removeAttribute('src')
		}

		video.onloadedmetadata = () => {
			const seconds = video.duration
			cleanup()
			if (!Number.isFinite(seconds)) {
				reject(new Error('Could not read non-finite duration.'))
				return
			}
			resolve(Math.floor(seconds))
		}

		video.onerror = () => {
			cleanup()
			reject(new Error('Failed to load video metadata (auth/CORS/url issue).'))
		}

		video.src = url
	})
}

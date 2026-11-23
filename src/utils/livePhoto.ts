/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node } from '@nextcloud/files'
import type { ResponseDataDetailed, SearchResult } from 'webdav'

import { defaultRootPath, resultToNode } from '@nextcloud/files/dav'
import { davClient } from '../services/DavClient.ts'
import { getDefaultDavProps } from '../services/DavRequest.ts'
import { logger } from '../services/logger.ts'

/**
 * Id of the video holding the motion of a live photo, for the still half of
 * the pair. Both halves carry the id of the other one in their metadata.
 *
 * @param file - File shown on a tile
 */
export function getLivePhotoVideoId(file: Node): number | undefined {
	if (file.mime?.startsWith('video/')) {
		return undefined
	}

	const peerId = Number(file.attributes['metadata-files-live-photo'])
	return Number.isInteger(peerId) && peerId > 0 ? peerId : undefined
}

/**
 * Whether a file is the video holding the motion of a live photo. The still
 * stands for the pair, so the video is left out of the listings the way the
 * files app leaves it out.
 *
 * @param file - File of a listing
 */
export function isLivePhotoVideo(file: Node): boolean {
	return file.mime === 'video/quicktime' && file.attributes['metadata-files-live-photo'] !== undefined
}

/**
 * The SEARCH request finding a file of the current user by its id.
 *
 * @param fileId - Id of the file
 */
export function getFileByIdSearch(fileId: number): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
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
					<d:scope>
						<d:href>${defaultRootPath}</d:href>
						<d:depth>infinity</d:depth>
					</d:scope>
				</d:from>
				<d:where>
					<d:eq>
						<d:prop>
							<oc:fileid/>
						</d:prop>
						<d:literal>${fileId}</d:literal>
					</d:eq>
				</d:where>
				<d:orderby/>
				<d:limit>
					<d:nresults>1</d:nresults>
				</d:limit>
			</d:basicsearch>
		</d:searchrequest>`
}

// The motion of a live photo is hidden from the listings, so it is looked up
// once by its id and remembered for the session.
const videoUrls = new Map<number, Promise<string | null>>()

/**
 * URL the motion of a live photo plays from, or null when the current user
 * cannot reach that video.
 *
 * @param videoId - Id of the video, see getLivePhotoVideoId
 */
export function getLivePhotoVideoUrl(videoId: number): Promise<string | null> {
	let url = videoUrls.get(videoId)
	if (url === undefined) {
		url = fetchVideoUrl(videoId)
		videoUrls.set(videoId, url)
	}
	return url
}

/**
 * Look up the video of a live photo by its id.
 *
 * @param videoId - Id of the video
 */
async function fetchVideoUrl(videoId: number): Promise<string | null> {
	try {
		const response = await davClient.search('/', {
			data: getFileByIdSearch(videoId),
			details: true,
		}) as ResponseDataDetailed<SearchResult>

		const result = response.data.results[0]
		if (result === undefined) {
			return null
		}

		result.filename = result.filename.replace(/^\/remote.php\/dav/, '')
		const video = resultToNode(result)
		return video.mime?.startsWith('video/') ? video.source : null
	} catch (error) {
		logger.error('Failed to look up the video of a live photo', { error, videoId })
		videoUrls.delete(videoId)
		return null
	}
}

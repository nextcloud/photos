/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateRemoteUrl } from '@nextcloud/router'

export type AlbumComment = {
	id: string
	verb: string
	actorId: string
	actorDisplayName: string
	message: string
	creationDateTime: string
}

// Verb of a comment that is an emoji reaction to the album.
export const REACTION_VERB = 'reaction'

const OC_NAMESPACE = 'http://owncloud.org/ns'

// Highest limit accepted by the comments DAV report.
const COMMENTS_LIMIT = 100

/**
 * @param albumId - Id of the album
 */
function getAlbumCommentsUrl(albumId: number): string {
	return generateRemoteUrl(`dav/comments/photos_album/${albumId}`)
}

/**
 * Parse the multistatus answer of the comments report, oldest entry first.
 * The entries are the comments and the reactions of the album, told apart by their verb.
 *
 * @param xml - Body of the report response
 */
export function parseAlbumComments(xml: string): AlbumComment[] {
	const document = new DOMParser().parseFromString(xml, 'application/xml')
	const findElements = (parent: Document | Element, namespace: string, name: string) => [...parent.getElementsByTagName('*')]
		.filter((element) => element.namespaceURI === namespace && element.localName === name)
	const readProp = (response: Element, name: string) => findElements(response, OC_NAMESPACE, name)[0]?.textContent ?? ''

	return findElements(document, 'DAV:', 'response')
		.map((response) => ({
			id: readProp(response, 'id'),
			verb: readProp(response, 'verb'),
			actorId: readProp(response, 'actorId'),
			actorDisplayName: readProp(response, 'actorDisplayName'),
			message: readProp(response, 'message'),
			creationDateTime: readProp(response, 'creationDateTime'),
		}))
		.filter((comment) => comment.id !== '')
		.sort((a, b) => (Date.parse(a.creationDateTime) - Date.parse(b.creationDateTime)) || (Number(a.id) - Number(b.id)))
}

/**
 * Fetch the latest comments and reactions of an album.
 *
 * @param albumId - Id of the album
 */
export async function fetchAlbumComments(albumId: number): Promise<AlbumComment[]> {
	const response = await axios.request<string>({
		method: 'REPORT',
		url: getAlbumCommentsUrl(albumId),
		responseType: 'text',
		data: `<?xml version="1.0"?>
			<oc:filter-comments xmlns:d="DAV:" xmlns:oc="${OC_NAMESPACE}">
				<oc:limit>${COMMENTS_LIMIT}</oc:limit>
				<oc:offset>0</oc:offset>
			</oc:filter-comments>`,
	})

	return parseAlbumComments(response.data)
}

/**
 * @param albumId - Id of the album
 * @param message - Text of the comment
 */
export async function addAlbumComment(albumId: number, message: string): Promise<void> {
	await axios.post(getAlbumCommentsUrl(albumId), {
		actorType: 'users',
		verb: 'comment',
		message,
	})
}

/**
 * React to an album. The server only accepts a single emoji.
 *
 * @param albumId - Id of the album
 * @param emoji - Emoji to react with
 */
export async function addAlbumReaction(albumId: number, emoji: string): Promise<void> {
	await axios.post(getAlbumCommentsUrl(albumId), {
		actorType: 'users',
		verb: REACTION_VERB,
		message: emoji,
	})
}

/**
 * Delete a comment or a reaction, which only its author may do.
 *
 * @param albumId - Id of the album
 * @param commentId - Id of the comment
 */
export async function deleteAlbumComment(albumId: number, commentId: string): Promise<void> {
	await axios.delete(`${getAlbumCommentsUrl(albumId)}/${encodeURIComponent(commentId)}`)
}

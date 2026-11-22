/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { addAlbumComment, deleteAlbumComment, fetchAlbumComments, parseAlbumComments } from './albumComments.ts'

const { axios } = vi.hoisted(() => ({
	axios: {
		request: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	},
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/router', () => ({ generateRemoteUrl: (path: string) => `https://cloud.example.org/remote.php/${path}` }))

/**
 * Build one comment entry of the report answer.
 *
 * @param id - Id of the comment
 * @param message - Text of the comment
 * @param date - Creation date of the comment
 */
function response(id: string, message: string, date: string): string {
	return `<d:response>
		<d:href>/remote.php/dav/comments/photos_album/7/${id}</d:href>
		<d:propstat>
			<d:prop>
				<oc:id>${id}</oc:id>
				<oc:message>${message}</oc:message>
				<oc:actorId>alice</oc:actorId>
				<oc:actorDisplayName>Alice &amp; co</oc:actorDisplayName>
				<oc:creationDateTime>${date}</oc:creationDateTime>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>`
}

/**
 * @param responses - Comment entries of the answer
 */
function multistatus(...responses: string[]): string {
	return `<?xml version="1.0"?>
		<d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">${responses.join('')}</d:multistatus>`
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('parseAlbumComments', () => {
	test('returns the comments oldest first', () => {
		const xml = multistatus(
			response('3', 'Third', 'Mon, 23 Nov 2026 10:00:00 GMT'),
			response('1', 'First', 'Sun, 22 Nov 2026 10:00:00 GMT'),
			response('2', 'Second', 'Sun, 22 Nov 2026 10:00:00 GMT'),
		)

		expect(parseAlbumComments(xml).map((comment) => comment.message)).toEqual(['First', 'Second', 'Third'])
	})

	test('keeps the text as written', () => {
		const [comment] = parseAlbumComments(multistatus(response('1', '1e5 &lt;b&gt;bold&lt;/b&gt;\nline', 'Sun, 22 Nov 2026 10:00:00 GMT')))

		expect(comment).toEqual({
			id: '1',
			actorId: 'alice',
			actorDisplayName: 'Alice & co',
			message: '1e5 <b>bold</b>\nline',
			creationDateTime: 'Sun, 22 Nov 2026 10:00:00 GMT',
		})
	})

	test('returns nothing for an empty answer', () => {
		expect(parseAlbumComments(multistatus())).toEqual([])
	})
})

describe('album comments requests', () => {
	test('fetches the comments of the album', async () => {
		axios.request.mockResolvedValue({ data: multistatus(response('1', 'Hello', 'Sun, 22 Nov 2026 10:00:00 GMT')) })

		const comments = await fetchAlbumComments(7)

		expect(axios.request).toHaveBeenCalledWith(expect.objectContaining({
			method: 'REPORT',
			url: 'https://cloud.example.org/remote.php/dav/comments/photos_album/7',
		}))
		expect(comments.map((comment) => comment.message)).toEqual(['Hello'])
	})

	test('posts a comment as the current user', async () => {
		await addAlbumComment(7, 'Nice!')

		expect(axios.post).toHaveBeenCalledWith(
			'https://cloud.example.org/remote.php/dav/comments/photos_album/7',
			{ actorType: 'users', verb: 'comment', message: 'Nice!' },
		)
	})

	test('deletes a comment', async () => {
		await deleteAlbumComment(7, '12')

		expect(axios.delete).toHaveBeenCalledWith('https://cloud.example.org/remote.php/dav/comments/photos_album/7/12')
	})
})

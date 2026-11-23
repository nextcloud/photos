/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AlbumComment } from '../services/albumComments.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useAlbumComments } from './useAlbumComments.ts'

const { service, showError } = vi.hoisted(() => ({
	service: {
		fetchAlbumComments: vi.fn(),
		addAlbumComment: vi.fn(),
		deleteAlbumComment: vi.fn(),
	},
	showError: vi.fn(),
}))

vi.mock('../services/albumComments.ts', () => service)
vi.mock('@nextcloud/dialogs', () => ({ showError }))
vi.mock('../services/logger.ts', () => ({ logger: { error: vi.fn() } }))

/**
 * @param id - Id of the comment
 */
function comment(id: string): AlbumComment {
	return { id, actorId: 'alice', actorDisplayName: 'Alice', message: `Comment ${id}`, creationDateTime: '' }
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('useAlbumComments', () => {
	test('loads the comments of the album', async () => {
		service.fetchAlbumComments.mockResolvedValue([comment('1'), comment('2')])
		const { comments, loading, fetchComments } = useAlbumComments(7)

		const promise = fetchComments()
		expect(loading.value).toBe(true)
		await promise

		expect(service.fetchAlbumComments).toHaveBeenCalledWith(7)
		expect(comments.value.map(({ id }) => id)).toEqual(['1', '2'])
		expect(loading.value).toBe(false)
	})

	test('shows an error when loading fails', async () => {
		service.fetchAlbumComments.mockRejectedValue(new Error('403'))
		const { comments, fetchComments } = useAlbumComments(7)

		await fetchComments()

		expect(comments.value).toEqual([])
		expect(showError).toHaveBeenCalled()
	})

	test('posts the trimmed comment and reloads the list', async () => {
		service.addAlbumComment.mockResolvedValue(undefined)
		service.fetchAlbumComments.mockResolvedValue([comment('1')])
		const { comments, addComment } = useAlbumComments(() => 7)

		expect(await addComment('  Hello  ')).toBe(true)

		expect(service.addAlbumComment).toHaveBeenCalledWith(7, 'Hello')
		expect(comments.value.map(({ id }) => id)).toEqual(['1'])
	})

	test('does not post empty comments', async () => {
		const { addComment } = useAlbumComments(7)

		expect(await addComment(' \n ')).toBe(false)
		expect(service.addAlbumComment).not.toHaveBeenCalled()
	})

	test('keeps the message when posting fails', async () => {
		service.addAlbumComment.mockRejectedValue(new Error('400'))
		const { posting, addComment } = useAlbumComments(7)

		expect(await addComment('Hello')).toBe(false)
		expect(showError).toHaveBeenCalled()
		expect(posting.value).toBe(false)
		expect(service.fetchAlbumComments).not.toHaveBeenCalled()
	})

	test('removes a deleted comment from the list', async () => {
		service.fetchAlbumComments.mockResolvedValue([comment('1'), comment('2')])
		service.deleteAlbumComment.mockResolvedValue(undefined)
		const { comments, fetchComments, deleteComment } = useAlbumComments(7)
		await fetchComments()

		await deleteComment('1')

		expect(service.deleteAlbumComment).toHaveBeenCalledWith(7, '1')
		expect(comments.value.map(({ id }) => id)).toEqual(['2'])
	})

	test('keeps the comment when deleting fails', async () => {
		service.fetchAlbumComments.mockResolvedValue([comment('1')])
		service.deleteAlbumComment.mockRejectedValue(new Error('403'))
		const { comments, fetchComments, deleteComment } = useAlbumComments(7)
		await fetchComments()

		await deleteComment('1')

		expect(comments.value.map(({ id }) => id)).toEqual(['1'])
		expect(showError).toHaveBeenCalled()
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AlbumComment } from '../services/albumComments.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { groupAlbumReactions, useAlbumComments } from './useAlbumComments.ts'

const { service, showError } = vi.hoisted(() => ({
	service: {
		fetchAlbumComments: vi.fn(),
		addAlbumComment: vi.fn(),
		addAlbumReaction: vi.fn(),
		REACTION_VERB: 'reaction',
		deleteAlbumComment: vi.fn(),
	},
	showError: vi.fn(),
}))

vi.mock('../services/albumComments.ts', () => service)
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/dialogs', () => ({ showError }))
vi.mock('../services/logger.ts', () => ({ logger: { error: vi.fn() } }))

/**
 * @param id - Id of the comment
 */
function comment(id: string): AlbumComment {
	return { id, verb: 'comment', actorId: 'alice', actorDisplayName: 'Alice', message: `Comment ${id}`, creationDateTime: '' }
}

/**
 * @param id - Id of the reaction
 * @param emoji - Emoji of the reaction
 * @param actorId - Id of the person who reacted
 */
function reaction(id: string, emoji: string, actorId = 'alice'): AlbumComment {
	return { id, verb: 'reaction', actorId, actorDisplayName: actorId === 'bob' ? 'Bob' : '', message: emoji, creationDateTime: '' }
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

describe('groupAlbumReactions', () => {
	test('groups the reactions by emoji with the people who reacted', () => {
		const reactions = groupAlbumReactions([reaction('1', '👍', 'bob'), reaction('2', '🎉'), reaction('3', '👍')], 'alice')

		expect(reactions).toEqual([
			{ emoji: '👍', actors: ['Bob', 'alice'], ownIds: ['3'] },
			{ emoji: '🎉', actors: ['alice'], ownIds: ['2'] },
		])
	})

	test('counts a person once per emoji but keeps all their own entries', () => {
		const [group] = groupAlbumReactions([reaction('1', '👍'), reaction('2', '👍'), reaction('3', '👍', 'bob')], 'alice')

		expect(group.actors).toHaveLength(2)
		expect(group.ownIds).toEqual(['1', '2'])
	})
})

describe('album reactions', () => {
	test('keeps reactions out of the comments', async () => {
		service.fetchAlbumComments.mockResolvedValue([comment('1'), reaction('2', '👍', 'bob')])
		const { comments, reactions, fetchComments } = useAlbumComments(7)

		await fetchComments()

		expect(comments.value.map(({ id }) => id)).toEqual(['1'])
		expect(reactions.value).toEqual([{ emoji: '👍', actors: ['Bob'], ownIds: [] }])
	})

	test('adds a reaction the user has not given yet', async () => {
		service.fetchAlbumComments.mockResolvedValueOnce([reaction('2', '👍', 'bob')])
			.mockResolvedValueOnce([reaction('2', '👍', 'bob'), reaction('3', '👍')])
		service.addAlbumReaction.mockResolvedValue(undefined)
		const { reactions, loading, fetchComments, toggleReaction } = useAlbumComments(7)
		await fetchComments()

		const promise = toggleReaction('👍')
		expect(loading.value).toBe(false)
		await promise

		expect(service.addAlbumReaction).toHaveBeenCalledWith(7, '👍')
		expect(service.deleteAlbumComment).not.toHaveBeenCalled()
		expect(reactions.value[0].ownIds).toEqual(['3'])
	})

	test('removes all own entries of a reaction the user has given', async () => {
		service.fetchAlbumComments.mockResolvedValueOnce([reaction('2', '👍', 'bob'), reaction('3', '👍'), reaction('4', '👍')])
			.mockResolvedValueOnce([reaction('2', '👍', 'bob')])
		service.deleteAlbumComment.mockResolvedValue(undefined)
		const { reactions, fetchComments, toggleReaction } = useAlbumComments(7)
		await fetchComments()

		await toggleReaction('👍')

		expect(service.deleteAlbumComment.mock.calls).toEqual([[7, '3'], [7, '4']])
		expect(service.addAlbumReaction).not.toHaveBeenCalled()
		expect(reactions.value).toEqual([{ emoji: '👍', actors: ['Bob'], ownIds: [] }])
	})

	test('shows an error and keeps the reactions when toggling fails', async () => {
		service.fetchAlbumComments.mockResolvedValue([reaction('2', '👍', 'bob')])
		service.addAlbumReaction.mockRejectedValue(new Error('403'))
		const { reactions, reacting, fetchComments, toggleReaction } = useAlbumComments(7)
		await fetchComments()

		await toggleReaction('🎉')

		expect(showError).toHaveBeenCalled()
		expect(reacting.value).toBe(false)
		expect(reactions.value.map(({ emoji }) => emoji)).toEqual(['👍'])
	})
})

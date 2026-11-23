/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter } from 'vue'
import type { AlbumComment } from '../services/albumComments.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { computed, ref, toValue } from 'vue'
import { addAlbumComment, addAlbumReaction, deleteAlbumComment, fetchAlbumComments, REACTION_VERB } from '../services/albumComments.ts'
import { logger } from '../services/logger.ts'

export type AlbumReaction = {
	emoji: string
	// Display names of the people who reacted with the emoji.
	actors: string[]
	// Ids of the current user's own entries, empty when they did not react with the emoji.
	ownIds: string[]
}

/**
 * Group reaction entries by emoji, counting each person once per emoji.
 *
 * @param entries - Reaction entries of the album, oldest first
 * @param currentUserId - Id of the current user
 */
export function groupAlbumReactions(entries: AlbumComment[], currentUserId?: string): AlbumReaction[] {
	const groups = new Map<string, { actors: Map<string, string>, ownIds: string[] }>()
	for (const entry of entries) {
		const group = groups.get(entry.message) ?? { actors: new Map<string, string>(), ownIds: [] as string[] }
		groups.set(entry.message, group)
		group.actors.set(entry.actorId, entry.actorDisplayName || entry.actorId)
		if (entry.actorId === currentUserId) {
			group.ownIds.push(entry.id)
		}
	}
	return [...groups].map(([emoji, { actors, ownIds }]) => ({ emoji, actors: [...actors.values()], ownIds }))
}

/**
 * Comments and emoji reactions of an album, oldest first.
 *
 * @param albumId - Id of the album
 */
export function useAlbumComments(albumId: MaybeRefOrGetter<number>) {
	const comments = ref<AlbumComment[]>([])
	const reactionEntries = ref<AlbumComment[]>([])
	const reactions = computed(() => groupAlbumReactions(reactionEntries.value, getCurrentUser()?.uid))
	const loading = ref(false)
	const posting = ref(false)
	const reacting = ref(false)

	/**
	 * Fetch the entries of the album and split them into comments and reactions.
	 */
	async function refresh(): Promise<void> {
		const entries = await fetchAlbumComments(toValue(albumId))
		comments.value = entries.filter((entry) => entry.verb !== REACTION_VERB)
		reactionEntries.value = entries.filter((entry) => entry.verb === REACTION_VERB)
	}

	/**
	 * Load the comments and reactions of the album.
	 */
	async function fetchComments(): Promise<void> {
		loading.value = true
		try {
			await refresh()
		} catch (error) {
			logger.error('Error while fetching album comments', { error })
			showError(t('photos', 'Failed to load comments'))
		} finally {
			loading.value = false
		}
	}

	/**
	 * @param message - Text of the new comment
	 * @return Whether the comment was posted
	 */
	async function addComment(message: string): Promise<boolean> {
		const text = message.trim()
		if (text === '' || posting.value) {
			return false
		}

		posting.value = true
		try {
			await addAlbumComment(toValue(albumId), text)
		} catch (error) {
			logger.error('Error while posting album comment', { error })
			showError(t('photos', 'Failed to post comment'))
			return false
		} finally {
			posting.value = false
		}

		await fetchComments()
		return true
	}

	/**
	 * @param commentId - Id of the comment to delete
	 */
	async function deleteComment(commentId: string): Promise<void> {
		try {
			await deleteAlbumComment(toValue(albumId), commentId)
			comments.value = comments.value.filter((comment) => comment.id !== commentId)
		} catch (error) {
			logger.error('Error while deleting album comment', { error })
			showError(t('photos', 'Failed to delete comment'))
		}
	}

	/**
	 * Add the current user's reaction to the album, or remove it when they already reacted with the emoji.
	 *
	 * @param emoji - Emoji to react with
	 */
	async function toggleReaction(emoji: string): Promise<void> {
		if (reacting.value) {
			return
		}

		reacting.value = true
		try {
			const id = toValue(albumId)
			const ownIds = reactions.value.find((reaction) => reaction.emoji === emoji)?.ownIds ?? []
			if (ownIds.length > 0) {
				await Promise.all(ownIds.map((ownId) => deleteAlbumComment(id, ownId)))
			} else {
				await addAlbumReaction(id, emoji)
			}
			await refresh()
		} catch (error) {
			logger.error('Error while updating album reaction', { error })
			showError(t('photos', 'Failed to update reaction'))
		} finally {
			reacting.value = false
		}
	}

	return { comments, reactions, loading, posting, reacting, fetchComments, addComment, deleteComment, toggleReaction }
}

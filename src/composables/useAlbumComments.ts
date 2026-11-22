/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRefOrGetter } from 'vue'
import type { AlbumComment } from '../services/albumComments.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { ref, toValue } from 'vue'
import { addAlbumComment, deleteAlbumComment, fetchAlbumComments } from '../services/albumComments.ts'
import { logger } from '../services/logger.ts'

/**
 * Comments of an album, oldest first.
 *
 * @param albumId - Id of the album
 */
export function useAlbumComments(albumId: MaybeRefOrGetter<number>) {
	const comments = ref<AlbumComment[]>([])
	const loading = ref(false)
	const posting = ref(false)

	/**
	 * Load the comments of the album.
	 */
	async function fetchComments(): Promise<void> {
		loading.value = true
		try {
			comments.value = await fetchAlbumComments(toValue(albumId))
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

	return { comments, loading, posting, fetchComments, addComment, deleteComment }
}

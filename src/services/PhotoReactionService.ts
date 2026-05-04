/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export interface ReactionSummary {
	emoji: string
	count: number
	userIds: string[]
	reactedByMe: boolean
}

export interface ReactionsResponse {
	fileId: number
	albumId: number
	reactions: ReactionSummary[]
}

export async function fetchReactions(albumId: number, fileId: number): Promise<ReactionsResponse> {
	const { data } = await axios.get<ReactionsResponse>(generateUrl('/apps/photos/api/v1/albums/{albumId}/files/{fileId}/reactions', { albumId, fileId }))
	return data
}

/**
 * Toggle. Server's PK collision drives add-or-remove; we just
 * relay the boolean back so the caller can update its optimistic
 * state in either direction.
 *
 * @param albumId
 * @param fileId
 * @param emoji
 */
export async function toggleReaction(
	albumId: number,
	fileId: number,
	emoji: string,
): Promise<{ added: boolean }> {
	const { data } = await axios.post<{ added: boolean }>(
		generateUrl('/apps/photos/api/v1/albums/{albumId}/files/{fileId}/reactions', { albumId, fileId }),
		{ emoji },
	)
	return data
}

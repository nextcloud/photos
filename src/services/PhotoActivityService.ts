/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export type ActivityAction = 'add_file' | 'remove_file' | 'react_add' | 'react_remove'

export interface ActivityItem {
	id: number
	albumId: number
	actorId: string
	action: ActivityAction
	targetId: string | null
	targetKind: string | null
	payload: Record<string, unknown> | null
	createdAt: number // unix seconds
}

export async function fetchActivity(albumId: number, limit = 50): Promise<ActivityItem[]> {
	const { data } = await axios.get<{ items: ActivityItem[] }>(
		generateUrl('/apps/photos/api/v1/albums/{albumId}/activity', { albumId }),
		{ params: { limit } },
	)
	return data.items
}

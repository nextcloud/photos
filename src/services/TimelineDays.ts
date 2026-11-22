/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosResponse } from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

export type TimelineMediaType = 'all' | 'photos' | 'videos'

export type TimelineDay = {
	day: string
	count: number
}

/**
 * Fetch the number of photos per day of the user's library, newest day first.
 * Days are UTC calendar days, and only the files of the user's own storage
 * are counted.
 *
 * @param mediaType - Kind of media to count
 * @param signal - Signal aborting the request
 */
export async function fetchTimelineDays(mediaType: TimelineMediaType, signal?: AbortSignal): Promise<TimelineDay[]> {
	const response = await axios.get(generateOcsUrl('apps/photos/api/v1/timeline/days'), {
		params: { mediaType },
		signal,
	}) as AxiosResponse<OCSResponse<TimelineDay[]>>

	return response.data.ocs.data
}

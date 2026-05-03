/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Tracks the photo-index migration progress reported by the
 * `/api/v1/index/status` endpoint. The backend backfill job seeds
 * `oc_photos_index` over many cron ticks; while it runs we want the
 * UI to (a) show a banner so users know their library is being
 * processed and (b) keep using the slow DAV REPORT path because the
 * index isn't authoritative yet. Once `ready` flips to true the
 * polling stops — there's nothing left to watch.
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface IndexStatus {
	ready: boolean
	indexed: number
	total: number
}

const POLL_INTERVAL_MS = 5_000

export default defineStore('indexStatus', () => {
	const ready = ref<boolean | null>(null)
	const indexed = ref(0)
	const total = ref(0)
	const error = ref<string | null>(null)

	let pollHandle: ReturnType<typeof setTimeout> | null = null

	const inProgress = computed(() => ready.value === false)
	const progressPercent = computed(() => {
		if (total.value <= 0) {
			return 0
		}
		return Math.min(100, Math.round((indexed.value / total.value) * 100))
	})

	async function fetchOnce(): Promise<void> {
		try {
			const { data } = await axios.get<IndexStatus>(generateUrl('/apps/photos/api/v1/index/status'))
			ready.value = data.ready
			indexed.value = data.indexed
			total.value = data.total
			error.value = null
		} catch (e) {
			// Endpoint missing on older backends → treat as ready so
			// the banner doesn't appear on instances that don't have
			// the index migration applied yet. This is also what we
			// want during the brief window between frontend deploy
			// and `occ upgrade` having run the migration.
			ready.value = true
			error.value = e instanceof Error ? e.message : String(e)
		}
	}

	function schedulePoll(): void {
		stopPolling()
		if (ready.value === true) {
			return
		}
		pollHandle = setTimeout(async () => {
			await fetchOnce()
			schedulePoll()
		}, POLL_INTERVAL_MS)
	}

	function stopPolling(): void {
		if (pollHandle !== null) {
			clearTimeout(pollHandle)
			pollHandle = null
		}
	}

	/**
	 * Kick off polling. Idempotent — safe to call from multiple
	 * mounted views; we share one timer.
	 */
	async function start(): Promise<void> {
		if (ready.value === null) {
			await fetchOnce()
		}
		schedulePoll()
	}

	function stop(): void {
		stopPolling()
	}

	return {
		ready,
		indexed,
		total,
		error,
		inProgress,
		progressPercent,
		start,
		stop,
		fetchOnce,
	}
})

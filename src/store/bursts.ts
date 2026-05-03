/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Map of leaderFileId → ordered member fileIds. Populated by
 * FilesByMonthMixin after each fetch / reset; consumed by
 * FileComponent (to render the stacked-card decoration + count
 * badge) and by TimelineView (to seed the slideshow with the full
 * stack on click).
 *
 * Stored separately from `state.files.files` so the Vue 3 reactive
 * Proxy doesn't have to walk the (already-large) files map on every
 * stack lookup — most file ids are NOT stack leaders.
 */

import type { BurstStack } from '../utils/burstClustering.ts'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('bursts', () => {
	const stacks = ref<Record<string, BurstStack>>({})

	function setStacks(next: Record<string, BurstStack>): void {
		stacks.value = next
	}

	function clear(): void {
		stacks.value = {}
	}

	function getStack(leaderId: string): BurstStack | undefined {
		return stacks.value[leaderId]
	}

	return { stacks, setStacks, clear, getStack }
})

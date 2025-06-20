/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import filters from '../services/PhotosFilters/index.ts'

export default defineStore('filters', () => {
	const selectedFilters = ref<Record<string, unknown[]>>(filters.reduce((acc, filter) => ({ ...acc, [filter.id]: [] }), {}))

	const filtersQuery = computed(() => {
		return Object.entries(selectedFilters.value)
			.filter(([, values]) => values.length > 0)
			.map(([key, values]) => filters.find((filter) => filter.id === key)?.getQuery(values))
			.join('\n')
	})

	return { selectedFilters, filtersQuery }
})

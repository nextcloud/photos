/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { SmartAlbum } from './userConfig.ts'

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useUserConfigStore } from './userConfig.ts'

/**
 * Whether at least one filter has a selected value.
 *
 * @param filters - Selected values by filter id
 */
export function hasActiveFilters(filters: Record<string, unknown[]>): boolean {
	return Object.values(filters).some((values) => values.length > 0)
}

/**
 * Plain copy of the filters that have a selected value.
 *
 * @param filters - Selected values by filter id, possibly reactive
 */
export function pickActiveFilters(filters: Record<string, unknown[]>): Record<string, unknown[]> {
	const activeFilters = Object.entries(filters).filter(([, values]) => values.length > 0)
	return JSON.parse(JSON.stringify(Object.fromEntries(activeFilters)))
}

/**
 * Short unique enough id, only compared to the ids of the same user.
 */
function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/**
 * Named sets of timeline filters, stored in the user config. Opening one shows
 * the photos currently matching its filters.
 */
export const useSmartAlbumsStore = defineStore('smartAlbums', () => {
	const userConfigStore = useUserConfigStore()

	const smartAlbums = computed(() => userConfigStore.smartAlbums)

	/**
	 * Persist the list, restoring the previous one when the server refuses it.
	 *
	 * @param newSmartAlbums - The full list of smart albums
	 */
	async function saveSmartAlbums(newSmartAlbums: SmartAlbum[]): Promise<void> {
		const previousSmartAlbums = userConfigStore.smartAlbums
		try {
			await userConfigStore.updateUserConfig('smartAlbums', newSmartAlbums)
		} catch (error) {
			userConfigStore.smartAlbums = previousSmartAlbums
			throw error
		}
	}

	/**
	 * @param id - Id of the smart album
	 */
	function getSmartAlbum(id: string): SmartAlbum | undefined {
		return smartAlbums.value.find((smartAlbum) => smartAlbum.id === id)
	}

	/**
	 * @param name - Name of the smart album
	 * @param filters - Selected values by filter id
	 */
	async function createSmartAlbum(name: string, filters: Record<string, unknown[]>): Promise<SmartAlbum> {
		const smartAlbum = { id: generateId(), name: name.trim(), filters: pickActiveFilters(filters) }
		await saveSmartAlbums([...smartAlbums.value, smartAlbum])
		return smartAlbum
	}

	/**
	 * @param id - Id of the smart album
	 * @param name - New name, ignored when blank
	 */
	async function renameSmartAlbum(id: string, name: string): Promise<void> {
		if (name.trim() === '') {
			return
		}

		await saveSmartAlbums(smartAlbums.value.map((smartAlbum) => smartAlbum.id === id
			? { ...smartAlbum, name: name.trim() }
			: smartAlbum))
	}

	/**
	 * @param id - Id of the smart album
	 */
	async function deleteSmartAlbum(id: string): Promise<void> {
		await saveSmartAlbums(smartAlbums.value.filter((smartAlbum) => smartAlbum.id !== id))
	}

	return { smartAlbums, getSmartAlbum, createSmartAlbum, renameSmartAlbum, deleteSmartAlbum }
})

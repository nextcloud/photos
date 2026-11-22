/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { reactive } from 'vue'
import { hasActiveFilters, pickActiveFilters, useSmartAlbumsStore } from './smartAlbums.ts'

const { axios, initialState } = vi.hoisted(() => ({
	axios: { put: vi.fn() },
	initialState: {} as Record<string, string>,
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/event-bus', () => ({ emit: vi.fn() }))
vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback: string) => initialState[key] ?? fallback,
}))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => null }))
vi.mock('@nextcloud/router', () => ({ generateUrl: (url: string) => `/index.php/${url}` }))

const rome = { id: 'rome', name: 'Rome', filters: { places: ['Rome'] } }
const beach = { id: 'beach', name: 'Beach', filters: { name: ['beach'] } }

/**
 * The list of smart albums sent with the last config request.
 */
function lastSavedSmartAlbums(): unknown {
	const [url, { value }] = axios.put.mock.lastCall!
	expect(url).toBe('/index.php/apps/photos/api/v1/config/smartAlbums')
	return JSON.parse(value)
}

describe('smart albums helpers', () => {
	test('hasActiveFilters is true once a filter has a value', () => {
		expect(hasActiveFilters({})).toBe(false)
		expect(hasActiveFilters({ name: [], places: [] })).toBe(false)
		expect(hasActiveFilters({ name: [], places: ['Rome'] })).toBe(true)
	})

	test('pickActiveFilters keeps a plain copy of the filters with values', () => {
		const dateRange = { start: 1, end: 2 }
		const filters = reactive({ name: [], places: ['Rome'], 'date-range': [dateRange] })

		const picked = pickActiveFilters(filters)

		expect(picked).toEqual({ places: ['Rome'], 'date-range': [{ start: 1, end: 2 }] })
		filters.places.push('Paris')
		dateRange.end = 3
		expect(picked).toEqual({ places: ['Rome'], 'date-range': [{ start: 1, end: 2 }] })
	})
})

describe('useSmartAlbumsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
		axios.put.mockResolvedValue({})
		initialState.smartAlbums = JSON.stringify([rome, beach])
	})

	test('lists the smart albums of the initial state', () => {
		const store = useSmartAlbumsStore()

		expect(store.smartAlbums).toEqual([rome, beach])
		expect(store.getSmartAlbum('beach')).toEqual(beach)
		expect(store.getSmartAlbum('unknown')).toBeUndefined()
	})

	test('has no smart album by default', () => {
		delete initialState.smartAlbums

		expect(useSmartAlbumsStore().smartAlbums).toEqual([])
	})

	test('createSmartAlbum appends the active filters under a trimmed name', async () => {
		const store = useSmartAlbumsStore()

		const smartAlbum = await store.createSmartAlbum('  Rome 2024 ', { name: [], places: ['Rome'], 'date-range': [{ start: 1, end: 2 }] })

		expect(smartAlbum).toEqual({
			id: expect.stringMatching(/^[a-z0-9]+$/),
			name: 'Rome 2024',
			filters: { places: ['Rome'], 'date-range': [{ start: 1, end: 2 }] },
		})
		expect(smartAlbum.id).not.toBe(rome.id)
		expect(store.smartAlbums).toEqual([rome, beach, smartAlbum])
		expect(lastSavedSmartAlbums()).toEqual([rome, beach, smartAlbum])
	})

	test('createSmartAlbum gives a different id to each smart album', async () => {
		const store = useSmartAlbumsStore()

		const first = await store.createSmartAlbum('One', { places: ['Rome'] })
		const second = await store.createSmartAlbum('Two', { places: ['Rome'] })

		expect(first.id).not.toBe(second.id)
	})

	test('renameSmartAlbum only renames the given smart album', async () => {
		const store = useSmartAlbumsStore()

		await store.renameSmartAlbum('rome', ' Roma ')

		expect(store.smartAlbums).toEqual([{ ...rome, name: 'Roma' }, beach])
		expect(lastSavedSmartAlbums()).toEqual([{ ...rome, name: 'Roma' }, beach])
	})

	test('renameSmartAlbum ignores a blank name', async () => {
		const store = useSmartAlbumsStore()

		await store.renameSmartAlbum('rome', '   ')

		expect(store.smartAlbums).toEqual([rome, beach])
		expect(axios.put).not.toHaveBeenCalled()
	})

	test('deleteSmartAlbum removes the given smart album', async () => {
		const store = useSmartAlbumsStore()

		await store.deleteSmartAlbum('rome')

		expect(store.smartAlbums).toEqual([beach])
		expect(lastSavedSmartAlbums()).toEqual([beach])
	})

	test('restores the list when saving fails', async () => {
		const store = useSmartAlbumsStore()
		axios.put.mockRejectedValue(new Error('Bad request'))

		await expect(store.deleteSmartAlbum('rome')).rejects.toThrow('Bad request')

		expect(store.smartAlbums).toEqual([rome, beach])
	})
})

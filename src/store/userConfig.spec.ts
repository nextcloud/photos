/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { configChangedEvent, useUserConfigStore } from './userConfig.ts'

const { axios, emit, initialState } = vi.hoisted(() => ({
	axios: { put: vi.fn() },
	emit: vi.fn(),
	initialState: {} as Record<string, string>,
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/event-bus', () => ({ emit }))
vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback: string) => initialState[key] ?? fallback,
}))
// Without an account the store does not stat the photos folder.
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => null }))
vi.mock('@nextcloud/router', () => ({ generateUrl: (url: string) => `/index.php/${url}` }))

describe('useUserConfigStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
		for (const key of Object.keys(initialState)) {
			delete initialState[key]
		}
	})

	test('falls back to the defaults without initial state', () => {
		const store = useUserConfigStore()

		expect(store.croppedLayout).toBe(false)
		expect(store.gridDensity).toBe('medium')
		expect(store.photosSourceFolders).toEqual(['/Photos'])
		expect(store.photosLocation).toBe('')
	})

	test('reads the initial state the server rendered', () => {
		initialState.croppedLayout = 'true'
		initialState.gridDensity = 'large'
		initialState.photosSourceFolders = '["/Photos","/Camera"]'
		initialState.photosLocation = '/Photos'

		const store = useUserConfigStore()

		expect(store.croppedLayout).toBe(true)
		expect(store.gridDensity).toBe('large')
		expect(store.photosSourceFolders).toEqual(['/Photos', '/Camera'])
		expect(store.photosLocation).toBe('/Photos')
	})

	test('ignores a grid density it does not know', () => {
		initialState.gridDensity = 'huge'

		expect(useUserConfigStore().gridDensity).toBe('medium')
	})

	test('updateUserConfig persists a string as is and announces the change', async () => {
		const store = useUserConfigStore()

		await store.updateUserConfig('gridDensity', 'small')

		expect(store.gridDensity).toBe('small')
		expect(axios.put).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/config/gridDensity', { value: 'small' })
		expect(emit).toHaveBeenCalledWith(configChangedEvent, { key: 'gridDensity', value: 'small' })
	})

	test('updateUserConfig serializes anything else', async () => {
		const store = useUserConfigStore()

		await store.updateUserConfig('photosSourceFolders', ['/Photos', '/Camera'])
		await store.updateUserConfig('croppedLayout', true)

		expect(store.photosSourceFolders).toEqual(['/Photos', '/Camera'])
		expect(axios.put).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/config/photosSourceFolders', { value: '["/Photos","/Camera"]' })
		expect(axios.put).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/config/croppedLayout', { value: 'true' })
	})
})

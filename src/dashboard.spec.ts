/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeAll, describe, expect, test, vi } from 'vitest'

const { mountOnThisDay, widgetModule } = vi.hoisted(() => ({
	mountOnThisDay: vi.fn(() => ({ mounted: true })),
	widgetModule: { loaded: false },
}))

vi.mock('./components/Dashboard/mountOnThisDay.ts', () => {
	widgetModule.loaded = true
	return { mountOnThisDay }
})

const register = vi.fn()
// Vitest clears mock calls before each test, so keep the ones made while loading the entry point
let registerCalls: unknown[][] = []

beforeAll(async () => {
	window.OCA = { Dashboard: { register } } as unknown as Window['OCA']
	// The entry point has no exports, it only registers the widget
	await import('./dashboard.ts' as string)
	window.dispatchEvent(new Event('DOMContentLoaded'))
	registerCalls = [...register.mock.calls]
})

describe('dashboard entry point', () => {
	test('registers the widget without loading it', () => {
		expect(registerCalls).toEqual([['photos-onthisday', expect.any(Function)]])
		expect(widgetModule.loaded).toBe(false)
		expect(mountOnThisDay).not.toHaveBeenCalled()
	})

	test('loads and mounts the widget when the dashboard renders it', async () => {
		const el = document.createElement('div')
		const callback = registerCalls[0][1] as (el: HTMLElement) => Promise<void>

		await callback(el)

		expect(widgetModule.loaded).toBe(true)
		expect(mountOnThisDay).toHaveBeenCalledWith(el)
		expect(global.PhotosOnThisDay).toEqual({ mounted: true })
	})
})

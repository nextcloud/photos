/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from 'vitest'
import { useInstallPrompt } from './useInstallPrompt.ts'

test('offers the installation once the browser does, and only once', async () => {
	const { canInstall, install } = useInstallPrompt()
	expect(canInstall.value).toBe(false)

	const prompt = vi.fn()
	const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt })
	window.dispatchEvent(event)

	expect(event.defaultPrevented).toBe(true)
	expect(canInstall.value).toBe(true)

	await install()
	expect(prompt).toHaveBeenCalledOnce()
	expect(canInstall.value).toBe(false)
})

test('withdraws the offer once the app is installed', () => {
	const { canInstall } = useInstallPrompt()
	window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), { prompt: vi.fn() }))
	expect(canInstall.value).toBe(true)

	window.dispatchEvent(new Event('appinstalled'))
	expect(canInstall.value).toBe(false)
})

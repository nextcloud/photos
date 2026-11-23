/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { isAppShellRequest } from './appShell.ts'

/**
 * @param pathname - The path of the request
 * @param request - What differs from a same origin script request
 * @param sameOrigin - Whether the request stays on this server
 */
function matches(pathname: string, request: Partial<Pick<Request, 'method' | 'mode' | 'destination'>> = {}, sameOrigin = true): boolean {
	return isAppShellRequest({
		request: { method: 'GET', mode: 'no-cors', destination: 'script', ...request },
		url: { pathname },
		sameOrigin,
	})
}

describe('isAppShellRequest', () => {
	test('matches the page of the app', () => {
		expect(matches('/index.php/apps/photos/', { mode: 'navigate', destination: 'document' })).toBe(true)
		expect(matches('/apps/photos/favorites', { mode: 'navigate', destination: 'document' })).toBe(true)
	})

	test('leaves public album pages to the network', () => {
		expect(matches('/index.php/apps/photos/public/token', { mode: 'navigate', destination: 'document' })).toBe(false)
	})

	test('matches scripts, styles, fonts and icons', () => {
		expect(matches('/apps/photos/js/photos-main.mjs')).toBe(true)
		expect(matches('/index.php/apps/theming/theme/light.css', { destination: 'style' })).toBe(true)
		expect(matches('/core/fonts/NotoSans-Regular-latin.woff2', { destination: 'font' })).toBe(true)
		expect(matches('/apps/photos/img/app.svg', { destination: 'image' })).toBe(true)
		expect(matches('/index.php/apps/theming/favicon/photos', { destination: 'image' })).toBe(true)
	})

	test('never matches data', () => {
		expect(matches('/ocs/v2.php/apps/photos/api/v1/albums', { mode: 'cors', destination: '' })).toBe(false)
		expect(matches('/index.php/core/preview', { destination: 'image' })).toBe(false)
		expect(matches('/remote.php/dav/files/admin/img/photo.jpg', { destination: 'image' })).toBe(false)
		expect(matches('/remote.php/dav/files/admin/Photos/', { mode: 'navigate', destination: 'document' })).toBe(false)
	})

	test('never matches writes or other servers', () => {
		expect(matches('/apps/photos/js/photos-main.mjs', { method: 'POST' })).toBe(false)
		expect(matches('/apps/photos/js/photos-main.mjs', {}, false)).toBe(false)
	})
})

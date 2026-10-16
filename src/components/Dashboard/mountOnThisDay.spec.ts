/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getActivePinia } from 'pinia'
import { describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import { mountOnThisDay } from './mountOnThisDay.ts'

vi.mock('./DashboardOnThisDay.vue', () => ({
	default: {
		render: () => h('div', { class: 'on-this-day' }),
	},
}))

describe('mountOnThisDay', () => {
	test('mounts the widget with its own id prefix and a pinia store', () => {
		const el = document.createElement('div')
		document.body.appendChild(el)

		const app = mountOnThisDay(el)

		expect(el.querySelector('.on-this-day')).not.toBeNull()
		expect(app.config.idPrefix).toBe('photos-dashboard')
		expect(getActivePinia()).toBeDefined()
		app.unmount()
	})
})

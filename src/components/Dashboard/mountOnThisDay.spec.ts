/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CreateElement } from 'vue'

import { describe, expect, test, vi } from 'vitest'
import Vue from 'vue'
import { mountOnThisDay } from './mountOnThisDay.ts'

vi.mock('./DashboardOnThisDay.vue', () => ({
	default: {
		render(h: CreateElement) {
			return h('div', { class: 'on-this-day' })
		},
	},
}))

describe('mountOnThisDay', () => {
	test('mounts the widget with translations and a pinia store', () => {
		const el = document.createElement('div')
		document.body.appendChild(el)

		const vm = mountOnThisDay(el)

		expect(vm.$el.classList.contains('on-this-day')).toBe(true)
		expect(Vue.prototype.t).toBeTypeOf('function')
		expect(Vue.prototype.n).toBeTypeOf('function')
		expect(vm.$pinia).toBeDefined()
		vm.$destroy()
	})
})

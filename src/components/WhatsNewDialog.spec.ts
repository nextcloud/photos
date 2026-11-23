/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type * as WhatsNew from '../services/whatsNew.ts'

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import WhatsNewDialog from './WhatsNewDialog.vue'

const { axios, initialState, installed } = vi.hoisted(() => ({
	axios: { put: vi.fn() },
	initialState: {} as Record<string, string>,
	installed: { version: '' },
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/event-bus', () => ({ emit: vi.fn() }))
vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback: string) => initialState[key] ?? fallback,
}))
// Without an account the store does not stat the photos folder.
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => null }))
vi.mock('../services/logger.ts', () => ({ logger: { error: vi.fn(), debug: vi.fn() } }))
vi.mock('../services/whatsNew.ts', async (importOriginal) => ({
	...await importOriginal<typeof WhatsNew>(),
	getInstalledVersion: () => installed.version,
	getWhatsNewEntries: () => [
		{ version: '9.1.0', highlights: [{ title: 'Newer', description: 'Newer highlight' }] },
		{ version: '9.0.0', highlights: [{ title: 'Older', description: 'Older highlight' }] },
	],
}))
// The real dialog teleports into the body and traps the focus.
vi.mock('@nextcloud/vue/components/NcDialog', () => ({
	default: defineComponent({
		emits: ['update:open'],
		setup: (props, { slots }) => () => h('div', { role: 'dialog' }, [slots.default?.(), slots.actions?.()]),
	}),
}))

const CONFIG_URL = expect.stringContaining('/apps/photos/api/v1/config/lastSeenVersion')

describe('WhatsNewDialog', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
		axios.put.mockResolvedValue({})
		for (const key of Object.keys(initialState)) {
			delete initialState[key]
		}
		installed.version = '9.1.0'
	})

	test('stays closed for a new user and remembers the installed version', async () => {
		const wrapper = mount(WhatsNewDialog)
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
		expect(axios.put).toHaveBeenCalledWith(CONFIG_URL, { value: '9.1.0' })
	})

	test('stays closed when the installed version was already seen', async () => {
		initialState.lastSeenVersion = '9.1.0'

		const wrapper = mount(WhatsNewDialog)
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
		expect(axios.put).not.toHaveBeenCalled()
	})

	test('shows the releases since the last seen version after an update', async () => {
		initialState.lastSeenVersion = '9.0.0'

		const wrapper = mount(WhatsNewDialog)
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
		expect(wrapper.text()).toContain('Newer highlight')
		expect(wrapper.text()).not.toContain('Older highlight')
		expect(axios.put).not.toHaveBeenCalled()
	})

	test('remembers the installed version once the news were closed', async () => {
		initialState.lastSeenVersion = '9.0.0'
		const wrapper = mount(WhatsNewDialog)

		await wrapper.find('button').trigger('click')
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
		expect(axios.put).toHaveBeenCalledWith(CONFIG_URL, { value: '9.1.0' })
	})

	test('stays closed for the session when the version could not be stored', async () => {
		initialState.lastSeenVersion = '9.0.0'
		axios.put.mockRejectedValue(new Error('offline'))
		const wrapper = mount(WhatsNewDialog)

		await wrapper.find('button').trigger('click')
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
	})

	test('remembers an update that came without highlights silently', async () => {
		installed.version = '9.1.1'
		initialState.lastSeenVersion = '9.1.0'

		const wrapper = mount(WhatsNewDialog)
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
		expect(axios.put).toHaveBeenCalledWith(CONFIG_URL, { value: '9.1.1' })
	})

	test('shows every release when opened on request and closes again', async () => {
		initialState.lastSeenVersion = '9.1.0'
		const wrapper = mount(WhatsNewDialog, { props: { open: true } })

		expect(wrapper.text()).toContain('Newer highlight')
		expect(wrapper.text()).toContain('Older highlight')

		await wrapper.find('button').trigger('click')

		expect(wrapper.emitted('update:open')).toEqual([[false]])
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import WelcomeDialog from './WelcomeDialog.vue'

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
// Without an account the store does not stat the photos folder.
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => null }))
vi.mock('../services/logger.ts', () => ({ logger: { error: vi.fn(), debug: vi.fn() } }))
// The real dialog teleports into the body and traps the focus.
vi.mock('@nextcloud/vue/components/NcDialog', () => ({
	default: defineComponent({
		emits: ['update:open'],
		setup: (props, { slots }) => () => h('div', { role: 'dialog' }, [slots.default?.(), slots.actions?.()]),
	}),
}))

/**
 * Find a button or link of the dialog by its label.
 *
 * @param wrapper - The mounted dialog
 * @param label - Visible label
 */
function action(wrapper: ReturnType<typeof mount>, label: string) {
	const found = wrapper.findAll('button, a').find((element) => element.text() === label)
	if (found === undefined) {
		throw new Error(`No action labelled "${label}"`)
	}
	return found
}

describe('WelcomeDialog', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
		axios.put.mockResolvedValue({})
		for (const key of Object.keys(initialState)) {
			delete initialState[key]
		}
	})

	test('is shown with its three steps to a user who never dismissed it', () => {
		const wrapper = mount(WelcomeDialog)

		expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
		expect(wrapper.findAll('li')).toHaveLength(3)
	})

	test('is not shown once it was dismissed', () => {
		initialState.welcomeDismissed = 'true'

		const wrapper = mount(WelcomeDialog)

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
	})

	test('closes and remembers the dismissal on the server', async () => {
		const wrapper = mount(WelcomeDialog)

		await action(wrapper, 'Get started').trigger('click')
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
		expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/apps/photos/api/v1/config/welcomeDismissed'), { value: 'true' })
		expect(wrapper.emitted('openSettings')).toBeUndefined()
	})

	test('stays closed when the dismissal could not be stored', async () => {
		axios.put.mockRejectedValue(new Error('offline'))
		const wrapper = mount(WelcomeDialog)

		await action(wrapper, 'Get started').trigger('click')
		await flushPromises()

		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
	})

	test('leads to the media folder settings and is dismissed by that', async () => {
		const wrapper = mount(WelcomeDialog)

		await action(wrapper, 'Choose media folders').trigger('click')
		await flushPromises()

		expect(wrapper.emitted('openSettings')).toHaveLength(1)
		expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
	})

	test('links to the upload folder in Files and to the mobile apps', () => {
		initialState.photosLocation = '/My Photos'

		const wrapper = mount(WelcomeDialog)

		expect(action(wrapper, 'Open the upload folder in Files').attributes('href')).toContain('/apps/files/files?dir=%2FMy%20Photos')
		expect(action(wrapper, 'Get the mobile apps').attributes('href')).toBe('https://nextcloud.com/install/#install-clients')
	})
})

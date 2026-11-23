/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import SendToTalkDialog from './SendToTalkDialog.vue'

const { talk, showSuccess } = vi.hoisted(() => ({
	talk: { canSendCaption: true, fetchConversations: vi.fn(), sendToConversation: vi.fn() },
	showSuccess: vi.fn(),
}))

vi.mock('../services/talk.ts', () => talk)
vi.mock('../services/logger.ts', () => ({ logger: { error: vi.fn() } }))
vi.mock('@nextcloud/dialogs', () => ({ showSuccess }))

const photos: PhotoTarget[] = [
	{ fileid: 1, basename: 'a.jpg', davPath: '/files/alice/Photos/a.jpg', permissions: 31, favorite: false },
	{ fileid: 2, basename: 'b.jpg', davPath: '/files/alice/Photos/b.jpg', permissions: 31, favorite: false },
]
const family = { token: 'abc', displayName: 'Family' }

/**
 * Mount the dialog with a bare form in place of the dialog and a button per
 * conversation in place of the select.
 */
async function mountDialog() {
	const wrapper = mount(SendToTalkDialog, {
		props: { photos },
		global: {
			stubs: {
				NcDialog: {
					emits: ['submit'],
					template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>',
				},
				NcSelect: {
					props: ['options'],
					emits: ['update:modelValue'],
					render() {
						return this.options.map((option) => h('button', {
							type: 'button',
							class: 'option',
							onClick: () => this.$emit('update:modelValue', option),
						}, option.displayName))
					},
				},
			},
		},
	})
	await flushPromises()
	return wrapper
}

describe('SendToTalkDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		talk.fetchConversations.mockResolvedValue([family])
	})

	test('cannot send before a conversation is picked', async () => {
		const wrapper = await mountDialog()

		expect(wrapper.find('[data-cy-send-to-talk="send"]').attributes('disabled')).toBeDefined()
		await wrapper.find('form').trigger('submit')

		expect(talk.sendToConversation).not.toHaveBeenCalled()
	})

	test('sends the photos with the message and closes', async () => {
		talk.sendToConversation.mockResolvedValue([])
		const wrapper = await mountDialog()

		await wrapper.find('.option').trigger('click')
		await wrapper.find('textarea').setValue('Look!')
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(talk.sendToConversation).toHaveBeenCalledWith('abc', photos, 'Look!', expect.any(Function))
		expect(showSuccess).toHaveBeenCalledOnce()
		expect(wrapper.emitted('close')).toHaveLength(1)
	})

	test('stays open with the photos that failed and retries only those, without the message', async () => {
		talk.sendToConversation.mockResolvedValueOnce([{ photo: photos[0], message: 'Sharing is not allowed' }])
		const wrapper = await mountDialog()

		await wrapper.find('.option').trigger('click')
		await wrapper.find('textarea').setValue('Look!')
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(wrapper.emitted('close')).toBeUndefined()
		expect(wrapper.text()).toContain('a.jpg – Sharing is not allowed')
		expect(wrapper.find('[data-cy-send-to-talk="send"]').text()).toBe('Retry')

		talk.sendToConversation.mockResolvedValueOnce([])
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(talk.sendToConversation).toHaveBeenLastCalledWith('abc', [photos[0]], '', expect.any(Function))
		expect(wrapper.emitted('close')).toHaveLength(1)
	})

	test('tells when the conversations cannot be loaded', async () => {
		talk.fetchConversations.mockRejectedValue(new Error('Network Error'))
		const wrapper = await mountDialog()

		expect(wrapper.text()).toContain('Failed to load your conversations')
	})
})

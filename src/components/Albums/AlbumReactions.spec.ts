/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import AlbumReactions from './AlbumReactions.vue'

const reactions = [
	{ emoji: '👍', actors: ['Alice', 'Bob'], ownIds: ['3'] },
	{ emoji: '🎉', actors: ['Bob'], ownIds: [] },
]

describe('AlbumReactions', () => {
	test('shows each reaction with its count, who reacted and whether the user did', () => {
		const wrapper = mount(AlbumReactions, { props: { reactions } })
		const [thumbsUp, party] = wrapper.findAll('button[title]')

		expect(thumbsUp.text()).toBe('👍 2')
		expect(thumbsUp.attributes('title')).toBe('Alice, Bob')
		expect(thumbsUp.attributes('aria-pressed')).toBe('true')
		expect(party.text()).toBe('🎉 1')
		expect(party.attributes('aria-pressed')).toBe('false')
	})

	test('asks to toggle a clicked reaction', async () => {
		const wrapper = mount(AlbumReactions, { props: { reactions } })

		await wrapper.findAll('button[title]')[1].trigger('click')

		expect(wrapper.emitted('toggle')).toEqual([['🎉']])
	})
})

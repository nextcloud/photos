/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import AlbumHero from './AlbumHero.vue'

vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({
	default: {
		render: () => h('canvas'),
	},
}))

describe('AlbumHero', () => {
	test('is a decoration loading the cover of the signed in user by default', () => {
		const wrapper = mount(AlbumHero, { props: { coverFileId: 12, title: 'Lisbon' } })

		expect(wrapper.find('.album-hero').attributes('aria-hidden')).toBe('true')
		expect(wrapper.find('h1').exists()).toBe(false)
		expect(wrapper.find('img').attributes('src')).toContain('/apps/photos/api/v1/preview/12?')
	})

	test('is not rendered without a cover', () => {
		const wrapper = mount(AlbumHero, { props: { title: 'Lisbon' } })

		expect(wrapper.find('.album-hero').exists()).toBe(false)
	})

	test('loads the cover from the given address', () => {
		const wrapper = mount(AlbumHero, { props: { coverFileId: 12, coverUrl: '/public/cover', title: 'Lisbon' } })

		expect(wrapper.find('img').attributes('src')).toBe('/public/cover')
	})

	test('is the heading of the page when standalone', () => {
		const wrapper = mount(AlbumHero, { props: { coverFileId: 12, title: 'Lisbon', subtitle: '3 photos', standalone: true } })

		expect(wrapper.find('.album-hero').attributes('aria-hidden')).toBeUndefined()
		expect(wrapper.find('h1').text()).toBe('Lisbon')
		expect(wrapper.text()).toContain('3 photos')
	})

	test('falls back to a plain heading when standalone without a cover', () => {
		const wrapper = mount(AlbumHero, { props: { title: 'Lisbon', standalone: true } })

		expect(wrapper.find('.album-hero').classes()).toContain('album-hero--plain')
		expect(wrapper.find('h1').text()).toBe('Lisbon')
		expect(wrapper.find('img').exists()).toBe(false)
	})
})

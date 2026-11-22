/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import PhotosSearch from './PhotosSearch.vue'

const { push, getCustomRange } = vi.hoisted(() => ({ push: vi.fn(), getCustomRange: vi.fn() }))

vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/vue/functions/dialog', () => ({ spawnDialog: vi.fn() }))
vi.mock('@nextcloud/vue/components/NcIconSvgWrapper', () => ({ default: { render: () => h('span') } }))
vi.mock('@nextcloud/vue/components/NcTextField', () => ({
	default: defineComponent({
		props: { modelValue: { type: String, default: '' } },
		emits: ['update:modelValue'],
		setup(props, { emit }) {
			return () => h('input', {
				value: props.modelValue,
				onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value),
			})
		},
	}),
}))
vi.mock('../../composables/useFetchCollections.ts', () => ({ useFetchCollections: () => ({ fetchCollections: vi.fn() }) }))
vi.mock('../../services/PhotosFilters/index.ts', () => ({
	photosFilters: [{
		getOptions: async () => [
			{ filterId: 'places', label: 'Lisbon', value: 'Lisbon' },
			{ filterId: 'date-range', label: 'Custom…', value: undefined, getValue: getCustomRange },
		],
	}],
}))
vi.mock('./CustomDateRangePickerDialog.vue', () => ({ default: {} }))
vi.mock('./DateRangeOption.vue', () => ({ default: {} }))
vi.mock('./NameOption.vue', () => ({ default: {} }))
vi.mock('./PlaceOption.vue', () => ({ default: {} }))
vi.mock('./TagOption.vue', () => ({ default: {} }))

/**
 * @param selectedFilters - Selected values per filter id
 */
async function mountSearch(selectedFilters: Record<string, unknown[]> = { name: [], places: [], 'date-range': [] }) {
	const wrapper = mount(PhotosSearch, { props: { selectedFilters }, attachTo: document.body })
	const input = wrapper.get('input')
	await input.trigger('focus')
	await flushPromises()
	return { wrapper, input }
}

describe('PhotosSearch', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		push.mockReset()
		getCustomRange.mockReset()
		Element.prototype.scrollIntoView = vi.fn()
	})

	test('exposes the suggestions as a grouped listbox of a combobox', async () => {
		const { wrapper, input } = await mountSearch()

		await input.setValue('lis')

		const listbox = wrapper.get('[role="listbox"]')
		expect(input.attributes('role')).toBe('combobox')
		expect(input.attributes('aria-expanded')).toBe('true')
		expect(input.attributes('aria-controls')).toBe(listbox.attributes('id'))
		expect(wrapper.findAll('[role="group"]').map((group) => wrapper.get(`[id="${group.attributes('aria-labelledby')}"]`).text()))
			.toEqual(['Places', 'File names'])
		expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Lisbon', 'Search file names for "lis"'])
		wrapper.unmount()
	})

	test('applies the file name filter on enter without active suggestion', async () => {
		const { wrapper, input } = await mountSearch()

		await input.setValue(' holidays ')
		await input.trigger('keydown', { key: 'Enter' })
		await flushPromises()

		expect(wrapper.emitted('selectFilter')).toEqual([[expect.objectContaining({ filterId: 'name', value: 'holidays' })]])
		expect((input.element as HTMLInputElement).value).toBe('')
		expect(input.attributes('aria-expanded')).toBe('false')
		wrapper.unmount()
	})

	test('picks the suggestion moved to with the arrow keys', async () => {
		const { wrapper, input } = await mountSearch()

		await input.setValue('lis')
		await input.trigger('keydown', { key: 'ArrowDown' })
		await input.trigger('keydown', { key: 'ArrowDown' })
		await input.trigger('keydown', { key: 'ArrowDown' })

		const [lisbon] = wrapper.findAll('[role="option"]')
		expect(input.attributes('aria-activedescendant')).toBe(lisbon.attributes('id'))
		expect(lisbon.attributes('aria-selected')).toBe('true')

		await input.trigger('keydown', { key: 'Enter' })
		await flushPromises()

		expect(wrapper.emitted('selectFilter')).toEqual([[expect.objectContaining({ filterId: 'places', value: 'Lisbon' })]])
		wrapper.unmount()
	})

	test('asks for the value of options that need one', async () => {
		getCustomRange.mockResolvedValue({ start: 1, end: 2 })
		const { wrapper, input } = await mountSearch()

		await input.setValue('custom')
		await wrapper.get('[role="option"]').trigger('click')
		await flushPromises()

		expect(wrapper.emitted('selectFilter')).toEqual([[expect.objectContaining({ filterId: 'date-range', value: { start: 1, end: 2 } })]])
		wrapper.unmount()
	})

	test('closes the suggestions on escape, then clears the field', async () => {
		const { wrapper, input } = await mountSearch()

		await input.setValue('lis')
		await input.trigger('keydown', { key: 'Escape' })
		expect(input.attributes('aria-expanded')).toBe('false')
		expect((input.element as HTMLInputElement).value).toBe('lis')

		await input.trigger('keydown', { key: 'Escape' })
		expect((input.element as HTMLInputElement).value).toBe('')
		wrapper.unmount()
	})
})

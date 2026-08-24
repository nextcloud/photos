/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Wrapper } from '@vue/test-utils'
import type Vue from 'vue'

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

/**
 * Run a composable inside a component, so the unit tests can exercise the
 * lifecycle hooks it registers. Destroy the wrapper to unmount it.
 *
 * @param composable - The composable call to run in the component setup
 */
export function mountComposable<T>(composable: () => T): { result: T, wrapper: Wrapper<Vue> } {
	let result: T | undefined

	const wrapper = mount(defineComponent({
		setup() {
			result = composable()
			return () => h('div')
		},
	}))

	return { result: result as T, wrapper }
}

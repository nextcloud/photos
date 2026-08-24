/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef } from 'vue'

import { computed, onUnmounted, shallowRef } from 'vue'
import router from '../router/index.ts'

/**
 * Signal to pass to the requests of a component, aborted when the component is
 * destroyed or when the user navigates to another route.
 */
export function useAbortController(): {
	abortSignal: ComputedRef<AbortSignal>
	abortPendingRequest: () => void
} {
	const abortController = shallowRef(new AbortController())

	const abortSignal = computed(() => abortController.value.signal)

	/**
	 * Abort the requests in flight and hand out a fresh signal for the next ones.
	 */
	function abortPendingRequest(): void {
		abortController.value.abort()
		abortController.value = new AbortController()
	}

	const removeNavigationGuard = router.beforeEach((to, from, next) => {
		abortPendingRequest()
		next()
	})

	onUnmounted(() => {
		removeNavigationGuard()
		abortController.value.abort()
	})

	return {
		abortSignal,
		abortPendingRequest,
	}
}

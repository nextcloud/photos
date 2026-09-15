/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef } from 'vue'

import { computed, inject, onBeforeUnmount, shallowRef } from 'vue'
import { matchedRouteKey, onBeforeRouteLeave } from 'vue-router'

/**
 * A signal for the requests of a component, aborted when it is left or unmounted.
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

	onBeforeUnmount(() => abortController.value.abort())

	// The dashboard widget mounts without a router, and the guard needs a
	// matched route to hook into.
	if (inject(matchedRouteKey, null) !== null) {
		onBeforeRouteLeave(abortPendingRequest)
	}

	return {
		abortSignal,
		abortPendingRequest,
	}
}

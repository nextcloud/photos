/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { computed, onUnmounted, ref } from 'vue'
import router from '../router/index.ts'

/**
 *
 */
export default function() {
	const abortController = ref(new AbortController())

	const abortSignal = computed(() => abortController.value.signal)

	/**
	 *
	 */
	function abortPendingRequest() {
		abortController.value.abort()
		abortController.value = new AbortController()
	}

	onUnmounted(() => {
		abortController.value.abort()
	})

	router.beforeEach((from, to, next) => {
		abortPendingRequest()
		next()
	})

	return {
		abortSignal,
		abortPendingRequest,
	}
}

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent, markRaw } from 'vue'

export default defineComponent({
	name: 'AbortControllerMixin',

	data() {
		return {
			// markRaw is required: AbortController uses private class fields
			// (`#aborted`, `#signal`, …) which throw "Cannot access invalid
			// private field" when Vue 3 wraps the instance in a reactive Proxy.
			abortController: markRaw(new AbortController()),
		}
	},

	methods: {
		abortPendingRequest() {
			this.abortController.abort()
			this.abortController = markRaw(new AbortController())
		},
	},

	beforeUnmount() {
		this.abortController.abort()
	},

	beforeRouteLeave(from, to, next) {
		this.abortPendingRequest()
		next()
	},
})

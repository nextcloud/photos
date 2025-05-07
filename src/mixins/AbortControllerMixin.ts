/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AbortControllerMixin',

	data() {
		return {
			abortController: new AbortController(),
		}
	},

	methods: {
		abortPendingRequest() {
			this.abortController.abort()
			this.abortController = new AbortController()
		},
	},

	beforeDestroy() {
		this.abortController.abort()
	},

	beforeRouteLeave(from, to, next) {
		this.abortPendingRequest()
		next()
	},
})

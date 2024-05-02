/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export default {
	name: 'AbortControllerMixin',

	data() {
		return {
			abortController: new AbortController(),
		}
	},

	beforeDestroy() {
		this.abortController.abort()
	},

	beforeRouteLeave(from, to, next) {
		this.abortController.abort()
		this.abortController = new AbortController()
		next()
	},
}

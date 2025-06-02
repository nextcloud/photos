/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommendedVue2 } from '@nextcloud/eslint-config'

export default [
	...recommendedVue2,
	{
		ignores: [
			'js/',
			'l10n/',
		],
	},
	{
		files: ['**/*.vue'],
		rules: {
			// TODO: Fix this
			'vue/no-boolean-default': 'warn',
			'vue/no-unused-refs': 'warn',
		},
	},
]

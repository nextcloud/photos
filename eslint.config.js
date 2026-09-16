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
		rules: {
			'jsdoc/require-jsdoc': 'off',
			'jsdoc/require-param-description': 'off',
		},
	},
	{
		files: ['**/*.vue'],
		rules: {
			// Same as the Vue 3 preset of @nextcloud/eslint-config, which the app moves to next
			'vue/attribute-hyphenation': ['error', 'never'],
		},
	},
]

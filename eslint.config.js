/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommended } from '@nextcloud/eslint-config'
import vuePlugin from 'eslint-plugin-vue'

export default [
	...recommended,
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
		// The photos codebase has historically used kebab-case for custom
		// event names and slot names. Vue 3 supports both styles; we keep the
		// existing convention rather than mass-renaming public API surface.
		files: ['**/*.vue', '**/*.ts', '**/*.js'],
		plugins: { vue: vuePlugin },
		rules: {
			'vue/custom-event-name-casing': ['error', 'kebab-case'],
			'vue/slot-name-casing': ['error', 'kebab-case'],
		},
	},
]

/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommended } from '@nextcloud/eslint-config'

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
]

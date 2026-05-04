/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { dateRangeFilter } from './dateRangeFilter.ts'
import { nameFilter } from './nameFilter.ts'
import { placesFilter } from './placesFilter.ts'

export default [
	nameFilter,
	dateRangeFilter,
	placesFilter,
]

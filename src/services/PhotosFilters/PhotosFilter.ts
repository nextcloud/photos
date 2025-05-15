/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentPublicInstanceConstructor } from 'vue/types/v3-component-public-instance'

export type PhotosFilter = {
	id: string
	component: ComponentPublicInstanceConstructor
	getQuery(value: unknown): string
}

/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComponentPublicInstanceConstructor } from 'vue/types/v3-component-public-instance'

export type FilterOption<T> = {
	filterId: string
	label: string
	value?: T
	imgSrc?: string
	getValue?: () => Promise<T>
}

export type PhotosFilter<T> = {
	id: string
	icon: string
	renderOptionComponent: ComponentPublicInstanceConstructor
	getQuery(value: T[]): string
	getOptions(): Promise<FilterOption<T>[]>
}

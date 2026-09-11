/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Component } from 'vue'

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
	/** Component rendering a selected value, filters without one are not displayed. */
	renderOptionComponent?: Component
	getQuery(value: T[]): string
	getOptions(): Promise<FilterOption<T>[]>
}

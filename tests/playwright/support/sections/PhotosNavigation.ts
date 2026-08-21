/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

import { PhotosFilters } from './PhotosFilters.ts'

/**
 * Names of the app navigation entries, as they are shown to the user.
 *
 * Several of them are prefixes of one another ("Albums" and "Collaborative
 * albums"), which is why every lookup below matches the whole name.
 */
export const NavigationEntry = {
	allMedia: 'All media',
	photos: 'Photos',
	videos: 'Videos',
	albums: 'Albums',
	sharedAlbums: 'Collaborative albums',
	people: 'People',
	folders: 'Folders',
	favorites: 'Favorites',
	onThisDay: 'On this day',
	memories: 'Memories',
	places: 'Places',
	map: 'Map',
} as const

export type NavigationEntryName = (typeof NavigationEntry)[keyof typeof NavigationEntry]

/** The app navigation of the photos app, holding the views and the filters. */
export class PhotosNavigation {
	/** The filters, which only the timeline views offer. */
	public readonly filters: PhotosFilters

	constructor(public readonly page: Page) {
		this.filters = new PhotosFilters(page, this.navigation())
	}

	public navigation(): Locator {
		return this.page.getByRole('navigation', { name: 'Photos' })
	}

	/**
	 * A view of the app navigation.
	 *
	 * @param name - Name of the entry
	 */
	public getEntry(name: NavigationEntryName): Locator {
		return this.navigation().getByRole('link', { name, exact: true })
	}

	/** The field filtering the timeline by file name. */
	public searchInput(): Locator {
		return this.navigation().getByRole('textbox', { name: 'Search by file name' })
	}

	/**
	 * The button emptying the search field, which is only rendered while the field
	 * holds something.
	 */
	public clearSearchButton(): Locator {
		return this.navigation().getByRole('button', { name: 'Clear search' })
	}
}

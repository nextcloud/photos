/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

/**
 * The actions menu of a header, holding what applies to the whole view and — once
 * photos are selected — what applies to the selection.
 *
 * Every view names its trigger "Open actions menu", and the menu takes its
 * accessible name from that trigger. Only one of them exists per view, so it is
 * looked up page wide: the popover is rendered outside of the header it belongs
 * to.
 */
export class ActionsMenu {
	constructor(public readonly page: Page) {}

	public trigger(): Locator {
		return this.page.getByRole('button', { name: 'Open actions menu' })
	}

	public menu(): Locator {
		return this.page.getByRole('menu', { name: 'Open actions menu' })
	}

	public getEntry(name: string | RegExp): Locator {
		return this.menu().getByRole('menuitem', { name })
	}

	/**
	 * The entry marking the selection as favorite. It is replaced by
	 * {@link removeFromFavoritesEntry} once every selected photo is a favorite.
	 */
	public addToFavoritesEntry(): Locator {
		return this.getEntry('Mark selection as favorite')
	}

	public removeFromFavoritesEntry(): Locator {
		return this.getEntry('Remove selection from favorites')
	}

	public downloadSelectionEntry(): Locator {
		return this.getEntry('Download selected files')
	}

	public deleteSelectionEntry(): Locator {
		return this.getEntry('Delete selection')
	}

	public removeFromAlbumEntry(): Locator {
		return this.getEntry('Remove selection from album')
	}

	public editAlbumDetailsEntry(): Locator {
		return this.getEntry('Edit album details')
	}

	public deleteAlbumEntry(): Locator {
		return this.getEntry('Delete album')
	}
}

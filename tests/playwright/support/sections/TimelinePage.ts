/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'
import type { PhotosFilters } from './PhotosFilters.ts'

import { expect } from '@playwright/test'
import { openMenu } from '../utils/menus.ts'
import { waitForTimelineSearch } from '../utils/requests.ts'
import { ActionsMenu } from './ActionsMenu.ts'
import { AlbumFormDialog } from './AlbumFormDialog.ts'
import { AlbumPickerDialog } from './AlbumPickerDialog.ts'
import { MediaGrid } from './MediaGrid.ts'
import { PhotosNavigation } from './PhotosNavigation.ts'
import { SlideshowModal } from './SlideshowModal.ts'

/** The timeline views of the app, which all share one component. */
export const Timeline = {
	allMedia: { path: '', title: 'All your media' },
	photos: { path: 'photos', title: 'Photos' },
	videos: { path: 'videos', title: 'Videos' },
	favorites: { path: 'favorites', title: 'Favorites' },
	onThisDay: { path: 'thisday', title: 'On this day' },
} as const

export type TimelineView = (typeof Timeline)[keyof typeof Timeline]

/** A timeline of photos, i.e. the main view of the app. */
export class TimelinePage {
	/** The photos of the timeline. */
	public readonly grid: MediaGrid

	/** The actions menu, which only appears once photos are selected. */
	public readonly actions: ActionsMenu

	/** The filters of the timeline, which live in the app navigation. */
	public readonly filters: PhotosFilters

	constructor(public readonly page: Page) {
		this.grid = new MediaGrid(page, page.getByRole('main'))
		this.actions = new ActionsMenu(page)
		this.filters = new PhotosNavigation(page).filters
	}

	/**
	 * Open a timeline and wait for its photos to be rendered.
	 *
	 * `goto` resolves on the `load` event, long before the app has mounted and
	 * fetched anything — returning there would let a caller assert on a view that
	 * is not there yet, which is also how a `toHaveCount(0)` passes for the wrong
	 * reason.
	 *
	 * @param view - The timeline to open, the whole library by default
	 */
	public async open(view: TimelineView = Timeline.allMedia): Promise<void> {
		await this.page.goto(`apps/photos/${view.path}`)
		await expect(this.heading(view)).toBeVisible()
		await this.waitForPhotos()
	}

	/**
	 * The heading naming the open timeline.
	 *
	 * @param view - The timeline to name
	 */
	public heading(view: TimelineView = Timeline.allMedia): Locator {
		return this.page.getByRole('heading', { level: 1, name: view.title })
	}

	/**
	 * Wait for the timeline to hold photos.
	 *
	 * Only usable for a library that has any — which every test account is seeded
	 * with — as the empty state is a statement of its own.
	 */
	public async waitForPhotos(): Promise<void> {
		await expect(this.grid.getAllMedia().first()).toBeVisible()
	}

	/** The message shown instead of the grid when nothing matches. */
	public emptyMessage(): Locator {
		return this.page.getByRole('note', { name: 'No photos or videos in here' })
	}

	/**
	 * The button playing the photos of the timeline as a slideshow. It is scoped
	 * to the header, as the slideshow itself carries a button of the same name to
	 * resume playing.
	 */
	public slideshowButton(): Locator {
		return this.page.getByRole('toolbar').getByRole('button', { name: 'Start slideshow' })
	}

	/** Play the photos of the timeline as a slideshow. */
	public async startSlideshow(): Promise<SlideshowModal> {
		await this.slideshowButton().click()

		const slideshow = new SlideshowModal(this.page)
		await expect(slideshow.photo()).toBeVisible()
		return slideshow
	}

	public createAlbumButton(): Locator {
		return this.page.getByRole('button', { name: 'Create new album' })
	}

	/**
	 * The button creating an album out of the filters that are set. The same
	 * button as {@link createAlbumButton}, only renamed while filters are on.
	 */
	public createAlbumFromFiltersButton(): Locator {
		return this.page.getByRole('button', { name: 'Create new album from filters' })
	}

	public addToAlbumButton(): Locator {
		return this.page.getByRole('button', { name: 'Add to album' })
	}

	public unselectAllButton(): Locator {
		return this.page.getByRole('button', { name: 'Unselect all' })
	}

	/** Open the actions menu of the selection. */
	public async openActionsMenu(): Promise<ActionsMenu> {
		await openMenu(this.actions.trigger(), this.actions.menu())
		return this.actions
	}

	/**
	 * Open the form creating an album out of the current view.
	 *
	 * @param options - `fromFilters` when filters are set, as the button is
	 * renamed then
	 * @param options.fromFilters - Whether filters are currently applied
	 */
	public async openAlbumCreationForm({ fromFilters = false } = {}): Promise<AlbumFormDialog> {
		const button = fromFilters ? this.createAlbumFromFiltersButton() : this.createAlbumButton()
		await button.click()

		const form = new AlbumFormDialog(this.page, 'New album')
		await form.waitForOpen()
		return form
	}

	/** Open the picker choosing which album to add the selection to. */
	public async openAlbumPicker(): Promise<AlbumPickerDialog> {
		return await AlbumPickerDialog.open(this.page, () => this.addToAlbumButton().click())
	}

	/**
	 * Run an action that changes which photos the timeline shows and wait for the
	 * new listing.
	 *
	 * The timeline is filled from a `SEARCH`, and the grid keeps showing the
	 * previous result until it comes back — so an assertion right after the action
	 * would be about the state before it.
	 *
	 * @param action - The change to apply
	 */
	public async withRefetch(action: () => Promise<void>): Promise<void> {
		const searched = waitForTimelineSearch(this.page)
		await action()
		await searched
	}

	/**
	 * Filter the timeline by a place.
	 *
	 * @param place - Name of the place
	 */
	public async filterByPlace(place: string): Promise<void> {
		await this.withRefetch(() => this.filters.selectPlace(place))
	}

	/**
	 * Filter the timeline by a date range.
	 *
	 * @param range - The range as the picker formats it, e.g. `2019-01-01 ~ 2019-12-31`
	 */
	public async filterByDateRange(range: string): Promise<void> {
		await this.withRefetch(() => this.filters.selectDateRange(range))
	}

	/**
	 * Drop the filters that are set, one at a time.
	 *
	 * @param count - How many filters to remove
	 */
	public async clearFilters(count: number): Promise<void> {
		for (let removed = 0; removed < count; removed++) {
			await this.withRefetch(() => this.filters.removeFirstFilter())
		}
	}

	/**
	 * Mark the selected photos as favorite and wait for the server to have stored
	 * it, then drop the selection.
	 *
	 * @param names - Names of the selected photo files
	 */
	public async favoriteSelection(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()
		await this.withFavoriteUpdates(names.length, () => menu.addToFavoritesEntry().click())
		await this.grid.deselect(...names)
	}

	/**
	 * Remove the selected photos from the favorites and wait for the server to
	 * have stored it, then drop the selection.
	 *
	 * @param names - Names of the selected photo files
	 */
	public async unfavoriteSelection(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()
		await this.withFavoriteUpdates(names.length, () => menu.removeFromFavoritesEntry().click())
		await this.grid.deselect(...names)
	}

	/**
	 * Await the favorite state of every photo of a selection to have been written.
	 *
	 * The app marks the tiles optimistically and only rolls back on failure, so
	 * without awaiting the requests a following reload could read the old state.
	 *
	 * @param photoCount - Number of photos in the selection
	 * @param action - The action triggering the updates
	 */
	private async withFavoriteUpdates(photoCount: number, action: () => Promise<void>): Promise<void> {
		const updates = Array.from({ length: photoCount }, () => this.page.waitForResponse((response) => response.request().method() === 'PROPPATCH'))
		await action()
		await Promise.all(updates)
	}

	/**
	 * Move the selected photos to the trash and wait for them to be gone.
	 *
	 * @param names - Names of the selected photo files
	 */
	public async deleteSelection(names: string[]): Promise<void> {
		const menu = await this.openActionsMenu()

		const deletions = names.map(() => this.page.waitForResponse((response) => response.request().method() === 'DELETE'))
		await menu.deleteSelectionEntry().click()
		await Promise.all(deletions)

		for (const name of names) {
			await expect(this.grid.getMedia(name)).toHaveCount(0)
		}
	}

	/**
	 * Download the selected photos through the actions menu and return the name
	 * the browser was offered for the download.
	 *
	 * The selection is dropped by the app itself as part of the download, so there
	 * is nothing to clean up afterwards.
	 */
	public async downloadSelection(): Promise<string> {
		const menu = await this.openActionsMenu()

		const download = this.page.waitForEvent('download')
		await menu.downloadSelectionEntry().click()

		return (await download).suggestedFilename()
	}
}

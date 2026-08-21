/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Page } from '@playwright/test'

import { AlbumPage } from './AlbumPage.ts'
import { AlbumsPage } from './AlbumsPage.ts'
import { FacePage } from './FacePage.ts'
import { FacesPage } from './FacesPage.ts'
import { FoldersPage } from './FoldersPage.ts'
import { MapPage } from './MapPage.ts'
import { MemoriesPage } from './MemoriesPage.ts'
import { PhotosNavigation } from './PhotosNavigation.ts'
import { PlacesPage } from './PlacesPage.ts'
import { PublicAlbumPage } from './PublicAlbumPage.ts'
import { SharedAlbumPage } from './SharedAlbumPage.ts'
import { SharedAlbumsPage } from './SharedAlbumsPage.ts'
import { TimelinePage } from './TimelinePage.ts'

/**
 * The photos app of one browser session, gathering the page objects of its views.
 *
 * Several of the tests are about what two or three accounts see of the same
 * album, so each of them drives its own page — bundling the views per page is
 * what keeps `alice.app.albums` and `bob.app.sharedAlbums` apart without every
 * fixture having to be declared three times over.
 */
export class PhotosApp {
	public readonly navigation: PhotosNavigation
	public readonly timeline: TimelinePage
	public readonly albums: AlbumsPage
	public readonly album: AlbumPage
	public readonly sharedAlbums: SharedAlbumsPage
	public readonly sharedAlbum: SharedAlbumPage
	public readonly publicAlbum: PublicAlbumPage
	public readonly places: PlacesPage
	public readonly map: MapPage
	public readonly memories: MemoriesPage
	public readonly folders: FoldersPage
	public readonly faces: FacesPage
	public readonly face: FacePage

	constructor(public readonly page: Page) {
		this.navigation = new PhotosNavigation(page)
		this.timeline = new TimelinePage(page)
		this.albums = new AlbumsPage(page)
		this.album = new AlbumPage(page)
		this.sharedAlbums = new SharedAlbumsPage(page)
		this.sharedAlbum = new SharedAlbumPage(page)
		this.publicAlbum = new PublicAlbumPage(page)
		this.places = new PlacesPage(page)
		this.map = new MapPage(page)
		this.memories = new MemoriesPage(page)
		this.folders = new FoldersPage(page)
		this.faces = new FacesPage(page)
		this.face = new FacePage(page)
	}
}

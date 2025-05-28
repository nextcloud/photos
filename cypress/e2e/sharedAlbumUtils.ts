/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { navigateToCollection, selectMedia } from './photosUtils.ts'

/**
 *
 * @param albumName
 */
export function removeSharedAlbums(albumName: string) {
	navigateToCollection('sharedalbums', albumName)
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
}

/**
 *
 * @param albumName
 * @param itemsIndex
 */
export function addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '/remote.php/dav/' }).as('search')
	cy.contains('Add').click()
	cy.wait('@search')
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '/remote.php/dav/files/*/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

/**
 *
 * @param albumName
 * @param itemsIndex
 */
export function addFilesToSharedAlbumFromAlbum(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '/remote.php/dav/' }).as('search')
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.wait('@search')
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '/remote.php/dav/files/*/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

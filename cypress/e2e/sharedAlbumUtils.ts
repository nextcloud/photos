/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { selectMedia } from "./photosUtils"

export function goToSharedAlbum(albumName: string) {
	cy.intercept({ times: 1, method: 'PROPFIND', url: '**/dav/photos/**/sharedalbums' }).as('propFindSharedAlbums')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFindSharedAlbumContent')
	cy.get('.app-navigation__list').contains('Collaborative albums').click()
	cy.wait('@propFindSharedAlbums')
	cy.get('ul.collections__list').contains(albumName).click()
	cy.wait('@propFindSharedAlbumContent')
}

export function removeSharedAlbums() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
}

export function addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '**/dav/' }).as('search')
	cy.contains('Add').click()
	cy.wait('@search')
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '**/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

export function addFilesToSharedAlbumFromAlbum(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '**/dav/' }).as('search')
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.wait('@search')
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '**/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

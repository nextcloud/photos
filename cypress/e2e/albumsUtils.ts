/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { navigateToCollection, navigateToCollections, selectMedia } from './photosUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

export function createAnAlbumFromTimeline(albumName: string) {
	navigateToTimeline('all-media')
	cy.get('[data-cy-header-action="create-album"]').click()
	cy.get('form [name="name"]').type(albumName)
	cy.intercept({ times: 1, method: 'MKCOL', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('mkcol')
	cy.intercept({ times: 1, method: 'PROPPATCH', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propPatch')
	cy.intercept({ times: 2, method: 'PROPFIND', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propFind')
	cy.contains('Create album').click()
	cy.wait('@mkcol')
	cy.wait('@propPatch')
	cy.wait('@propFind')
}

export function createAnAlbumFromAlbums(albumName: string) {
	navigateToCollections('albums')
	cy.contains('New album').click()
	cy.get('form [name="name"]').type(albumName)
	cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propFind')
	cy.contains('Create album').click()
	cy.wait('@propFind')
}

export function deleteAnAlbumFromAlbumContent(albumName: string) {
	navigateToCollection('albums', albumName)
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
	cy.contains(`Are you sure you want to delete ${albumName}? This action cannot be undone.`)
		.parentsUntil('.modal')
		.contains('Delete')
		.click()
}

export function addFilesToAlbumFromTimeline(albumName: string) {
	navigateToTimeline('all-media')
	cy.intercept({ times: 1, method: 'COPY', url: '/remote.php/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photos/*/albums/' }).as('propFindAlbums')
	cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photos/*/sharedalbums/' }).as('propFindSharedAlbums')
	cy.contains('Add to album').click()
	cy.wait('@propFindAlbums')
	cy.wait('@propFindSharedAlbums')
	cy.get('.album-picker ul').contains(albumName).click()
	cy.wait('@copy')
}

/**
 *
 * @param albumName
 * @param itemsIndex
 */
export function addFilesToAlbumFromAlbum(albumName: string, itemsIndex: number[]) {
	navigateToCollection('albums', albumName)
	cy.intercept({ times: 1, method: 'SEARCH', url: '/remote.php/dav/' }).as('search')
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.wait('@search')
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '/remote.php/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

/**
 *
 * @param albumName
 * @param itemsIndex
 */
export function addFilesToAlbumFromAlbumFromHeader(albumName: string, itemsIndex: number[]) {
	navigateToCollection('albums', albumName)
	cy.contains('Add photos to this album').click()
	cy.get('.photos-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})

	cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@propFind')
}

/**
 *
 * @param collectionId
 * @param albumName
 */
export function removeSelectionFromCollection(collectionId: string, albumName: string) {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.intercept({ times: 1, method: 'DELETE', url: `/remote.php/dav/photos/*/${collectionId}/${encodeURIComponent(albumName)}/*` }).as('deleteFromAlbum')
	cy.contains('Remove selection from album').click()
	cy.wait('@deleteFromAlbum')
}

/**
 *
 * @param collaborators
 */
export function addCollaborators(collaborators: string[]) {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator: string) => {
		cy.get('#sharing-search-input').type(collaborator)
		cy.contains(collaborator).click()
	})
	cy.contains('Save').click()
}

/**
 *
 * @param collaborators
 */
export function removeCollaborators(collaborators: string[]) {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator: string) => {
		cy.get('.manage-collaborators')
			.within(() => {
				cy.contains(collaborator)
					.parentsUntil('ul')
					.get(`[aria-label="Deselect ${collaborator}"]`)
					.click()
			})
	})
	cy.contains('Save').click()
}

/**
 *
 */
export function createPublicShare() {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/photos/*/albums/*' }).as('patchCall')
	cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photos/*/albums/*' }).as('propFind')
	cy.get('[aria-label="Create public link share"]').click()
	cy.wait('@patchCall')
	cy.wait('@propFind')

	return cy.get('[aria-label="Copy the public link"]')
		.invoke('attr', 'title') as Cypress.Chainable<string>
}

/**
 *
 */
export function deletePublicShare() {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	cy.get('[aria-label="Delete the public link"]').click()
}

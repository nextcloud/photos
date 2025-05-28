/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import {
	addFilesToAlbumFromAlbum,
	addFilesToAlbumFromAlbumFromHeader,
	createAnAlbumFromAlbums,
	removeSelectionFromCollection,
} from './albumsUtils.ts'
import {
	deleteSelection,
	navigateToCollection,
	navigateToCollections,
	selectAndFavorite,
	selectAndUnfavorite,
	selectMedia,
	setupPhotosTests,
	unselectMedia,
} from './photosUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage albums', () => {
	const albumName = 'albums_test'

	beforeEach(function() {
		setupPhotosTests()

		navigateToCollections('albums')
		createAnAlbumFromAlbums(albumName)
		addFilesToAlbumFromAlbum(albumName, [0, 1, 2])
	})

	it('Create an album, populate it and delete it', () => {
		cy.get('[data-test="media"]').should('have.length', 3)
	})

	it('Remove a file to an album from an album content view', () => {
		navigateToCollection('albums', albumName)
		selectMedia([0])
		removeSelectionFromCollection('albums', albumName)
	})

	it('Remove multiple files to an album from an album content view', () => {
		navigateToCollection('albums', albumName)
		selectMedia([0, 1])
		removeSelectionFromCollection('albums', albumName)
	})

	it('Favorite a file from an album content view', () => {
		navigateToCollection('albums', albumName)
		selectAndFavorite([0])
		cy.get('[data-test="media"]').eq(0).find('[aria-label="Favorite"]')
		selectAndUnfavorite([0])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	it('Favorite multiple files from an album content view', () => {
		navigateToCollection('albums', albumName)
		selectAndFavorite([1, 2])
		cy.get('[data-test="media"]').eq(1).find('[aria-label="Favorite"]')
		cy.get('[data-test="media"]').eq(2).find('[aria-label="Favorite"]')
		selectAndUnfavorite([1, 2])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	xit('Download a file from an album content view', () => {
		selectMedia([0])
		// downloadSelection()
		unselectMedia([0])
	})

	xit('Download multiple files from an album content view', () => {
		selectMedia([1, 2])
		// downloadSelection()
		unselectMedia([1, 2])
	})

	xit('Download all files from an album content view', () => {
		selectMedia([1, 2])
		// downloadSelection()
		unselectMedia([1, 2])
	})

	it('Edit an album\'s name', () => {
		navigateToCollection('albums', albumName)
		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="name"]').clear()
		cy.get('form [name="name"]').type('New name')
		cy.contains('Save').click()

		cy.contains('New name')

		cy.reload()

		cy.contains('New name')

		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="name"]').clear()
		cy.get('form [name="name"]').type('albums_test')
		cy.contains('Save').click()
	})

	it('Edit an album\'s location', () => {
		navigateToCollection('albums', albumName)
		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="location"]').clear()
		cy.get('form [name="location"]').type('New location')
		cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/photos/*/albums/*' }).as('propPatchAlbum')
		cy.contains('Save').click()
		cy.wait('@propPatchAlbum')

		cy.contains('New location')

		cy.reload()

		cy.contains('New location')

		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="location"]').clear()
		cy.contains('Save').click()
	})

	it('Delete a file that was added to an album', () => {
		addFilesToAlbumFromAlbumFromHeader('albums_test', [3])
		cy.get('[data-test="media"]').should('have.length', 4)
		cy.visit('/apps/photos')
		selectMedia([3])
		deleteSelection()
		navigateToCollection('albums', 'albums_test')
		cy.get('[data-test="media"]').should('have.length', 3)
	})
})

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import {
	addFilesToAlbumFromAlbum,
	addFilesToAlbumFromAlbumFromHeader,
	createAnAlbumFromAlbums,
	goToAlbum,
	removeSelectionFromAlbum,
} from './albumsUtils'
import {
	deleteSelection,
	favoriteSelection,
	mkdir,
	selectMedia,
	unfavoriteSelection,
	unselectMedia,
	uploadTestMedia,
} from './photosUtils'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage albums', () => {
	let user = null

	beforeEach(function () {
		cy.createRandomUser()
			.then(_user => {
				user = _user
				mkdir(user, '/Photos')
				uploadTestMedia(user)
				cy.login(user)
			})
		cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
		createAnAlbumFromAlbums('albums_test')
		addFilesToAlbumFromAlbum('albums_test', [0, 1, 2])
	})

	it('Create an album, populate it and delete it', () => {
		cy.get('[data-test="media"]').should('have.length', 3)
	})

	it('Remove a file to an album from an album content view', () => {
		selectMedia([0])
		removeSelectionFromAlbum()
	})

	it('Remove multiple files to an album from an album content view', () => {
		selectMedia([0, 1])
		removeSelectionFromAlbum()
	})

	it('Favorite a file from an album content view', () => {
		selectMedia([0])
		favoriteSelection()
		cy.get('[data-test="media"]').eq(0).find('[aria-label="Favorite"]')
		unfavoriteSelection()
		unselectMedia([0])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	it('Favorite multiple files from an album content view', () => {
		selectMedia([1, 2])
		favoriteSelection()
		cy.get('[data-test="media"]').eq(1).find('[aria-label="Favorite"]')
		cy.get('[data-test="media"]').eq(2).find('[aria-label="Favorite"]')
		unfavoriteSelection()
		unselectMedia([1, 2])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	// it('Download a file from an album content view', () => {
	// 	selectMedia([0])
	// 	downloadSelection()
	// 	unselectMedia([0])
	// })

	// it('Download multiple files from an album content view', () => {
	// 	selectMedia([1, 2])
	// 	downloadSelection()
	// 	unselectMedia([1, 2])
	// })

	// it('Download all files from an album content view', () => {
	// 	selectMedia([1, 2])
	// 	downloadSelection()
	// 	unselectMedia([1, 2])
	// })

	it('Edit an album\'s name', () => {
		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="name"]').clear().type('New name')
		cy.contains('Save').click()

		cy.contains('New name')

		cy.reload()

		cy.contains('New name')

		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="name"]').clear().type('albums_test')
		cy.contains('Save').click()
	})

	it('Edit an album\'s location', () => {
		cy.get('[aria-label="Open actions menu"]').click()
		cy.contains('Edit album details').click()
		cy.get('form [name="location"]').clear().type('New location')
		cy.contains('Save').click()

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
		goToAlbum('albums_test')
		cy.get('[data-test="media"]').should('have.length', 3)
	})
})

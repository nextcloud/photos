/**
 * @copyright Copyright (c) 2022 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
		goToAlbum('albums_test')
		cy.get('[data-test="media"]').should('have.length', 3)
	})
})

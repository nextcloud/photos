
import { randHash } from '../utils'
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
import { User } from '@nextcloud/cypress'
import {
	addCollaborators,
	addFilesToAlbumFromAlbum,
	createAnAlbumFromAlbums,
	goToAlbum,
	removeCollaborators,
	removeSelectionFromAlbum,
} from './albumsUtils'
import {
	downloadAllFiles,
	downloadSelection,
	goToSharedAlbum,
	removeSharedAlbums,
	selectMedia,
	uploadTestMedia,
} from './photosUtils'

import { randHash } from '../utils'

const alice = new User(`alice_${randHash()}`)
const bob = new User(`bob_${randHash()}`)
const charlie = new User(`charlie_${randHash()}`)

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage shared albums', () => {
	before(() => {
		cy.createUser(alice)
		cy.createUser(bob).then(() => {
			uploadTestMedia(bob)
		})
		cy.createUser(charlie)

	})

	context('Adding and removing files in a shared album', () => {
		before(() => {
			cy.login(alice)
			cy.visit('apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test1')
			addCollaborators([bob.userId])
		})

		it('Add and remove a file to a shared album from a shared album', () => {
			cy.login(bob)
			cy.visit('apps/photos/albums')
			goToSharedAlbum('shared_album_test1')
			cy.get('[data-test="media"]').should('have.length', 0)
			addFilesToAlbumFromAlbum('shared_album_test1', [0])
			cy.get('[data-test="media"]').should('have.length', 1)
			selectMedia([0])
			removeSelectionFromAlbum()
			cy.get('[data-test="media"]').should('have.length', 0)
		})

		it('Add and remove multiple files to a shared album from a shared album', () => {
			goToSharedAlbum('shared_album_test1')
			cy.get('[data-test="media"]').should('have.length', 0)
			addFilesToAlbumFromAlbum('shared_album_test1', [1, 2])
			cy.get('[data-test="media"]').should('have.length', 2)
			selectMedia([0, 1])
			removeSelectionFromAlbum()
			cy.get('[data-test="media"]').should('have.length', 0)
		})
	})

	context('Download files from a shared album', () => {
		before(() => {
			cy.login(alice)
			cy.visit('apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test2')
			addCollaborators([bob.userId])

			cy.login(bob)
			cy.visit('apps/photos/sharedalbums')
			goToSharedAlbum('shared_album_test2')
			addFilesToAlbumFromAlbum('shared_album_test2', [0, 1, 2])
		})

		xit('Download a file from a shared album', () => {
			goToSharedAlbum('shared_album_test2')
			selectMedia([0])
			downloadSelection()
			selectMedia([0])
		})

		xit('Download multiple files from a shared album', () => {
			goToSharedAlbum('shared_album_test2')
			selectMedia([1, 2])
			downloadSelection()
			selectMedia([1, 2])
		})

		xit('Download all files from a shared album', () => {
			goToSharedAlbum('shared_album_test2')
			downloadAllFiles()
		})
	})

	context('Delete a received shared album', () => {
		before(() => {
			cy.login(alice)
			cy.visit('apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test3')
			addCollaborators([bob.userId])
		})

		it('Remove shared album', () => {
			cy.login(bob)
			cy.visit('apps/photos/albums')
			goToSharedAlbum('shared_album_test3')
			removeSharedAlbums()
		})
	})

	context('Remove a collaborator from an album', () => {
		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test4')
			addCollaborators([bob.userId])
		})

		it('Remove collaborator from an album', () => {
			cy.login(bob)
			cy.visit('apps/photos/sharedalbums')
			cy.get(`[data-test="shared_album_test4 (${alice.userId})"]`).should('have.length', 1)

			cy.login(alice)
			cy.visit('/apps/photos')
			goToAlbum('shared_album_test4')
			removeCollaborators([bob.userId])

			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get('body')
				.should('not.contain', `shared_album_test4 (${alice.userId})`)
		})
	})

	context('Two shared albums with the same name', () => {
		before(() => {
			cy.login(alice)
			cy.visit('apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test5')
			addCollaborators([bob.userId])

			cy.login(charlie)
			cy.visit('apps/photos/albums')
			createAnAlbumFromAlbums('shared_album_test5')
			addCollaborators([bob.userId])
		})

		it('It should display two shared albums', () => {
			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get(`[data-test="shared_album_test5 (${alice.userId})"]`).should('have.length', 1)
			cy.get(`[data-test="shared_album_test5 (${charlie.userId})"]`).should('have.length', 1)
		})
	})
})

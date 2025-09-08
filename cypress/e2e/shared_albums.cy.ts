/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { User } from '@nextcloud/cypress'

import {
	addCollaborators,
	addFilesToAlbumFromAlbum,
	createAnAlbumFromAlbums,
	createPublicShare,
	deletePublicShare,
	removeCollaborators,
	removeSelectionFromCollection,
} from './albumsUtils.ts'
import {
	deleteSelection,
	downloadAllFiles,
	downloadSelection,
	mkdir,
	navigateToCollection,
	selectMedia,
	setupPhotosTests,
	uploadTestMedia,
} from './photosUtils.ts'
import {
	addFilesToSharedAlbumFromAlbum,
	addFilesToSharedAlbumFromSharedAlbumFromHeader,
	removeSharedAlbums,
} from './sharedAlbumUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

let alice: User
let bob: User
let charlie: User

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage shared albums', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
				bob = setupInfo.bob
				charlie = setupInfo.charlie
			})
	})

	context('Adding and removing files in a shared album', () => {
		const albumName = 'shared_album_test1'

		before(() => {
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId])
		})

		beforeEach(() => {
			cy.login(bob)
			cy.visit('/apps/photos')
		})

		it('Add and remove a file to a shared album from a shared album', () => {
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 0)
			addFilesToSharedAlbumFromAlbum(albumName, [0])
			cy.get('[data-test="media"]').should('have.length', 1)
			selectMedia([0])
			removeSelectionFromCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 0)
		})

		it('Add and remove multiple files to a shared album from a shared album', () => {
			navigateToTimeline('all-media') // HACK: this will trigger a SEARCH request in the file picker
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 0)
			addFilesToSharedAlbumFromAlbum(albumName, [1, 2])
			cy.get('[data-test="media"]').should('have.length', 2)
			selectMedia([0, 1])
			removeSelectionFromCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 0)
		})
	})

	xcontext('Download files from a shared album', () => {
		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos')
			createAnAlbumFromAlbums('shared_album_test2')
			addCollaborators([bob.userId])

			cy.login(bob)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', 'shared_album_test2')
			addFilesToSharedAlbumFromAlbum('shared_album_test2', [0, 1, 2])
		})

		beforeEach(() => {
			cy.login(bob)
			cy.visit('/apps/photos')
		})

		it('Download a file from a shared album', () => {
			navigateToCollection('sharedalbums', 'shared_album_test2')
			selectMedia([0])
			downloadSelection()
			selectMedia([0])
		})

		it('Download multiple files from a shared album', () => {
			navigateToCollection('sharedalbums', 'shared_album_test2')
			selectMedia([1, 2])
			downloadSelection()
			selectMedia([1, 2])
		})

		it('Download all files from a shared album', () => {
			navigateToCollection('sharedalbums', 'shared_album_test2')
			downloadAllFiles()
		})
	})

	context('Delete a received shared album', () => {
		const albumName = 'shared_album_test3'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId])
		})

		it('Remove shared album', () => {
			cy.login(bob)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			removeSharedAlbums(`${albumName} (${alice.userId})`)
		})
	})

	context('Remove a collaborator from an album', () => {
		const albumName = 'shared_album_test4'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId])
		})

		it('Remove collaborator from an album', () => {
			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get(`[data-test="shared_album_test4 (${alice.userId})"]`).should('have.length', 1)

			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			removeCollaborators([bob.userId])

			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get('body')
				.should('not.contain', `shared_album_test4 (${alice.userId})`)
		})
	})

	context('Two shared albums with the same name', () => {
		const albumName = 'shared_album_test5'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId])

			cy.login(charlie)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId])
		})

		it('It should display two shared albums', () => {
			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get(`[data-test="${albumName} (${alice.userId})"]`).should('have.length', 1)
			cy.get(`[data-test="${albumName} (${charlie.userId})"]`).should('have.length', 1)
		})
	})

	context('Multiple collaborators should see each other\'s pictures', () => {
		const albumName = 'shared_album_test6'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId, charlie.userId])
		})

		it('It should display picture from all collaborators', () => {
			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			cy.get('[data-test="media"]').should('have.length', 0)
			addFilesToAlbumFromAlbum(albumName, [0])
			cy.get('[data-test="media"]').should('have.length', 1)

			cy.login(bob)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 1)
			addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName, [1])
			cy.get('[data-test="media"]').should('have.length', 2)

			cy.login(charlie)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 2)
			addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName, [2])
			cy.get('[data-test="media"]').should('have.length', 3)
		})

		it('Removing a collaborator should remove its pictures', () => {
			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			removeCollaborators([bob.userId])
			cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/albums/${albumName}` }).as('propFind')
			cy.reload()
			cy.wait('@propFind')
			cy.get('[data-test="media"]').should('have.length', 2)
		})

		it('Collaborator should be able to remove all pictures from the shared album', () => {
			cy.login(charlie)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			selectMedia([0, 1])
			removeSelectionFromCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 0)

			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			cy.get('[data-test="media"]').should('have.length', 0)
		})
	})

	context('Users and files events should impact albums', () => {
		const albumName = 'shared_album_test7'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addCollaborators([bob.userId, charlie.userId])
			addFilesToAlbumFromAlbum(albumName, [0])

			cy.login(bob)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName, [1])

			cy.login(charlie)
			cy.visit('/apps/photos')
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName, [2])
			cy.get('[data-test="media"]').should('have.length', 3)
		})

		it('Deleting a file should remove it from the albums', () => {
			cy.login(bob)
			cy.visit('/apps/photos')
			selectMedia([1])
			deleteSelection()
			navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
			cy.get('[data-test="media"]').should('have.length', 2)

			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			cy.get('[data-test="media"]').should('have.length', 2)
		})

		it('Deleting a user should remove it from the collaborator list of albums and remove its pictures', () => {
			cy.deleteUser(charlie)
			cy.login(alice)
			cy.visit('/apps/photos')
			navigateToCollection('albums', albumName)
			cy.get('[data-test="media"]').should('have.length', 1)
			cy.get('[aria-label="Manage collaborators for this album"]').click()
			cy.get('.manage-collaborators__form .vs__selected').should('have.length', 1)
		})

		it('Deleting a user should remove its albums for collaborators', () => {
			cy.deleteUser(alice)
			cy.login(bob)
			cy.visit('/apps/photos/sharedalbums')
			cy.get('body').should('not.contain', `${albumName} (${alice.userId})`)
			cy.createUser(alice)
			mkdir(alice, '/Photos')
			uploadTestMedia(alice)
		})
	})

	context('Public share should work', () => {
		const albumName = 'shared_album_test8'

		before(() => {
			cy.login(alice)
			cy.visit('/apps/photos/albums')
			createAnAlbumFromAlbums(albumName)
			addFilesToAlbumFromAlbum(albumName, [0, 1, 2])
		})

		it('Create a public link', () => {
			createPublicShare()
				.then((publicLink) => {
					cy.logout()
					cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photospublic/*' }).as('propFindAlbum')
					cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photospublic/*/' }).as('propFindContent')
					cy.visit(publicLink)
					cy.wait('@propFindAlbum')
					cy.wait('@propFindContent')
					cy.contains(albumName)
					cy.get('[data-test="media"]').should('have.length', 3)

					cy.login(alice)
					cy.visit('/apps/photos')
					navigateToCollection('albums', albumName)
					deletePublicShare()
					cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photospublic/*' }).as('propFindAlbum')
					cy.visit(publicLink)
					cy.wait('@propFindAlbum')
					cy.contains('This collection does not exist')
				})
		})
	})
})

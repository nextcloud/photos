/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { User } from '@nextcloud/cypress'

import {
	addCollaborators,
	addFilesToAlbumFromTimeline,
	createAnAlbumFromAlbums,
	createAnAlbumFromTimeline,
	deleteAnAlbumFromAlbumContent,
} from './albumsUtils.ts'
import {
	deleteSelection,
	downloadSelection,
	navigateToCollection,
	selectAndFavorite,
	selectAndUnfavorite,
	selectMedia,
	unselectMedia,
} from './photosUtils.ts'
import { setupPhotosTests } from './photosUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

let alice: User
let bob: User

describe('View list of photos in the main timeline', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
				bob = setupInfo.bob
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')
	})

	it('Favorite a file from a timeline', () => {
		selectAndFavorite([0])
		cy.get('[data-test="media"]').eq(0).find('[aria-label="Favorite"]')
		selectAndUnfavorite([0])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	it('Favorite multiple files from a timeline', () => {
		selectAndFavorite([1, 2])
		cy.get('[data-test="media"]').eq(1).find('[aria-label="Favorite"]')
		cy.get('[data-test="media"]').eq(2).find('[aria-label="Favorite"]')
		selectAndUnfavorite([1, 2])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	it('Download a file from a timeline', () => {
		selectMedia([0])
		downloadSelection()
		unselectMedia([0])
	})

	it('Download multiple files from a timeline', () => {
		selectMedia([1, 2])
		downloadSelection()
		unselectMedia([1, 2])
	})

	it('Add file to an album from a timeline', () => {
		const albumName = 'timeline_test_single'
		createAnAlbumFromTimeline(albumName)
		navigateToTimeline('all-media')
		selectMedia([0])
		addFilesToAlbumFromTimeline(albumName)
		navigateToCollection('albums', albumName)
		cy.get('[data-test="media"]').should('have.length', 1)
		deleteAnAlbumFromAlbumContent(albumName)
	})

	it('Add multiple files to an album from a timeline', () => {
		const albumName = 'timeline_test_multiple'
		createAnAlbumFromTimeline(albumName)
		navigateToTimeline('all-media')
		selectMedia([1, 2])
		addFilesToAlbumFromTimeline(albumName)
		navigateToCollection('albums', albumName)
		cy.get('[data-test="media"]').should('have.length', 2)
		deleteAnAlbumFromAlbumContent(albumName)
	})

	it('Add file to a shared album from a timeline', () => {
		const albumName = 'timeline_test_shared_album'
		createAnAlbumFromAlbums(albumName)
		addCollaborators([bob.userId])
		cy.login(bob)
		cy.visit('/apps/photos')
		selectMedia([0])
		addFilesToAlbumFromTimeline(albumName)
		navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Add multiple files to a shared album from a timeline', () => {
		const albumName = 'timeline_test_shared_album'
		cy.login(bob)
		cy.visit('/apps/photos')
		navigateToTimeline('all-media')
		selectMedia([1, 2])
		addFilesToAlbumFromTimeline(albumName)
		navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)
		cy.get('[data-test="media"]').should('have.length', 3)
		cy.login(alice)
		cy.visit('/apps/photos')
		navigateToTimeline('all-media')
	})

	it('Delete a file from photos', () => {
		cy.get('[data-test="media"]').should('have.length', 5)
		selectMedia([0])
		deleteSelection()
		cy.get('[data-test="media"]').should('have.length', 4)
	})

	it('Delete multiple files from photos', () => {
		cy.get('[data-test="media"]').should('have.length', 4)
		selectMedia([1, 2])
		deleteSelection()
		cy.get('[data-test="media"]').should('have.length', 2)
	})
})

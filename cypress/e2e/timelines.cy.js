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
	addFilesToAlbumFromTimeline,
	createAnAlbumFromAlbums,
	createAnAlbumFromTimeline,
	deleteAnAlbumFromAlbumContent,
	goToAlbum,
} from './albumsUtils'

import {
	deleteSelection,
	downloadSelection,
	favoriteSelection,
	selectMedia,
	unfavoriteSelection,
	unselectMedia,
	uploadTestMedia,
} from './photosUtils'
import {
	goToSharedAlbum,
} from './sharedAlbumUtils'
import {
	randHash,
} from '../utils/index.js'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

const alice = new User(`alice_${randHash()}`)
const bob = new User(`bob_${randHash()}`)

describe('View list of photos in the main timeline', () => {
	before(() => {
		cy.createUser(alice).then(() => {
			uploadTestMedia(alice)
		})
		cy.createUser(bob).then(() => {
			uploadTestMedia(bob)
		})
		cy.login(alice)
	})

	beforeEach(() => {
		cy.visit('/apps/photos')
	})

	it('Favorite a file from a timeline', () => {
		selectMedia([0])
		favoriteSelection()
		cy.get('[data-test="media"]').eq(0).find('[aria-label="Favorite"]')
		unfavoriteSelection()
		unselectMedia([0])
		cy.get('[aria-label="Favorite"]').should('not.exist')
	})

	it('Favorite multiple files from a timeline', () => {
		selectMedia([1, 2])
		favoriteSelection()
		cy.get('[data-test="media"]').eq(1).find('[aria-label="Favorite"]')
		cy.get('[data-test="media"]').eq(2).find('[aria-label="Favorite"]')
		unfavoriteSelection()
		unselectMedia([1, 2])
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
		createAnAlbumFromTimeline('timeline_test_single')
		selectMedia([0])
		addFilesToAlbumFromTimeline('timeline_test_single')
		goToAlbum('timeline_test_single')
		cy.get('[data-test="media"]').should('have.length', 1)
		deleteAnAlbumFromAlbumContent()
	})

	it('Add multiple files to an album from a timeline', () => {
		createAnAlbumFromTimeline('timeline_test_multiple')
		selectMedia([1, 2])
		addFilesToAlbumFromTimeline('timeline_test_multiple')
		goToAlbum('timeline_test_multiple')
		cy.get('[data-test="media"]').should('have.length', 2)
		deleteAnAlbumFromAlbumContent()
	})

	it('Add file to a shared album from a timeline', () => {
		cy.visit('apps/photos/albums')
		createAnAlbumFromAlbums('timeline_test_shared_album')
		addCollaborators([bob.userId])
		cy.login(bob)
		cy.visit('apps/photos')
		selectMedia([0])
		addFilesToAlbumFromTimeline('timeline_test_shared_album')
		goToSharedAlbum('timeline_test_shared_album')
		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Add multiple files to a shared album from a timeline', () => {
		cy.login(bob)
		cy.visit('apps/photos')
		selectMedia([1, 2])
		addFilesToAlbumFromTimeline('timeline_test_shared_album')
		goToSharedAlbum('timeline_test_shared_album')
		cy.get('[data-test="media"]').should('have.length', 3)
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

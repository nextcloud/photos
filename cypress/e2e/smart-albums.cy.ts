/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { navigateToCollection, setupPhotosTests } from './photosUtils.ts'
import { addCollaborators, createAnAlbumFromAlbums, createPublicShare } from './albumsUtils.ts'
import { randHash } from '../utils/index.js'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('View list of photos in the main timeline', () => {
	let alice: User
	let bob: User
	let albumName: string

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

		albumName = `test_smart_album_${randHash()}`
		createAnAlbumFromAlbums(albumName)
	})

	it('Should allow to set filters and update immediately', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })

		cy.get('[data-test="media"]').should('have.length', 3)

		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })

		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Should display the filters in the header', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-header-action="toggle-filters"]').click()

		cy.get('.photos-navigation').within(() => {
			cy.contains('Date range: January 1, 2019 ⸱ December 31, 2019')
			cy.contains('Places: Lauris')
		})
	})

	it('Should keep filters after a refresh', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })

		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Should display filters and photos in shared album', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-header-action="toggle-filters"]').click()

		addCollaborators([bob.userId])
		cy.login(bob)
		cy.visit('/apps/photos')
		navigateToCollection('sharedalbums', `${albumName} (${alice.userId})`)

		cy.get('.photos-navigation').within(() => {
			cy.contains('Date range: January 1, 2019 ⸱ December 31, 2019')
			cy.contains('Places: Lauris')
		})

		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Should display filters and photos in public link', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-header-action="toggle-filters"]').click()

		createPublicShare()
			.then(publicLink => {
				cy.logout()
				cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photospublic/*' }).as('propFindAlbum')
				cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/photospublic/*/' }).as('propFindContent')
				cy.visit(publicLink)
				cy.wait('@propFindAlbum')
				cy.wait('@propFindContent')

				cy.get('.photos-navigation').within(() => {
					cy.contains('Date range: January 1, 2019 ⸱ December 31, 2019')
					cy.contains('Places: Lauris')
				})

				cy.get('[data-test="media"]').should('have.length', 1)
			})
	})
})

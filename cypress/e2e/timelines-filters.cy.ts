/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { navigateToCollection, setupPhotosTests } from './photosUtils.ts'
import { clearFilters, setDateRangeFilter, setPlacesFilter } from './timelinesFiltersUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

let alice: User

describe('View list of photos in the main timeline', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')
	})

	it('Apply date range filter to timeline', () => {
		setDateRangeFilter('2020-01-01 ~ 2020-12-31')
		cy.get('[data-test="media"]').should('have.length', 2)

		clearFilters(1)
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Apply places filter to timeline', () => {
		setPlacesFilter(['Lauris'])
		cy.get('[data-test="media"]').should('have.length', 1)

		setPlacesFilter(['Annot'])
		cy.get('[data-test="media"]').should('have.length', 3)

		clearFilters(2)
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Apply multiple filters to timeline', () => {
		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		cy.get('[data-test="media"]').should('have.length', 3)

		setPlacesFilter(['Lauris'])
		cy.get('[data-test="media"]').should('have.length', 1)

		clearFilters(2)
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Changing view resets filters', () => {
		setDateRangeFilter('2020-01-01 ~ 2020-12-31')
		cy.get('body').type('{esc}')
		navigateToTimeline('photos')
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Should allow to create an album based on the filters', () => {
		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		setPlacesFilter(['Lauris'])

		cy.get('[data-cy-header-action="create-album"]').click()
		cy.get('form [name="name"]').type('Smart album from timeline')

		cy.get('.album-form').within(() => {
			cy.contains('January 1, 2019 ⸱ December 31, 2019')
			cy.contains('Lauris')
		})

		cy.contains('Create album').click()

		navigateToCollection('albums', 'Smart album from timeline')
		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

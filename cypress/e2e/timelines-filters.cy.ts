/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { navigateToCollection, setupPhotosTests } from './photosUtils.ts'
import { setDateRangeFilter, setPlacesFilter, toggleFilters } from './timelinesFiltersUtils.ts'
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
		toggleFilters()

		setDateRangeFilter('2020-01-01 ~ 2020-12-31')
		cy.get('[data-test="media"]').should('have.length', 2)

		setDateRangeFilter('')
		cy.get('[data-test="media"]').should('have.length', 5)

		toggleFilters()
	})

	it('Apply places filter to timeline', () => {
		toggleFilters()

		setPlacesFilter(['Lauris'])
		cy.get('[data-test="media"]').should('have.length', 1)

		setPlacesFilter(['Annot'])
		cy.get('[data-test="media"]').should('have.length', 3)

		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').eq(1).click()
		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').eq(0).click()
		cy.get('[data-test="media"]').should('have.length', 5)

		toggleFilters()
	})

	it('Apply multiple filters to timeline', () => {
		toggleFilters()

		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		cy.get('[data-test="media"]').should('have.length', 3)

		setPlacesFilter(['Lauris'])
		cy.get('[data-test="media"]').should('have.length', 1)

		setDateRangeFilter('')
		setPlacesFilter([])
		cy.get('[data-test="media"]').should('have.length', 5)

		toggleFilters()
	})

	it('Toggling filters resets filters', () => {
		toggleFilters()

		setDateRangeFilter('2020-01-01 ~ 2020-12-31')
		toggleFilters()
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Changing view resets filters', () => {
		toggleFilters()

		setDateRangeFilter('2020-01-01 ~ 2020-12-31')

		navigateToTimeline('photos')
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Should allow to create an album based on the filters', () => {
		toggleFilters()

		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		setPlacesFilter(['Lauris'])

		cy.get('[data-cy-header-action="create-album"]').click()
		cy.get('form [name="name"]').type('Smart album from timeline')

		cy.get('.album-form').within(() => {
			cy.contains('Date range: January 1, 2019 ⸱ December 31, 2019')
			cy.contains('Places: Lauris')
		})

		cy.contains('Create album').click()

		navigateToCollection('albums', 'Smart album from timeline')
		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

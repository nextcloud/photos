/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { navigateToCollection, setupPhotosTests } from './photosUtils.ts'
import { navigateToTimeline } from './timelines.ts'

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
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 2)
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').clear()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('{enter}')
		cy.get('[data-test="media"]').should('have.length', 5)
		cy.get('[data-cy-header-action="toggle-filters"]').click()
	})

	it('Apply places filter to timeline', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 1)
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Annot{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 3)
		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').eq(1).click()
		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').eq(0).click()
		cy.get('[data-test="media"]').should('have.length', 5)
		cy.get('[data-cy-header-action="toggle-filters"]').click()
	})

	it('Apply multiple filters to timeline', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 3)
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 1)
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').clear()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('{enter}')
		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').click()
		cy.get('[data-test="media"]').should('have.length', 5)
		cy.get('[data-cy-header-action="toggle-filters"]').click()
	})

	it('Toggling filters resets filters', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Changing view resets filters', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		navigateToTimeline('photos')
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Should allow to create an album based on the filters', () => {
		cy.get('[data-cy-header-action="toggle-filters"]').click()
		cy.get('[data-cy-photos-filters="date-range"]').click()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('2019-01-01 ~ 2019-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-photos-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })

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

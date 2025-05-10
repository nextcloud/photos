/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { navigateToTimeline } from './timelines.ts'
import { setupPhotosTests } from './photosUtils.ts'
import type { User } from '@nextcloud/cypress'

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
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
		cy.get('[data-cy-timeline-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 2)
		cy.get('[data-cy-timeline-filters="date-range"] input[name="date"]').clear()
		cy.get('[data-cy-timeline-filters="date-range"] input[name="date"]').type('{enter}')
		cy.get('[data-test="media"]').should('have.length', 5)
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
	})

	it('Apply places filter to timeline', () => {
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
		cy.get('[data-cy-timeline-filters="places"] input[type="search"]').type('Lauris{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 1)
		cy.get('[data-cy-timeline-filters="places"] input[type="search"]').type('Annot{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-test="media"]').should('have.length', 2)
		cy.get('[data-cy-timeline-filters="places"] input[type="search"]').clear()
		cy.get('[data-test="media"]').should('have.length', 5)
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
	})

	it('Toggling filters resets filters', () => {
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
		cy.get('[data-cy-timeline-filters="date-range"]').click()
		cy.get('[data-cy-timeline-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
		cy.get('[data-test="media"]').should('have.length', 5)
	})

	it('Changing view resets filters', () => {
		cy.get('[data-cy-timeline-action="toggle-filters"]').click()
		cy.get('[data-cy-timeline-filters="date-range"]').click()
		cy.get('[data-cy-timeline-filters="date-range"] input[name="date"]').type('2020-01-01 ~ 2020-12-31{enter}', { scrollBehavior: 'nearest' })
		navigateToTimeline('photos')
		cy.get('[data-test="media"]').should('have.length', 5)
	})

})

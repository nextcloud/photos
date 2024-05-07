/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { mkdir, uploadTestMedia } from './photosUtils'
import { navigateToPlace, runOccCommand } from './placesUtils'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage places', () => {
	before(function () {
		cy.createRandomUser()
			.then((user) => {
				mkdir(user, '/Photos')
				uploadTestMedia(user)
				runOccCommand('files:scan --all --generate-metadata')
				cy.login(user)
				cy.visit('/apps/photos')
			})
	})

	beforeEach(() => {
		cy.visit('apps/photos/places')
	})

	it('Check that we detect some places out of the existing files', () => {
		cy.get('ul.collections__list li').should('have.length', 4)
	})

	it('Navigate to place and check that it contains some files', () => {
		navigateToPlace('Lauris')
		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

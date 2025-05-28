/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { User } from '@nextcloud/cypress'

import { navigateToCollection, navigateToCollections, setupPhotosTests } from './photosUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

let alice: User

describe('Manage places', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')
		navigateToCollections('places')
	})

	it('Check that we detect some places out of the existing files', () => {
		cy.get('ul.collections__list li').should('have.length', 4)
	})

	it('Navigate to place and check that it contains some files', () => {
		navigateToCollection('places', 'Lauris')
		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

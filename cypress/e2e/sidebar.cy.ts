/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { User } from '@nextcloud/cypress'
import { mkdir, uploadTestMedia } from './photosUtils'
import { randHash } from '../utils/index.js'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

const alice = new User(`alice_${randHash()}`)

describe('Sidebar tab', () => {
	before(() => {
		cy.createUser(alice).then(() => {
			mkdir(alice, '/Photos')
			uploadTestMedia(alice)

			cy.runOccCommand('files:scan --all --generate-metadata')
		})
		cy.login(alice)
	})

	beforeEach(() => {
		cy.visit('/apps/photos')
	})

	it('Should display EXIF data in the sidebar', () => {
		cy.get('[data-test="media"]').eq(3).click()
		cy.get('.viewer .modal-header .action-item__menutoggle').click()
		cy.contains('Open sidebar').click()
		cy.get('#tab-button-photos').click()

		cy.get('.photo-detail__file').contains('Taken on Oct 27, 2019 at') // Ignoring exact time as it it timeszone dependent.
		cy.get('.photo-detail__file').contains('242 KB ⸱ 16 MP ⸱ 4608 x 3456')
		cy.get('.photo-detail__gps__title').contains('Annot')
		cy.get('.photo-detail__camera').contains('OnePlus ONEPLUS A5000')
		cy.get('.photo-detail__camera').contains('ƒ/1.7 ⸱ 1/2461 ⸱ 4.103mm ⸱ ISO160')
	})

	it('Should update EXIF data when changing photos', () => {
		cy.get('[data-test="media"]').eq(3).click()
		cy.get('.viewer .modal-header .action-item__menutoggle').click()
		cy.contains('Open sidebar').click()
		cy.get('#tab-button-photos').click()
		cy.get('[aria-label="Next"]').click()

		cy.get('.photo-detail__file').contains('Taken on Oct 24, 2019 at') // Ignoring exact time as it it timeszone dependent.
		cy.get('.photo-detail__file').contains('178 KB ⸱ 16 MP ⸱ 4608 x 3456')
		cy.get('.photo-detail__gps__title').contains('Lauris')
		cy.get('.photo-detail__camera').contains('OnePlus ONEPLUS A5000')
		cy.get('.photo-detail__camera').contains('ƒ/1.7 ⸱ 1/269 ⸱ 4.103mm ⸱ ISO250')
	})
})



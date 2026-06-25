/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
	navigateToFaces,
	openFace,
	openFaceActionsMenu,
	selectFacePhoto,
	setupFacesTests,
} from './facesUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

/**
 * Assert that a recognize WebDAV request succeeded — in particular that it did
 * not 404. Using the bare photo basename (instead of the
 * `{detectionId}-{fileName}` name expected by recognize) used to make these
 * requests 404, so this is the core regression guard.
 *
 * @param alias The intercepted request alias to wait for.
 */
function expectRecognizeRequestToSucceed(alias: string) {
	cy.wait(alias).then(({ response }) => {
		expect(response?.statusCode, 'recognize WebDAV request status').to.be.oneOf([200, 201, 204, 207])
		expect(response?.statusCode, 'recognize WebDAV request must not 404').to.not.equal(404)
	})
}

describe('Faces view', () => {
	beforeEach(() => {
		// The first run classifies the fixtures and snapshots the result; later
		// runs restore that snapshot. Either way we land on the faces view.
		setupFacesTests()
		navigateToFaces()
	})

	it('shows recognized people', () => {
		cy.get('[data-test="face"]').should('have.length.at.least', 1)
		cy.get('[data-test="unassigned-faces"]').should('exist')
	})

	it('opens a person and shows their photos', () => {
		openFace(0)
		cy.get('[data-test="media"]').should('have.length.at.least', 1)
	})

	it('renames a person', () => {
		const newName = 'Cypress Person'
		openFace(0)

		cy.get('.face__header__actions [aria-label="Rename person"]').click()
		cy.get('.rename-form input[name="name"]').clear()
		cy.get('.rename-form input[name="name"]').type(newName)

		cy.intercept({ times: 1, method: 'MOVE', url: '/remote.php/dav/recognize/*/faces/*' }).as('renameFace')
		cy.contains('button', 'Save').click()
		expectRecognizeRequestToSucceed('@renameFace')

		// The new name is reflected in the header.
		cy.get('.face-name').should('contain', newName)
	})

	it('moves a photo to a different person without producing a 404', () => {
		// Moving photos between people needs at least two clusters.
		cy.get('[data-test="face"]').should('have.length.at.least', 2)

		openFace(0)
		selectFacePhoto(0)

		openFaceActionsMenu()
		cy.contains('Move photo').click()

		// Pick the first person offered in the move dialog. The MOVE must target
		// the `{detectionId}-{fileName}` path recognize expects, not the bare
		// basename (which used to 404).
		cy.intercept({ times: 1, method: 'MOVE', url: '/remote.php/dav/recognize/*/faces/**' }).as('moveToFace')
		cy.get('.merge-form .face-cover').first().click()
		expectRecognizeRequestToSucceed('@moveToFace')
	})

	it('removes a photo from a person without producing a 404', () => {
		openFace(0)
		selectFacePhoto(0)

		cy.intercept({ times: 1, method: 'DELETE', url: '/remote.php/dav/recognize/*/faces/**' }).as('removeFromFace')
		openFaceActionsMenu()
		cy.contains(/Remove photos? from person/).click()
		expectRecognizeRequestToSucceed('@removeFromFace')
	})

	it('merges two people without producing a 404', () => {
		cy.get('[data-test="face"]').should('have.length.at.least', 2)

		openFace(0)
		openFaceActionsMenu()
		cy.contains('Merge with different person').click()

		// Merging moves every photo of this person onto the target person.
		cy.intercept({ method: 'MOVE', url: '/remote.php/dav/recognize/*/faces/**' }).as('mergeFace')
		cy.get('.merge-form .face-cover').first().click()
		expectRecognizeRequestToSucceed('@mergeFace')
	})
})

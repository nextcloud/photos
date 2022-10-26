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
import { uploadTestMedia } from './photosUtils'
import { navigateToLocation, runOccCommand } from './locationsUtils'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('Manage locations', () => {
	before(function() {
		cy.createRandomUser()
			.then((user) => {
				uploadTestMedia(user)
				runOccCommand(`photos:map-media-to-location --user ${user.userId}`)
				cy.login(user)
				cy.visit('/apps/photos')
			})
	})

	beforeEach(() => {
		cy.visit('apps/photos/locations')
	})

	it('Check that we detect some locations out of the existing files', () => {
		cy.get('ul.collections__list li').should('have.length', 4)
	})

	it('Navigate to location and check that it contains some files', () => {
		navigateToLocation('Lauris')
		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

/**
 * @copyright Copyright (c) 2023 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
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

import type { User } from '@nextcloud/cypress'

export function uploadTestMedia(user: User) {
	cy.exec('ls cypress/fixtures/media')
		.then((result) => {
			for (const fileName of result.stdout.split('\n')) {
				cy.uploadFile(user, `media/${fileName}`, 'image/png', `/${fileName}`)
			}
		})
}

export function selectMedia(indexes: number[]) {
	indexes.forEach((index: number) => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').check({ force: true })
	})
}

export function unselectMedia(indexes: number[]) {
	indexes.forEach((index: number) => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').uncheck({ force: true })
	})
}

export function favoriteSelection() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Mark selection as favorite"]').click()
}

export function unfavoriteSelection() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Remove selection from favorites"]').click()
}

export function downloadSelection() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download selected files"]').trigger('click')
}

export function downloadAllFiles() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download all files in album"]').trigger('click')
}

export function deleteSelection() {
	cy.intercept({ method: 'DELETE' }).as('deleteRequests')
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete selection')
		.click()
		.wait('@deleteRequests')
}

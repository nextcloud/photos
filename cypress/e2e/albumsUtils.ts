/**
 * @copyright Copyright (c) 2023 Louis Chmn <louis@chmn.me>
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

import { selectMedia } from "./photosUtils"

export function createAnAlbumFromTimeline(albumName: string) {
	cy.contains('Add').click()
	cy.contains('Create new album').click()
	cy.get('form [name="name"]').type(albumName)
	cy.contains('Create album').click()
}

export function createAnAlbumFromAlbums(albumName: string) {
	cy.intercept({ method: 'PROPFIND', url: `**/dav/photos/**/albums/${albumName}` }).as('propFind')
	cy.contains('New album').click()
	cy.get('form [name="name"]').type(albumName)
	cy.contains('Create album').click()
	cy.wait('@propFind')
}

export function deleteAnAlbumFromAlbumContent() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
}

export function addFilesToAlbumFromTimeline(albumName: string) {
	cy.contains('Add to album').click()
	cy.get('.album-picker ul').contains(albumName).click()
}

export function addFilesToAlbumFromAlbum(albumName: string, itemsIndex: number[]) {
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.get('.file-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.contains(`Add to ${albumName}`).click()
}

export function addFilesToAlbumFromAlbumFromHeader(albumName: string, itemsIndex: number[]) {
	cy.contains('Add').click()
	cy.contains('Add photos to this album').click()
	cy.get('.file-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.contains(`Add to ${albumName}`).click()
}

export function removeSelectionFromAlbum() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Remove selection from album').click()
}

export function goToAlbum(albumName: string) {
	cy.intercept({ method: 'PROPFIND', url: `**/dav/photos/**/albums/${albumName}` }).as('propFind')
	cy.get('.app-navigation__list').contains('Albums').click()
	cy.get('ul.collections__list').contains(albumName).click()
	cy.wait('@propFind')
}

export function addCollaborators(collaborators: string[]) {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator: string) => {
		cy.get('[aria-label="Search for collaborators"').type(collaborator)
		cy.contains(collaborator).click()
	})
	cy.contains('Save').click()
}

export function removeCollaborators(collaborators: string[]) {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator: string) => {
		cy.get('.manage-collaborators')
			.within(() => {
				cy.contains(collaborator)
					.parentsUntil('ul')
					.get(`[aria-label="Remove ${collaborator} from the collaborators list"]`)
					.click()
			})
	})
	cy.contains('Save').click()
}

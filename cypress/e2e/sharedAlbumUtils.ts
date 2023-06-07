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

export function goToSharedAlbum(albumName: string) {
	cy.intercept({ times: 1, method: 'PROPFIND', url: '**/dav/photos/**/sharedalbums' }).as('propFindSharedAlbums')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFindSharedAlbumContent')
	cy.get('.app-navigation__list').contains('Collaborative albums').click()
	cy.wait('@propFindSharedAlbums')
	cy.get('ul.collections__list').contains(albumName).click()
	cy.wait('@propFindSharedAlbumContent')
}

export function removeSharedAlbums() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
}

export function addFilesToSharedAlbumFromSharedAlbumFromHeader(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '**/dav/' }).as('search')
	cy.contains('Add').click()
	cy.wait('@search')
	cy.get('.file-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '**/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

export function addFilesToSharedAlbumFromAlbum(albumName: string, itemsIndex: number[]) {
	cy.intercept({ times: 1, method: 'SEARCH', url: '**/dav/' }).as('search')
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.wait('@search')
	cy.get('.file-picker__file-list').within(() => {
		selectMedia(itemsIndex)
	})
	cy.intercept({ times: itemsIndex.length, method: 'COPY', url: '**/dav/files/**' }).as('copy')
	cy.intercept({ times: 1, method: 'PROPFIND', url: `**/dav/photos/*/sharedalbums/${albumName}*/` }).as('propFind')
	cy.contains(`Add to ${albumName}`).click()
	cy.wait('@copy')
	cy.wait('@propFind')
}

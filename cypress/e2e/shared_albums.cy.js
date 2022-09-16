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
import { randHash } from '../utils'
const randUser = randHash()
const randUser2 = randHash()

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

describe('Manage shared albums', () => {
  before(() => {
    cy.logout()
    cy.nextcloudCreateUser(randUser, 'password')
    cy.nextcloudCreateUser(randUser2, 'password')

    cy.login(randUser, 'password')
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
    cy.createAnAlbumFromAlbums('shared_album_test1')
    cy.addCollaborators([randUser2])
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
    cy.createAnAlbumFromAlbums('shared_album_test2')
    cy.addCollaborators([randUser2])
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
    cy.createAnAlbumFromAlbums('shared_album_test3')
    cy.addCollaborators([randUser2])
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
    cy.createAnAlbumFromAlbums('shared_album_test4')
    cy.addCollaborators([randUser2])
    cy.logout()

    cy.login(randUser2, 'password')
    cy.uploadTestMedia()
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/sharedalbums`)
    cy.goToSharedAlbum('shared_album_test2')
    cy.addFilesToAlbumFromAlbum('shared_album_test2', [0, 1, 2])

    // wait a bit for things to be settled
    cy.wait(1000)
  })

  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/sharedalbums`)
  })

  it('Add and remove a file to a shared album from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test1')
    cy.get('[data-test="media"]').should('have.length', 0)
    cy.addFilesToAlbumFromAlbum('shared_album_test1', [0])
    cy.get('[data-test="media"]').should('have.length', 1)
    cy.selectMedia([0])
    cy.removeSelectionFromAlbum()
    cy.get('[data-test="media"]').should('have.length', 0)
  })

  it('Add and remove multiple files to a shared album from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test1')
    cy.get('[data-test="media"]').should('have.length', 0)
    cy.addFilesToAlbumFromAlbum('shared_album_test1', [1, 2])
    cy.get('[data-test="media"]').should('have.length', 2)
    cy.selectMedia([0, 1])
    cy.removeSelectionFromAlbum()
    cy.get('[data-test="media"]').should('have.length', 0)
  })

  it('Download a file from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test2')
    cy.selectMedia([0])
    cy.downloadSelection()
    cy.unselectMedia([0])
  })

  it('Download multiple files from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test2')
    cy.selectMedia([1, 2])
    cy.downloadSelection()
    cy.unselectMedia([1, 2])
  })

  it('Download all files from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test2')
    cy.downloadAllFiles()
  })

  it('Remove a file from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test2')
    cy.get('[data-test="media"]').should('have.length', 3)
    cy.goToSharedAlbum('shared_album_test2')
    cy.selectMedia([0])
    cy.removeSelectionFromAlbum()
    cy.get('[data-test="media"]').should('have.length', 2)
  })

  it('Remove multiple files from a shared album', () => {
    cy.goToSharedAlbum('shared_album_test2')
    cy.get('[data-test="media"]').should('have.length', 2)
    cy.goToSharedAlbum('shared_album_test2')
    cy.selectMedia([0, 1])
    cy.removeSelectionFromAlbum()
    cy.get('[data-test="media"]').should('have.length', 0)
  })

  xit('Remove shared album', () => {
    cy.goToSharedAlbum('shared_album_test3')
    cy.removeSharedAlbums()
  })

  xit('Remove collaborator from an album', () => {
    cy.get('[data-test="media"]').should('have.length', 4)

    cy.logout()
    cy.login(randUser, 'password')
    cy.goToAlbum('shared_album_test4')
    cy.removeCollaborators([randUser2])
    cy.logout()

    cy.login(randUser2, 'password')
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/sharedalbums`)

    cy.get('ul.collections__list li').should('have.length', 3)
  })
})
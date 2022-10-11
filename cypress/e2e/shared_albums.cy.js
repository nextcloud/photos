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

const alice = `alice_${randHash()}`
const bob = `bob_${randHash()}`
const charlie = `charlie_${randHash()}`

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

describe('Manage shared albums', () => {
  before(() => {
    cy.visit('')
    cy.logout()

    cy.nextcloudCreateUser(alice, 'password')
    cy.nextcloudCreateUser(bob, 'password')
    cy.nextcloudCreateUser(charlie, 'password')

    cy.login(bob, 'password')
    cy.uploadTestMedia()
    cy.logout()
  })

  beforeEach(() => {
    cy.logout()
    cy.login(bob, 'password', '/apps/photos/sharedalbums')
  })

  context('Adding and removing files in a shared album', () => {
    before(() => {
      cy.logout()
      cy.login(alice, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
      cy.createAnAlbumFromAlbums('shared_album_test1')
      cy.addCollaborators([bob])
      cy.logout()
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
  })

  context('Download files from a shared album', () => {
    before(() => {
      cy.logout()
      cy.login(alice, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
      cy.createAnAlbumFromAlbums('shared_album_test2')
      cy.addCollaborators([bob])
      cy.logout()

      cy.login(bob, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/sharedalbums`)
      cy.goToSharedAlbum('shared_album_test2')
      cy.addFilesToAlbumFromAlbum('shared_album_test2', [0, 1, 2])
      cy.logout()
    })

    xit('Download a file from a shared album', () => {
      cy.goToSharedAlbum('shared_album_test2')
      cy.selectMedia([0])
      cy.downloadSelection()
      cy.unselectMedia([0])
    })

    xit('Download multiple files from a shared album', () => {
      cy.goToSharedAlbum('shared_album_test2')
      cy.selectMedia([1, 2])
      cy.downloadSelection()
      cy.unselectMedia([1, 2])
    })

    xit('Download all files from a shared album', () => {
      cy.goToSharedAlbum('shared_album_test2')
      cy.downloadAllFiles()
    })
  })

  context('Delete a received shared album', () => {
    before(() => {
      cy.logout()
      cy.login(alice, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
      cy.createAnAlbumFromAlbums('shared_album_test3')
      cy.addCollaborators([bob])
      cy.logout()
    })

    it('Remove shared album', () => {
      cy.goToSharedAlbum('shared_album_test3')
      cy.removeSharedAlbums()
    })
  })

  context('Remove a collaborator from an album', () => {
    before(() => {
      cy.logout()
      cy.login(alice, 'password', '/apps/photos/albums')
      cy.createAnAlbumFromAlbums('shared_album_test4')
      cy.addCollaborators([bob])
      cy.logout()
    })

    it('Remove collaborator from an album', () => {
      cy.get('ul.collections__list li')
        .should('contain', `shared_album_test4 (${alice})`)

      cy.logout()
      cy.login(alice, 'password', '/apps/photos')
      cy.goToAlbum('shared_album_test4')
      cy.removeCollaborators([bob])
      cy.logout()

      cy.login(bob, 'password', '/apps/photos/sharedalbums')
      cy.get('body')
        .should('not.contain', `shared_album_test4 (${alice})`)
    })
  })

  context('Two shared albums with the same name', () => {
    before(() => {
      cy.logout()
      cy.login(alice, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
      cy.createAnAlbumFromAlbums('shared_album_test5')
      cy.addCollaborators([bob])
      cy.logout()

      cy.login(charlie, 'password')
      cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
      cy.createAnAlbumFromAlbums('shared_album_test5')
      cy.addCollaborators([bob])
      cy.logout()
    })


    it('It should display two shared albums', () => {
      cy.get('ul.collections__list li')
        .contains(`shared_album_test5 (${alice})`)
      cy.get('ul.collections__list li')
        .contains(`shared_album_test5 (${charlie})`)
    })
  })
})
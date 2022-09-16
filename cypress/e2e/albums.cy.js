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

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

describe('Manage albums', () => {
  before(function () {
    cy.logout()
    cy.nextcloudCreateUser(randUser, 'password')

    cy.login(randUser, 'password')
    cy.uploadTestMedia()

    // wait a bit for things to be settled
    cy.wait(1000)
  })

  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos/albums`)
    cy.createAnAlbumFromAlbums('albums_test')
    cy.addFilesToAlbumFromAlbum('albums_test', [0, 1, 2])
  })

  afterEach(() => {
    cy.deleteAnAlbumFromAlbumContent()
    cy.contains("There is no album yet!").click()
  })

  it('Add and remove a file to an album from an album', () => {
    cy.selectMedia([0])
    cy.removeSelectionFromAlbum()
  })

  it('Add and remove multiple files to an album from an album', () => {
    cy.selectMedia([0, 1])
    cy.removeSelectionFromAlbum()
  })

  it('Favorite a file from an album', () => {
    cy.selectMedia([0])
    cy.favoriteSelection()
    cy.get('[data-test="media"]').eq(0).find('[aria-label="The file is in the favorites"]')
    cy.unfavoriteSelection()
    cy.unselectMedia([0])
    cy.get('[aria-label="The file is in the favorites"]').should('not.exist')
  })

  it('Favorite multiple files from an album', () => {
    cy.selectMedia([1, 2])
    cy.favoriteSelection()
    cy.get('[data-test="media"]').eq(1).find('[aria-label="The file is in the favorites"]')
    cy.get('[data-test="media"]').eq(2).find('[aria-label="The file is in the favorites"]')
    cy.unfavoriteSelection()
    cy.unselectMedia([1, 2])
    cy.get('[aria-label="The file is in the favorites"]').should('not.exist')
  })

  it('Download a file from an album', () => {
    cy.selectMedia([0])
    cy.downloadSelection()
    cy.unselectMedia([0])
  })

  it('Download multiple files from an album', () => {
    cy.selectMedia([1, 2])
    cy.downloadSelection()
    cy.unselectMedia([1, 2])
  })

  it('Download all files from an album', () => {
    cy.selectMedia([1, 2])
    cy.downloadSelection()
    cy.unselectMedia([1, 2])
  })

  it('Edit an album\'s name', () => {
    cy.get('[aria-label="Open actions menu"]').click()
    cy.contains('Edit album details').click()
    cy.get('form [name="name"]').clear().type("New name")
    cy.contains('Save').click()

    cy.reload()

    cy.contains('New name')

    cy.get('[aria-label="Open actions menu"]').click()
    cy.contains('Edit album details').click()
    cy.get('form [name="name"]').clear().type("albums_test")
    cy.contains('Save').click()
  })

  it('Edit an album\'s location', () => {
    cy.get('[aria-label="Open actions menu"]').click()
    cy.contains('Edit album details').click()
    cy.get('form [name="location"]').clear().type("New location")
    cy.contains('Save').click()

    cy.reload()

    cy.contains('New location')

    cy.get('[aria-label="Open actions menu"]').click()
    cy.contains('Edit album details').click()
    cy.get('form [name="location"]').clear()
    cy.contains('Save').click()
  })
})

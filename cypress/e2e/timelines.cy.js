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

describe('View list of photos in the main timeline', () => {
  before(() => {
    cy.logout()
    cy.nextcloudCreateUser(randUser, 'password')

    cy.login(randUser, 'password')
    cy.uploadTestMedia()

    // wait a bit for things to be settled
    cy.wait(1000)
  })

  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/index.php/apps/photos`)
  })

  it('Favorite a file from a timeline', () => {
    cy.selectMedia([0])
    cy.favoriteSelection()
    cy.get('[data-test="media"]').eq(0).find('[aria-label="The file is in the favorites"]')
    cy.unfavoriteSelection()
    cy.unselectMedia([0])
    cy.get('[aria-label="The file is in the favorites"]').should('not.exist')
  })

  it('Favorite multiple files from a timeline', () => {
    cy.selectMedia([1, 2])
    cy.favoriteSelection()
    cy.get('[data-test="media"]').eq(1).find('[aria-label="The file is in the favorites"]')
    cy.get('[data-test="media"]').eq(2).find('[aria-label="The file is in the favorites"]')
    cy.unfavoriteSelection()
    cy.unselectMedia([1, 2])
    cy.get('[aria-label="The file is in the favorites"]').should('not.exist')
  })

  it('Download a file from a timeline', () => {
    cy.selectMedia([0])
    cy.downloadSelection()
    cy.unselectMedia([0])
  })

  it('Download multiple files from a timeline', () => {
    cy.selectMedia([1, 2])
    cy.downloadSelection()
    cy.unselectMedia([1, 2])
  })

  it('Add file to an album from a timeline', () => {
    cy.createAnAlbumFromTimeline('timeline_test_single')
    cy.selectMedia([0])
    cy.addFilesToAlbumFromTimeline('timeline_test_single')
    cy.goToAlbum('timeline_test_single')
    cy.get('[data-test="media"]').should('have.length', 1)
    cy.deleteAnAlbumFromAlbumContent()
  })

  it('Add multiple files to an album from a timeline', () => {
    cy.createAnAlbumFromTimeline('timeline_test_multiple')
    cy.selectMedia([1, 2])
    cy.addFilesToAlbumFromTimeline('timeline_test_multiple')
    cy.goToAlbum('timeline_test_multiple')
    cy.get('[data-test="media"]').should('have.length', 2)
    cy.deleteAnAlbumFromAlbumContent()
  })

  it('Delete a file from photos', () => {
    cy.get('[data-test="media"]').should('have.length', 5)
    cy.selectMedia([0])
    cy.deleteSelection()
    cy.get('[data-test="media"]').should('have.length', 4)
  })

  it('Delete multiple files from photos', () => {
    cy.get('[data-test="media"]').should('have.length', 4)
    cy.selectMedia([1, 2])
    cy.deleteSelection()
    cy.get('[data-test="media"]').should('have.length', 2)
  })
})
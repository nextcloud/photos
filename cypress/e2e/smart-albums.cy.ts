/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { randHash } from '../utils/index.js'
import { createAnAlbumFromAlbums } from './albumsUtils.ts'
import { setupPhotosTests } from './photosUtils.ts'
import { openAlbumSetting, setDateRangeFilter, setPlacesFilter } from './smartAlbumsUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

describe('View list of photos in the main timeline', () => {
	let alice: User
	let albumName: string

	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')

		albumName = `test_smart_album_${randHash()}`
		createAnAlbumFromAlbums(albumName)
	})

	it('Should allow to set filters in the setting dialog and on save', () => {
		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		cy.get('[data-test="media"]').should('have.length', 3)

		setPlacesFilter(['Lauris'])
		cy.get('[data-test="media"]').should('have.length', 1)
	})

	it('Should display the filters in the setting dialog', () => {
		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		setPlacesFilter(['Lauris'])

		openAlbumSetting()

		cy.get('.album-form').within(() => {
			cy.contains('January 1, 2019 ⸱ December 31, 2019')
			cy.contains('Lauris')
		})
	})

	it('Should keep filters after a refresh', () => {
		setDateRangeFilter('2019-01-01 ~ 2019-12-31')
		setPlacesFilter(['Lauris'])

		cy.get('[data-test="media"]').should('have.length', 1)
	})
})

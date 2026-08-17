/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { User } from '@nextcloud/e2e-test-server'

import { createAnAlbumFromTimeline } from './albumsUtils.ts'
import { navigateToCollection, setupPhotosTests } from './photosUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

let alice: User

/** Photo taken in Lauris on the 24th of October 2019. */
const photo = 'IMG_20191024_081301.jpg'

/**
 * Find a field by its accessible name.
 *
 * @param label - Label of the field
 */
function fieldByLabel(label: string) {
	return cy.contains('label', label)
		.invoke('attr', 'for')
		.then((id) => cy.get(`#${id}`))
}

/**
 * @param fileName - Name of the photo to act on
 * @param action - Name of the entry to pick in the actions menu
 * @param dialogName - Name of the dialog the entry opens
 */
function openPhotoAction(fileName: string, action: string, dialogName: string) {
	// The menu is only revealed once the photo it belongs to is hovered or
	// holds the focus.
	cy.get(`[aria-label="Actions for ${fileName}"]`).focus().click({ force: true })
	cy.get('[role="menuitem"]').contains(action).click()
	return cy.contains('h2', dialogName).should('be.visible')
}

/**
 * @param fileName - Name of the photo to edit
 */
function openMetadataEditor(fileName: string) {
	return openPhotoAction(fileName, 'Edit metadata', 'Edit metadata')
}

/**
 * @param label - Name of the metadata entry
 */
function entryByName(label: string) {
	return cy.contains('dt', label).siblings('dd')
}

describe('Show the metadata of a photo', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')
		openPhotoAction(photo, 'View metadata', 'Photo metadata')
	})

	it('Shows the place and the coordinates of the photo', () => {
		entryByName('Place').should('have.text', 'Lauris')
		entryByName('Location').should('have.text', '43.73926, 5.31345')
	})

	it('Shows the photo on a map', () => {
		// A map carries no accessible name of its own, its marker names the
		// place it points at.
		cy.get('.leaflet-container').should('be.visible')
		cy.get('.leaflet-tooltip').should('contain.text', 'Lauris')
	})

	it('Shows the camera the photo was taken with', () => {
		// The manufacturer is left out, the model already carries it.
		entryByName('Camera').should('have.text', 'ONEPLUS A5000')
	})
})

describe('Edit the metadata of a photo', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
		cy.visit('/apps/photos')
	})

	it('Fills the form with the metadata of the photo', () => {
		openMetadataEditor(photo)

		// The precision of the coordinates depends on the server, and the taken
		// date is displayed in the timezone of the browser.
		fieldByLabel('Latitude').invoke('val').then((latitude) => {
			expect(Number(latitude)).to.be.closeTo(43.739, 0.001)
		})
		fieldByLabel('Longitude').invoke('val').then((longitude) => {
			expect(Number(longitude)).to.be.closeTo(5.313, 0.001)
		})
		fieldByLabel('Date and time the photo was taken').invoke('val').should('match', /^2019-10-2\d/)
	})

	it('Saves a corrected location and taken date', () => {
		openMetadataEditor(photo)

		fieldByLabel('Latitude').clear().type('48.8583')
		fieldByLabel('Longitude').clear().type('2.2945')
		fieldByLabel('Date and time the photo was taken').clear().type('2020-07-14T21:30')

		cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/**' }).as('metadataProppatch')
		cy.contains('button', 'Save').click()
		cy.wait('@metadataProppatch')

		cy.contains('h2', 'Edit metadata').should('not.exist')

		// Reopening reads the values back from the server.
		cy.reload()
		openMetadataEditor(photo)

		fieldByLabel('Latitude').should('have.value', '48.8583')
		fieldByLabel('Longitude').should('have.value', '2.2945')
		fieldByLabel('Date and time the photo was taken').should('have.value', '2020-07-14T21:30')
	})

	it('Refuses coordinates which are off world', () => {
		openMetadataEditor(photo)

		fieldByLabel('Latitude').clear().type('95')

		cy.contains('Enter decimal degrees between -90 and 90').should('be.visible')
		cy.contains('button', 'Save').should('be.disabled')
	})

	it('Refuses a single coordinate', () => {
		openMetadataEditor(photo)

		fieldByLabel('Longitude').clear()

		cy.contains('Both coordinates are required').should('be.visible')
		cy.contains('button', 'Save').should('be.disabled')
	})

	it('Removes the location of a photo', () => {
		openMetadataEditor(photo)

		cy.contains('button', 'Remove location').click()

		cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/**' }).as('metadataProppatch')
		cy.contains('button', 'Save').click()
		cy.wait('@metadataProppatch')

		cy.reload()
		openMetadataEditor(photo)

		fieldByLabel('Latitude').should('have.value', '')
		fieldByLabel('Longitude').should('have.value', '')
	})
})

describe('Reach the actions of a photo outside of the timeline', () => {
	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
			})
	})

	beforeEach(() => {
		cy.login(alice)
	})

	it('Manages a photo from the folders view', () => {
		cy.visit('/apps/photos/folders/Photos')

		openPhotoAction(photo, 'View metadata', 'Photo metadata')
		entryByName('Filename').should('have.text', photo)
	})

	it('Manages a photo from an album', () => {
		cy.visit('/apps/photos')
		createAnAlbumFromTimeline('Actions')
		navigateToTimeline('all-media')

		cy.intercept({ times: 1, method: 'COPY', url: '/remote.php/dav/files/**' }).as('copy')
		openPhotoAction(photo, 'Add to album', 'Add to Album')
		cy.get('[aria-label="Add selection to album Actions"]').click()
		cy.wait('@copy')

		navigateToCollection('albums', 'Actions')

		// Photos of an album are named after their id, the actions are about
		// the original file.
		openPhotoAction(photo, 'View metadata', 'Photo metadata')
		entryByName('Filename').should('have.text', photo)
	})

	it('Leaves the picking of photos alone', () => {
		cy.visit('/apps/photos')
		createAnAlbumFromTimeline('Picking')
		cy.get('[aria-label="Add photos to this album"]').first().click()
		cy.contains('h2', 'Add photos to Picking').should('be.visible')

		// Picking photos is not managing them.
		cy.get('[aria-label^="Actions for"]').should('not.exist')
	})
})

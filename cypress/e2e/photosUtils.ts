/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'
import axios from 'axios'

export function uploadTestMedia(user: User, destination = '/Photos') {
	cy.exec('ls cypress/fixtures/media')
		.then((result) => {
			for (const fileName of result.stdout.split('\n')) {
				cy.uploadFile(user, `media/${fileName}`, 'image/png', `/${destination}/${fileName}`)
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
	cy.intercept({ times: 1, method: 'DELETE' }).as('deleteRequests')
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete selection')
		.click()
		.wait('@deleteRequests')
}

export function mkdir(user: User, target: string) {
	// eslint-disable-next-line cypress/unsafe-to-chain-command
	cy.clearCookies()
		.then({ timeout: 8000 }, async () => {
			try {
				const rootPath = `${Cypress.env('baseUrl')}//remote.php/dav/files/${encodeURIComponent(user.userId)}`
				const filePath = target.split('/').map(encodeURIComponent).join('/')
				const response = await axios({
					url: `${rootPath}${filePath}`,
					method: 'MKCOL',
					auth: {
						username: user.userId,
						password: user.password,
					},
				})
				cy.log(`Created directory ${target}`, response)
			} catch (error) {
				cy.log('error', error)
				throw new Error('Unable to process fixture')
			}
		})
}

type SetupInfo = {
	snapshot: string
	alice: User
	bob: User
	charlie: User
}

export function setupPhotosTests(): Cypress.Chainable<SetupInfo> {
	return cy.task('getVariable', { key: 'timeline-data' })
		.then((_setupInfo) => {
			const setupInfo = _setupInfo as SetupInfo || {}
			if (setupInfo.snapshot) {
				cy.restoreState(setupInfo.snapshot)
			} else {
				cy.createRandomUser().then(user => { setupInfo.alice = user })
				cy.createRandomUser().then(user => { setupInfo.bob = user })
				cy.createRandomUser().then(user => { setupInfo.charlie = user })

				cy.then(() => {
					mkdir(setupInfo.alice, '/Photos')
					mkdir(setupInfo.bob, '/Photos')
					mkdir(setupInfo.charlie, '/Photos')
					uploadTestMedia(setupInfo.alice)
					uploadTestMedia(setupInfo.bob)
					uploadTestMedia(setupInfo.charlie)
				})

				cy.runOccCommand('files:scan --all --generate-metadata')

				cy.then(() => {
					cy.saveState().then((value) => { setupInfo.snapshot = value })
					cy.task('setVariable', { key: 'timeline-data', value: setupInfo })
				})
			}

			return cy.then(() => {
				cy.login(setupInfo.alice)
				cy.visit('/apps/photos')
				return cy.wrap(setupInfo)
			})
		})
}

export function navigateToCollections(collectionId: 'places'|'albums'|'sharedalbums') {
	cy.url()
		.then((url) => {
			if (!url.endsWith(`/apps/photos/${collectionId}/`) && !url.endsWith(`/apps/photos/${collectionId}`)) {
				cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/${collectionId}/` }).as('propFindCollections')
				cy.get(`[data-id-app-nav-item="${collectionId}"]`).click()
				cy.wait('@propFindCollections')
			}
		})
}

export function navigateToCollection(collectionId: 'places'|'albums'|'sharedalbums', collectionName: string) {
	cy.url()
		.then((url) => {
			if (!url.endsWith(`/apps/photos/${collectionId}/${encodeURIComponent(collectionName)}`)) {
				navigateToCollections(collectionId)

				cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/${collectionId}/${encodeURIComponent(collectionName)}` }).as('propFindCollection')
				cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/${collectionId}/${encodeURIComponent(collectionName)}/` }).as('propFindCollectionContent')
				cy.get('[data-cy-collections-list-collection="' + collectionName + '"]').click()
				cy.wait('@propFindCollection')
				cy.wait('@propFindCollectionContent')
			}
		})
}

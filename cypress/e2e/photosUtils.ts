/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import axios from 'axios'

/**
 *
 * @param user
 * @param destination
 */
export function uploadTestMedia(user: User, destination = '/Photos') {
	return cy.exec('ls cypress/fixtures/media')
		.then((result) => {
			const fileIdsMap = {} as Record<string, number>
			result.stdout.split('\n').map((fileName) => {
				cy.uploadFile(user, `media/${fileName}`, 'image/png', `/${destination}/${fileName}`)
					.then((fileId) => fileIdsMap[fileName] = fileId)
			})
			cy.log('Uploaded files:', JSON.stringify(fileIdsMap))
			return cy.wrap(fileIdsMap)
		})
}

/**
 *
 * @param indexes
 */
export function selectMedia(indexes: number[]) {
	indexes.forEach((index: number) => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').check({ force: true })
	})
}

/**
 *
 * @param indexes
 */
export function unselectMedia(indexes: number[]) {
	indexes.forEach((index: number) => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').uncheck({ force: true })
	})
}

/**
 *
 * @param selection
 */
export function selectAndFavorite(selection: number[]) {
	selectMedia(selection)

	cy.get('[aria-label="Open actions menu"]').click()

	cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/**' }).as('favoriteProppatch')
	cy.get('[aria-label="Mark selection as favorite"]').click()
	cy.wait('@favoriteProppatch')

	unselectMedia(selection)
}

/**
 *
 * @param selection
 */
export function selectAndUnfavorite(selection: number[]) {
	selectMedia(selection)

	cy.get('[aria-label="Open actions menu"]').click()

	cy.intercept({ times: 1, method: 'PROPPATCH', url: '/remote.php/dav/**' }).as('unfavoriteProppatch')
	cy.get('[aria-label="Remove selection from favorites"]').click()
	cy.wait('@unfavoriteProppatch')

	unselectMedia(selection)
}

/**
 *
 */
export function downloadSelection() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download selected files"]').trigger('click')
}

/**
 *
 */
export function downloadAllFiles() {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download all files in album"]').trigger('click')
}

/**
 *
 */
export function deleteSelection() {
	cy.intercept({ times: 1, method: 'DELETE' }).as('deleteRequests')
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete selection')
		.click()
		.wait('@deleteRequests')
}

/**
 * @param user - User to create directory for
 * @param target - Target path of the directory
 */
export function mkdir(user: User, target: string) {
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
	alicesFiles: Record<string, number>
	bobsFiles: Record<string, number>
	charliesFiles: Record<string, number>
}

/**
 *
 */
export function setupPhotosTests(): Cypress.Chainable<SetupInfo> {
	return cy.task('getVariable', { key: 'timeline-data' })
		.then((_setupInfo) => {
			const setupInfo = _setupInfo as SetupInfo || {}
			if (setupInfo.snapshot) {
				cy.restoreState(setupInfo.snapshot)
			} else {
				cy.createRandomUser().then((user) => {
					setupInfo.alice = user
				})
				cy.createRandomUser().then((user) => {
					setupInfo.bob = user
				})
				cy.createRandomUser().then((user) => {
					setupInfo.charlie = user
				})

				cy.then(() => {
					mkdir(setupInfo.alice, '/Photos')
					mkdir(setupInfo.bob, '/Photos')
					mkdir(setupInfo.charlie, '/Photos')
					uploadTestMedia(setupInfo.alice)
						.then((fileIdsMap) => setupInfo.alicesFiles = fileIdsMap)
					uploadTestMedia(setupInfo.bob)
						.then((fileIdsMap) => setupInfo.bobsFiles = fileIdsMap)
					uploadTestMedia(setupInfo.charlie)
						.then((fileIdsMap) => setupInfo.charliesFiles = fileIdsMap)
				})

				cy.runOccCommand('files:scan --all --generate-metadata')

				cy.then(() => {
					cy.saveState().then((value) => {
						setupInfo.snapshot = value
					})
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

/**
 *
 * @param collectionId
 */
export function navigateToCollections(collectionId: 'places' | 'albums' | 'sharedalbums') {
	cy.url()
		.then((url) => {
			if (!url.endsWith(`/apps/photos/${collectionId}/`) && !url.endsWith(`/apps/photos/${collectionId}`)) {
				cy.intercept({ times: 1, method: 'PROPFIND', url: `/remote.php/dav/photos/*/${collectionId}/` }).as('propFindCollections')
				cy.get(`[data-id-app-nav-item="${collectionId}"]`).click()
				cy.wait('@propFindCollections')
			}
		})
}

/**
 *
 * @param collectionId
 * @param collectionName
 */
export function navigateToCollection(collectionId: 'places' | 'albums' | 'sharedalbums', collectionName: string) {
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

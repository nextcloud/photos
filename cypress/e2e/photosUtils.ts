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
				const rootPath = `${Cypress.env('baseUrl')}/remote.php/dav/files/${encodeURIComponent(user.userId)}`
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

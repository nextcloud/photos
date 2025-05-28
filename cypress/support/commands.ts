/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { addCommands } from '@nextcloud/cypress'
import axios from 'axios'
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command'
import { basename } from 'path'

// Add custom commands
import 'cypress-wait-until'
addCommands()
addCompareSnapshotCommand()

// Register this file's custom commands types
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
		interface Chainable<Subject = any> {
			/**
			 * Upload a file from the fixtures folder to a given user storage.
			 * **Warning**: Using this function will reset the previous session
			 */
			uploadFile(user: User, fixture?: string, mimeType?: string, target?: string): Cypress.Chainable<number>

			/**
			 * Upload a raw content to a given user storage.
			 * **Warning**: Using this function will reset the previous session
			 */
			uploadContent(user: User, content: Blob, mimeType: string, target: string): Cypress.Chainable<number>
		}
	}
}

const url = (Cypress.config('baseUrl') || '').replace(/\/index.php\/?$/g, '')
Cypress.env('baseUrl', url)

/**
 * cy.uploadedFile - uploads a file from the fixtures folder
 * TODO: standardise in @nextcloud/cypress
 *
 * @param {User} user the owner of the file, e.g. admin
 * @param {string} fixture the fixture file name, e.g. image1.jpg
 * @param {string} mimeType e.g. image/png
 * @param {string} [target] the target of the file relative to the user root
 */
Cypress.Commands.add('uploadFile', (user, fixture = 'image.jpg', mimeType = 'image/jpeg', target = `/${fixture}`) => {
	// get fixture
	return cy.fixture(fixture, 'base64').then((file) => {
		// convert the base64 string to a blob
		const blob = Cypress.Blob.base64StringToBlob(file, mimeType)
		return cy.uploadContent(user, blob, mimeType, target)
	})
})

/**
 * cy.uploadedContent - uploads a raw content
 * TODO: standardise in @nextcloud/cypress
 *
 * @param {User} user the owner of the file, e.g. admin
 * @param {Blob} blob the content to upload
 * @param {string} mimeType e.g. image/png
 * @param {string} target the target of the file relative to the user root
 */
Cypress.Commands.add('uploadContent', (user, blob, mimeType, target) => {
	return cy.clearCookies()
		.then(async () => {
			const fileName = basename(target)

			// Process paths
			const rootPath = `${Cypress.env('baseUrl')}/remote.php/dav/files/${encodeURIComponent(user.userId)}`
			const filePath = target.split('/').map(encodeURIComponent).join('/')
			try {
				const file = new File([blob], fileName, { type: mimeType })
				return axios({
					url: `${rootPath}${filePath}`,
					method: 'PUT',
					data: file,
					headers: {
						'Content-Type': mimeType,
					},
					auth: {
						username: user.userId,
						password: user.password,
					},
				}).then((response) => {
					cy.log(`Uploaded content as ${fileName}`, response)
					return Number.parseInt(response.headers['oc-fileid'].split('oc')[0])
				})
			} catch (error) {
				cy.log('error', error)
				throw new Error('Unable to process fixture')
			}
		})
})

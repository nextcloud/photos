/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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

/// <reference types="Cypress" />

const url = Cypress.config('baseUrl').replace(/\/index.php\/?$/g, '')
Cypress.env('baseUrl', url)

Cypress.Commands.add('login', (user, password, route = '/apps/files') => {
	cy.clearCookies()
	Cypress.Cookies.defaults({
		preserve: /^(oc|nc)/,
	})
	cy.visit(route)
	cy.get('input[name=user]').type(user)
	cy.get('input[name=password]').type(password)
	cy.get('form[name=login] [type=submit]').click()
	cy.url().should('include', route)
})

Cypress.Commands.add('logout', () => {
	cy.visit('')
	cy.getCookies()
		.then(cookies => {
			if (cookies.length === 0) {
				cy.log('Not logged, skipping logout...')
				return
			}

			return cy.get("body")
				.then($body => {
					const logout = $body.find('#expanddiv li[data-id="logout"] a')
					if (logout.length > 0) {
						cy.log('Loging out...')
						cy.visit(logout[0].href)
					} else {
						cy.log('Nothing')
					}
				})
		})
})

Cypress.Commands.add('nextcloudCreateUser', (user, password) => {
	cy.clearCookies()
	cy.visit('/')
	cy.request({
		method: 'POST',
		url: `${Cypress.env('baseUrl')}/ocs/v1.php/cloud/users?format=json`,
		form: true,
		body: {
			userid: user,
			password,
		},
		auth: { user: 'admin', pass: 'admin' },
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'OCS-ApiRequest': 'true',
			Authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
		},
	})
})

Cypress.Commands.add('uploadTestMedia', () => {
	cy.exec('ls cypress/fixtures/media')
		.then((result) => {
			for (const fileName of result.stdout.split('\n')) {
				cy.uploadFile(`media/${fileName}`, 'image/png', '', fileName)
			}
		})
})

/**
 * cy.uploadedFile - uploads a file from the fixtures folder
 *
 * @param {string} fixtureFileName
 * @param {string} mimeType eg. image/png
 * @param {string} path  to the folder in which this file should be uploaded
 * @param {string} uploadedFileName  alternative name to give the file while uploading
 */
Cypress.Commands.add('uploadFile', (fixtureFileName, mimeType, path = '', uploadedFileName = null) => {
	if (uploadedFileName === null) {
		uploadedFileName = fixtureFileName;
	}

	let file = null

	return cy.fixture(fixtureFileName, 'base64')
		.then(fileBase64 => {
			// convert the logo base64 string to a blob
			const blob = Cypress.Blob.base64StringToBlob(fileBase64, mimeType)
			file = new File([blob], uploadedFileName, { type: mimeType })
			return cy.window()
		})
		.then(window => {
			const encodedPath = path.split("/")
				.map(encodeURIComponent)
				.join("/")

			const url = `${Cypress.env('baseUrl')}/remote.php/webdav${encodedPath}/${encodeURIComponent(uploadedFileName)}`
			return cy.request({
				method: 'PUT',
				url,
				body: file,
				encoding: 'binary',
				headers: {
					'Content-Type': mimeType,
					requesttoken: window.OC.requestToken,
				},
			})
		})
})

Cypress.Commands.add('selectMedia', (indexes) => {
	indexes.forEach(index => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').check({ force: true })
	})
})

Cypress.Commands.add('unselectMedia', indexes => {
	indexes.forEach(index => {
		cy.get('[data-test="media"]').eq(index)
			.find('a').focus()
			.parent().find('input').uncheck({ force: true })
	})
})

Cypress.Commands.add('favoriteSelection', () => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Mark selection as favorite"]').click()
})

Cypress.Commands.add('unfavoriteSelection', () => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Remove selection from favorites"]').click()
})

Cypress.Commands.add('downloadSelection', () => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download selected files"]').trigger('click')
})

Cypress.Commands.add('downloadAllFiles', () => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.get('[aria-label="Download all files in album"]').trigger('click')
})

Cypress.Commands.add('createAnAlbumFromTimeline', albumName => {
	cy.contains('Add').click()
	cy.contains('Create new album').click()
	cy.get('form [name="name"]').type(albumName)
	cy.contains('Create album').click()
})

Cypress.Commands.add('createAnAlbumFromAlbums', albumName => {
	cy.contains('New album').click()
	cy.get('form [name="name"]').type(albumName)
	cy.contains('Create album').click()
})

Cypress.Commands.add('deleteAnAlbumFromAlbumContent', albumName => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains('Delete album').click()
})

Cypress.Commands.add('addFilesToAlbumFromTimeline', albumName => {
	cy.contains('Add to album').click()
	cy.get('.album-picker ul').contains(albumName).click()
})

Cypress.Commands.add('addFilesToAlbumFromAlbum', (albumName, itemsIndex) => {
	cy.get('[aria-label="Add photos to this album"]').click()
	cy.get('.file-picker__file-list').within(() => {
		cy.selectMedia(itemsIndex)
	})
	cy.contains(`Add to ${albumName}`).click()
})

Cypress.Commands.add('deleteSelection', () => {
	cy.intercept({ method: 'DELETE' }).as("deleteRequests");
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains("Delete selection")
		.click()
		.wait('@deleteRequests')
})

Cypress.Commands.add('removeSelectionFromAlbum', () => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains("Remove selection from album").click()
})

Cypress.Commands.add('goToAlbum', albumName => {
	cy.get('.app-navigation__list').contains('Albums').click()
	cy.get('ul.collections__list').contains(albumName).click()
})

Cypress.Commands.add('goToSharedAlbum', albumName => {
	cy.get('.app-navigation__list').contains('Collaborative albums').click()
	cy.get('ul.collections__list').contains(albumName).click()
})

Cypress.Commands.add('addCollaborators', collaborators => {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator) => {
		cy.get('[aria-label="Search for collaborators"').type(collaborator)
		cy.contains(collaborator).click()
	})
	cy.contains('Save').click()
})

Cypress.Commands.add('removeCollaborators', collaborators => {
	cy.get('[aria-label="Manage collaborators for this album"]').click()
	collaborators.forEach((collaborator) => {
		cy.get('[aria-label="Search for collaborators"').type(collaborator)
		cy.contains(collaborator).click()
	})
	cy.contains('Save').click()
})

Cypress.Commands.add('removeSharedAlbums', collaborators => {
	cy.get('[aria-label="Open actions menu"]').click()
	cy.contains("Remove selection from album").click()
})

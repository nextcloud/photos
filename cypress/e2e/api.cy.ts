/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/cypress'

import { randHash } from '../utils/index.js'
import { addCollaborators, addFilesToAlbumFromTimeline, createAnAlbumFromAlbums, createPublicShare } from './albumsUtils.ts'
import { navigateToCollection, selectMedia, setupPhotosTests } from './photosUtils.ts'
import { navigateToTimeline } from './timelinesUtils.ts'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
	/* returning false here prevents Cypress from failing the test */
	if (resizeObserverLoopErrRe.test(err.message)) {
		return false
	}
})

const base = Cypress.config('baseUrl')!.replace(/\/index\.php\/?/, '')

describe('Test DAV API', () => {
	let alice: User
	let bob: User
	let charlie: User
	let alicesFiles: Record<string, number>
	let publicShareUrl: string
	let publicShareToken: string
	let albumName: string

	before(() => {
		setupPhotosTests()
			.then((setupInfo) => {
				alice = setupInfo.alice
				bob = setupInfo.bob
				charlie = setupInfo.charlie
				alicesFiles = setupInfo.alicesFiles

				cy.login(alice)
				cy.visit('/apps/photos')

				albumName = `test_album_${randHash()}`

				createAnAlbumFromAlbums(albumName)
				navigateToTimeline('all-media')
				selectMedia([0])
				addFilesToAlbumFromTimeline(albumName)
				navigateToCollection('albums', albumName)
				addCollaborators([bob.userId])
				createPublicShare()
					.then((url) => {
						publicShareUrl = url
						publicShareToken = publicShareUrl.split('/').pop() as string
					})

				cy.logout()
			})
	})

	it('Should not allow MKCOL in an album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${alice.userId}/albums/${albumName}/folder`,
			auth: { user: alice.userId, pass: alice.password },
			method: 'MKCOL',
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Not allowed to create directories in an album')
			})
	})

	it('Should not allow MKCOL in shared albums', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${alice.userId}/sharedalbums/${albumName}_2`,
			auth: { user: alice.userId, pass: alice.password },
			method: 'MKCOL',
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Not allowed to create folders in shared albums home')
			})
	})

	it('Should not allow MKCOL in public albums', () => {
		cy.request({
			url: `${base}/remote.php/dav/photospublic/test`,
			auth: { user: alice.userId, pass: alice.password },
			method: 'MKCOL',
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Permission denied to create director')
			})
	})

	it('Should not allow to rename shared album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName} (${alice.userId})`,
			method: 'MOVE',
			auth: { user: bob.userId, pass: bob.password },
			headers: { Destination: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName}_renamed` },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Not allowed to rename a shared album')
			})
	})

	it('Should not allow to rename a public shared album', () => {
		cy.visit(publicShareUrl)

		return cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}`,
			method: 'MOVE',
			headers: { Destination: `${base}/remote.php/dav/photospublic/${publicShareToken}_renamed` },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Not allowed to rename a public album')
			})
	})

	it('Should not allow to set collaborator of shared album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName} (${alice.userId})`,
			method: 'PROPPATCH',
			auth: { user: bob.userId, pass: bob.password },
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:collaborators>
							[{"id": "${charlie.userId}", "type": 0}]
						</nc:collaborators>
					</d:prop>
				</d:set>
				</d:propertyupdate>

			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Setting the collaborators is not allowed on this type of album')
			})
	})

	it('Should not allow to create a public link of shared album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName} (${alice.userId})`,
			method: 'PROPPATCH',
			auth: { user: bob.userId, pass: bob.password },
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:collaborators>
							[{"id": "", "type": 3}]
						</nc:collaborators>
					</d:prop>
				</d:set>
				</d:propertyupdate>

			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Setting the collaborators is not allowed on this type of album')
			})
	})

	it('Should not allow to set collaborator of public album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}`,
			method: 'PROPPATCH',
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:collaborators>
							[{"id": "${charlie.userId}", "type": 0}]
						</nc:collaborators>
					</d:prop>
				</d:set>
				</d:propertyupdate>

			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Setting the collaborators is not allowed on this type of album')
			})
	})

	it('Should not allow to set filters of shared album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName} (${alice.userId})`,
			method: 'PROPPATCH',
			auth: { user: bob.userId, pass: bob.password },
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:filters>
							[{"filter": {}}]
						</nc:filters>
					</d:prop>
				</d:set>
				</d:propertyupdate>
			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Setting the filters is not allowed on this type of album')
			})
	})

	it('Should not allow to set filters of public album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}`,
			method: 'PROPPATCH',
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:filters>
							[{"filter": {}}]
						</nc:filters>
					</d:prop>
				</d:set>
				</d:propertyupdate>
			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Setting the filters is not allowed on this type of album')
			})
	})

	it('Should not allow to add files to a public album', () => {
		const file = new File([new Blob(['v1'])], 'photo.jpg', { type: 'image/jpeg' })
		cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}/photo.jpg`,
			method: 'PUT',
			body: file,
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Not allowed to create a file in a public album')
			})
	})

	it('Should not allow to delete a photo from a public album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}/${alicesFiles['IMG_20200101_154159.jpg']}-IMG_20200101_154159.jpg`,
			method: 'DELETE',
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Deleting photos from a public album is not allowed')
			})
	})

	it('Should not allow to favorite a photo from a shared album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photos/${bob.userId}/sharedalbums/${albumName} (${alice.userId})/${alicesFiles['IMG_20200101_154159.jpg']}-IMG_20200101_154159.jpg`,
			method: 'PROPPATCH',
			auth: { user: bob.userId, pass: bob.password },
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:set>
					<d:prop>
						<oc:favorite>1</oc:favorite>
					</d:prop>
				</d:set>
				</d:propertyupdate>
			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Only the owner can favorite its photos')
			})
	})

	it('Should not allow to favorite a photo from a public album', () => {
		cy.request({
			url: `${base}/remote.php/dav/photospublic/${publicShareToken}/${alicesFiles['IMG_20200101_154159.jpg']}-IMG_20200101_154159.jpg`,
			method: 'PROPPATCH',
			body: `<?xml version="1.0"?>
				<d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:set>
					<d:prop>
						<oc:favorite>1</oc:favorite>
					</d:prop>
				</d:set>
				</d:propertyupdate>
			`,
			headers: { 'Content-Type': 'application/xml' },
			failOnStatusCode: false,
		})
			.then(({ status, body }) => {
				expect(status).to.equal(403)
				expect(body).to.contain('Only the owner can favorite its photos')
			})
	})
})

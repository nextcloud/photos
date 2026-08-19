/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { APIRequestContext, APIResponse } from '@playwright/test'
import type { SharedAlbumApi } from '../support/fixtures/album-api.ts'

import { expect, test } from '../support/fixtures/album-api.ts'
import { albumsDavUrl, basicAuth, PUBLIC_PHOTOS_DAV_ROOT, sharedAlbumsDavUrl } from '../support/utils/dav.ts'

/**
 * The album endpoints expose collections that are not folders: a shared album is
 * owned by somebody else, a public album by nobody at all. Every operation that
 * would not make sense on them has to be refused rather than half-applied — which
 * is what this spec pins down, straight against the DAV endpoints.
 *
 * The messages are asserted alongside the status so that a rejection for the
 * wrong reason cannot pass as the expected one.
 */

/** Where a public album lives, addressed by the token of its link. */
function publicAlbumUrl({ publicToken }: SharedAlbumApi, path = ''): string {
	return `${PUBLIC_PHOTOS_DAV_ROOT}/${publicToken}${path}`
}

/**
 * Run a DAV request that is expected to be refused.
 *
 * @param request - Request context to use
 * @param options - The request to run
 * @param options.method - HTTP method
 * @param options.url - Absolute path of the request
 * @param options.headers - Headers of the request, including any credentials
 * @param options.data - Body of the request
 */
async function dav(
	request: APIRequestContext,
	{ method, url, headers, data }: { method: string, url: string, headers?: Record<string, string>, data?: string },
): Promise<APIResponse> {
	return request.fetch(url, { method, headers, ...(data === undefined ? {} : { data }) })
}

/**
 * A PROPPATCH body setting a single property.
 *
 * @param property - Name of the property, without its namespace prefix
 * @param value - Value to set
 * @param namespace - Prefix and URI of the namespace of the property
 */
function propPatch(property: string, value: string, namespace: 'nc' | 'oc' = 'nc'): string {
	const uri = namespace === 'nc' ? 'http://nextcloud.org/ns' : 'http://owncloud.org/ns'
	return `<?xml version="1.0"?>
		<d:propertyupdate xmlns:d="DAV:" xmlns:${namespace}="${uri}">
			<d:set>
				<d:prop><${namespace}:${property}>${value}</${namespace}:${property}></d:prop>
			</d:set>
		</d:propertyupdate>`
}

const XML_HEADERS = { 'Content-Type': 'application/xml' }

test.describe('Creating collections where there can be none', () => {
	test('refuses a directory inside an album', async ({ api, sharedAlbum }) => {
		const { owner, albumName } = sharedAlbum

		const response = await dav(api, {
			method: 'MKCOL',
			url: `${albumsDavUrl(owner, albumName)}/folder`,
			headers: basicAuth(owner),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Not allowed to create directories in an album')
	})

	test('refuses an album in the shared albums home', async ({ api, sharedAlbum }) => {
		const { owner, albumName } = sharedAlbum

		const response = await dav(api, {
			method: 'MKCOL',
			url: sharedAlbumsDavUrl(owner, `${albumName}_2`),
			headers: basicAuth(owner),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Not allowed to create folders in shared albums home')
	})

	test('refuses a collection in the public albums endpoint', async ({ api, sharedAlbum }) => {
		const { owner } = sharedAlbum

		const response = await dav(api, {
			method: 'MKCOL',
			url: `${PUBLIC_PHOTOS_DAV_ROOT}/test`,
			headers: basicAuth(owner),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Permission denied to create director')
	})
})

test.describe('Renaming an album somebody else owns', () => {
	test('refuses to rename a shared album', async ({ api, sharedAlbum }) => {
		const { collaborator, sharedAlbumName, albumName } = sharedAlbum

		const response = await dav(api, {
			method: 'MOVE',
			url: sharedAlbumsDavUrl(collaborator, sharedAlbumName),
			headers: {
				...basicAuth(collaborator),
				Destination: sharedAlbumsDavUrl(collaborator, `${albumName}_renamed`),
			},
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Not allowed to rename a shared album')
	})

	test('refuses to rename a public album', async ({ api, sharedAlbum }) => {
		const { publicToken } = sharedAlbum

		const response = await dav(api, {
			method: 'MOVE',
			url: publicAlbumUrl(sharedAlbum),
			headers: { Destination: `${PUBLIC_PHOTOS_DAV_ROOT}/${publicToken}_renamed` },
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Not allowed to rename a public album')
	})
})

test.describe('Re-sharing an album somebody else owns', () => {
	test('refuses to set the collaborators of a shared album', async ({ api, sharedAlbum }) => {
		const { collaborator, outsider, sharedAlbumName } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: sharedAlbumsDavUrl(collaborator, sharedAlbumName),
			headers: { ...basicAuth(collaborator), ...XML_HEADERS },
			data: propPatch('collaborators', `[{"id": "${outsider.userId}", "type": 0}]`),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Setting the collaborators is not allowed on this type of album')
	})

	test('refuses to create a public link of a shared album', async ({ api, sharedAlbum }) => {
		const { collaborator, sharedAlbumName } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: sharedAlbumsDavUrl(collaborator, sharedAlbumName),
			headers: { ...basicAuth(collaborator), ...XML_HEADERS },
			data: propPatch('collaborators', '[{"id": "", "type": 3}]'),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Setting the collaborators is not allowed on this type of album')
	})

	test('refuses to set the collaborators of a public album', async ({ api, sharedAlbum }) => {
		const { outsider } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: publicAlbumUrl(sharedAlbum),
			headers: XML_HEADERS,
			data: propPatch('collaborators', `[{"id": "${outsider.userId}", "type": 0}]`),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Setting the collaborators is not allowed on this type of album')
	})
})

test.describe('Turning an album somebody else owns into a smart album', () => {
	test('refuses to set the filters of a shared album', async ({ api, sharedAlbum }) => {
		const { collaborator, sharedAlbumName } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: sharedAlbumsDavUrl(collaborator, sharedAlbumName),
			headers: { ...basicAuth(collaborator), ...XML_HEADERS },
			data: propPatch('filters', '[{"filter": {}}]'),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Setting the filters is not allowed on this type of album')
	})

	test('refuses to set the filters of a public album', async ({ api, sharedAlbum }) => {
		const response = await dav(api, {
			method: 'PROPPATCH',
			url: publicAlbumUrl(sharedAlbum),
			headers: XML_HEADERS,
			data: propPatch('filters', '[{"filter": {}}]'),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Setting the filters is not allowed on this type of album')
	})
})

test.describe('Changing the photos of a public album', () => {
	test('refuses to add a photo', async ({ api, sharedAlbum }) => {
		const response = await dav(api, {
			method: 'PUT',
			url: publicAlbumUrl(sharedAlbum, '/photo.jpg'),
			headers: { 'Content-Type': 'image/jpeg' },
			data: 'not really a photo',
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Not allowed to create a file in a public album')
	})

	test('refuses to delete a photo', async ({ api, sharedAlbum }) => {
		const { photoName } = sharedAlbum

		const response = await dav(api, {
			method: 'DELETE',
			url: publicAlbumUrl(sharedAlbum, `/${encodeURIComponent(photoName)}`),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Deleting photos from a public album is not allowed')
	})
})

test.describe('Favoriting a photo of somebody else', () => {
	test('refuses to favorite a photo of a shared album', async ({ api, sharedAlbum }) => {
		const { collaborator, sharedAlbumName, photoName } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: `${sharedAlbumsDavUrl(collaborator, sharedAlbumName)}/${encodeURIComponent(photoName)}`,
			headers: { ...basicAuth(collaborator), ...XML_HEADERS },
			data: propPatch('favorite', '1', 'oc'),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Only the owner can favorite its photos')
	})

	test('refuses to favorite a photo of a public album', async ({ api, sharedAlbum }) => {
		const { photoName } = sharedAlbum

		const response = await dav(api, {
			method: 'PROPPATCH',
			url: publicAlbumUrl(sharedAlbum, `/${encodeURIComponent(photoName)}`),
			headers: XML_HEADERS,
			data: propPatch('favorite', '1', 'oc'),
		})

		expect(response.status()).toBe(403)
		expect(await response.text()).toContain('Only the owner can favorite its photos')
	})
})

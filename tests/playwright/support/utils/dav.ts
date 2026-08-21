/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext, APIResponse } from '@playwright/test'

/** WebDAV endpoint of the photos app, the collections are exposed under it. */
export const PHOTOS_DAV_ROOT = '/remote.php/dav/photos'

/** WebDAV endpoint of a public album, reached with the share token as the user. */
export const PUBLIC_PHOTOS_DAV_ROOT = '/remote.php/dav/photospublic'

/** WebDAV endpoint of recognize, the faces are exposed under it. */
export const RECOGNIZE_DAV_ROOT = '/remote.php/dav/recognize'

/**
 * Type of a collaborator of an album, mirroring `ShareType` of the app and
 * `AlbumMapper::TYPE_*` of the server.
 */
export const CollaboratorType = {
	User: 0,
	Group: 1,
	Link: 3,
} as const

export interface Collaborator {
	/** Account or group id, empty when asking the server to mint a public link. */
	id: string
	type: (typeof CollaboratorType)[keyof typeof CollaboratorType]
}

/**
 * Authenticate a DAV request as an account with Basic auth.
 *
 * The seeding helpers below run before — and independently of — any browser
 * session, so they cannot borrow a session cookie and its CSRF token. Basic auth
 * needs neither, which also means one request context can act as any account.
 *
 * @param user - Account to authenticate as
 */
export function basicAuth(user: User): Record<string, string> {
	return { Authorization: `Basic ${Buffer.from(`${user.userId}:${user.password}`).toString('base64')}` }
}

/**
 * Encode a path for a URL without encoding its separators.
 *
 * @param path - Path to encode, with `/` as the separator
 */
function encodePath(path: string): string {
	return path.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

/**
 * The files endpoint of an account.
 *
 * @param user - Owner of the path
 * @param path - Path relative to the account's root
 */
export function filesDavUrl(user: User, path = ''): string {
	return `/remote.php/dav/files/${encodeURIComponent(user.userId)}${encodePath(`/${path}`.replace(/\/+/g, '/'))}`
}

/**
 * The albums endpoint of an account.
 *
 * @param user - Owner of the albums
 * @param albumName - Name of an album, omit for the album list itself
 */
export function albumsDavUrl(user: User, albumName = ''): string {
	const suffix = albumName === '' ? '' : `/${encodeURIComponent(albumName)}`
	return `${PHOTOS_DAV_ROOT}/${encodeURIComponent(user.userId)}/albums${suffix}`
}

/**
 * The shared albums endpoint of an account.
 *
 * @param user - Account the albums are shared with
 * @param albumName - Name of a shared album, omit for the list itself
 */
export function sharedAlbumsDavUrl(user: User, albumName = ''): string {
	const suffix = albumName === '' ? '' : `/${encodeURIComponent(albumName)}`
	return `${PHOTOS_DAV_ROOT}/${encodeURIComponent(user.userId)}/sharedalbums${suffix}`
}

/**
 * Statuses that say "the server was busy", not "the request was wrong".
 *
 * Writing a file extracts its metadata and propagates the size of its folder,
 * both inside a transaction — and every worker of the run does that against the
 * same SQLite database. Losing that race is answered with a locked or
 * unavailable status, which says nothing about what a test is checking.
 */
const TRANSIENT_STATUSES = [423, 429, 500, 503]

/** How long to back off before retrying a request the server was too busy for. */
const RETRY_DELAY = 800

/**
 * Run a request, once more if the server was too busy to answer it.
 *
 * @param request - Request context to use
 * @param url - Absolute path of the request
 * @param options - Method, headers and body of the request
 */
async function fetchWithRetry(
	request: APIRequestContext,
	url: string,
	options: Parameters<APIRequestContext['fetch']>[1],
): Promise<APIResponse> {
	const response = await request.fetch(url, options)
	if (!TRANSIENT_STATUSES.includes(response.status())) {
		return response
	}

	await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
	return request.fetch(url, options)
}

/**
 * Run a DAV request as an account and fail on anything but a success status.
 *
 * @param request - Request context to use, any one will do as the account is
 * carried by the Basic auth header
 * @param user - Account to act as
 * @param method - HTTP method
 * @param url - Absolute path of the request
 * @param options - Body and extra headers of the request
 * @param options.data - Body of the request
 * @param options.headers - Extra headers of the request
 */
async function davRequest(
	request: APIRequestContext,
	user: User,
	method: string,
	url: string,
	{ data, headers }: { data?: string | Buffer, headers?: Record<string, string> } = {},
): Promise<string> {
	const response = await fetchWithRetry(request, url, {
		method,
		headers: { ...basicAuth(user), ...headers },
		...(data === undefined ? {} : { data }),
	})

	if (!response.ok()) {
		throw new Error(`${method} ${url} as "${user.userId}" failed with status ${response.status()}: ${await response.text()}`)
	}

	return response.text()
}

/**
 * Create a directory in the home of an account.
 *
 * @param request - Request context to use
 * @param user - Owner of the directory
 * @param path - Path of the directory, relative to the account's root
 */
export async function mkdir(request: APIRequestContext, user: User, path: string): Promise<void> {
	await davRequest(request, user, 'MKCOL', filesDavUrl(user, path))
}

/**
 * Upload a file into the home of an account.
 *
 * @param request - Request context to use
 * @param user - Owner of the file
 * @param path - Target path, relative to the account's root
 * @param content - Contents of the file
 * @param mimeType - Mime type to store the file under
 * @return The file id the server assigned, which is how the app addresses photos
 */
export async function uploadFile(
	request: APIRequestContext,
	user: User,
	path: string,
	content: Buffer,
	mimeType: string,
): Promise<string> {
	const url = filesDavUrl(user, path)
	const response = await fetchWithRetry(request, url, {
		method: 'PUT',
		headers: { ...basicAuth(user), 'Content-Type': mimeType },
		data: content,
	})

	if (!response.ok()) {
		throw new Error(`PUT ${url} as "${user.userId}" failed with status ${response.status()}: ${await response.text()}`)
	}

	const fileId = response.headers()['oc-fileid']
	if (fileId === undefined) {
		throw new Error(`PUT ${url} did not return a file id`)
	}

	// The header carries the id together with the instance id ("42ocabc…"), the
	// app only ever uses the numeric part of it.
	return String(Number.parseInt(fileId, 10))
}

/**
 * Read the place a photo was taken at, as the server resolved it out of the
 * coordinates the picture carries.
 *
 * @param request - Request context to use
 * @param user - Owner of the photo
 * @param path - Path of the photo, relative to the account's root
 * @return The name of the place, empty when the server resolved none
 */
export async function readPhotoPlace(request: APIRequestContext, user: User, path: string): Promise<string> {
	const body = await davRequest(request, user, 'PROPFIND', filesDavUrl(user, path), {
		headers: { 'Content-Type': 'application/xml', Depth: '0' },
		data: `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:prop><nc:metadata-photos-place /></d:prop>
			</d:propfind>`,
	})

	return body.match(/<[^>]*metadata-photos-place>([^<]*)</)?.[1] ?? ''
}

/**
 * Create an album.
 *
 * @param request - Request context to use
 * @param user - Owner of the album
 * @param albumName - Name of the album
 */
export async function createAlbum(request: APIRequestContext, user: User, albumName: string): Promise<void> {
	await davRequest(request, user, 'MKCOL', albumsDavUrl(user, albumName))
}

/**
 * Add a photo of an account's home to one of its albums.
 *
 * @param request - Request context to use
 * @param user - Owner of both the photo and the album
 * @param albumName - Name of the album
 * @param path - Path of the photo, relative to the account's root
 */
export async function addPhotoToAlbum(request: APIRequestContext, user: User, albumName: string, path: string): Promise<void> {
	const name = path.split('/').pop() as string
	await davRequest(request, user, 'COPY', filesDavUrl(user, path), {
		headers: { Destination: `${albumsDavUrl(user, albumName)}/${encodeURIComponent(name)}` },
	})
}

/**
 * Set the collaborators of an album, replacing the ones it has.
 *
 * @param request - Request context to use
 * @param user - Owner of the album
 * @param albumName - Name of the album
 * @param collaborators - The collaborators the album should end up with. An entry
 * of type `Link` with an empty id asks the server to mint a public link token.
 */
export async function setAlbumCollaborators(
	request: APIRequestContext,
	user: User,
	albumName: string,
	collaborators: Collaborator[],
): Promise<void> {
	await davRequest(request, user, 'PROPPATCH', albumsDavUrl(user, albumName), {
		headers: { 'Content-Type': 'application/xml' },
		data: `<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:collaborators>${JSON.stringify(collaborators)}</nc:collaborators>
					</d:prop>
				</d:set>
			</d:propertyupdate>`,
	})
}

/**
 * Share an album through a public link and return the token of that link.
 *
 * The token is minted by the server, so it has to be read back from the album.
 * It is the only 32 character alphanumeric id among the collaborators — account
 * and group ids are the short random names the test accounts are created with.
 *
 * @param request - Request context to use
 * @param user - Owner of the album
 * @param albumName - Name of the album
 * @param collaborators - Accounts and groups to keep as collaborators
 * @return The token of the public link
 */
export async function createAlbumPublicLink(
	request: APIRequestContext,
	user: User,
	albumName: string,
	collaborators: Collaborator[] = [],
): Promise<string> {
	await setAlbumCollaborators(request, user, albumName, [
		...collaborators,
		{ id: '', type: CollaboratorType.Link },
	])

	const body = await davRequest(request, user, 'PROPFIND', albumsDavUrl(user, albumName), {
		headers: { 'Content-Type': 'application/xml', Depth: '0' },
		data: `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:prop><nc:collaborators /></d:prop>
			</d:propfind>`,
	})

	const token = [...body.matchAll(/<[^>]*id>([^<]+)<\/[^>]*id>/g)]
		.map(([, id]) => id)
		.find((id) => /^[A-Za-z0-9]{32}$/.test(id))

	if (token === undefined) {
		throw new Error(`No public link token found among the collaborators of "${albumName}": ${body}`)
	}

	return token
}

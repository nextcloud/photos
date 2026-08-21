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

/** WebDAV endpoint of the tags of the instance. */
export const SYSTEMTAGS_DAV_ROOT = '/remote.php/dav/systemtags'

/** WebDAV endpoint of the tags assigned to a file. */
export const TAG_ASSIGNMENTS_DAV_ROOT = '/remote.php/dav/systemtags-relations/files'

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
 * Copy a file inside the home of an account.
 *
 * @param request - Request context to use
 * @param user - Owner of both paths
 * @param sourcePath - Path of the file to copy, relative to the account's root
 * @param targetPath - Path of the copy, relative to the account's root
 */
export async function copyFile(request: APIRequestContext, user: User, sourcePath: string, targetPath: string): Promise<void> {
	await davRequest(request, user, 'COPY', filesDavUrl(user, sourcePath), {
		headers: { Destination: filesDavUrl(user, targetPath) },
	})
}

/**
 * Set the moment a photo was taken at, the way the metadata editor of the app
 * does.
 *
 * @param request - Request context to use
 * @param user - Owner of the photo
 * @param path - Path of the photo, relative to the account's root
 * @param takenAt - Moment the photo should count as taken at
 */
export async function setPhotoTakenAt(request: APIRequestContext, user: User, path: string, takenAt: Date): Promise<void> {
	await davRequest(request, user, 'PROPPATCH', filesDavUrl(user, path), {
		headers: { 'Content-Type': 'application/xml' },
		data: `<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						<nc:metadata-photos-original_date_time>${Math.floor(takenAt.getTime() / 1000)}</nc:metadata-photos-original_date_time>
					</d:prop>
				</d:set>
			</d:propertyupdate>`,
	})
}

/**
 * Drop the coordinates of a photo, as the metadata editor of the app does.
 *
 * @param request - Request context to use
 * @param user - Owner of the photo
 * @param path - Path of the photo, relative to the account's root
 */
export async function removePhotoLocation(request: APIRequestContext, user: User, path: string): Promise<void> {
	await davRequest(request, user, 'PROPPATCH', filesDavUrl(user, path), {
		headers: { 'Content-Type': 'application/xml' },
		data: `<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:remove>
					<d:prop><nc:metadata-photos-gps /></d:prop>
				</d:remove>
			</d:propertyupdate>`,
	})
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
 * Read whether an account has a photo marked as one of its favorites.
 *
 * @param request - Request context to use
 * @param user - Account the favorites belong to
 * @param path - Path of the photo, relative to the account's root
 */
export async function readPhotoFavorite(request: APIRequestContext, user: User, path: string): Promise<boolean> {
	const body = await davRequest(request, user, 'PROPFIND', filesDavUrl(user, path), {
		headers: { 'Content-Type': 'application/xml', Depth: '0' },
		data: `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:prop><oc:favorite /></d:prop>
			</d:propfind>`,
	})

	return body.match(/<[^>]*favorite>([^<]*)</)?.[1] === '1'
}

/**
 * Create a tag of the instance.
 *
 * Tags are not owned by an account, only created by one — the name has to be
 * unique across the whole instance, and the tests run against a shared one.
 *
 * @param request - Request context to use
 * @param user - Account to create the tag as
 * @param displayName - Name of the tag
 * @return The id the server assigned, which is how a tag is assigned to a file
 */
export async function createSystemTag(request: APIRequestContext, user: User, displayName: string): Promise<string> {
	const response = await fetchWithRetry(request, SYSTEMTAGS_DAV_ROOT, {
		method: 'POST',
		headers: { ...basicAuth(user), 'Content-Type': 'application/json' },
		data: JSON.stringify({ name: displayName, userVisible: true, userAssignable: true }),
	})

	if (!response.ok()) {
		throw new Error(`Failed to create the tag "${displayName}": ${response.status()} ${await response.text()}`)
	}

	const tagId = (response.headers()['content-location'] ?? '').match(/\/systemtags\/(\d+)/)?.[1]
	if (tagId === undefined) {
		throw new Error(`Creating the tag "${displayName}" returned no id`)
	}

	return tagId
}

/**
 * Put a tag on a file.
 *
 * @param request - Request context to use
 * @param user - Account to assign the tag as
 * @param fileId - File id of the photo, as the upload reported it
 * @param tagId - Id of the tag
 */
export async function assignSystemTag(request: APIRequestContext, user: User, fileId: string, tagId: string): Promise<void> {
	await davRequest(request, user, 'PUT', `${TAG_ASSIGNMENTS_DAV_ROOT}/${fileId}/${tagId}`, {
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({ name: tagId, userVisible: true, userAssignable: true }),
	})
}

/**
 * Read the names of the tags a file carries.
 *
 * @param request - Request context to use
 * @param user - Account to read as
 * @param fileId - File id of the photo, as the upload reported it
 */
export async function readFileTags(request: APIRequestContext, user: User, fileId: string): Promise<string[]> {
	const body = await davRequest(request, user, 'PROPFIND', `${TAG_ASSIGNMENTS_DAV_ROOT}/${fileId}`, {
		headers: { 'Content-Type': 'application/xml', Depth: '1' },
		data: `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:prop><oc:display-name /></d:prop>
			</d:propfind>`,
	})

	// The listing leads with the collection itself, which carries no name of its
	// own and is answered with an empty property.
	return [...body.matchAll(/<[^>]*display-name>([^<]*)</g)]
		.map(([, name]) => name)
		.filter((name) => name !== '')
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

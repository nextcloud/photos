/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Per-file tag CRUD against the `systemtags-relations` and
 * `systemtags` DAV trees. Mirrors the surface that the systemtags
 * app exposes internally — we re-implement here rather than
 * importing from `apps/systemtags/src` because that module isn't
 * declared as a public entry and its build chain is independent.
 *
 * The shape we surface is intentionally minimal: just enough for
 * the "Manage tags" picker in the photo overflow menu. If photos
 * ever needs the richer shape (colours, last-used ordering, etag
 * conflict handling), the systemtags app's `services/api.ts` is the
 * canonical source to port from.
 */

import type { FileStat, ResponseDataDetailed, WebDAVClientError } from 'webdav'

import { davClient } from './DavClient.ts'

export interface PhotoTag {
	id: number
	displayName: string
	userVisible: boolean
	userAssignable: boolean
	canAssign: boolean
}

const TAG_PROPFIND_PAYLOAD = `<?xml version="1.0"?>
<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
	<d:prop>
		<oc:id />
		<oc:display-name />
		<oc:user-visible />
		<oc:user-assignable />
		<oc:can-assign />
	</d:prop>
</d:propfind>`

interface RawTagProps {
	id?: number | string
	'display-name'?: string
	'user-visible'?: boolean | string
	'user-assignable'?: boolean | string
	'can-assign'?: boolean | string
}

function parseTagProps(props: RawTagProps): PhotoTag | null {
	if (props.id === undefined || props['display-name'] === undefined) {
		return null
	}
	return {
		id: typeof props.id === 'number' ? props.id : Number.parseInt(String(props.id)),
		displayName: String(props['display-name']),
		userVisible: parseBool(props['user-visible']),
		userAssignable: parseBool(props['user-assignable']),
		canAssign: parseBool(props['can-assign']),
	}
}

function parseBool(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value
	}
	// DAV serializes booleans as the strings "true" / "false".
	return value === 'true' || value === '1' || value === 1
}

/**
 * Fetch every system tag the user can see. Used to populate the
 * picker. Returns only user-visible + user-assignable tags so we
 * don't surface admin-only ones in a casual photo menu.
 */
export async function fetchAllTags(): Promise<PhotoTag[]> {
	const { data } = await davClient.getDirectoryContents('/systemtags', {
		data: TAG_PROPFIND_PAYLOAD,
		details: true,
		glob: '/systemtags/*',
	}) as ResponseDataDetailed<Required<FileStat>[]>

	return data
		.map((stat) => parseTagProps(stat.props as RawTagProps))
		.filter((tag): tag is PhotoTag => tag !== null && tag.userVisible && tag.userAssignable)
}

/**
 * Fetch the tags currently assigned to the given file.
 *
 * @param fileId
 */
export async function fetchTagsForFile(fileId: number): Promise<PhotoTag[]> {
	const { data } = await davClient.getDirectoryContents(`/systemtags-relations/files/${fileId}`, {
		data: TAG_PROPFIND_PAYLOAD,
		details: true,
		glob: '/systemtags-relations/files/*/*',
	}) as ResponseDataDetailed<Required<FileStat>[]>

	return data
		.map((stat) => parseTagProps(stat.props as RawTagProps))
		.filter((tag): tag is PhotoTag => tag !== null)
}

/**
 * Assign the given tag to the file. Idempotent — the server returns
 * 409 if the tag is already on the file; we swallow that as success.
 *
 * @param fileId
 * @param tag
 */
export async function assignTagToFile(fileId: number, tag: PhotoTag): Promise<void> {
	const path = `/systemtags-relations/files/${fileId}/${tag.id}`
	const body = JSON.stringify({
		id: tag.id,
		name: tag.displayName,
		userVisible: tag.userVisible,
		userAssignable: tag.userAssignable,
		canAssign: tag.canAssign,
	})
	try {
		await davClient.customRequest(path, {
			method: 'PUT',
			data: body,
		})
	} catch (error) {
		const status = (error as WebDAVClientError)?.response?.status
		if (status !== 409) {
			throw error
		}
	}
}

/**
 * Remove the tag from the file. Mirrors the `assign` call's
 * idempotency: a 404 is treated as success (already not on the file).
 *
 * @param fileId
 * @param tag
 */
export async function unassignTagFromFile(fileId: number, tag: PhotoTag): Promise<void> {
	const path = `/systemtags-relations/files/${fileId}/${tag.id}`
	try {
		await davClient.deleteFile(path)
	} catch (error) {
		const status = (error as WebDAVClientError)?.response?.status
		if (status !== 404) {
			throw error
		}
	}
}

/**
 * Create a brand-new tag and return its id. Caller still has to
 * call `assignTagToFile` to put it on the photo — splitting the two
 * steps keeps the picker UI simple (the same submit-button can both
 * create and assign).
 *
 * @param displayName
 */
export async function createTag(displayName: string): Promise<number> {
	const body = JSON.stringify({
		name: displayName,
		userVisible: true,
		userAssignable: true,
		canAssign: true,
	})
	const response = await davClient.customRequest('/systemtags', {
		method: 'POST',
		data: body,
	})
	const location = response.headers.get('content-location') ?? ''
	const match = location.match(/\/systemtags\/(\d+)/)
	if (match === null) {
		throw new Error('Tag created but Content-Location was missing or malformed')
	}
	return Number.parseInt(match[1])
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** A user who added a file. */
export type Contributor = {
	userId: string
	displayName: string
}

/**
 * Whether a path is a folder or lies inside of it.
 *
 * @param path - Path relative to the user's root
 * @param folder - Folder relative to the user's root, `/` being the root itself
 */
export function isInFolder(path: string, folder: string): boolean {
	return folder === '/' || path === folder || path.startsWith(`${folder.replace(/\/$/, '')}/`)
}

/**
 * The user who added a file, as far as it is known.
 *
 * Photos records the user uploading a file. Files stored before it did fall
 * back to their owner, except in group folders whose owner is whoever looks
 * at them.
 *
 * @param attributes - DAV attributes of the file
 */
export function getAddedBy(attributes: Record<string, unknown>): Contributor | null {
	const addedBy = attributes['metadata-photos-added-by']
	if (addedBy !== undefined && addedBy !== '') {
		const userId = String(addedBy)
		return { userId, displayName: String(attributes['photos-added-by-display-name'] || userId) }
	}

	const ownerId = attributes['owner-id']
	if (ownerId === undefined || ownerId === '' || attributes['mount-type'] === 'group') {
		return null
	}

	const userId = String(ownerId)
	return { userId, displayName: String(attributes['owner-display-name'] || userId) }
}

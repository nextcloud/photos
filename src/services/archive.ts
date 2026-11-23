/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClientError } from 'webdav'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { defaultRootPath } from '@nextcloud/files/dav'
import { dirname, join } from '@nextcloud/paths'
import { davClient } from './DavClient.ts'

/**
 * Folder of the account the archived photos are moved to, mirroring the
 * folders they were archived from, so unarchiving knows where to put them back.
 * It lies outside of the default media folder, which keeps its photos out of
 * the timeline searches.
 */
export const archiveFolder = '/.archive'

/**
 * @param path - Path of a file, relative to the files of the account
 */
export function isInArchive(path: string): boolean {
	return path.startsWith(`${archiveFolder}/`)
}

/**
 * Whether one of the media folders holds the archive, in which case searching
 * them returns the archived photos as well.
 *
 * @param sourceFolders - Media folders, relative to the files of the account
 */
export function isArchiveInFolders(sourceFolders: string[]): boolean {
	return sourceFolders.some((folder) => {
		const prefix = folder.endsWith('/') ? folder : `${folder}/`
		return folder === archiveFolder || archiveFolder.startsWith(prefix)
	})
}

/**
 * Path a photo is moved to when it is archived, or back to when it is
 * unarchived.
 *
 * @param path - Current path of the photo, relative to the files of the account
 * @param archived - Whether the photo is to be archived
 * @throws {Error} When the photo already is where it is to be moved to
 */
export function getArchiveDestination(path: string, archived: boolean): string {
	if (isInArchive(path) === archived) {
		throw new Error(archived ? `${path} is already archived` : `${path} is not archived`)
	}

	return archived ? `${archiveFolder}${path}` : path.slice(archiveFolder.length)
}

/**
 * @param photo - Photo the actions apply to
 */
export function isPhotoArchived(photo: PhotoTarget): boolean {
	return isInArchive(photo.davPath.slice(defaultRootPath.length))
}

/**
 * Create a folder of the account, unless it exists already.
 *
 * @param path - Folder to create, relative to the files of the account
 * @param createParents - Whether its missing parents are created as well
 */
async function createFolder(path: string, createParents = true): Promise<void> {
	try {
		await davClient.createDirectory(join(defaultRootPath, path))
	} catch (error) {
		const status = (error as WebDAVClientError).response?.status

		// The folder exists already, possibly created by a concurrent move.
		if (status === 405) {
			return
		}

		// Its parent does not exist yet.
		if (status === 409 && createParents && dirname(path) !== path) {
			await createFolder(dirname(path))
			await createFolder(path, false)
			return
		}

		throw error
	}
}

/**
 * Move a photo of the account into the archive, or back out of it to the
 * folder it was archived from.
 *
 * The photo is moved with the permissions of the user, and a file in the way
 * is never overwritten.
 *
 * @param photo - Photo to move, one of the account's own files
 * @param archived - Whether the photo is to be archived
 * @return Path of the photo on the files DAV endpoint once it is moved
 * @throws {Error} When the photo cannot be moved
 */
export async function setPhotoArchived(photo: PhotoTarget, archived: boolean): Promise<string> {
	if (!photo.archivable) {
		throw new Error(`${photo.basename} is not one of the files of the account`)
	}

	const destination = getArchiveDestination(photo.davPath.slice(defaultRootPath.length), archived)
	const davPath = join(defaultRootPath, destination)
	const move = () => davClient.moveFile(photo.davPath, davPath, { overwrite: false })

	try {
		await move()
	} catch (error) {
		// The folder to move the photo to does not exist yet.
		if ((error as WebDAVClientError).response?.status !== 409) {
			throw error
		}

		await createFolder(dirname(destination))
		await move()
	}

	return davPath
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, ResponseDataDetailed } from 'webdav'

import { getCurrentUser } from '@nextcloud/auth'
import { loadState } from '@nextcloud/initial-state'
import { davClient } from './DavClient.ts'

/** Whether deleted files go to a trash bin they can be restored from. */
export const isTrashbinEnabled = loadState<{ files?: { undelete?: boolean } }>('core', 'capabilities', {}).files?.undelete === true

/**
 * Put a deleted file back where it was.
 *
 * A file keeps its id in the trash bin, which is what it is found by.
 *
 * @param fileId - Id of the deleted file
 * @throws {Error} When the file is not in the trash bin, or the server refuses to restore it
 */
export async function restoreFromTrashbin(fileId: number): Promise<void> {
	const root = `/trashbin/${getCurrentUser()?.uid}`

	const { data } = await davClient.getDirectoryContents(`${root}/trash`, {
		details: true,
		data: `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:prop>
					<oc:fileid />
				</d:prop>
			</d:propfind>`,
	}) as ResponseDataDetailed<FileStat[]>

	const trashed = data.find((item) => Number(item.props?.fileid) === fileId)
	if (trashed === undefined) {
		throw new Error(`File ${fileId} is not in the trash bin`)
	}

	await davClient.moveFile(trashed.filename, `${root}/restore/${trashed.basename}`)
}

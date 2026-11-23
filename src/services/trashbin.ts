/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File, Node } from '@nextcloud/files'
import type { FileStat, ResponseDataDetailed } from 'webdav'

import { getCurrentUser } from '@nextcloud/auth'
import { FileType } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'
import { generateUrl } from '@nextcloud/router'
import { SemaphoreWithPriority as Semaphore } from '../utils/semaphoreWithPriority.ts'
import { allMimes } from './AllowedMimes.ts'
import { davClient } from './DavClient.ts'
import { getPropFind } from './DavRequest.ts'

/**
 * Path of the trash bin of the current user on the DAV endpoint.
 */
export function getTrashbinRoot(): string {
	return `/trashbin/${getCurrentUser()?.uid}/trash`
}

/**
 * Path an item of the trash bin is moved to in order to restore it.
 *
 * @param node - Item of the trash bin
 */
function getRestorePath(node: Node): string {
	return `/trashbin/${getCurrentUser()?.uid}/restore/${node.basename}`
}

/**
 * Keep the photos and videos of a trash bin listing, the most recently deleted first.
 *
 * @param nodes - Items of the trash bin
 */
export function filterTrashedMedia(nodes: Node[]): File[] {
	return nodes
		.filter((node): node is File => node.type === FileType.File && allMimes.includes(node.mime ?? ''))
		.sort((node1, node2) => getDeletionTime(node2) - getDeletionTime(node1))
}

/**
 * Moment an item was moved to the trash bin, as a unix timestamp.
 *
 * @param node - Item of the trash bin
 */
export function getDeletionTime(node: Node): number {
	return Number(node.attributes['trashbin-deletion-time'] ?? 0)
}

/**
 * URL of the preview of a trashed file, served by the trash bin app since the
 * file is not part of the user's files anymore.
 *
 * @param fileId - Id of the trashed file
 * @param size - Maximum width and height of the preview
 */
export function getTrashedPreviewUrl(fileId: number, size: number): string {
	// `a=1` keeps the aspect ratio, like the photos preview endpoint does.
	return generateUrl('/apps/files_trashbin/preview?fileId={fileId}&x={size}&y={size}&a=1', { fileId, size })
}

/**
 * List the photos and videos of the trash bin of the current user.
 *
 * Only the items at the root of the trash bin are listed: the content of a
 * deleted folder is restored with the folder itself.
 *
 * @param signal - Signal to abort the request
 */
export async function fetchTrashedMedia(signal?: AbortSignal): Promise<File[]> {
	const root = getTrashbinRoot()
	const response = await davClient.getDirectoryContents(root, {
		details: true,
		data: getPropFind([
			'<nc:trashbin-filename />',
			'<nc:trashbin-original-location />',
			'<nc:trashbin-deletion-time />',
		]),
		signal,
	}) as ResponseDataDetailed<FileStat[]>

	return filterTrashedMedia(response.data.map((stat) => resultToNode(stat, root)))
}

/**
 * Restore a trashed item to where it was deleted from.
 *
 * @param node - Item of the trash bin
 * @throws {Error} When the server refuses to restore the item
 */
export async function restoreTrashedItem(node: Node): Promise<void> {
	await davClient.moveFile(`${getTrashbinRoot()}/${node.basename}`, getRestorePath(node))
}

/**
 * Restore several trashed items, a few at a time.
 *
 * @param nodes - Items of the trash bin
 * @return The items that were restored and the ones the server refused to restore
 */
export async function restoreTrashedItems<T extends Node>(nodes: T[]): Promise<{ restored: T[], failed: { node: T, error: unknown }[] }> {
	const semaphore = new Semaphore(5)
	const restored: T[] = []
	const failed: { node: T, error: unknown }[] = []

	await Promise.all(nodes.map(async (node) => {
		const symbol = await semaphore.acquire()
		try {
			await restoreTrashedItem(node)
			restored.push(node)
		} catch (error) {
			failed.push({ node, error })
		} finally {
			semaphore.release(symbol)
		}
	}))

	return { restored, failed }
}

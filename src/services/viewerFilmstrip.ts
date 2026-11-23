/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ViewerOptions, ViewerSession } from '@nextcloud/viewer'

import { getViewer } from '@nextcloud/viewer'
import { computed, ref, shallowRef } from 'vue'

/** How many photos the filmstrip shows on each side of the one in the viewer. */
export const FILMSTRIP_RADIUS = 10

const openedFiles = shallowRef<File[]>([])
const shownFileId = ref<number>()
const editing = ref(false)
let activeSession: ViewerSession | undefined

/**
 * The files around a given one, in the order of the list and the file itself
 * included. Empty when the file is not in the list, or has no neighbour.
 *
 * @param files - The list the viewer steps through
 * @param fileId - Id of the file shown
 * @param radius - How many files to keep on each side
 */
export function getFilmstripWindow<T extends { fileid?: number }>(files: T[], fileId: number | undefined, radius: number = FILMSTRIP_RADIUS): T[] {
	const index = fileId === undefined ? -1 : files.findIndex((file) => file.fileid === fileId)
	if (index === -1 || files.length < 2) {
		return []
	}

	// Near an end of the list the window keeps its size by reaching further
	// on the other side.
	const size = Math.min(files.length, 2 * radius + 1)
	const start = Math.max(0, Math.min(index - radius, files.length - size))
	return files.slice(start, start + size)
}

/** Id of the file the viewer shows, as far as the session it was opened with tells. */
export const filmstripFileId = computed(() => shownFileId.value)

/** The files to show in the filmstrip, none while there is nothing to step to. */
export const filmstripFiles = computed(() => editing.value ? [] : getFilmstripWindow(openedFiles.value, shownFileId.value))

function reset() {
	activeSession = undefined
	openedFiles.value = []
	shownFileId.value = undefined
	editing.value = false
}

/**
 * Open files in the viewer and follow what it shows, for the filmstrip.
 *
 * @param nodes - The files to step through, in order
 * @param file - The file to start on
 * @param options - Options of the viewer
 */
export async function openInViewer(nodes: File[], file: File | undefined = nodes[0], options?: ViewerOptions): Promise<ViewerSession> {
	const session = await getViewer().open(nodes, file, options)

	activeSession = session
	openedFiles.value = nodes
	shownFileId.value = file?.fileid
	editing.value = options?.editing === true

	// A session replaced by a later opening still hears the viewer close.
	const whileActive = <T extends unknown[]>(listener: (...detail: T) => void) => ({ detail }: CustomEvent<T>) => {
		if (session === activeSession) {
			listener(...detail)
		}
	}
	session.addEventListener('update:file', whileActive((shown) => {
		shownFileId.value = shown.fileid
	}))
	session.addEventListener('update:editing', whileActive((isEditing) => {
		editing.value = isEditing
	}))
	session.addEventListener('close', whileActive(reset), { once: true })

	return session
}

/**
 * Show another of the opened files in the viewer.
 *
 * @param fileId - Id of the file to show
 */
export function showInViewer(fileId: number) {
	if (!openedFiles.value.some((file) => file.fileid === fileId)) {
		return
	}

	// The viewer does not tell of a file it was asked to show.
	getViewer().goTo(fileId)
	shownFileId.value = fileId
}

/**
 * Drop a file from the filmstrip, as the viewer does from its own list once
 * the file is deleted.
 *
 * @param fileId - Id of the deleted file
 */
export function removeFromFilmstrip(fileId: number | undefined) {
	if (openedFiles.value.some((file) => file.fileid === fileId)) {
		openedFiles.value = openedFiles.value.filter((file) => file.fileid !== fileId)
	}
}

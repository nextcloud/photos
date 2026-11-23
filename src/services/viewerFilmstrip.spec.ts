/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { filmstripFileId, filmstripFiles, getFilmstripWindow, openInViewer, removeFromFilmstrip, showInViewer } from './viewerFilmstrip.ts'

const viewer = vi.hoisted(() => ({
	open: vi.fn(),
	goTo: vi.fn(),
}))

vi.mock('@nextcloud/viewer', () => ({ getViewer: () => viewer }))

/**
 * Build a list of files with the ids 1 to `count`.
 *
 * @param count - How many files to build
 */
function buildFiles(count: number): File[] {
	return Array.from({ length: count }, (_, index) => ({ fileid: index + 1 }) as File)
}

/**
 * The ids of a list of files.
 *
 * @param files - The files to read the ids of
 */
function ids(files: { fileid?: number }[]): (number | undefined)[] {
	return files.map((file) => file.fileid)
}

describe('getFilmstripWindow', () => {
	test('keeps the neighbours on both sides of the file', () => {
		expect(ids(getFilmstripWindow(buildFiles(20), 10, 2))).toEqual([8, 9, 10, 11, 12])
	})

	test('keeps its size at the start and at the end of the list', () => {
		expect(ids(getFilmstripWindow(buildFiles(20), 1, 2))).toEqual([1, 2, 3, 4, 5])
		expect(ids(getFilmstripWindow(buildFiles(20), 20, 2))).toEqual([16, 17, 18, 19, 20])
	})

	test('returns the whole list when it is shorter than the window', () => {
		expect(ids(getFilmstripWindow(buildFiles(3), 2, 2))).toEqual([1, 2, 3])
	})

	test('is empty for a single file, an unknown file or no file', () => {
		expect(getFilmstripWindow(buildFiles(1), 1)).toEqual([])
		expect(getFilmstripWindow(buildFiles(5), 9)).toEqual([])
		expect(getFilmstripWindow(buildFiles(5), undefined)).toEqual([])
	})
})

describe('viewer session', () => {
	let session: EventTarget

	/**
	 * Dispatch an event of the viewer on the session of the last opening.
	 *
	 * @param type - Name of the event
	 * @param detail - Values of the event
	 */
	function tell(type: string, ...detail: unknown[]) {
		session.dispatchEvent(new CustomEvent(type, { detail }))
	}

	beforeEach(async () => {
		viewer.goTo.mockClear()
		viewer.open.mockImplementation(async () => {
			session = new EventTarget()
			return session
		})
		const files = buildFiles(5)
		await openInViewer(files, files[1])
	})

	test('starts on the opened file', () => {
		expect(filmstripFileId.value).toBe(2)
		expect(ids(filmstripFiles.value)).toEqual([1, 2, 3, 4, 5])
	})

	test('follows the file the viewer moves to', () => {
		tell('update:file', { fileid: 4 })

		expect(filmstripFileId.value).toBe(4)
	})

	test('asks the viewer for a file of the list and marks it as shown', () => {
		showInViewer(5)

		expect(viewer.goTo).toHaveBeenCalledWith(5)
		expect(filmstripFileId.value).toBe(5)
	})

	test('does not ask the viewer for a file it was not opened with', () => {
		showInViewer(9)

		expect(viewer.goTo).not.toHaveBeenCalled()
		expect(filmstripFileId.value).toBe(2)
	})

	test('hides while a photo is edited', () => {
		tell('update:editing', true)
		expect(filmstripFiles.value).toEqual([])

		tell('update:editing', false)
		expect(filmstripFiles.value).toHaveLength(5)
	})

	test('hides when the viewer shows a file it does not know', () => {
		tell('update:file', { fileid: 9 })

		expect(filmstripFiles.value).toEqual([])
	})

	test('drops deleted files', () => {
		removeFromFilmstrip(3)

		expect(ids(filmstripFiles.value)).toEqual([1, 2, 4, 5])
	})

	test('empties when the viewer closes', () => {
		tell('close')

		expect(filmstripFiles.value).toEqual([])
		expect(filmstripFileId.value).toBeUndefined()
	})

	test('ignores a session replaced by a later opening', async () => {
		const replaced = session
		const files = buildFiles(3)
		await openInViewer(files, files[0])

		replaced.dispatchEvent(new CustomEvent('update:file', { detail: [{ fileid: 3 }] }))
		replaced.dispatchEvent(new CustomEvent('close', { detail: [] }))

		expect(filmstripFileId.value).toBe(1)
		expect(ids(filmstripFiles.value)).toEqual([1, 2, 3])
	})
})

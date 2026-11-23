/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { restoreFromTrashbin } from './trashbin.ts'

const { davClient } = vi.hoisted(() => ({
	davClient: {
		getDirectoryContents: vi.fn(),
		moveFile: vi.fn(),
	},
}))

vi.mock('./DavClient.ts', () => ({ davClient }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/initial-state', () => ({ loadState: (app: string, key: string, fallback: unknown) => fallback }))

describe('restoreFromTrashbin', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		davClient.getDirectoryContents.mockResolvedValue({
			data: [
				{ filename: '/trashbin/alice/trash/a.jpg.d1700000000', basename: 'a.jpg.d1700000000', props: { fileid: 11 } },
				{ filename: '/trashbin/alice/trash/b.jpg.d1700000001', basename: 'b.jpg.d1700000001', props: { fileid: '12' } },
			],
		})
	})

	test('moves the trashed file with the given id to the restore folder', async () => {
		await restoreFromTrashbin(12)

		expect(davClient.getDirectoryContents).toHaveBeenCalledWith('/trashbin/alice/trash', expect.objectContaining({ details: true }))
		expect(davClient.moveFile).toHaveBeenCalledWith('/trashbin/alice/trash/b.jpg.d1700000001', '/trashbin/alice/restore/b.jpg.d1700000001')
	})

	test('fails without moving anything when the file is not in the trash bin', async () => {
		await expect(restoreFromTrashbin(99)).rejects.toThrow()

		expect(davClient.moveFile).not.toHaveBeenCalled()
	})
})

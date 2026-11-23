/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { describe, expect, test, vi } from 'vitest'
import { isEndToEndEncrypted } from '../utils/fileUtils.ts'
import { getFolderContent } from './FolderContent.ts'

vi.mock('@nextcloud/axios', () => ({ default: { get: vi.fn() } }))
vi.mock('./AllowedMimes.ts', () => ({ allMimes: ['image/jpeg'] }))

/**
 * An entry of the folder listing endpoint.
 *
 * @param id - Id of the node
 * @param filename - Path of the node, relative to the root of the account
 * @param type - Whether it is a file or a folder
 * @param attributes - Attributes of the node
 */
function entry(id: number, filename: string, type: 'file' | 'dir', attributes: Record<string, unknown> = {}) {
	return {
		id: String(id),
		filename,
		mime: type === 'dir' ? 'httpd/unix-directory' : 'image/jpeg',
		mtime: 0,
		size: 0,
		type,
		permissions: 'RGDNVCK',
		owner: 'alice',
		attributes: { etag: `etag-${id}`, ...attributes },
	}
}

describe('getFolderContent', () => {
	test('keeps the encryption state the endpoint gives the folders', async () => {
		vi.mocked(axios.get).mockResolvedValue({
			data: [
				entry(1, '/', 'dir', { 'is-encrypted': 0 }),
				entry(10, '/Vault', 'dir', { 'is-encrypted': 1 }),
				entry(20, '/Trip', 'dir', { 'is-encrypted': 0 }),
				entry(30, '/cat.jpg', 'file'),
			],
		})

		const { folder, folders, files } = await getFolderContent('/')

		expect(folder && isEndToEndEncrypted(folder)).toBe(false)
		expect(folders.map((node) => [node.basename, isEndToEndEncrypted(node)])).toEqual([['Vault', true], ['Trip', false]])
		expect(files.map((node) => node.basename)).toEqual(['cat.jpg'])
	})

	test('reads an encrypted folder that is opened as encrypted and empty', async () => {
		vi.mocked(axios.get).mockResolvedValue({ data: [entry(10, '/Vault', 'dir', { 'is-encrypted': 1 })] })

		const { folder, folders, files } = await getFolderContent('/Vault')

		expect(folder && isEndToEndEncrypted(folder)).toBe(true)
		expect(folders).toEqual([])
		expect(files).toEqual([])
	})
})

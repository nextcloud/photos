/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getPhotos } from './PhotoSearch.ts'

const { search } = vi.hoisted(() => ({ search: vi.fn() }))

vi.mock('./DavClient.ts', () => ({ davClient: { search } }))
vi.mock('./DavRequest.ts', () => ({ getDefaultDavProps: () => '' }))
vi.mock('@nextcloud/files/dav', () => ({ defaultRootPath: '/files/alice', resultToNode: vi.fn() }))
vi.mock('../store/userConfig.ts', () => ({
	useUserConfigStore: () => ({ photosSourceFolders: ['/Photos', '/Family'] }),
}))

/**
 * The folders the last search request was scoped to.
 */
function searchedFolders(): string[] {
	const request = search.mock.calls.at(-1)![1].data as string
	return [...request.matchAll(/<d:href>(.*?)<\/d:href>/g)].map((match) => match[1]!)
}

describe('getPhotos', () => {
	beforeEach(() => {
		search.mockReset()
		search.mockResolvedValue({ data: { results: [] } })
	})

	test('searches the media folders of the user by default', async () => {
		await getPhotos()

		expect(searchedFolders()).toEqual(['/files/alice/Photos', '/files/alice/Family'])
	})

	test('searches only the folders it is given', async () => {
		await getPhotos({ sourceFolders: ['/Family'] })

		expect(searchedFolders()).toEqual(['/files/alice/Family'])
	})
})

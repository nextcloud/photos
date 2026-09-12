/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File } from '@nextcloud/files'
import { getHandlers, getViewer, registerDefaultHandlers } from '@nextcloud/viewer'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { closeViewer, openInViewer, registerViewerHandlers } from './viewer.ts'

vi.mock('@nextcloud/viewer', () => ({
	getHandlers: vi.fn(() => new Map()),
	getViewer: vi.fn(),
	registerDefaultHandlers: vi.fn(),
}))

vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string) => url,
}))

const viewer = {
	open: vi.fn(),
	close: vi.fn(),
}

/**
 * @param id - The file id of the photo
 */
function photo(id: number): File {
	return new File({
		id,
		source: `https://cloud.example.com/remote.php/dav/files/alice/${id}.jpg`,
		root: '/files/alice',
		owner: 'alice',
		mime: 'image/jpeg',
	})
}

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(getViewer).mockReturnValue(viewer as unknown as ReturnType<typeof getViewer>)
})

describe('registerViewerHandlers', () => {
	test('registers the views when the page has none for images', () => {
		registerViewerHandlers()

		expect(registerDefaultHandlers).toHaveBeenCalledOnce()
	})

	test('leaves the views of the page alone when it has one for images', () => {
		vi.mocked(getHandlers).mockReturnValue(new Map([['images', {}]]) as unknown as ReturnType<typeof getHandlers>)

		registerViewerHandlers()

		expect(registerDefaultHandlers).not.toHaveBeenCalled()
	})
})

describe('openInViewer', () => {
	test('opens the gallery on the node standing for the photo', async () => {
		const photos = [photo(1), photo(2), photo(3)]

		await openInViewer(photos, photos[1], { startSlideshow: true })

		expect(viewer.open).toHaveBeenCalledOnce()
		const [nodes, node, options] = viewer.open.mock.calls[0]
		expect(nodes.map((node: File) => node.fileid)).toEqual([1, 2, 3])
		// The very node of the list, which is how the viewer knows where it is.
		expect(nodes[1]).toBe(node)
		expect(options).toEqual({ startSlideshow: true })
	})
})

describe('closeViewer', () => {
	test('closes the viewer', () => {
		closeViewer()

		expect(viewer.close).toHaveBeenCalledOnce()
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'

const { axios, capabilities } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn() },
	capabilities: {} as Record<string, unknown>,
}))

vi.mock('@nextcloud/axios', () => ({
	default: axios,
	isAxiosError: (error: { response?: unknown }) => error.response !== undefined,
}))
vi.mock('@nextcloud/files/dav', () => ({ getRootPath: () => '/files/alice' }))
vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback: unknown) => (app === 'core' && key === 'capabilities' ? capabilities : fallback),
}))
vi.mock('@nextcloud/router', () => ({ generateOcsUrl: (url: string) => `/ocs/v2.php/${url}` }))

/**
 * Load the service with the given capabilities, which it reads once.
 *
 * @param spreed - Capabilities of Talk, none when it is not enabled
 */
async function loadService(spreed?: { features: string[] }) {
	vi.resetModules()
	capabilities.spreed = spreed
	return await import('./talk.ts')
}

/**
 * @param fileid - Id of the photo
 * @param path - Path of the photo in the files of the user
 */
function photo(fileid: number, path: string): PhotoTarget {
	return { fileid, basename: path.split('/').pop() as string, davPath: `/files/alice${path}`, permissions: 31, favorite: false }
}

const room = { type: 2, objectType: '', readOnly: 0, permissions: 254, lastActivity: 10 }

describe('talk service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('detects Talk and its caption support from the capabilities', async () => {
		expect((await loadService()).isTalkEnabled).toBe(false)

		const withoutCaption = await loadService({ features: [] })
		expect(withoutCaption.isTalkEnabled).toBe(true)
		expect(withoutCaption.canSendCaption).toBe(false)

		expect((await loadService({ features: ['media-caption'] })).canSendCaption).toBe(true)
	})

	test('lists the conversations files can be posted in, most recent first', async () => {
		const { fetchConversations } = await loadService({ features: [] })
		axios.get.mockResolvedValue({
			data: {
				ocs: {
					data: [
						{ ...room, token: 'old', displayName: 'Old', lastActivity: 5 },
						{ ...room, token: 'changelog', displayName: 'Talk updates', type: 4 },
						{ ...room, token: 'file', displayName: 'notes.md', objectType: 'file' },
						{ ...room, token: 'readonly', displayName: 'Archive', readOnly: 1 },
						{ ...room, token: 'remote', displayName: 'Federated', remoteServer: 'https://other.example' },
						{ ...room, token: 'muted', displayName: 'Webinar', permissions: 1 },
						{ ...room, token: 'new', displayName: 'New', lastActivity: 20 },
					],
				},
			},
		})

		const conversations = await fetchConversations()

		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/apps/spreed/api/v4/room', { params: { noStatusUpdate: 1 } })
		expect(conversations.map((conversation) => conversation.token)).toEqual(['new', 'old'])
	})

	test('shares every photo with the conversation, the message going with the last one', async () => {
		const { sendToConversation } = await loadService({ features: ['media-caption'] })
		axios.post.mockResolvedValue({})
		const onProgress = vi.fn()

		const failures = await sendToConversation('abc', [photo(1, '/Photos/a.jpg'), photo(2, '/Photos/Trip/b.jpg')], ' Look! ', onProgress)

		expect(failures).toEqual([])
		expect(axios.post.mock.calls).toEqual([
			['/ocs/v2.php/apps/files_sharing/api/v1/shares', { shareType: 10, shareWith: 'abc', path: '/Photos/a.jpg', talkMetaData: undefined }],
			['/ocs/v2.php/apps/files_sharing/api/v1/shares', { shareType: 10, shareWith: 'abc', path: '/Photos/Trip/b.jpg', talkMetaData: '{"caption":"Look!"}' }],
		])
		expect(onProgress.mock.calls).toEqual([[1], [2]])
	})

	test('leaves the message out when Talk has no captions', async () => {
		const { sendToConversation } = await loadService({ features: [] })
		axios.post.mockResolvedValue({})

		await sendToConversation('abc', [photo(1, '/Photos/a.jpg')], 'Look!')

		expect(axios.post.mock.calls[0][1].talkMetaData).toBeUndefined()
	})

	test('keeps going after a failure and reports the reason of the server', async () => {
		const { sendToConversation } = await loadService({ features: [] })
		const first = photo(1, '/Photos/a.jpg')
		const second = photo(2, '/Photos/b.jpg')
		const third = photo(3, '/Photos/c.jpg')
		axios.post
			.mockRejectedValueOnce({ response: { data: { ocs: { meta: { message: 'Path is already shared with this conversation' } } } } })
			.mockRejectedValueOnce(new Error('Network Error'))
			.mockResolvedValueOnce({})

		const failures = await sendToConversation('abc', [first, second, third])

		expect(axios.post).toHaveBeenCalledTimes(3)
		expect(failures).toEqual([
			{ photo: first, message: 'Path is already shared with this conversation' },
			{ photo: second, message: '' },
		])
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { guestUploadError, uploadGuestFiles } from './guestUpload.ts'

const { axios } = vi.hoisted(() => ({
	axios: { post: vi.fn() },
}))

vi.mock('@nextcloud/axios', () => ({
	default: axios,
	isAxiosError: (error: { isAxiosError?: boolean }) => error?.isAxiosError === true,
}))
vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string, params: Record<string, string>) => `/index.php${url.replace('{token}', params.token)}`,
}))

const MIMES = ['image/jpeg', 'video/mp4']
const MAX = 1000

/**
 * @param name - File name
 * @param size - Size in bytes
 * @param type - Media type
 */
function file(name: string, size = 100, type = 'image/jpeg'): File {
	return new File([new Uint8Array(size)], name, { type })
}

/**
 * @param status - HTTP status of the failed request
 * @param message - Message sent by the server
 */
function httpError(status: number, message?: string) {
	return { isAxiosError: true, response: { status, data: message === undefined ? {} : { message } } }
}

describe('guestUploadError', () => {
	test('accepts allowed photos and videos within the limit', () => {
		expect(guestUploadError(file('a.jpg'), MAX, MIMES)).toBeNull()
		expect(guestUploadError(file('a.mp4', 10, 'video/mp4'), MAX, MIMES)).toBeNull()
	})

	test('leaves files without a browser type to the server', () => {
		expect(guestUploadError(file('a.heic', 10, ''), MAX, MIMES)).toBeNull()
	})

	test('rejects other media types', () => {
		expect(guestUploadError(file('a.pdf', 10, 'application/pdf'), MAX, MIMES)).toBe('Only photos and videos can be added.')
	})

	test('rejects files above the limit', () => {
		expect(guestUploadError(file('a.jpg', MAX + 1), MAX, MIMES)).toMatch(/^The file is larger than/)
	})
})

describe('uploadGuestFiles', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('sends each file with the guest name to the link endpoint, one after the other', async () => {
		const progress: number[] = []
		let running = 0
		axios.post.mockImplementation(async () => {
			expect(++running).toBe(1)
			await Promise.resolve()
			running--
		})

		const summary = await uploadGuestFiles('tok', [file('a.jpg', 100), file('b.jpg', 300)], '  Anna ', MAX, MIMES, (value) => progress.push(value))

		expect(summary).toEqual({ uploaded: 2, errors: [] })
		expect(axios.post).toHaveBeenCalledTimes(2)
		const [url, data] = axios.post.mock.calls[0]
		expect(url).toBe('/index.php/apps/photos/api/v1/public/tok/upload')
		expect((data as FormData).get('guestName')).toBe('Anna')
		expect(((data as FormData).get('file') as File).name).toBe('a.jpg')
		expect(progress).toEqual([0.25, 1])
	})

	test('skips invalid files without sending them and keeps going', async () => {
		axios.post.mockResolvedValue({})

		const summary = await uploadGuestFiles('tok', [file('a.pdf', 10, 'application/pdf'), file('b.jpg')], '', MAX, MIMES)

		expect(summary.uploaded).toBe(1)
		expect(summary.errors).toEqual(['a.pdf: Only photos and videos can be added.'])
		expect(axios.post).toHaveBeenCalledTimes(1)
	})

	test('reports the server message and continues after a rejected file', async () => {
		axios.post
			.mockRejectedValueOnce(httpError(415, 'Only photos and videos can be added.'))
			.mockResolvedValueOnce({})

		const summary = await uploadGuestFiles('tok', [file('a.jpg'), file('b.jpg')], '', MAX, MIMES)

		expect(summary).toEqual({ uploaded: 1, errors: ['a.jpg: Only photos and videos can be added.'] })
	})

	test('stops when the server refuses all further uploads', async () => {
		axios.post.mockRejectedValueOnce(httpError(429, 'Too many uploads, please try again later.'))

		const summary = await uploadGuestFiles('tok', [file('a.jpg'), file('b.jpg'), file('c.jpg')], '', MAX, MIMES)

		expect(axios.post).toHaveBeenCalledTimes(1)
		expect(summary.uploaded).toBe(0)
		expect(summary.errors).toEqual(['a.jpg: Too many uploads, please try again later.', '2 files were not uploaded.'])
	})

	test('falls back to a generic message on network errors', async () => {
		axios.post.mockRejectedValueOnce(new Error('offline'))

		const summary = await uploadGuestFiles('tok', [file('a.jpg')], '', MAX, MIMES)

		expect(summary.errors).toEqual(['a.jpg: The file could not be uploaded.'])
	})
})

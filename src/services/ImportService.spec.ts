/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ImportStatus } from './ImportService.ts'

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { getImports, isImportActive, startImport, waitForImport } from './ImportService.ts'

const { axios } = vi.hoisted(() => ({
	axios: { get: vi.fn(), post: vi.fn() },
}))

vi.mock('@nextcloud/axios', () => ({
	default: axios,
	isAxiosError: (error: { isAxiosError?: boolean }) => error.isAxiosError === true,
}))
vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string, params: Record<string, string> = {}) => '/index.php' + url.replace(/{(\w+)}/g, (_, key) => params[key]),
}))

/**
 * @param state - State of the import
 */
function buildStatus(state: ImportStatus['state']): ImportStatus {
	return {
		id: 'import1',
		provider: 'google-takeout',
		folder: '/Takeout',
		dryRun: true,
		state,
		processed: 0,
		found: [],
		changed: [],
		skipped: [],
		examples: [],
		error: null,
	}
}

describe('ImportService', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('lists the importers and the last import', async () => {
		axios.get.mockResolvedValue({ data: { providers: [], status: null } })

		expect(await getImports()).toEqual({ providers: [], status: null })
		expect(axios.get).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/import')
	})

	test('starts an import with its options', async () => {
		axios.post.mockResolvedValue({ data: buildStatus('queued') })

		const status = await startImport('google-takeout', '/Takeout', true, { force: true })

		expect(status.id).toBe('import1')
		expect(axios.post).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/import', {
			provider: 'google-takeout',
			path: '/Takeout',
			dryRun: true,
			options: { force: true },
		})
	})

	test('throws the message of the server when the import cannot start', async () => {
		axios.post.mockRejectedValue({ isAxiosError: true, response: { data: { message: 'Another import is still running' } } })

		await expect(startImport('google-takeout', '/Takeout', false, {})).rejects.toThrow('Another import is still running')
	})

	test('throws a generic message without a message of the server', async () => {
		axios.post.mockRejectedValue(new Error('Network Error'))

		await expect(startImport('google-takeout', '/Takeout', false, {})).rejects.toThrow('Could not start the import')
	})

	test('tells active imports apart', () => {
		expect(isImportActive(null)).toBe(false)
		expect(isImportActive(buildStatus('queued'))).toBe(true)
		expect(isImportActive(buildStatus('running'))).toBe(true)
		expect(isImportActive(buildStatus('done'))).toBe(false)
		expect(isImportActive(buildStatus('failed'))).toBe(false)
	})

	test('polls the status until the import finished', async () => {
		axios.get
			.mockResolvedValueOnce({ data: buildStatus('queued') })
			.mockResolvedValueOnce({ data: { ...buildStatus('running'), processed: 10 } })
			.mockResolvedValueOnce({ data: { ...buildStatus('done'), processed: 20 } })
		const onUpdate = vi.fn()

		const result = waitForImport('import1', onUpdate)
		await vi.runAllTimersAsync()

		expect((await result)?.state).toBe('done')
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.get).toHaveBeenCalledWith('/index.php/apps/photos/api/v1/import/import1')
		expect(onUpdate.mock.calls.map(([status]) => status.processed)).toEqual([0, 10, 20])
	})

	test('stops polling when aborted', async () => {
		axios.get.mockResolvedValue({ data: buildStatus('running') })
		const controller = new AbortController()
		const onUpdate = vi.fn()

		const result = waitForImport('import1', onUpdate, controller.signal)
		await vi.advanceTimersByTimeAsync(0)
		controller.abort()
		await vi.runAllTimersAsync()

		expect(await result).toBeNull()
		expect(onUpdate).toHaveBeenCalledTimes(1)
	})
})

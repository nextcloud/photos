/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { buildTimeline } from './memoryVideo.ts'
import { renderMemoryVideo } from './memoryVideoRenderer.ts'

const mocks = vi.hoisted(() => ({
	startRecording: vi.fn(),
	stop: vi.fn(),
}))

vi.mock('../store/userConfig.ts', () => ({}))
vi.mock('./videoRecorder.ts', () => ({
	getRecordingMimeType: () => 'video/webm',
	startRecording: mocks.startRecording,
}))

const photos = Array.from({ length: 3 }, (_, index) => ({
	fileid: index + 1,
	attributes: { etag: 'etag', timestamp: index },
} as unknown as PhotoFile))

const track = { stop: vi.fn() }
let now = 0

beforeEach(() => {
	now = 0
	mocks.stop.mockResolvedValue(new Blob(['video'], { type: 'video/webm' }))
	mocks.startRecording.mockReturnValue({ stop: mocks.stop })

	const context = new Proxy({}, { get: (target, key) => key === 'measureText' ? () => ({ width: 100 }) : vi.fn() })
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
	HTMLCanvasElement.prototype.captureStream = vi.fn(() => ({ getVideoTracks: () => [track] }) as unknown as MediaStream)
	vi.stubGlobal('MediaStream', class {
		tracks: unknown[] = []
		addTrack(added: unknown) { this.tracks.push(added) }
		getTracks() { return this.tracks }
	})
	vi.spyOn(performance, 'now').mockImplementation(() => now)
	// Every frame is drawn a second after the previous one.
	vi.stubGlobal('requestAnimationFrame', (callback: () => void) => setTimeout(() => {
		now += 1000
		callback()
	}))
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('renderMemoryVideo', () => {
	test('records the whole timeline and reports the progress', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue()
		const onProgress = vi.fn()

		const video = await renderMemoryVideo({ photos, title: 'Lisbon', subtitle: '3 photos', animate: true, onProgress })

		expect(video.duration).toBe(buildTimeline(4).duration)
		expect(video.blob.type).toBe('video/webm')
		expect(mocks.startRecording).toHaveBeenCalledWith(expect.anything(), 'video/webm')
		expect(mocks.stop).toHaveBeenCalledOnce()
		expect(onProgress).toHaveBeenCalledWith('loading', 1)
		expect(onProgress).toHaveBeenLastCalledWith('recording', 1)
		expect(track.stop).toHaveBeenCalled()
	})

	test('leaves out the photos that fail to load', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode')
			.mockResolvedValueOnce()
			.mockRejectedValueOnce(new Error('404'))
			.mockResolvedValueOnce()

		const video = await renderMemoryVideo({ photos, title: 'Lisbon', subtitle: '', animate: false })

		expect(video.duration).toBe(buildTimeline(3).duration)
	})

	test('fails when no photo loads', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockRejectedValue(new Error('404'))

		await expect(renderMemoryVideo({ photos, title: 'Lisbon', subtitle: '', animate: false })).rejects.toThrow()
		expect(mocks.startRecording).not.toHaveBeenCalled()
	})

	test('stops the recording when aborted', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue()
		const controller = new AbortController()

		const rendering = renderMemoryVideo({
			photos,
			title: 'Lisbon',
			subtitle: '',
			animate: false,
			signal: controller.signal,
			onProgress: (step) => step === 'recording' && controller.abort(),
		})

		await expect(rendering).rejects.toBeDefined()
		expect(mocks.stop).toHaveBeenCalledOnce()
	})
})

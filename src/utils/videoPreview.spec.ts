/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getVideoPreviewSources, getVideoRenditionUrl } from './videoPreview.ts'

const { initialState } = vi.hoisted(() => ({
	initialState: {} as Record<string, unknown>,
}))

vi.mock('@nextcloud/initial-state', () => ({
	loadState: (app: string, key: string, fallback: unknown) => initialState[key] ?? fallback,
}))
vi.mock('@nextcloud/router', () => ({ generateUrl: (url: string) => `/index.php${url}` }))

const SOURCE = '/remote.php/dav/files/admin/clip.mov'
const RENDITION = '/index.php/apps/photos/api/v1/video/42?etag=abc'

const playsEverything = () => true
const playsNothing = () => false

describe('getVideoPreviewSources', () => {
	test('plays the original when the browser knows its format', () => {
		expect(getVideoPreviewSources('video/mp4', SOURCE, null, playsEverything)).toEqual([SOURCE])
	})

	test('falls back to the rendition after the original', () => {
		expect(getVideoPreviewSources('video/mp4', SOURCE, RENDITION, playsEverything)).toEqual([SOURCE, RENDITION])
	})

	test('goes straight to the rendition when the browser does not know the format', () => {
		expect(getVideoPreviewSources('video/quicktime', SOURCE, RENDITION, playsNothing)).toEqual([RENDITION])
	})

	test('has nothing to play without a known format or a rendition', () => {
		expect(getVideoPreviewSources('video/quicktime', SOURCE, null, playsNothing)).toEqual([])
	})

	test('asks the browser about the mime type of the file', () => {
		const canPlay = vi.fn(() => false)

		getVideoPreviewSources('video/quicktime', SOURCE, null, canPlay)

		expect(canPlay).toHaveBeenCalledWith('video/quicktime')
	})

	test('plays nothing for files which are not videos', () => {
		expect(getVideoPreviewSources('image/jpeg', SOURCE, RENDITION, playsEverything)).toEqual([])
		expect(getVideoPreviewSources(undefined, SOURCE, RENDITION, playsEverything)).toEqual([])
	})
})

describe('getVideoRenditionUrl', () => {
	beforeEach(() => {
		delete initialState['video-renditions']
	})

	test('is null when the server does not make renditions', () => {
		expect(getVideoRenditionUrl(42, 'abc')).toBeNull()

		initialState['video-renditions'] = false
		expect(getVideoRenditionUrl(42, 'abc')).toBeNull()
	})

	test('points at the rendition of the current version of the file', () => {
		initialState['video-renditions'] = true

		expect(getVideoRenditionUrl(42, 'abc')).toBe(RENDITION)
	})
})

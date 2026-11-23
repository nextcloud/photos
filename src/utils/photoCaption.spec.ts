/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { describe, expect, test, vi } from 'vitest'
import { getPhotoCaption, isCaptionSearchEnabled } from './photoCaption.ts'

vi.mock('@nextcloud/initial-state', () => ({
	loadState: vi.fn((app: string, key: string, fallback: unknown) => fallback),
}))

describe('getPhotoCaption', () => {
	test('returns the description of the photo', () => {
		expect(getPhotoCaption({ 'metadata-photos-caption': 'A dog on a beach' })).toBe('A dog on a beach')
	})

	test('returns nothing when the photo has no description', () => {
		expect(getPhotoCaption({})).toBeUndefined()
		expect(getPhotoCaption({ 'metadata-photos-caption': '  ' })).toBeUndefined()
		expect(getPhotoCaption({ 'metadata-photos-caption': { nested: true } })).toBeUndefined()
	})

	test('returns a numeric description as text', () => {
		expect(getPhotoCaption({ 'metadata-photos-caption': 1984 })).toBe('1984')
	})
})

describe('isCaptionSearchEnabled', () => {
	test('is disabled when the server does not say otherwise', () => {
		expect(isCaptionSearchEnabled()).toBe(false)
	})

	test('follows the initial state of the server', () => {
		vi.mocked(loadState).mockReturnValueOnce(true)

		expect(isCaptionSearchEnabled()).toBe(true)
		expect(loadState).toHaveBeenLastCalledWith('photos', 'caption-search', false)
	})
})

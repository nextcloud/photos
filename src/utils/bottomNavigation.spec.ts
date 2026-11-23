/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { FAST_SCROLL_SPEED, getActiveDestination, isHiddenAfterScroll } from './bottomNavigation.ts'

describe('getActiveDestination', () => {
	it('maps every timeline flavour to the all media destination', () => {
		expect(getActiveDestination('all_media')).toBe('all_media')
		expect(getActiveDestination('photos')).toBe('all_media')
		expect(getActiveDestination('videos')).toBe('all_media')
	})

	it('keeps albums current while an album is open', () => {
		expect(getActiveDestination('albums')).toBe('albums')
		expect(getActiveDestination('albumsContent')).toBe('albums')
	})

	it('maps memories and the map to themselves', () => {
		expect(getActiveDestination('memories')).toBe('memories')
		expect(getActiveDestination('map')).toBe('map')
	})

	it('has no current destination on other routes', () => {
		expect(getActiveDestination('folders')).toBeUndefined()
		expect(getActiveDestination('sharedAlbums')).toBeUndefined()
		expect(getActiveDestination(undefined)).toBeUndefined()
		expect(getActiveDestination(Symbol('route'))).toBeUndefined()
	})
})

describe('isHiddenAfterScroll', () => {
	const start = { top: 500, time: 1000 }
	const fastDistance = FAST_SCROLL_SPEED * 16

	it('hides on a fast scroll down', () => {
		expect(isHiddenAfterScroll(false, start, { top: 500 + fastDistance, time: 1016 })).toBe(true)
	})

	it('stays visible on a slow scroll down', () => {
		expect(isHiddenAfterScroll(false, start, { top: 502, time: 1016 })).toBe(false)
		expect(isHiddenAfterScroll(false, start, { top: 600, time: 6000 })).toBe(false)
	})

	it('stays hidden while the scroll down slows', () => {
		expect(isHiddenAfterScroll(true, start, { top: 501, time: 1016 })).toBe(true)
	})

	it('comes back on any scroll up', () => {
		expect(isHiddenAfterScroll(true, start, { top: 499, time: 1016 })).toBe(false)
		expect(isHiddenAfterScroll(true, start, { top: 100, time: 1016 })).toBe(false)
	})

	it('comes back at the top', () => {
		expect(isHiddenAfterScroll(true, { top: 0, time: 1000 }, { top: 0, time: 1016 })).toBe(false)
		expect(isHiddenAfterScroll(true, { top: -20, time: 1000 }, { top: -5, time: 1016 })).toBe(false)
	})

	it('keeps its state when nothing moved or no time passed', () => {
		expect(isHiddenAfterScroll(true, start, { top: 500, time: 1016 })).toBe(true)
		expect(isHiddenAfterScroll(false, start, { top: 500, time: 1016 })).toBe(false)
		expect(isHiddenAfterScroll(false, start, { top: 900, time: 1000 })).toBe(false)
	})
})

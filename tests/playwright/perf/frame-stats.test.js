/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { frameStats, median } from './frame-stats.js'

test('median of an odd and an even number of values', () => {
	assert.equal(median([5, 1, 3]), 3)
	assert.equal(median([4, 1, 3, 2]), 2.5)
})

test('a steady run drops no frame', () => {
	assert.deepEqual(frameStats([16.7, 16.6, 16.7, 16.8, 16.7]), {
		frames: 5,
		refreshIntervalMs: 16.7,
		droppedFrames: 0,
		droppedPercent: 0,
		longestFrameMs: 16.8,
	})
})

test('a frame that takes three intervals stands for two dropped ones', () => {
	const stats = frameStats([16.7, 16.7, 50.1, 16.7, 16.7, 33.4, 16.7, 16.7])

	assert.equal(stats.droppedFrames, 3)
	assert.equal(stats.droppedPercent, 27.3)
	assert.equal(stats.longestFrameMs, 50.1)
})

test('no frames at all', () => {
	assert.equal(frameStats([]).droppedPercent, 0)
})

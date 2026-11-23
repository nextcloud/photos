/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * The value in the middle of a list of numbers.
 *
 * @param {number[]} values - The numbers, in any order
 * @return {number}
 */
export function median(values) {
	const sorted = [...values].sort((a, b) => a - b)
	const middle = Math.floor(sorted.length / 2)
	return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

/**
 * Sum up how smooth a run of animation frames was.
 *
 * The refresh interval of the display is taken to be the median time between two
 * frames; a frame that took n intervals to arrive stands for n - 1 dropped ones.
 *
 * @param {number[]} frameTimes - Milliseconds between consecutive frames
 * @return {{ frames: number, refreshIntervalMs: number, droppedFrames: number, droppedPercent: number, longestFrameMs: number }}
 */
export function frameStats(frameTimes) {
	if (frameTimes.length === 0) {
		return { frames: 0, refreshIntervalMs: 0, droppedFrames: 0, droppedPercent: 0, longestFrameMs: 0 }
	}

	const refreshInterval = median(frameTimes)
	const dropped = frameTimes.reduce((sum, time) => sum + Math.max(0, Math.round(time / refreshInterval) - 1), 0)

	return {
		frames: frameTimes.length,
		refreshIntervalMs: round(refreshInterval),
		droppedFrames: dropped,
		droppedPercent: round(100 * dropped / (frameTimes.length + dropped)),
		longestFrameMs: round(Math.max(...frameTimes)),
	}
}

/**
 * @param {number} value - The number to round to one decimal
 * @return {number}
 */
export function round(value) {
	return Math.round(value * 10) / 10
}

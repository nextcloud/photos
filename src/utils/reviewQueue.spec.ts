/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import {
	appendToReviewQueue,
	createReviewQueue,
	currentReviewFileId,
	recordReviewDecision,
	summarizeReview,
	swipeToReviewAction,
	undoReviewDecision,
} from './reviewQueue.ts'

describe('review queue', () => {
	test('starts with the first photo and drops duplicates', () => {
		const queue = createReviewQueue([3, 1, 3, 2])

		expect(queue.fileIds).toEqual([3, 1, 2])
		expect(currentReviewFileId(queue)).toBe(3)
	})

	test('every decision moves on to the next photo', () => {
		const queue = createReviewQueue([1, 2, 3])

		expect(recordReviewDecision(queue, 'keep', false)).toEqual({ fileId: 1, action: 'keep', wasFavorite: false })
		expect(currentReviewFileId(queue)).toBe(2)

		recordReviewDecision(queue, 'delete', true)
		recordReviewDecision(queue, 'favorite', false)

		expect(currentReviewFileId(queue)).toBeUndefined()
	})

	test('nothing is recorded once every photo was seen', () => {
		const queue = createReviewQueue([1])
		recordReviewDecision(queue, 'keep', false)

		expect(recordReviewDecision(queue, 'delete', false)).toBeUndefined()
		expect(queue.decisions).toHaveLength(1)
	})

	test('undo hands back the last decision and returns to its photo', () => {
		const queue = createReviewQueue([1, 2, 3])
		recordReviewDecision(queue, 'keep', false)
		recordReviewDecision(queue, 'favorite', true)

		expect(undoReviewDecision(queue)).toEqual({ fileId: 2, action: 'favorite', wasFavorite: true })
		expect(currentReviewFileId(queue)).toBe(2)

		expect(undoReviewDecision(queue)).toEqual({ fileId: 1, action: 'keep', wasFavorite: false })
		expect(currentReviewFileId(queue)).toBe(1)
	})

	test('undo does nothing before the first decision', () => {
		const queue = createReviewQueue([1, 2])

		expect(undoReviewDecision(queue)).toBeUndefined()
		expect(currentReviewFileId(queue)).toBe(1)
	})

	test('a photo decided on again after an undo is counted once', () => {
		const queue = createReviewQueue([1, 2])
		recordReviewDecision(queue, 'delete', false)
		undoReviewDecision(queue)
		recordReviewDecision(queue, 'keep', false)

		expect(summarizeReview(queue)).toEqual({ kept: 1, favorites: 0, deleted: 0 })
	})

	test('appended photos continue a finished queue, known ones are skipped', () => {
		const queue = createReviewQueue([1, 2])
		recordReviewDecision(queue, 'keep', false)
		recordReviewDecision(queue, 'keep', false)

		appendToReviewQueue(queue, [2, 3, 3, 4])

		expect(queue.fileIds).toEqual([1, 2, 3, 4])
		expect(currentReviewFileId(queue)).toBe(3)
	})

	test('the summary counts the decisions by kind', () => {
		const queue = createReviewQueue([1, 2, 3, 4, 5, 6])
		for (const action of ['keep', 'delete', 'favorite', 'keep', 'delete'] as const) {
			recordReviewDecision(queue, action, false)
		}

		expect(summarizeReview(queue)).toEqual({ kept: 2, favorites: 1, deleted: 2 })
	})
})

describe('swipeToReviewAction', () => {
	test.each([
		[120, 10, 'keep'],
		[-120, -30, 'delete'],
		[20, -150, 'favorite'],
	])('a swipe of %i/%i stands for %s', (deltaX, deltaY, action) => {
		expect(swipeToReviewAction(deltaX, deltaY)).toBe(action)
	})

	test.each([
		[40, 0],
		[-79, 10],
		[0, -60],
		[10, 200],
	])('a swipe of %i/%i is no decision', (deltaX, deltaY) => {
		expect(swipeToReviewAction(deltaX, deltaY)).toBeUndefined()
	})
})

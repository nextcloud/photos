/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type ReviewAction = 'keep' | 'favorite' | 'delete'

export type ReviewDecision = {
	fileId: number
	action: ReviewAction
	/** Whether the photo was a favorite before the decision, to put it back on undo. */
	wasFavorite: boolean
}

/**
 * Photos to go through one at a time, and what was decided for the ones seen
 * so far. Every decision moves on to the next photo, so the photo to decide on
 * is always the one after the last decision.
 */
export type ReviewQueue = {
	fileIds: number[]
	decisions: ReviewDecision[]
}

export type ReviewSummary = Record<'kept' | 'favorites' | 'deleted', number>

/**
 * @param fileIds - Ids of the photos to review, in the order they are shown
 */
export function createReviewQueue(fileIds: number[]): ReviewQueue {
	return { fileIds: [...new Set(fileIds)], decisions: [] }
}

/**
 * Add photos to the end of a queue, skipping the ones it already holds.
 *
 * @param queue - Queue to extend
 * @param fileIds - Ids of the photos to add
 */
export function appendToReviewQueue(queue: ReviewQueue, fileIds: number[]): void {
	const known = new Set(queue.fileIds)
	queue.fileIds.push(...new Set(fileIds.filter((fileId) => !known.has(fileId))))
}

/**
 * @param queue - Queue to read
 * @return Id of the photo to decide on, undefined once every photo was seen
 */
export function currentReviewFileId(queue: ReviewQueue): number | undefined {
	return queue.fileIds[queue.decisions.length]
}

/**
 * Store the decision made for the current photo and move on to the next one.
 *
 * @param queue - Queue to update
 * @param action - What was decided
 * @param wasFavorite - Whether the photo was a favorite before the decision
 * @return The stored decision, undefined when there is no photo left to decide on
 */
export function recordReviewDecision(queue: ReviewQueue, action: ReviewAction, wasFavorite: boolean): ReviewDecision | undefined {
	const fileId = currentReviewFileId(queue)
	if (fileId === undefined) {
		return undefined
	}

	const decision = { fileId, action, wasFavorite }
	queue.decisions.push(decision)
	return decision
}

/**
 * Take the last decision back, which makes its photo the current one again.
 *
 * @param queue - Queue to update
 * @return The decision taken back, undefined when none was made yet
 */
export function undoReviewDecision(queue: ReviewQueue): ReviewDecision | undefined {
	return queue.decisions.pop()
}

/**
 * @param queue - Queue to read
 * @return How many photos were kept, made a favorite and deleted
 */
export function summarizeReview(queue: ReviewQueue): ReviewSummary {
	const count = (action: ReviewAction) => queue.decisions.filter((decision) => decision.action === action).length

	return {
		kept: count('keep'),
		favorites: count('favorite'),
		deleted: count('delete'),
	}
}

/** Distance in pixels a swipe has to cover to count as a decision. */
export const SWIPE_THRESHOLD = 80

/**
 * Tell which decision a swipe stands for: right keeps, left deletes and up
 * makes the photo a favorite.
 *
 * @param deltaX - Horizontal distance of the swipe, positive to the right
 * @param deltaY - Vertical distance of the swipe, positive downwards
 * @return The decision, undefined when the swipe is too short or goes down
 */
export function swipeToReviewAction(deltaX: number, deltaY: number): ReviewAction | undefined {
	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
			return undefined
		}
		return deltaX > 0 ? 'keep' : 'delete'
	}

	return deltaY <= -SWIPE_THRESHOLD ? 'favorite' : undefined
}

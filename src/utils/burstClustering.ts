/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

/**
 * A run of photos taken in one go - a burst, a live photo, a quick double tap -
 * folded into the tile of its first member so the grid does not drown in a dozen
 * near-identical pictures of the same subject. The variants of one shot (see
 * `shotVariants.ts`) are stacked the same way.
 */
export interface BurstStack {
	/** The photo the grid renders: the first one of a run, the preferred variant of a shot. */
	leaderId: string
	/** Every photo of the stack, the leader first. */
	memberIds: string[]
}

interface ClusterOptions {
	/** Seconds two consecutive photos may lie apart and still belong together. */
	windowSeconds: number
	/** Photos a run needs before it is folded at all. */
	minSize: number
}

const DEFAULTS: ClusterOptions = {
	// Loose enough for a handheld ten-frames-per-second burst and for the pair a
	// live photo is, tight enough that a whole morning of holiday pictures does
	// not collapse into a single tile.
	windowSeconds: 3,
	// A pair is a run worth folding: a live photo is one, and so is the second
	// shot of the same thing right after the first.
	minSize: 2,
}

/**
 * Group a list of photos into the runs they were taken in.
 *
 * Clustering runs over the photos the app already holds, so it costs no request
 * and its window can be tuned without a migration.
 *
 * The distance is measured against the *previous* member rather than against the
 * leader, so a sustained burst of twenty photos stays one run even though its
 * first and last picture lie more than a window apart.
 *
 * @param fileIds - File ids in the order the grid shows them, newest first.
 * @param files - The photos, by file id.
 * @param options - Overrides of the window and of the minimum run length.
 * @return The runs, by the file id of their leader. Photos that were not grouped
 * carry no entry — a caller renders them as the single photo they are.
 */
export function clusterBursts(
	fileIds: string[],
	files: Record<string, PhotoFile>,
	options: Partial<ClusterOptions> = {},
): Record<string, BurstStack> {
	const { windowSeconds, minSize } = { ...DEFAULTS, ...options }
	const stacks: Record<string, BurstStack> = {}

	let index = 0
	while (index < fileIds.length) {
		const leaderId = fileIds[index]
		const leader = files[leaderId]
		if (leader === undefined) {
			index++
			continue
		}

		const memberIds = [leaderId]
		let previousTimestamp = leader.attributes.timestamp
		let next = index + 1

		while (next < fileIds.length) {
			const candidate = files[fileIds[next]]
			if (candidate === undefined || Math.abs(previousTimestamp - candidate.attributes.timestamp) > windowSeconds) {
				break
			}

			memberIds.push(fileIds[next])
			previousTimestamp = candidate.attributes.timestamp
			next++
		}

		if (memberIds.length >= minSize) {
			stacks[leaderId] = { leaderId, memberIds }
		}

		index = next
	}

	return stacks
}

/**
 * Fold the members of every run into their leader, leaving the list the grid
 * renders: one tile per run, at the position of its leader, and the photos that
 * are part of none unchanged. A member whose leader is not in the list, such as
 * the variant of a shot whose leader sits in another month, is left out too.
 *
 * @param fileIds - File ids in the order the grid shows them.
 * @param stacks - The runs, as {@link clusterBursts} returns them.
 */
export function applyBurstStacks(
	fileIds: string[],
	stacks: Record<string, BurstStack>,
): string[] {
	if (Object.keys(stacks).length === 0) {
		return fileIds
	}

	const leaderOf: Record<string, string> = {}
	for (const stack of Object.values(stacks)) {
		for (const memberId of stack.memberIds) {
			leaderOf[memberId] = stack.leaderId
		}
	}

	return fileIds.filter((fileId) => (leaderOf[fileId] ?? fileId) === fileId)
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Burst / Live-photo clustering. Groups photos taken within a small
 * time window (default ~3 seconds) into a single stack so the
 * timeline doesn't drown in twelve near-identical shots of the same
 * subject. The first (most recent / highest-priority) member is the
 * "representative" — that's the tile actually rendered in the grid;
 * tapping it opens the slideshow seeded with the full stack.
 *
 * This is intentionally a pure function over already-fetched files.
 * No backend round trip, no SQL clustering — Memories does it the
 * same way for the same reason: cheap on the server, instant in the
 * UI, easy to tune (window size, min-stack-size) without a migration.
 *
 * Tunables: bumping `windowSeconds` higher catches handheld bursts
 * but starts pulling in unrelated photos taken close together (e.g.
 * two people taking a quick snap each). 3s is a sweet spot for iPhone
 * burst (10 frames in ~1s) + Android Live Photos (~1.5s capture) +
 * the occasional manual rapid-fire.
 */

import type { PhotoFile } from '../store/files.ts'

export interface BurstStack {
	/** The fileId rendered in the grid (first member). */
	leaderId: string
	/** All fileIds in the stack, including the leader. Sorted newest-first. */
	memberIds: string[]
}

interface ClusterOptions {
	windowSeconds: number
	minSize: number
}

const DEFAULTS: ClusterOptions = {
	// Photos within this many seconds of each other belong to the
	// same burst. Loose enough for handheld 10-fps bursts, tight
	// enough that we don't conflate a vacation morning into one stack.
	windowSeconds: 3,
	// Stacks of two are a real pattern (Live Photos = paired image
	// + video; iPhone "Live" = two frames; quick double-tap on Android).
	// Lower than this and every photo with a near-twin becomes a stack,
	// which is just visual noise.
	minSize: 2,
}

/**
 * Cluster a chronologically-sorted list of fileIds into burst stacks.
 *
 * @param fileIds - File ids in display order (newest-first).
 * @param files - Lookup table keyed by fileId.
 * @param options - Override window / minimum size.
 * @return A map from leaderId → stack. Files that weren't grouped
 *          are NOT in the map (caller renders them as singletons).
 */
export function clusterBursts(
	fileIds: string[],
	files: Record<string, PhotoFile>,
	options: Partial<ClusterOptions> = {},
): Record<string, BurstStack> {
	const opts = { ...DEFAULTS, ...options }
	const stacks: Record<string, BurstStack> = {}

	if (fileIds.length < opts.minSize) {
		return stacks
	}

	let i = 0
	while (i < fileIds.length) {
		const leaderId = fileIds[i]
		const leader = files[leaderId]
		if (leader === undefined) {
			i++
			continue
		}

		const leaderTs = timestampOf(leader)
		const member: string[] = [leaderId]
		let j = i + 1

		// Walk forward while neighbours are within the window of the
		// PREVIOUS member (chain-cluster), not the leader. This way a
		// long burst of 20 photos at 0.1s intervals stays a single
		// stack even if the first and last are >3s apart.
		let prevTs = leaderTs
		while (j < fileIds.length) {
			const nextFile = files[fileIds[j]]
			if (nextFile === undefined) {
				break
			}
			const nextTs = timestampOf(nextFile)
			if (Math.abs(prevTs - nextTs) > opts.windowSeconds) {
				break
			}
			member.push(fileIds[j])
			prevTs = nextTs
			j++
		}

		if (member.length >= opts.minSize) {
			stacks[leaderId] = { leaderId, memberIds: member }
		}

		i = j
	}

	return stacks
}

function timestampOf(file: PhotoFile): number {
	// `attributes.timestamp` is set in the store mutation from
	// metadata-photos-original_date_time (or mtime). Always defined
	// for files that survived `appendFiles`.
	return file.attributes.timestamp
}

/**
 * Inverse of `clusterBursts` for rendering: given a list of fileIds
 * in display order and the stack map, produce the list with stack
 * members folded in (i.e. only leaders remain). Singletons pass
 * through unchanged.
 *
 * @param fileIds
 * @param stacks
 */
export function applyBurstStacks(
	fileIds: string[],
	stacks: Record<string, BurstStack>,
): string[] {
	if (Object.keys(stacks).length === 0) {
		return fileIds
	}

	// Quick lookup: every member of every stack maps back to its leader.
	const memberToLeader: Record<string, string> = {}
	for (const stack of Object.values(stacks)) {
		for (const id of stack.memberIds) {
			memberToLeader[id] = stack.leaderId
		}
	}

	const seen = new Set<string>()
	const result: string[] = []
	for (const id of fileIds) {
		const leader = memberToLeader[id] ?? id
		if (seen.has(leader)) {
			continue
		}
		seen.add(leader)
		result.push(leader)
	}
	return result
}

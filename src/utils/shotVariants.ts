/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { BurstStack } from './burstClustering.ts'

/**
 * Suffixes cameras, phones and editors append to the name of a copy of a shot:
 * " (edited)", "-edited", "_edited" and the localised names Google Photos
 * exports under, and the "~2" of a duplicated file.
 */
const EDIT_SUFFIXES = [
	/[ _-]?\(edited\)$/i,
	/[ _-](?:edited|bearbeitet|modifié|editado|modificato|bewerkt)$/i,
	/~\d+$/,
]

/** The "IMG_E1234" an iPhone names the edited copy of "IMG_1234". */
const APPLE_EDITED = /^(IMG_)E(\d+)$/i

/**
 * The name a file shares with every other variant of its shot: its base name
 * without the extension and without edit suffixes, lower case.
 *
 * @param basename - File name, e.g. "IMG_1234 (edited).jpg"
 * @return The shot name, e.g. "img_1234", and whether the name carried an edit
 * suffix.
 */
export function shotName(basename: string): { name: string, edited: boolean } {
	const normalized = basename.normalize('NFC')
	const dot = normalized.lastIndexOf('.')
	let name = dot > 0 ? normalized.slice(0, dot) : normalized
	let edited = false

	let stripped = true
	while (stripped) {
		stripped = false
		for (const suffix of EDIT_SUFFIXES) {
			const shorter = name.replace(suffix, '')
			if (shorter !== name && shorter !== '') {
				name = shorter
				edited = true
				stripped = true
			}
		}
	}

	if (APPLE_EDITED.test(name)) {
		name = name.replace(APPLE_EDITED, '$1$2')
		edited = true
	}

	return { name: name.toLowerCase(), edited }
}

/**
 * How well a variant stands for its shot, lower is better: pictures before
 * videos, edited copies before originals, JPEG before any other format (HEIC,
 * RAW, …).
 *
 * @param file - One variant of a shot
 */
function leaderRank(file: PhotoFile): number {
	return (file.mime?.startsWith('video/') ? 4 : 0)
		+ (shotName(file.basename).edited ? 0 : 2)
		+ (file.mime === 'image/jpeg' ? 0 : 1)
}

/**
 * Group the files of one folder that are variants of the same shot - RAW and
 * JPEG, HEIC and JPEG, the original and its edited copy - regardless of when
 * they were taken.
 *
 * @param fileIds - File ids in the order the grid shows them.
 * @param files - The photos, by file id.
 * @return The groups of two or more variants, by the file id of their leader,
 * the variant the grid shows. Members follow the leader in grid order.
 */
export function groupShotVariants(
	fileIds: string[],
	files: Record<string, PhotoFile>,
): Record<string, BurstStack> {
	const groups = new Map<string, string[]>()
	for (const fileId of fileIds) {
		const file = files[fileId]
		if (file === undefined) {
			continue
		}

		const key = `${file.dirname}/${shotName(file.basename).name}`
		const group = groups.get(key)
		if (group === undefined) {
			groups.set(key, [fileId])
		} else {
			group.push(fileId)
		}
	}

	const stacks: Record<string, BurstStack> = {}
	for (const group of groups.values()) {
		if (group.length < 2) {
			continue
		}

		// The sort is stable, so variants of equal rank keep their grid order.
		const leaderId = [...group].sort((id1, id2) => leaderRank(files[id1]) - leaderRank(files[id2]))[0]
		stacks[leaderId] = {
			leaderId,
			memberIds: [leaderId, ...group.filter((fileId) => fileId !== leaderId)],
		}
	}

	return stacks
}

/**
 * Combine the variant groups with the bursts found among their leaders: a burst
 * takes in the variants of each of its shots, right after that shot, and a
 * variant group no burst took in stays a stack of its own.
 *
 * @param variantStacks - The variant groups, as {@link groupShotVariants} returns them.
 * @param burstStacks - The bursts, clustered over photos where every variant
 * group is represented by its leader alone.
 */
export function mergeStacks(
	variantStacks: Record<string, BurstStack>,
	burstStacks: Record<string, BurstStack>,
): Record<string, BurstStack> {
	const stacks: Record<string, BurstStack> = { ...variantStacks }
	for (const burst of Object.values(burstStacks)) {
		for (const shotId of burst.memberIds) {
			delete stacks[shotId]
		}
		stacks[burst.leaderId] = {
			leaderId: burst.leaderId,
			memberIds: burst.memberIds.flatMap((shotId) => variantStacks[shotId]?.memberIds ?? [shotId]),
		}
	}
	return stacks
}

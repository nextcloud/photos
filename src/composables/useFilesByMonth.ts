/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'
import type { PhotoFile } from '../store/files.ts'
import type { BurstStack } from '../utils/burstClustering.ts'

import { computed, unref } from 'vue'
import store from '../store/index.ts'
import { applyBurstStacks, clusterBursts } from '../utils/burstClustering.ts'

export interface FilesByMonthOptions {
	/**
	 * Whether photos taken in one go are folded into a single tile. Off by
	 * default: folding hides photos from the grid, which a view where photos are
	 * picked cannot afford - every one of them has to stay selectable there. The
	 * timeline, where photos are browsed rather than picked, turns it on.
	 */
	foldBursts?: Ref<boolean> | boolean
}

/**
 * Group the loaded photos by the month they were taken in, so the grid can
 * render them as sections.
 *
 * @param fileIds - Ids of the loaded photos, in the order they were fetched
 * @param options - See FilesByMonthOptions
 */
export function useFilesByMonth(
	fileIds: Ref<number[]> | ComputedRef<number[]>,
	options: FilesByMonthOptions = {},
): {
	fileIdsByMonthUngrouped: ComputedRef<Record<string, string[]>>
	burstStacks: ComputedRef<Record<string, BurstStack>>
	fileIdsByMonth: ComputedRef<Record<string, string[]>>
	monthsList: ComputedRef<string[]>
} {
	const files = computed<Record<string, PhotoFile>>(() => store.state.files.files)

	/**
	 * @param fileId1 - Id of the photo to compare
	 * @param fileId2 - Id of the photo to compare it to
	 */
	function sortFilesByTimestamp(fileId1: string, fileId2: string): -1 | 1 {
		return files.value[fileId1].attributes.timestamp > files.value[fileId2].attributes.timestamp ? -1 : 1
	}

	// The photos of the library by month, before any folding - so the widgets
	// counting a month, like the density ticks of the scrubber, can show how many
	// photos it really holds.
	const fileIdsByMonthUngrouped = computed<Record<string, string[]>>(() => {
		// The grid and the store both index the photos by their numeric file id,
		// which JavaScript turns into the string the consumers declare.
		const filesByMonth = {} as Record<string, string[]>
		for (const fileId of fileIds.value) {
			const file = files.value[fileId]
			if (file) {
				filesByMonth[file.attributes.month] = filesByMonth[file.attributes.month] ?? []
				filesByMonth[file.attributes.month].push(file.fileid as unknown as string)
			}
		}

		// Sort files in sections.
		Object.keys(filesByMonth)
			.forEach((month) => filesByMonth[month].sort(sortFilesByTimestamp))

		return filesByMonth
	})

	// The runs of photos taken in one go, by the file id of the tile standing for
	// them. Empty unless the view folds them.
	// Clustered per month, so a run is never split across two sections of the
	// grid - and a run spanning the turn of a month becomes two of them, which is
	// what the grid can render.
	const burstStacks = computed<Record<string, BurstStack>>(() => {
		if (!unref(options.foldBursts ?? false)) {
			return {}
		}

		const stacks: Record<string, BurstStack> = {}
		for (const monthFileIds of Object.values(fileIdsByMonthUngrouped.value)) {
			Object.assign(stacks, clusterBursts(monthFileIds, files.value))
		}
		return stacks
	})

	// The photos the grid renders, by month: the same shape as
	// `fileIdsByMonthUngrouped`, with the members of every run folded into the
	// tile of its leader.
	const fileIdsByMonth = computed<Record<string, string[]>>(() => {
		if (!unref(options.foldBursts ?? false)) {
			return fileIdsByMonthUngrouped.value
		}

		return Object.fromEntries(Object
			.entries(fileIdsByMonthUngrouped.value)
			.map(([month, monthFileIds]) => [month, applyBurstStacks(monthFileIds, burstStacks.value)]))
	})

	const monthsList = computed<string[]>(() => Object
		.keys(fileIdsByMonth.value)
		.sort((month1, month2) => month1 > month2 ? -1 : 1))

	return {
		fileIdsByMonthUngrouped,
		burstStacks,
		fileIdsByMonth,
		monthsList,
	}
}

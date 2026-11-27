/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { PhotoFile } from '../store/files.ts'
import type { BurstStack } from '../utils/burstClustering.ts'

import { computed, toValue } from 'vue'
import { applyBurstStacks, clusterBursts } from '../utils/burstClustering.ts'
import { groupShotVariants, mergeStacks } from '../utils/shotVariants.ts'

/**
 * Group the fetched photos by month, the sections of a timeline grid.
 *
 * @param fetchedFileIds - Ids of the photos fetched so far, in fetch order
 * @param files - Photos of the store, by id
 * @param foldBursts - Whether photos taken in one go, and the variants of one
 * shot (RAW and JPEG, an original and its edited copy), are folded into a single
 * tile. Off by default: folding hides photos from the grid, which a view where
 * photos are picked cannot afford, every one of them has to stay selectable
 * there. The timeline, where photos are browsed rather than picked, turns it on.
 */
export function useFilesByMonth(
	fetchedFileIds: Ref<number[]>,
	files: Ref<Record<string, PhotoFile>>,
	foldBursts: MaybeRefOrGetter<boolean> = false,
): {
	fileIdsByMonthUngrouped: ComputedRef<Record<string, string[]>>
	burstStacks: ComputedRef<Record<string, BurstStack>>
	fileIdsByMonth: ComputedRef<Record<string, string[]>>
	monthsList: ComputedRef<string[]>
} {
	/**
	 * @param fileId1 - First photo
	 * @param fileId2 - Second photo
	 */
	function sortFilesByTimestamp(fileId1: string, fileId2: string): -1 | 1 {
		return files.value[fileId1].attributes.timestamp > files.value[fileId2].attributes.timestamp ? -1 : 1
	}

	// The photos of the library by month, before any folding, so the widgets
	// counting a month, like the density ticks of the scrubber, can show how many
	// photos it really holds.
	const fileIdsByMonthUngrouped = computed<Record<string, string[]>>(() => {
		const filesByMonth: Record<string, string[]> = {}
		for (const fileId of fetchedFileIds.value) {
			const file = files.value[fileId]
			if (file) {
				filesByMonth[file.attributes.month] = filesByMonth[file.attributes.month] ?? []
				filesByMonth[file.attributes.month].push(String(file.fileid))
			}
		}

		// Sort files in sections.
		Object.keys(filesByMonth)
			.forEach((month) => filesByMonth[month].sort(sortFilesByTimestamp))

		return filesByMonth
	})

	// The runs of photos taken in one go and the variants of one shot, by the
	// file id of the tile standing for them. Empty unless the view folds them.
	// Variants are grouped over the whole library, as an edited copy can carry
	// another date than its original. Runs are clustered per month, over the
	// leaders of the variant groups, so a run is never split across two sections
	// of the grid, and a run spanning the turn of a month becomes two of them,
	// which is what the grid can render.
	const burstStacks = computed<Record<string, BurstStack>>(() => {
		if (!toValue(foldBursts)) {
			return {}
		}

		const months = Object.keys(fileIdsByMonthUngrouped.value).sort().reverse()
		const variantStacks = groupShotVariants(months.flatMap((month) => fileIdsByMonthUngrouped.value[month]), files.value)

		const runs: Record<string, BurstStack> = {}
		for (const fileIds of Object.values(fileIdsByMonthUngrouped.value)) {
			Object.assign(runs, clusterBursts(applyBurstStacks(fileIds, variantStacks), files.value))
		}
		return mergeStacks(variantStacks, runs)
	})

	// The photos the grid renders, by month: the same shape as
	// `fileIdsByMonthUngrouped`, with the members of every stack folded into the
	// tile of its leader, and without the months left empty by that.
	const fileIdsByMonth = computed<Record<string, string[]>>(() => {
		if (!toValue(foldBursts)) {
			return fileIdsByMonthUngrouped.value
		}

		return Object.fromEntries(Object
			.entries(fileIdsByMonthUngrouped.value)
			.map(([month, fileIds]) => [month, applyBurstStacks(fileIds, burstStacks.value)])
			.filter(([, fileIds]) => fileIds.length > 0))
	})

	const monthsList = computed(() => Object
		.keys(fileIdsByMonth.value)
		.sort((month1, month2) => month1 > month2 ? -1 : 1))

	return {
		fileIdsByMonthUngrouped,
		burstStacks,
		fileIdsByMonth,
		monthsList,
	}
}

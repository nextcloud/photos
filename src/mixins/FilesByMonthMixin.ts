/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { BurstStack } from '../utils/burstClustering.ts'

import { defineComponent } from 'vue'
import { applyBurstStacks, clusterBursts } from '../utils/burstClustering.ts'

export default defineComponent({
	name: 'FilesByMonthMixin',

	computed: {
		// Whether photos taken in one go are folded into a single tile. Extension
		// point for the views using this mixin, off by default: folding hides photos
		// from the grid, which a view where photos are picked cannot afford - every
		// one of them has to stay selectable there. The timeline, where photos are
		// browsed rather than picked, overrides it.
		foldBursts(): boolean {
			return false
		},

		// The photos of the library by month, before any folding - so the widgets
		// counting a month, like the density ticks of the scrubber, can show how many
		// photos it really holds.
		fileIdsByMonthUngrouped(): Record<string, string[]> {
			const filesByMonth = {}
			for (const fileId of (this.fetchedFileIds as number[])) {
				const file = (this.files as Record<string, PhotoFile>)[fileId]
				if (file) {
					filesByMonth[file.attributes.month] = filesByMonth[file.attributes.month] ?? []
					filesByMonth[file.attributes.month].push(file.fileid)
				}
			}

			// Sort files in sections.
			Object.keys(filesByMonth)
				.forEach((month) => filesByMonth[month].sort(this.sortFilesByTimestamp))

			return filesByMonth
		},

		// The runs of photos taken in one go, by the file id of the tile standing for
		// them. Empty unless the view folds them.
		// Clustered per month, so a run is never split across two sections of the
		// grid - and a run spanning the turn of a month becomes two of them, which is
		// what the grid can render.
		burstStacks(): Record<string, BurstStack> {
			if (!this.foldBursts) {
				return {}
			}

			const stacks: Record<string, BurstStack> = {}
			for (const fileIds of Object.values(this.fileIdsByMonthUngrouped)) {
				Object.assign(stacks, clusterBursts(fileIds, this.files as Record<string, PhotoFile>))
			}
			return stacks
		},

		// The photos the grid renders, by month: the same shape as
		// `fileIdsByMonthUngrouped`, with the members of every run folded into the
		// tile of its leader.
		fileIdsByMonth(): Record<string, string[]> {
			if (!this.foldBursts) {
				return this.fileIdsByMonthUngrouped
			}

			return Object.fromEntries(Object
				.entries(this.fileIdsByMonthUngrouped as Record<string, string[]>)
				.map(([month, fileIds]) => [month, applyBurstStacks(fileIds, this.burstStacks)]))
		},

		monthsList(): string[] {
			return Object
				.keys(this.fileIdsByMonth)
				.sort((month1, month2) => month1 > month2 ? -1 : 1)
		},
	},

	methods: {
		sortFilesByTimestamp(fileId1: string, fileId2: string): -1 | 1 {
			return (this.files as Record<string, PhotoFile>)[fileId1].attributes.timestamp > (this.files as Record<string, PhotoFile>)[fileId2].attributes.timestamp ? -1 : 1
		},
	},
})

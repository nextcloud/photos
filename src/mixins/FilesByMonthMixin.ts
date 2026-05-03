/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { defineComponent } from 'vue'
import burstStore from '../store/bursts.ts'
import { applyBurstStacks, clusterBursts } from '../utils/burstClustering.ts'

export default defineComponent({
	name: 'FilesByMonthMixin',

	setup() {
		// Pinia store the mixin pushes the per-month burst clusters
		// into. FileComponent reads the same store to render the
		// stacked-card decoration; TimelineView reads it to seed the
		// slideshow with all stack members on click.
		const bursts = burstStore()
		return { bursts }
	},

	computed: {
		// Raw grouping by month, before burst clustering. Kept as an
		// internal step so the scrubber / count widgets can show the
		// "true" photo count per month (including hidden burst members)
		// without recomputing from scratch.
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

		// Same shape as the legacy `fileIdsByMonth` consumers expect,
		// but burst members are folded into their leader. The store is
		// kept in sync so FileComponent + TimelineView can look up
		// stack membership by leader id.
		fileIdsByMonth(): Record<string, string[]> {
			const ungrouped = this.fileIdsByMonthUngrouped
			const allStacks: Record<string, ReturnType<typeof clusterBursts>[string]> = {}
			const result: Record<string, string[]> = {}

			for (const month of Object.keys(ungrouped)) {
				const ids = ungrouped[month]
				const monthStacks = clusterBursts(ids, this.files as Record<string, PhotoFile>)
				Object.assign(allStacks, monthStacks)
				result[month] = applyBurstStacks(ids, monthStacks)
			}

			// Push the latest stack map into the Pinia store so the
			// rest of the UI sees it. Done in the computed because
			// Vuex/Vue 3 fires this on `fetchedFileIds` changes — same
			// reactivity surface as the consumers.
			this.bursts.setStacks(allStacks)

			return result
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

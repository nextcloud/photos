/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

import { computed, ref, toValue, watch } from 'vue'
import { useRoute } from 'vue-router'

export type FileSelectToggle = {
	/** Id of the file */
	id: number
	/** Whether it is selected */
	value: boolean
	/** Whether every file from the last toggled one up to this one follows it */
	range?: boolean
}

/**
 * The files from one file up to another, both included, in the order of the list.
 * Only the target is returned when either of them is not in the list.
 *
 * @param orderedFileIds - Files in the order they are shown
 * @param fromFileId - One end of the range
 * @param toFileId - The other end of the range
 */
export function fileIdsBetween(orderedFileIds: string[], fromFileId: string, toFileId: string): string[] {
	const fromIndex = orderedFileIds.indexOf(fromFileId)
	const toIndex = orderedFileIds.indexOf(toFileId)
	if (fromIndex === -1 || toIndex === -1) {
		return [toFileId]
	}

	return orderedFileIds.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1)
}

/**
 * The photos selected in a grid, dropped on every navigation.
 *
 * @param orderedFileIds - Files of the grid in the order it shows them, what a range is taken from
 * @param expandFileId - Files a tile stands for, all of which follow its selection
 */
export function useFilesSelection(
	orderedFileIds: MaybeRefOrGetter<string[]> = [],
	expandFileId: (fileId: string) => string[] = (fileId) => [fileId],
): {
	selection: Ref<Record<string, boolean>>
	selectedFileIds: ComputedRef<string[]>
	onFileSelectToggle: (toggle: FileSelectToggle) => void
	onUncheckFiles: (fileIds: string[]) => void
	resetSelection: () => void
} {
	const route = useRoute()

	const selection = ref<Record<string, boolean>>({})

	const selectedFileIds = computed(() => Object.keys(selection.value).filter((fileId) => selection.value[fileId]))

	// The file a range starts from.
	let lastToggledFileId: string | undefined

	/**
	 * @param toggle - The file and its new selection state
	 * @param toggle.id - Id of the file
	 * @param toggle.value - Whether it is selected
	 * @param toggle.range - Whether every file from the last toggled one up to this one follows it
	 */
	function onFileSelectToggle({ id, value, range = false }: FileSelectToggle): void {
		const fileId = id.toString()
		const fileIds = range && lastToggledFileId !== undefined && selectedFileIds.value.length > 0
			? fileIdsBetween(toValue(orderedFileIds), lastToggledFileId, fileId)
			: [fileId]

		fileIds
			.flatMap((tileFileId) => expandFileId(tileFileId))
			.forEach((selectedFileId) => {
				selection.value[selectedFileId] = value
			})

		lastToggledFileId = fileId
	}

	/**
	 * @param fileIds - Files to drop from the selection
	 */
	function onUncheckFiles(fileIds: string[]): void {
		fileIds.forEach((fileId) => {
			selection.value[fileId] = false
		})
	}

	function resetSelection(): void {
		selection.value = {}
		lastToggledFileId = undefined
	}

	watch(() => route.fullPath, resetSelection)

	return {
		selection,
		selectedFileIds,
		onFileSelectToggle,
		onUncheckFiles,
		resetSelection,
	}
}

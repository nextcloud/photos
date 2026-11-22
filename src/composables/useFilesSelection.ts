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

export type FileSelectRectangle = {
	/** Ids of the files whose tiles the rectangle touches */
	fileIds: string[]
	/** Whether the tiles add to the selection the drag started with instead of replacing it */
	additive: boolean
	/** Whether the drag has just started */
	start: boolean
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
	onFileSelectRectangle: (rectangle: FileSelectRectangle) => void
	selectAll: () => void
	onUncheckFiles: (fileIds: string[]) => void
	resetSelection: () => void
} {
	const route = useRoute()

	const selection = ref<Record<string, boolean>>({})

	const selectedFileIds = computed(() => Object.keys(selection.value).filter((fileId) => selection.value[fileId]))

	// The file a range starts from.
	let lastToggledFileId: string | undefined
	// The selection a drawn rectangle adds its tiles to.
	let selectionBeforeRectangle: Record<string, boolean> = {}

	/**
	 * @param fileIds - Tiles to select, along with the files they stand for
	 */
	function selectedTiles(fileIds: string[]): Record<string, boolean> {
		return Object.fromEntries(fileIds
			.flatMap((fileId) => expandFileId(fileId))
			.map((fileId) => [fileId, true]))
	}

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
	 * @param rectangle - The tiles touched by a rectangle drawn over the grid
	 * @param rectangle.fileIds - Ids of the files whose tiles the rectangle touches
	 * @param rectangle.additive - Whether the tiles add to the selection the drag started with instead of replacing it
	 * @param rectangle.start - Whether the drag has just started
	 */
	function onFileSelectRectangle({ fileIds, additive, start }: FileSelectRectangle): void {
		if (start) {
			selectionBeforeRectangle = additive ? { ...selection.value } : {}
		}

		selection.value = { ...selectionBeforeRectangle, ...selectedTiles(fileIds) }
	}

	function selectAll(): void {
		selection.value = { ...selection.value, ...selectedTiles(toValue(orderedFileIds)) }
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
		onFileSelectRectangle,
		selectAll,
		onUncheckFiles,
		resetSelection,
	}
}

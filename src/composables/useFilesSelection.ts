/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * The photos selected in a grid, dropped on every navigation.
 */
export function useFilesSelection(): {
	selection: Ref<Record<string, boolean>>
	selectedFileIds: ComputedRef<string[]>
	onFileSelectToggle: (toggle: { id: number, value: boolean }) => void
	onUncheckFiles: (fileIds: string[]) => void
	resetSelection: () => void
} {
	const route = useRoute()

	const selection = ref<Record<string, boolean>>({})

	const selectedFileIds = computed(() => Object.keys(selection.value).filter((fileId) => selection.value[fileId]))

	/**
	 * @param toggle - The file and its new selection state
	 * @param toggle.id - Id of the file
	 * @param toggle.value - Whether it is selected
	 */
	function onFileSelectToggle({ id, value }: { id: number, value: boolean }): void {
		selection.value[id] = value
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

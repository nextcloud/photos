/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'

import { computed, onUnmounted, ref } from 'vue'
import router from '../router/index.ts'

/**
 * Keep track of the photos the user picked in a grid. The selection is dropped
 * when the user navigates to another route.
 */
export function useFilesSelection(): {
	selection: Ref<Record<string, boolean>>
	selectedFileIds: ComputedRef<string[]>
	setSelected: (fileIds: string[], value: boolean) => void
	onFileSelectToggle: (payload: { id: string, value: boolean }) => void
	onUncheckFiles: (fileIds: string[]) => void
	resetSelection: () => void
} {
	const selection = ref<Record<string, boolean>>({})

	const selectedFileIds = computed(() => Object.keys(selection.value).filter((fileId) => selection.value[fileId]))

	/**
	 * @param fileIds - Ids of the photos to select or unselect
	 * @param value - Whether they become selected
	 */
	function setSelected(fileIds: string[], value: boolean): void {
		// The map is replaced rather than mutated: Vue 2 does not pick up keys
		// added to a reactive object.
		selection.value = {
			...selection.value,
			...Object.fromEntries(fileIds.map((fileId) => [fileId, value])),
		}
	}

	/**
	 * @param payload - The photo whose selection was toggled, and its new state
	 * @param payload.id
	 * @param payload.value
	 */
	function onFileSelectToggle({ id, value }: { id: string, value: boolean }): void {
		setSelected([id], value)
	}

	/**
	 * @param fileIds - Ids of the photos to unselect
	 */
	function onUncheckFiles(fileIds: string[]): void {
		setSelected(fileIds, false)
	}

	function resetSelection(): void {
		selection.value = {}
	}

	const removeNavigationHook = router.afterEach(resetSelection)

	onUnmounted(removeNavigationHook)

	return {
		selection,
		selectedFileIds,
		setSelected,
		onFileSelectToggle,
		onUncheckFiles,
		resetSelection,
	}
}

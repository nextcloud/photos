<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div
		ref="root"
		class="files-list-viewer"
		@pointerdown="onPointerDown"
		@keydown="onKeyDown">
		<NcEmptyContent
			v-if="emptyMessage !== '' && photosCount === 0 && !loading"
			key="emptycontent"
			:name="emptyMessage">
			<template #icon>
				<PackageVariant />
			</template>
		</NcEmptyContent>

		<TiledLayout ref="tiledLayout" :baseHeight="baseHeight" :sections="itemsBySections">
			<template #default="{ tiledSections }">
				<VirtualScrolling
					:useWindow="useWindow"
					:containerElement="containerElement"
					:sections="tiledSections"
					:scrollToKey="scrollToSection"
					:headerHeight="sectionHeaderHeight"
					@needContent="needContent">
					<template #default="{ visibleSections }">
						<div v-for="section of visibleSections" :key="section.id">
							<template v-if="section.id !== ''">
								<!-- Placeholder when initial loading -->
								<div
									v-if="showPlaceholders"
									class="files-list-viewer__placeholder"
									:style="{ 'flex-basis': '100%', height: `${sectionHeaderHeight}px` }" />
								<!-- Real file. -->
								<slot
									v-else
									:file="{ id: section.id }"
									:isHeader="true"
									class="files-list-viewer__section-header"
									:style="{ 'flex-basis': '100%', height: `${sectionHeaderHeight}px` }" />
							</template>

							<ul>
								<template v-for="(row, rowIndex) of section.rows" :key="row.key">
									<!--
									We are subtracting 1 from flex-basis to compensate for rounding issues.
									The flex algo will then compensate with flex-grow.
									'last-tiled-row' prevents the last row's items from growing.
								-->
									<li
										v-for="item of row.items"
										:key="item.key"
										:class="{ 'last-tiled-rows': rowIndex === section.rows.length - 1 }"
										:data-tile-id="showPlaceholders ? undefined : item.id"
										:style="{ 'flex-basis': `${item.width - 1}px`, height: `${item.height}px` }">
										<!-- Placeholder when initial loading -->
										<div v-if="showPlaceholders" class="files-list-viewer__placeholder" />
										<!-- Real file. -->
										<slot v-else :file="item" />
									</li>
								</template>
							</ul>
						</div>
					</template>
					<template #loader>
						<NcLoadingIcon v-if="loading && !showPlaceholders" class="files-list-viewer__loader" />
					</template>
				</VirtualScrolling>
			</template>
		</TiledLayout>

		<div
			v-if="rectangle !== null"
			class="files-list-viewer__selection-rectangle"
			:style="{ left: `${rectangle.left}px`, top: `${rectangle.top}px`, width: `${rectangle.width}px`, height: `${rectangle.height}px` }" />
	</div>
</template>

<script setup lang="ts">
import type { File, Node } from '@nextcloud/files'
import type { FileSelectRectangle } from '../composables/useFilesSelection.ts'
import type { TiledItem, TiledSection } from '../services/TiledLayout.ts'
import type { PhotoFile } from '../store/files.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import PackageVariant from 'vue-material-design-icons/PackageVariant.vue'
import TiledLayout from '../components/TiledLayout/TiledLayout.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import { tileBoxes, useRectangleSelection } from '../composables/useRectangleSelection.ts'
import { fetchFile } from '../services/fileFetcher.ts'
import { useFilesStore } from '../store/files.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

const props = withDefaults(defineProps<{
	// Array of file ids that should be rendered.
	fileIds?: string[]
	// An object mapping a list of section to a list of fileIds.
	fileIdsBySection?: Record<string, string[]>
	// The list of sorted sections.
	sections?: string[]
	// Whether we should display a loading indicator.
	loading?: boolean
	// Message to display when there is no files.
	emptyMessage?: string
	// The base height to forward to TileLayout.
	baseHeight?: number
	// The height to use for section headers.
	sectionHeaderHeight?: number
	// Instruct VirtualScrolling to scroll to the given section id.
	scrollToSection?: string
	// The containerElement props to forward to TileLayout.
	containerElement?: HTMLElement | null
	// The useWindow props to forward to TileLayout.
	useWindow?: boolean
	// Whether files can be selected by drawing a rectangle over them and with Ctrl+A.
	selectable?: boolean
	// Whether files are selected, a drag on a tile then draws a rectangle too.
	selectionActive?: boolean
}>(), {
	fileIds: undefined,
	fileIdsBySection: undefined,
	sections: undefined,
	loading: false,
	emptyMessage: '',
	baseHeight: 200,
	sectionHeaderHeight: 75,
	scrollToSection: '',
	containerElement: null,
	useWindow: false,
	selectable: false,
	selectionActive: false,
})

const emit = defineEmits<{
	needContent: []
	selectRectangle: [rectangle: FileSelectRectangle]
	selectAll: []
}>()

defineSlots<{
	// Section headers only carry the section id as file id.
	default(props: { file: Pick<TiledItem, 'id'>, isHeader?: boolean }): unknown
}>()

const filesStore = useFilesStore()
const userConfigStore = useUserConfigStore()

const files = computed<Record<string, PhotoFile>>(() => filesStore.files)

const croppedLayout = computed<boolean>(() => userConfigStore.croppedLayout)

const placeholderFiles: TiledItem[] = Array(20).fill(0).map((_, index) => {
	const height = 200
	const width = croppedLayout.value ? height : height * (1 + Math.random() * 2)
	return {
		id: index.toString(),
		width,
		height,
		ratio: width / height,
	}
})

const showPlaceholders = computed<boolean>(() => props.loading && (props.fileIds?.length === 0 || props.sections?.length === 0))

const itemsBySections = computed<{ id: string, items: TiledItem[] }[]>(() => {
	if (props.fileIds !== undefined) {
		if (showPlaceholders.value) {
			return [{ id: '', items: placeholderFiles }]
		}

		return [
			{
				id: '',
				items: props.fileIds
					.filter((fileId) => files.value[fileId])
					.map(mapFileToItem),
			},
		]
	}

	if (props.sections !== undefined) {
		if (showPlaceholders.value) {
			return [{ id: 'placeholder', items: placeholderFiles }]
		}

		return props.sections.map((sectionId) => {
			return {
				id: sectionId,
				items: (props.fileIdsBySection?.[sectionId] ?? [])
					.filter((fileId) => files.value[fileId])
					.map(mapFileToItem),
			}
		})
	}

	return []
})

const root = useTemplateRef<HTMLDivElement>('root')
const tiledLayout = useTemplateRef<{ tiledSections: TiledSection[] }>('tiledLayout')

const tiles = computed(() => tileBoxes(tiledLayout.value?.tiledSections ?? [], props.sectionHeaderHeight))

const { rectangle, onPointerDown } = useRectangleSelection({
	root,
	boxes: () => tiles.value,
	scrollContainer: () => props.containerElement ?? (props.useWindow ? window : root.value?.querySelector<HTMLElement>('.vs-container') ?? window),
	enabled: () => props.selectable && !showPlaceholders.value,
	selectionActive: () => props.selectionActive,
	onSelect: (rectangle) => emit('selectRectangle', rectangle),
})

/**
 * Selects every file with Ctrl+A or Cmd+A while the focus is in the grid.
 *
 * @param event - The pressed key
 */
function onKeyDown(event: KeyboardEvent): void {
	if (!props.selectable || !(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey || event.key.toLowerCase() !== 'a') {
		return
	}

	event.preventDefault()
	emit('selectAll')
}

const photosCount = computed<number>(() => itemsBySections.value.map(({ items }) => items.length).reduce((total, length) => total + length, 0))

// Ask the parent for more content.
function needContent(): void {
	emit('needContent')
}

function mapFileToItem(fileId: string): TiledItem {
	const file = files.value[fileId] as File
	return {
		id: file.fileid?.toString() as string,
		width: file.attributes['metadata-photos-size'].width,
		height: file.attributes['metadata-photos-size'].height,
		ratio: croppedLayout.value ? 1 : file.attributes['metadata-photos-size'].width / file.attributes['metadata-photos-size'].height,
	}
}

async function handleFileUpdated({ fileid }: Node): Promise<void> {
	const fetchedFile = await fetchFile(files.value[fileid as number].path)
	if (fetchedFile === null) {
		return
	}

	filesStore.appendFiles([fetchedFile as File])
}

function handleFileDeleted({ fileid }: Node) {
	filesStore.deleteFile(fileid as number)
}

onMounted(() => {
	subscribe('files:node:updated', handleFileUpdated)
	subscribe('files:node:deleted', handleFileDeleted)
})

onUnmounted(() => {
	unsubscribe('files:node:updated', handleFileUpdated)
	unsubscribe('files:node:deleted', handleFileDeleted)
})
</script>

<style lang="scss" scoped>
.files-list-viewer {
	height: 100%;
	position: relative;

	&__placeholder {
		background: var(--color-primary-element-light);
		width: 100%;
		height: 100%;
		border: 2px solid var(--color-main-background); // Use border so create a separation between images.
	}

	.tiled-container {
		flex-basis: 0;
	}

	ul {
		display: flex;
		flex-wrap: wrap;

		li:not(.last-tiled-rows) {
			flex-grow: 1;
		}
	}

	&__section-header {
		position: sticky;
		top: 0;
		z-index: 3;
		background: var(--color-main-background);
	}

	&__loader {
		margin: 50px 0;
	}

	&__selection-rectangle {
		position: absolute;
		z-index: 4;
		pointer-events: none;
		border: 1px solid var(--color-primary-element);
		border-radius: var(--border-radius-small);
		background-color: color-mix(in srgb, var(--color-primary-element) 20%, transparent);
	}
}
</style>

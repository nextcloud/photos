<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="files-list-viewer">
		<NcEmptyContent
			v-if="emptyMessage !== '' && photosCount === 0 && !loading"
			key="emptycontent"
			:name="emptyMessage">
			<PackageVariant slot="icon" />
		</NcEmptyContent>

		<TiledLayout :base-height="baseHeight" :sections="itemsBySections">
			<VirtualScrolling
				slot-scope="{ tiledSections }"
				:use-window="useWindow"
				:container-element="containerElement"
				:sections="tiledSections"
				:scroll-to-key="scrollToSection"
				:header-height="sectionHeaderHeight"
				@need-content="needContent">
				<template slot-scope="{ visibleSections }">
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
								:is-header="true"
								class="files-list-viewer__section-header"
								:style="{ 'flex-basis': '100%', height: `${sectionHeaderHeight}px` }" />
						</template>

						<ul>
							<template v-for="(row, rowIndex) of section.rows">
								<!--
									We are subtracting 1 from flex-basis to compensate for rounding issues.
									The flex algo will then compensate with flex-grow.
									'last-tiled-row' prevents the last row's items from growing.
								-->
								<li
									v-for="item of row.items"
									:key="item.key"
									:class="{ 'last-tiled-rows': rowIndex === section.rows.length - 1 }"
									:style="{ 'flex-basis': `${item.width - 1}px`, height: `${item.height}px` }">
									<!-- Placeholder when initial loading -->
									<div v-if="showPlaceholders" class="files-list-viewer__placeholder" />
									<!-- Real file. -->
									<slot v-else :file="item" :distance="row.distance" />
								</li>
							</template>
						</ul>
					</div>
				</template>
				<NcLoadingIcon v-if="loading && !showPlaceholders" slot="loader" class="files-list-viewer__loader" />
			</VirtualScrolling>
		</TiledLayout>
	</div>
</template>

<script lang='ts'>
import type { File } from '@nextcloud/files'
import type { PropType } from 'vue'
import type { TiledItem } from '../services/TiledLayout.ts'
import type { PhotoFile } from '../store/files.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import PackageVariant from 'vue-material-design-icons/PackageVariant.vue'
import TiledLayout from '../components/TiledLayout/TiledLayout.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import { fetchFile } from '../services/fileFetcher.ts'

export default {
	name: 'FilesListViewer',

	components: {
		PackageVariant,
		NcEmptyContent,
		NcLoadingIcon,
		TiledLayout,
		VirtualScrolling,
	},

	props: {
		// Array of file ids that should be rendered.
		fileIds: {
			type: Array as PropType<string[]>,
			default: undefined,
		},

		// An object mapping a list of section to a list of fileIds.
		fileIdsBySection: {
			type: Object as PropType<Record<string, string[]>>,
			default: undefined,
		},

		// The list of sorted sections.
		sections: {
			type: Array as PropType<string[]>,
			default: undefined,
		},

		// Whether we should display a loading indicator.
		loading: {
			type: Boolean,
			default: false,
		},

		// Message to display when there is no files.
		emptyMessage: {
			type: String,
			default: '',
		},

		// The base height to forward to TileLayout.
		baseHeight: {
			type: Number,
			default: 200,
		},

		// The height to use for section headers.
		sectionHeaderHeight: {
			type: Number,
			default: 75,
		},

		// Instruct VirtualScrolling to scroll to the given section id.
		scrollToSection: {
			type: String,
			default: '',
		},

		// The containerElement props to forward to TileLayout.
		containerElement: {
			type: [HTMLElement, null],
			default: null,
		},

		// The useWindow props to forward to TileLayout.
		useWindow: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			placeholderFiles: Array(20).fill(0).map((_, index) => {
				const height = 200
				const width = this.croppedLayout ? height : height * (1 + Math.random() * 2)
				return {
					id: index.toString(),
					width,
					height,
					ratio: width / height,
				}
			}),
		}
	},

	computed: {
		files(): Record<string, PhotoFile> {
			return this.$store.state.files.files
		},

		showPlaceholders(): boolean {
			return this.loading && (this.fileIds?.length === 0 || this.sections?.length === 0)
		},

		itemsBySections(): { id: string, items: TiledItem[] }[] {
			if (this.fileIds !== undefined) {
				if (this.showPlaceholders) {
					return [{ id: '', items: this.placeholderFiles }]
				}

				return [
					{
						id: '',
						items: this.fileIds
							.filter((fileId) => this.files[fileId])
							.map(this.mapFileToItem),
					},
				]
			}

			if (this.sections !== undefined) {
				if (this.showPlaceholders) {
					return [{ id: 'placeholder', items: this.placeholderFiles }]
				}

				return this.sections.map((sectionId) => {
					return {
						id: sectionId,
						items: this.fileIdsBySection[sectionId]
							.filter((fileId) => this.files[fileId])
							.map(this.mapFileToItem),
					}
				})
			}

			return []
		},

		photosCount(): number {
			return this.itemsBySections.map(({ items }) => items.length).reduce((total, length) => total + length, 0)
		},

		showLoader(): boolean {
			return this.loading && (this.fileIds?.length !== 0 || this.sections?.length !== 0)
		},

		croppedLayout(): boolean {
			return this.$store.state.userConfig.croppedLayout
		},
	},

	mounted() {
		subscribe('files:node:updated', this.handleFileUpdated)
		subscribe('files:node:deleted', this.handleFileDeleted)
	},

	destroyed() {
		unsubscribe('files:node:updated', this.handleFileUpdated)
		unsubscribe('files:node:deleted', this.handleFileDeleted)
	},

	methods: {
		// Ask the parent for more content.
		needContent(): void {
			this.$emit('need-content')
		},

		mapFileToItem(fileId: string): TiledItem {
			const file = this.files[fileId] as File
			return {
				id: file.fileid?.toString() as string,
				width: file.attributes['metadata-photos-size'].width,
				height: file.attributes['metadata-photos-size'].height,
				ratio: this.croppedLayout ? 1 : file.attributes['metadata-photos-size'].width / file.attributes['metadata-photos-size'].height,
			}
		},

		async handleFileUpdated({ fileid }: File): Promise<void> {
			const fetchedFile = await fetchFile(this.files[fileid as number].path)
			this.$store.dispatch('appendFiles', [fetchedFile])
		},

		handleFileDeleted({ fileid }: File) {
			this.$store.commit('deleteFile', fileid)
		},
	},
}
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
}
</style>

<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<template>
	<div class="files-list-viewer">
		<NcEmptyContent v-if="emptyMessage !== '' && items.length === 0 && !loading"
			key="emptycontent"
			:title="emptyMessage">
			<PackageVariant slot="icon" />
		</NcEmptyContent>

		<TiledLayout :base-height="baseHeight" :items="items">
			<VirtualScrolling slot-scope="{rows}"
				:use-window="useWindow"
				:container-element="containerElement"
				:rows="rows"
				:scroll-to-key="scrollToSection"
				@need-content="needContent">
				<ul slot-scope="{renderedRows}">
					<div v-for="row of renderedRows"
						:key="row.key"
						class="tiled-row"
						:class="{'files-list-viewer__section-header': row.items[0].sectionHeader}"
						:style="{height: `${row.height}px`}">
						<li v-for="item of row.items"
							:key="item.id"
							:style="{ width: item.ratio ? `${row.height * item.ratio}px` : '100%', height: `${row.height}px`}">
							<!-- Placeholder when initial loading -->
							<div v-if="showPlaceholders" class="files-list-viewer__placeholder" />
							<!-- Real file. -->
							<slot v-else :file="item" :distance="row.distance" />
						</li>
					</div>
				</ul>
				<NcLoadingIcon v-if="loading && !showPlaceholders" slot="loader" class="files-list-viewer__loader" />
			</VirtualScrolling>
		</TiledLayout>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import PackageVariant from 'vue-material-design-icons/PackageVariant.vue'

import { NcEmptyContent, NcLoadingIcon } from '@nextcloud/vue'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'

import TiledLayout from '../components/TiledLayout/TiledLayout.vue'
import { fetchFile } from '../services/fileFetcher.js'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import EmptyBox from '../assets/Illustrations/empty.svg'
import { loadState } from '@nextcloud/initial-state'

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
			type: Array,
			default: undefined,
		},
		// An object mapping a list of section to a list of fileIds.
		fileIdsBySection: {
			type: Object,
			default: undefined,
		},
		// The list of sorted sections.
		sections: {
			type: Array,
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
			type: HTMLElement,
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
			EmptyBox,
			croppedLayout: loadState('photos', 'croppedLayout', 'false') === 'true',
			placeholderFiles: Array(20).fill(0).map((_, index) => {
				const height = 200
				const width = this.croppedLayout ? height : height * (1 + Math.random() * 2)
				return {
					id: index,
					width,
					height,
					ratio: width / height,
				}
			}),
		}
	},

	computed: {
		...mapGetters([
			'files',
		]),

		/**
		 * @return {object[]} The list of items to pass to TiledLayout.
		 */
		fileIdsToItems() {
			if (this.fileIds === undefined) {
				return []
			}

			return this.fileIds
				.filter(fileId => this.files[fileId])
				.map(this.mapFileToItem)
		},

		/**
		 * @return {object[]} The list of items separated by sections to pass to TiledLayout.
		 */
		sectionsToItems() {
			if (this.sections === undefined) {
				return []
			}

			return this.sections.flatMap((sectionId) => {
				return [
					{
						id: sectionId,
						sectionHeader: true,
						height: this.sectionHeaderHeight,
					},
					...this.fileIdsBySection[sectionId]
						.filter(fileId => this.files[fileId])
						.map(this.mapFileToItem),
				]
			})
		},

		/**
		 * @return {boolean} The list of items to pass to TiledLayout.
		 */
		showPlaceholders() {
			return this.loading && (this.fileIds?.length === 0 || this.sections?.length === 0)
		},

		/**
		 * @return {object[]} The list of items to pass to TiledLayout.
		 */
		items() {

			if (this.fileIds !== undefined) {
				if (this.showPlaceholders) {
					return this.placeholderFiles
				}

				return this.fileIdsToItems
			}

			if (this.sections !== undefined) {
				if (this.showPlaceholders) {
					return [{ height: 75, sectionHeader: true }, ...this.placeholderFiles]
				}

				return this.sectionsToItems
			}

			return []
		},

		showLoader() {
			return this.loading && (this.fileIds?.length !== 0 || this.sections?.length !== 0)
		},
	},

	mounted() {
		subscribe('files:node:updated', this.handleFileUpdated)
	},

	destroyed() {
		unsubscribe('files:node:updated', this.handleFileUpdated)
	},

	methods: {
		...mapActions([
			'appendFiles',
		]),

		// Ask the parent for more content.
		needContent() {
			this.$emit('need-content')
		},

		mapFileToItem(fileId) {
			const file = this.files[fileId]
			return {
				id: file.fileid,
				width: file.fileMetadataSizeParsed.width,
				height: file.fileMetadataSizeParsed.height,
				ratio: this.croppedLayout ? 1 : file.fileMetadataSizeParsed.width / file.fileMetadataSizeParsed.height,
			}
		},

		/**
		 * @param {object} data
		 * @param {string} data.fileid - The file id of the updated file.
		 */
		async handleFileUpdated({ fileid }) {
			const fetchedFile = await fetchFile(this.files[fileid].filename)
			this.appendFiles([fetchedFile])
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

		.tiled-row {
			display: flex;
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

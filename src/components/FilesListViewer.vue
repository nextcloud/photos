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
		<EmptyContent v-if="emptyMessage !== '' && items.length === 0 && !loading"
			key="emptycontent">
			<template #icon>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<span class="empty-content-illustration" v-html="EmptyBox" />
			</template>
			{{ emptyMessage }}
		</EmptyContent>

		<TiledLayout :base-height="baseHeight" :items="items">
			<VirtualScrolling slot-scope="{rows}"
				:use-window="useWindow"
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
							<slot :file="item" :visibility="row.visibility" />
						</li>
					</div>
				</ul>
				<template v-if="loading" #loader>
					<Loader class="files-list-viewer__loader" />
				</template>
			</VirtualScrolling>
		</TiledLayout>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'

import { EmptyContent } from '@nextcloud/vue'

import TiledLayout from '../components/TiledLayout.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import Loader from '../components/Loader.vue'
import EmptyBox from '../assets/Illustrations/empty.svg'

export default {
	name: 'FilesListViewer',

	components: {
		EmptyContent,
		TiledLayout,
		VirtualScrolling,
		Loader,
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
			required: true,
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

			return this.fileIds.map(this.mapFileToItem)
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
					...this.fileIdsBySection[sectionId].map(this.mapFileToItem),
				]
			})
		},

		/**
		 * @return {object[]} The list of items to pass to TiledLayout.
		 */
		items() {
			if (this.fileIds !== undefined) {
				return this.fileIdsToItems
			}

			if (this.sections !== undefined) {
				return this.sectionsToItems
			}

			return []
		},
	},

	methods: {
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
				ratio: file.fileMetadataSizeParsed.width / file.fileMetadataSizeParsed.height,
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.files-list-viewer {
	height: 100%;
	position: relative;

	::v-deep .empty-content__icon {
		width: 200px;
		height: 200px;

		.empty-content-illustration svg {
			width: 200px;
			height: 200px;
		}
	}

	.tiled-row {
		display: flex;
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

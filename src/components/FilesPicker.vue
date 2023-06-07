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
	<div class="file-picker">
		<div class="file-picker__content">
			<div class="file-picker__navigation"
				:class="{'file-picker__navigation--placeholder': monthsList.length === 0}">
				<div v-for="month in monthsList"
					:key="month"
					class="file-picker__navigation__month"
					:class="{selected: targetMonth === month}"
					@click="targetMonth = month">
					{{ month | dateMonthAndYear }}
				</div>
			</div>

			<FilesListViewer class="file-picker__file-list"
				:class="{'file-picker__file-list--placeholder': monthsList.length === 0}"
				:file-ids-by-section="fileIdsByMonth"
				:empty-message="t('photos', 'There are no photos or videos yet!')"
				:sections="monthsList"
				:loading="loadingFiles"
				:base-height="100"
				:section-header-height="50"
				:scroll-to-section="targetMonth"
				@need-content="getFiles">
				<template slot-scope="{file, height, distance}">
					<h3 v-if="file.sectionHeader"
						:id="`file-picker-section-header-${file.id}`"
						:style="{ height: `${height}px`}"
						class="section-header">
						{{ file.id | dateMonthAndYear }}
					</h3>

					<File v-else
						:file="files[file.id]"
						:allow-selection="true"
						:selected="selection[file.id] === true"
						:distance="distance"
						@select-toggled="onFileSelectToggle" />
				</template>
			</FilesListViewer>
		</div>

		<div class="file-picker__actions">
			<UploadPicker :accept="allowedMimes"
				:context="uploadContext"
				:destination="photosLocation"
				:multiple="true"
				@uploaded="refreshFiles" />
			<NcButton type="primary" :disabled="loading || selectedFileIds.length === 0" @click="emitPickedEvent">
				<template #icon>
					<ImagePlus v-if="!loading" />
					<NcLoadingIcon v-if="loading" />
				</template>
				{{ t('photos', 'Add to {destination}', { destination }) }}
			</NcButton>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NcButton, NcLoadingIcon } from '@nextcloud/vue'
import { UploadPicker } from '@nextcloud/upload'
import moment from '@nextcloud/moment'

import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'

import FilesListViewer from './FilesListViewer.vue'
import File from './File.vue'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import UserConfig from '../mixins/UserConfig.js'
import allowedMimes from '../services/AllowedMimes.js'

export default {
	name: 'FilesPicker',

	components: {
		File,
		FilesListViewer,
		ImagePlus,
		NcButton,
		NcLoadingIcon,
		UploadPicker,
	},

	filters: {
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateMonthAndYear(date) {
			return moment(date, 'YYYYMM').format('MMMM YYYY')
		},
	},
	mixins: [
		FetchFilesMixin,
		FilesByMonthMixin,
		FilesSelectionMixin,
		UserConfig,
	],

	props: {
		// Label to show in the submit button.
		destination: {
			type: String,
			required: true,
		},

		// List of file ids to not show.
		blacklistIds: {
			type: Array,
			default: () => [],
		},

		// Whether we should disable the submit button and show a spinner.
		loading: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			allowedMimes,
			targetMonth: null,
			uploadContext: {
				route: 'albumpicker',
			},
		}
	},

	computed: {
		...mapGetters([
			'files',
		]),
	},

	watch: {
		monthsList(value) {
			if (this.targetMonth === null) {
				this.targetMonth = value[0]
			}
		},
	},

	methods: {
		getFiles() {
			this.fetchFiles('', {}, this.blacklistIds)
		},

		refreshFiles() {
			this.fetchFiles('', { firstResult: 0 }, [...this.blacklistIds, ...this.fetchedFileIds], true)
		},

		emitPickedEvent() {
			this.$emit('files-picked', this.selectedFileIds)
		},
	},
}
</script>

<style lang="scss" scoped>
.file-picker {
	display: flex;
	flex-direction: column;
	padding: 12px;

	&__content {
		display: flex;
		align-items: flex-start;
		flex-grow: 1;
		height: 500px;
	}

	&__navigation {
		flex-basis: 200px;
		overflow: scroll;
		margin-right: 8px;
		padding-right: 8px;
		height: 100%;

		@media only screen and (max-width: 1200px) {
			flex-basis: 100px;
		}

		&--placeholder {
			background: var(--color-primary-element-light);
			border-radius: var(--border-radius-large);
		}

		&__month {
			font-weight: bold;
			font-size: 16px;
			border-radius: var(--border-radius-pill);
			padding: 8px 16px;
			margin: 4px 0;
			cursor: pointer;

			@media only screen and (max-width: 1200px) {
				text-align: center;
			}

			&:hover {
				background: var(--color-background-dark);
			}

			&.selected {
				background: var(--color-primary-element-lighter);
			}
		}
	}

	&__file-list {
		flex-grow: 1;
		min-width: 0;
		height: 100%;

		&--placeholder {
			background: var(--color-primary-element-light);
			border-radius: var(--border-radius-large);
		}

		.section-header {
			font-weight: bold;
			font-size: 20px;
			padding: 8px 0 4px 0;
		}

		:deep .empty-content {
			position: absolute;
			width: 100%;
			margin-top: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}

	&__actions {
		display: flex;
		justify-content: space-between;
		justify-items: center;
		padding-top: 16px;
	}
}
</style>

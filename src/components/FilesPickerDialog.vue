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
	<!-- TODO Adjust tests -->

	<NcDialog size="large"
		:name="t('photos', 'Add photos to {albumName}', { albumName })"
		close-on-click-outside
		:navigation-aria-label="t('photos', 'Months')"
		@closing="$emit('close')">
		<template #navigation="{ isCollapsed }">
			<FilesPickerNavigation :is-collapsed="isCollapsed"
				:months-list="monthsList"
				:date-month-and-year="dateMonthAndYear"
				:target-month.sync="targetMonth" />
		</template>

		<template #actions>
			<UploadPicker :accept="allowedMimes"
				:context="uploadContext"
				:destination="photosLocationFolder"
				:multiple="true"
				@uploaded="refreshFiles" />

			<NcButton type="primary"
				:disabled="loading || selectedFileIds.length === 0"
				@click="emitPickedEvent">
				<template #icon>
					<ImagePlus v-if="!loading" />
					<NcLoadingIcon v-if="loading" />
				</template>
				{{ t('photos', 'Add to {destination}', { destination }) }}
			</NcButton>
		</template>

		<div class="photos-picker">
			<div class="photos-picker__content">
				<FilesListViewer class="photos-picker__file-list"
					:class="{'photos-picker__file-list--placeholder': monthsList.length === 0}"
					:file-ids-by-section="fileIdsByMonth"
					:empty-message="t('photos', 'There are no photos or videos yet!')"
					:sections="monthsList"
					:loading="loadingFiles"
					:base-height="100"
					:section-header-height="50"
					:scroll-to-section="targetMonth"
					@need-content="getFiles"
					@focusout.native="onFocusOut">
					<template slot-scope="{file, height, isHeader, distance}">
						<h3 v-if="isHeader"
							:id="`photos-picker-section-header-${file.id}`"
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
		</div>
	</NcDialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { NcButton, NcDialog, NcLoadingIcon } from '@nextcloud/vue'
import { UploadPicker } from '@nextcloud/upload'
import moment from '@nextcloud/moment'
import { useIsMobile } from '@nextcloud/vue'

import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'

import FilesPickerNavigation from './FilesPickerNavigation.vue'
import FilesListViewer from './FilesListViewer.vue'
import File from './File.vue'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import UserConfig from '../mixins/UserConfig.js'
import allowedMimes from '../services/AllowedMimes.js'

const isMobile = useIsMobile()

/**
 * @param {string} date - In the following format: YYYYMM
 */
function dateMonthAndYear(date) {
	if (isMobile.value) {
		return moment(date, 'YYYYMM').format('MMM YYYY')
	} else {
		return moment(date, 'YYYYMM').format('MMMM YYYY')
	}
}

export default {
	name: 'FilesPickerDialog',

	components: {
		File,
		FilesPickerNavigation,
		FilesListViewer,
		ImagePlus,
		NcButton,
		NcDialog,
		NcLoadingIcon,
		UploadPicker,
	},

	filters: {
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateMonthAndYear(date) {
			return dateMonthAndYear(date)
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

		// Label to show in the dialog title.
		albumName: {
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

	emits: [
		'close',
		'files-picked',
	],

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
		/**
		 * @param {FocusEvent} event The focus event
		 */
		onFocusOut(event) {
			if (event.relatedTarget === null) { // Focus escaping to body
				event.target.focus({ preventScroll: true })
			}
		},

		getFiles() {
			this.fetchFiles('', {}, this.blacklistIds)
		},

		refreshFiles() {
			this.fetchFiles('', { firstResult: 0 }, [...this.blacklistIds, ...this.fetchedFileIds], true)
		},

		emitPickedEvent() {
			this.$emit('files-picked', this.selectedFileIds)
		},

		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateMonthAndYear(date) {
			return dateMonthAndYear(date)
		},
	},
}
</script>

<style lang="scss" scoped>
.photos-picker {
	display: flex;
	flex-direction: column;

	&__content {
		display: flex;
		align-items: flex-start;
		flex-grow: 1;
		height: 500px;
		padding: 0 2px;
	}

	&__file-list {
		flex-grow: 1;
		min-width: 0;
		height: 100%;
		padding: 0 4px;

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
}

:deep {
	.dialog__navigation {
		padding-bottom: 12px;
	}
}
</style>

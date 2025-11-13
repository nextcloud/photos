<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDialog
		content-classes="photos-picker"
		:name="name"
		:open="open"
		out-transition
		size="large"
		@update:open="(open) => $emit('update:open', open)">
		<!-- Navigation containing the months available -->
		<template v-if="monthsList.length > 0" #navigation="{ isCollapsed }">
			<!-- Mobile view -->
			<NcSelect
				v-if="isCollapsed"
				v-model="targetMonth"
				:aria-label-listbox="t('photos', 'Dates')"
				class="photos-picker__navigation__month-select"
				:clearable="false"
				:input-label="t('photos', 'Jump to specific date in list')"
				:options="monthsList">
				<template #selected-option="{ label }">
					{{ dateMonthAndYear(label) }}
				</template>
				<template #option="{ label }">
					{{ dateMonthAndYear(label) }}
				</template>
			</NcSelect>

			<!-- Default view -->
			<ul v-else :aria-label="t('photos', 'Dates')">
				<li
					v-for="month in monthsList"
					:key="month"
					class="photos-picker__navigation__month">
					<NcButton
						:variant="targetMonth === month ? 'secondary' : 'tertiary'"
						:aria-label="t('photos', 'Jump to {date}', { date: dateMonthAndYear(month) })"
						@click="targetMonth = month">
						{{ dateMonthAndYear(month) }}
					</NcButton>
				</li>
			</ul>
		</template>

		<!-- The actions on the bottom -->
		<template #actions>
			<div class="photos-picker__actions">
				<div class="photos-picker__actions__buttons">
					<UploadPicker
						:accept="allowedMimes"
						:context="uploadContext"
						:destination="photosLocationFolder"
						multiple
						@uploaded="refreshFiles" />
					<NcButton variant="primary" :disabled="loading || selectedFileIds.length === 0" @click="emitPickedEvent">
						<template #icon>
							<ImagePlusOutline v-if="!loading" />
							<NcLoadingIcon v-if="loading" />
						</template>
						{{ t('photos', 'Add to {destination}', { destination }, undefined, { escape: false, sanitize: false }) }}
					</NcButton>
				</div>
				<NcNoteCard v-if="photosLocationFolder?.attributes['owner-id'] !== currentUser" type="warning">
					{{ t('photos', 'The destination folder is owned by {owner}', { owner: photosLocationFolder?.attributes['owner-id'] }) }}
				</NcNoteCard>
			</div>
		</template>

		<FilesListViewer
			class="photos-picker__file-list"
			:class="{ 'photos-picker__file-list--placeholder': monthsList.length === 0 }"
			:file-ids-by-section="fileIdsByMonth"
			:empty-message="t('photos', 'There are no photos or videos yet!')"
			:sections="monthsList"
			:loading="loadingFiles"
			:base-height="100"
			:section-header-height="50"
			:scroll-to-section="targetMonth"
			@need-content="getFiles"
			@focusout.native="onFocusOut">
			<template slot-scope="{ file, height, isHeader, distance }">
				<h3
					v-if="isHeader"
					:id="`photos-picker-section-header-${file.id}`"
					:style="{ height: `${height}px` }"
					class="section-header">
					{{ dateMonthAndYear(file.id) }}
				</h3>

				<FileComponent
					v-else
					:file="files[file.id]"
					:allow-selection="true"
					:selected="selection[file.id] === true"
					:distance="distance"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>
	</NcDialog>
</template>

<script lang='ts'>
import type { File } from '@nextcloud/files'

import { getCurrentUser } from '@nextcloud/auth'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { UploadPicker } from '@nextcloud/upload'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import {
	type PropType,

	defineComponent,
} from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import FileComponent from './FileComponent.vue'
import FilesListViewer from './FilesListViewer.vue'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import allowedMimes from '../services/AllowedMimes.js'

export default defineComponent({
	name: 'PhotosPicker',

	components: {
		FileComponent,
		FilesListViewer,
		ImagePlusOutline,
		NcButton,
		NcDialog,
		NcLoadingIcon,
		NcSelect,
		NcNoteCard,
		UploadPicker,
	},

	mixins: [
		FetchFilesMixin,
		FilesByMonthMixin,
		FilesSelectionMixin,
	],

	props: {
		/**
		 * If the photos picker should be opened
		 */
		open: {
			type: Boolean,
			default: true,
		},

		/**
		 * Name to be used as heading
		 */
		name: {
			type: String,
			required: true,
		},

		// Label to show in the submit button.
		destination: {
			type: String,
			required: true,
		},

		// List of file ids to not show.
		blacklistIds: {
			type: Array as PropType<string[]>,
			default: () => [],
		},

		// Whether we should disable the submit button and show a spinner.
		loading: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['files-picked', 'update:open'],

	setup() {
		return {
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			allowedMimes,
			targetMonth: null as string | null,
			uploadContext: {
				route: 'albumpicker',
			},

			currentUser: getCurrentUser()?.uid,
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		photosLocationFolder() {
			return this.$store.state.userConfig.photosLocationFolder
		},
	},

	watch: {
		monthsList(value) {
			if (this.targetMonth === null) {
				this.targetMonth = value[0]
			}
		},
	},

	methods: {
		onFocusOut(event: FocusEvent) {
			if (event.relatedTarget === null) { // Focus escaping to body
				event.target?.focus({ preventScroll: true })
			}
		},

		getFiles() {
			this.fetchFiles({}, this.shouldShowFile)
		},

		refreshFiles() {
			this.fetchFiles({ firstResult: 0 }, this.shouldShowFile, true)
		},

		shouldShowFile(file: File) {
			return file.attributes['mount-type'] === '' && !this.blacklistIds.includes(file.fileid?.toString() ?? '')
		},

		emitPickedEvent() {
			this.$emit('files-picked', this.selectedFileIds)
			this.resetSelection()
		},

		/**
		 * @param date - In the following format: YYYYMM
		 */
		dateMonthAndYear(date: string) {
			if (this.isMobile) {
				return moment(date, 'YYYYMM').format('MMM YYYY')
			}
			return moment(date, 'YYYYMM').format('MMMM YYYY')
		},

		t,
	},
})
</script>

<style lang="scss" scoped>
:deep(.photos-picker) {
	display: flex;
	// remove padding to move scrollbar to the very end
	padding-inline-end: 0 !important;
}

.photos-picker {

	&__navigation {
		&__month {
			// For focus-visible outline
			margin: 4px;
		}

		&__month-select {
			flex: 1;
			// align with other content
			padding-inline-end: 12px;
			padding-block-end: 6px;
		}
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

		:deep(.empty-content) {
			height: fit-content;
			margin-block: 1em;
			margin-inline-end: 12px;
			width: calc(100% - 12px);
		}
	}

	&__actions {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		&__buttons {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 16px;
		}
	}
}
</style>

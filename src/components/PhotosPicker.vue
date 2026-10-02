<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDialog
		id="photos-picker"
		contentClasses="photos-picker"
		:name="name"
		:open="open"
		outTransition
		size="large"
		@update:open="(open) => $emit('update:open', open)"
		@closing="$emit('closed')">
		<!-- The actions on the bottom -->
		<template #actions>
			<div class="photos-picker__actions">
				<div class="photos-picker__actions__buttons">
					<NcButton
						v-if="allowempty"
						variant="secondary"
						:disabled="loading"
						@click="$emit('closed')">
						<template #icon>
							<ImageAlbum v-if="!loading" />
							<NcLoadingIcon v-if="loading" />
						</template>
						{{ t('photos', 'Create empty album') }}
					</NcButton>
					<NcButton variant="primary" :disabled="loading || selectedFileIds.length === 0" @click="emitPickedEvent">
						<template #icon>
							<ImagePlusOutline v-if="!loading" />
							<NcLoadingIcon v-if="loading" />
						</template>
						{{ t('photos', 'Add') }}
					</NcButton>
				</div>
			</div>
		</template>

		<FilesListViewer
			class="photos-picker__file-list"
			:class="{ 'photos-picker__file-list--placeholder': monthsList.length === 0 }"
			:fileIdsBySection="fileIdsByMonth"
			:emptyMessage="t('photos', 'There are no photos or videos yet!')"
			:sections="monthsList"
			:loading="loadingFiles"
			:baseHeight="100"
			:sectionHeaderHeight="50"
			:scrollToSection="targetMonth"
			@need-content="getFiles"
			@focusout.native="onFocusOut">
			<template #default="{ file, height, isHeader }">
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
					:allowSelection="true"
					:selected="selection[file.id] === true"
					:showActionsMenu="false"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>
	</NcDialog>
</template>

<script lang='ts'>
import type { File } from '@nextcloud/files'
import type { PropType } from 'vue'

import { t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import {
	defineComponent,
} from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ImageAlbum from 'vue-material-design-icons/ImageAlbum.vue'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import FileComponent from './FileComponent.vue'
import FilesListViewer from './FilesListViewer.vue'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import { useFilesStore } from '../store/files.ts'
import { formatMonthAndYear } from '../utils/dateUtils.ts'

export default defineComponent({
	name: 'PhotosPicker',

	components: {
		FileComponent,
		FilesListViewer,
		ImageAlbum,
		ImagePlusOutline,
		NcButton,
		NcDialog,
		NcLoadingIcon,
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

		// Whether we allow to create empty album.
		allowempty: {
			type: Boolean,
			default: false,
			required: false,
		},
	},

	emits: ['files-picked', 'update:open', 'closed'],

	setup() {
		return {
			filesStore: useFilesStore(),
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			targetMonth: null as string | null,
		}
	},

	computed: {
		files() {
			return this.filesStore.files
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
			return this.isMobile
				? formatMonthAndYear(date, true)
				: formatMonthAndYear(date)
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
			font-size: 1.5rem;
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

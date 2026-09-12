<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDialog
		contentClasses="photos-picker"
		:name="name"
		:open="open"
		outTransition
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
				:inputLabel="t('photos', 'Jump to specific date in list')"
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
					<NcUploadPicker
						v-if="photosLocationFolder !== undefined"
						:accept="allowedMimes"
						:content="uploadDestinationContent"
						:destination="photosLocationFolder"
						multiple
						@finished="refreshFiles" />
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
			:fileIdsBySection="fileIdsByMonth"
			:emptyMessage="t('photos', 'There are no photos or videos yet!')"
			:sections="monthsList"
			:loading="loadingFiles"
			:baseHeight="100"
			:sectionHeaderHeight="50"
			:scrollToSection="targetMonth"
			@needContent="getFiles"
			@focusout="onFocusOut">
			<template #default="{ file, isHeader }">
				<h3
					v-if="isHeader"
					:id="`photos-picker-section-header-${file.id}`"
					class="section-header">
					{{ dateMonthAndYear(file.id) }}
				</h3>

				<FileComponent
					v-else
					:file="files[file.id]"
					:allowSelection="true"
					:selected="selection[file.id] === true"
					:showActionsMenu="false"
					@selectToggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>
	</NcDialog>
</template>

<script setup lang="ts">
import type { File, Node } from '@nextcloud/files'

import { getCurrentUser } from '@nextcloud/auth'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, ref, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcUploadPicker from '@nextcloud/vue/components/NcUploadPicker'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import FileComponent from './FileComponent.vue'
import FilesListViewer from './FilesListViewer.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { useFetchFiles } from '../composables/useFetchFiles.ts'
import { useFilesByMonth } from '../composables/useFilesByMonth.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { allMimes as allowedMimes } from '../services/AllowedMimes.ts'
import { getFolderContent } from '../services/FolderContent.ts'
import { useFilesStore } from '../store/files.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

const props = withDefaults(defineProps<{
	/**
	 * If the photos picker should be opened
	 */
	open?: boolean

	/**
	 * Name to be used as heading
	 */
	name: string

	// Label to show in the submit button.
	destination: string

	// List of file ids to not show.
	blacklistIds?: string[]

	// Whether we should disable the submit button and show a spinner.
	loading?: boolean
}>(), {
	open: true,
	blacklistIds: () => [],
	loading: false,
})

const emit = defineEmits<{
	filesPicked: [fileIds: string[]]
	'update:open': [open: boolean]
}>()

const isMobile = useIsMobile()
const filesStore = useFilesStore()
const userConfigStore = useUserConfigStore()
const { abortSignal } = useAbortController()
const { fetchFiles, fetchedFileIds, loadingFiles } = useFetchFiles()
const { selection, selectedFileIds, onFileSelectToggle, resetSelection } = useFilesSelection()

const targetMonth = ref<string>()
const currentUser = getCurrentUser()?.uid

const files = computed(() => filesStore.files)
const photosLocationFolder = computed(() => userConfigStore.photosLocationFolder)

const { fileIdsByMonth, monthsList } = useFilesByMonth(fetchedFileIds, files)

watch(monthsList, (value) => {
	if (targetMonth.value === undefined) {
		targetMonth.value = value[0]
	}
})

/**
 * List the nodes of the photos folder, so the picker can spot conflicts.
 */
async function uploadDestinationContent(): Promise<Node[]> {
	const { folders, files } = await getFolderContent(photosLocationFolder.value?.path ?? '/', { signal: abortSignal.value })
	return [...folders, ...files]
}

function onFocusOut(event: FocusEvent) {
	if (event.relatedTarget === null) { // Focus escaping to body
		(event.target as HTMLElement | null)?.focus({ preventScroll: true })
	}
}

function getFiles() {
	fetchFiles({}, shouldShowFile)
}

function refreshFiles() {
	fetchFiles({ firstResult: 0 }, shouldShowFile, true)
}

function shouldShowFile(file: File) {
	return file.attributes['mount-type'] === '' && !props.blacklistIds.includes(file.fileid?.toString() ?? '')
}

function emitPickedEvent() {
	emit('filesPicked', selectedFileIds.value)
	resetSelection()
}

/**
 * @param date - In the following format: YYYYMM
 */
function dateMonthAndYear(date: string) {
	if (isMobile.value) {
		return moment(date, 'YYYYMM').format('MMM YYYY')
	}
	return moment(date, 'YYYYMM').format('MMMM YYYY')
}
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

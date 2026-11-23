<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent
		v-if="face === undefined && !loadingFiles && !loadingFaces"
		class="empty-content-with-illustration">
		<template #icon>
			<AccountBoxMultipleOutline />
		</template>
		{{ t('photos', 'This person could not be found') }}
	</NcEmptyContent>
	<NcEmptyContent v-else-if="errorFetchingFiles || errorFetchingFaces">
		<template #icon>
			<AlertCircleOutline />
		</template>
		{{ t('photos', 'An error occurred') }}
	</NcEmptyContent>

	<div v-else class="face">
		<div class="face__header">
			<div class="face__header__left">
				<NcActions>
					<NcActionButton @click="router.push('/faces/')">
						<template #icon>
							<ArrowLeft />
						</template>{{ t('photos', 'Back') }}
					</NcActionButton>
				</NcActions>
				<div class="face__header__title">
					<h2
						v-if="face !== undefined"
						class="face-name"
						:class="{ 'hidden-visually': face.basename.match(/^[0-9]+$/) }">
						{{ face.basename }}
					</h2>
				</div>

				<NcLoadingIcon v-if="loadingCount > 0 || loadingFaces" />
			</div>
			<div v-if="face !== undefined" class="face__header__actions">
				<NcActions>
					<NcActionButton
						:closeAfterClick="true"
						:aria-label="t('photos', 'Rename person')"
						@click="openRenameModal">
						<template #icon>
							<PencilOutline />
						</template>
						{{ t('photos', 'Rename person') }}
					</NcActionButton>
				</NcActions>
				<NcActions :forceMenu="true">
					<NcActionButton
						v-if="Object.keys(faces).length > 1"
						:closeAfterClick="true"
						:aria-label="t('photos', 'Merge with different person')"
						@click="showMergeModal = true">
						<template #icon>
							<Merge />
						</template>
						{{ t('photos', 'Merge with different person') }}
					</NcActionButton>
					<template v-if="selectedFileIds.length">
						<NcActionButton
							:closeAfterClick="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelection">
							<template #icon>
								<Download />
							</template>
							{{ t('photos', 'Download selected photos') }}
						</NcActionButton>
						<NcActionButton
							v-if="shouldFavoriteSelection"
							:closeAfterClick="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							<template #icon>
								<StarOutline />
							</template>
							{{ t('photos', 'Favorite') }}
						</NcActionButton>
						<NcActionButton
							v-else
							:closeAfterClick="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							<template #icon>
								<Star />
							</template>
							{{ t('photos', 'Remove from favorites') }}
						</NcActionButton>
						<NcActionButton
							:closeAfterClick="true"
							@click="showMoveModal = true">
							<template #icon>
								<AccountSwitchOutline />
							</template>
							{{ n('photos', 'Move photo to a different person', 'Move photos to a different person', selectedFileIds.length) }}
						</NcActionButton>
						<NcActionButton
							:closeAfterClick="true"
							@click="handleRemoveFilesFromFace(selectedFileIds)">
							<template #icon>
								<Close />
							</template>
							{{ n('photos', 'Remove photo from person', 'Remove photos from person', selectedFileIds.length) }}
						</NcActionButton>
					</template>
					<NcActionButton
						v-if="contact !== undefined"
						:closeAfterClick="true"
						@click="handleUseAsContactPicture">
						<template #icon>
							<AccountBoxOutline />
						</template>
						{{ t('photos', 'Use as contact picture') }}
					</NcActionButton>
					<NcActionButton
						:closeAfterClick="true"
						@click="handleDeleteFace">
						<template #icon>
							<Close />
						</template>
						{{ t('photos', 'Remove person') }}
					</NcActionButton>
				</NcActions>
			</div>
		</div>

		<div v-if="contact?.birthday" class="face__contact">
			<span>{{ t('photos', 'Birthday: {date}', { date: formatDayAndMonth(contact.birthday.month, contact.birthday.day) }) }}</span>
			<NcButton
				v-if="birthdayFileIds.length"
				v-model:pressed="birthdaysOnly"
				variant="tertiary">
				<template #icon>
					<CakeVariantOutline :size="20" />
				</template>
				{{ t('photos', 'Photos from birthdays') }}
			</NcButton>
		</div>

		<FilesListViewer
			v-if="face !== undefined"
			class="face__photos"
			:containerElement="appContent"
			:fileIds="shownFileIds"
			:loading="loadingFiles || loadingFaces">
			<template #default="{ file }">
				<FileComponent
					:file="files[file.id]"
					:allowSelection="true"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>

		<NcDialog
			v-if="showRenameModal"
			:name="t('photos', 'Rename person')"
			closeOnClickOutside
			size="small"
			@closing="closeRenameModal">
			<div class="rename-form">
				<input
					v-model="newName"
					v-focus
					type="text"
					name="name"
					required
					:placeholder="t('photos', 'Name of this person')"
					@input="onNameInput"
					@keydown.enter="handleRenameFace(newName)">
				<ul v-if="suggestions.length" class="rename-form__contacts" :aria-label="t('photos', 'Name after a contact')">
					<li v-for="suggestion in suggestions" :key="suggestion.url">
						<NcButton
							alignment="start"
							variant="tertiary"
							wide
							@click="handleRenameFace(suggestion.fullName)">
							<template #icon>
								<AccountBoxOutline :size="20" />
							</template>
							{{ suggestion.fullName }}
						</NcButton>
					</li>
				</ul>
			</div>
			<template #actions>
				<NcButton
					:aria-label="t('photos', 'Save.')"
					variant="primary"
					:disabled="newName.trim() === ''"
					@click="handleRenameFace(newName)">
					<template #icon>
						<NcLoadingIcon v-if="loadingCount" />
						<SendOutline v-else />
					</template>
					{{ t('photos', 'Save') }}
				</NcButton>
			</template>
		</NcDialog>

		<NcDialog
			v-if="showMergeModal"
			:name="t('photos', 'Merge person')"
			closeOnClickOutside
			size="normal"
			@closing="showMergeModal = false">
			<FaceMergeForm :firstFace="faceName" @select="handleMerge($event)" />
		</NcDialog>

		<NcDialog
			v-if="showMoveModal"
			:name="t('photos', 'Move to different person')"
			closeOnClickOutside
			size="normal"
			@closing="showMoveModal = false">
			<FaceMergeForm :firstFace="faceName" @select="handleMove($event, selectedFileIds)" />
		</NcDialog>
	</div>
</template>

<script setup lang="ts">
import type { Collection } from '../services/collectionFetcher.ts'
import type { Contact } from '../utils/contacts.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import debounce from 'debounce'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline.vue'
import AccountBoxOutline from 'vue-material-design-icons/AccountBoxOutline.vue'
import AccountSwitchOutline from 'vue-material-design-icons/AccountSwitchOutline.vue'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import CakeVariantOutline from 'vue-material-design-icons/CakeVariantOutline.vue'
import Close from 'vue-material-design-icons/Close.vue'
import Merge from 'vue-material-design-icons/Merge.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import Download from 'vue-material-design-icons/TrayArrowDown.vue'
import FaceMergeForm from '../components/Faces/FaceMergeForm.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import { useFaceCover } from '../composables/useFaceCover.ts'
import { useFetchFaces } from '../composables/useFetchFaces.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { isContactsInstalled, searchContacts, setContactPhoto } from '../services/contacts.ts'
import { downloadFiles } from '../services/downloadFiles.ts'
import { logger } from '../services/logger.ts'
import { confirmOperation } from '../store/collections.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilesStore } from '../store/files.ts'
import { findContactByName, isAroundBirthday, suggestContacts } from '../utils/contacts.ts'
import { formatDayAndMonth } from '../utils/dateUtils.ts'

const props = withDefaults(defineProps<{
	faceName?: string
}>(), {
	faceName: '/',
})

const router = useRouter()
const facesStore = useFacesStore()
const filesStore = useFilesStore()
const { fetchFaceContent, loadingFaces, loadingFiles, errorFetchingFaces, errorFetchingFiles } = useFetchFaces()
const { selection, selectedFileIds, onFileSelectToggle, onUncheckFiles, resetSelection } = useFilesSelection()
const { getFaceCoverJpeg } = useFaceCover()

const showMoveModal = ref(false)
const showMergeModal = ref(false)
const showRenameModal = ref(false)
const newName = ref('')
const loadingCount = ref(0)
const contact = ref<Contact>()
const suggestions = ref<Contact[]>([])
const birthdaysOnly = ref(false)
const appContent = document.getElementById('app-content-vue')

const files = computed(() => filesStore.files)
const faces = computed(() => facesStore.faces)
const facesFiles = computed(() => facesStore.facesFiles)
const face = computed<Collection | undefined>(() => faces.value[props.faceName])
const faceFileIds = computed<string[]>(() => facesFiles.value[props.faceName] || [])

const birthdayFileIds = computed<string[]>(() => {
	const birthday = contact.value?.birthday
	return birthday
		? faceFileIds.value.filter((fileId) => files.value[fileId] && isAroundBirthday(new Date(files.value[fileId].attributes.timestamp * 1000), birthday))
		: []
})
const shownFileIds = computed<string[]>(() => birthdaysOnly.value && birthdayFileIds.value.length ? birthdayFileIds.value : faceFileIds.value)

// Favorite all selection if at least one file is not on the favorites.
const shouldFavoriteSelection = computed<boolean>(() => selectedFileIds.value.some((fileId) => filesStore.files[fileId].attributes.favorite === 0))

watch(face, () => {
	if (face.value) {
		fetchFaceContent(props.faceName)
	}
})

// A person is linked to the contact carrying the same name.
watch(() => props.faceName, async (faceName) => {
	contact.value = undefined
	birthdaysOnly.value = false
	if (!isContactsInstalled || /^[0-9]+$/.test(faceName)) {
		return
	}
	try {
		const found = findContactByName(await searchContacts(faceName), faceName)
		if (props.faceName === faceName) {
			contact.value = found
		}
	} catch (error) {
		logger.error('Failed to fetch the contact of the person', { error })
	}
}, { immediate: true })

watch(birthdaysOnly, resetSelection)

const fetchSuggestions = debounce(async (name: string) => {
	try {
		const found = suggestContacts(await searchContacts(name), name).filter((suggestion) => suggestion.fullName !== props.faceName)
		// Drop the answer when the name changed in the meantime.
		if (showRenameModal.value && newName.value.trim() === name) {
			suggestions.value = found
		}
	} catch (error) {
		logger.error('Failed to search contacts', { error })
	}
}, 300)

function onNameInput(): void {
	const name = newName.value.trim()
	if (!isContactsInstalled || name.length < 2) {
		suggestions.value = []
		return
	}
	fetchSuggestions(name)
}

function openRenameModal(): void {
	newName.value = props.faceName
	showRenameModal.value = true
}

function closeRenameModal(): void {
	showRenameModal.value = false
	suggestions.value = []
}

function vFocus(el: HTMLElement): void {
	nextTick(() => el.focus())
}

// The photo is already gone from the store, it only has to leave the
// face it was recognized on.
function onPhotoDeleted(photo: PhotoTarget): void {
	onUncheckFiles([photo.fileid.toString()])
	facesStore.removeFileIdsFromFace(props.faceName, [photo.fileid.toString()])
}

function openViewer(fileId: number): void {
	getViewer().open(shownFileIds.value.map((fileId) => files.value[fileId]), files.value[fileId], { enableSidebar: false })
}

async function handleRemoveFilesFromFace(fileIds: string[]): Promise<void> {
	try {
		loadingCount.value++
		await facesStore.removeFilesFromFace(props.faceName, fileIds)
		resetSelection()
	} catch (error) {
		logger.error('Failed to remove files from face', { error })
	} finally {
		loadingCount.value--
	}
}

async function handleDeleteFace(): Promise<void> {
	try {
		loadingCount.value++
		await facesStore.deleteFace(props.faceName)
		router.push('/faces')
	} catch (error) {
		logger.error('Failed to delete face', { error })
	} finally {
		loadingCount.value--
	}
}

async function handleRenameFace(faceName: string): Promise<void> {
	try {
		loadingCount.value++
		closeRenameModal()
		const oldName = props.faceName
		await facesStore.renameFace(oldName, faceName)
		router.push({ name: 'facecontent', params: { faceName } })
	} catch (error) {
		logger.error('Failed to rename face', { error })
	} finally {
		loadingCount.value--
	}
}

async function handleUseAsContactPicture(): Promise<void> {
	const linkedContact = contact.value
	if (linkedContact === undefined || !await confirmOperation(
		t('photos', 'Use as contact picture'),
		t('photos', 'The picture of the contact {name} will be replaced with the face of this person.', { name: linkedContact.fullName }),
	)) {
		return
	}
	try {
		loadingCount.value++
		await setContactPhoto(linkedContact, await getFaceCoverJpeg(props.faceName))
		showSuccess(t('photos', 'Contact picture updated'))
	} catch (error) {
		logger.error('Failed to update the contact picture', { error })
		showError(t('photos', 'Failed to update the contact picture'))
	} finally {
		loadingCount.value--
	}
}

async function handleMerge(faceName: string): Promise<void> {
	try {
		loadingCount.value++
		await facesStore.moveFilesToFace(faceName, facesFiles.value[props.faceName], props.faceName)
		await facesStore.deleteFace(props.faceName)
		showMergeModal.value = false
		router.push({ name: 'facecontent', params: { faceName } })
	} catch (error) {
		logger.error('Failed to merge faces', { error })
	} finally {
		loadingCount.value--
	}
}

async function handleMove(faceName: string, fileIds: string[]): Promise<void> {
	try {
		loadingCount.value++
		await facesStore.moveFilesToFace(faceName, fileIds, props.faceName)
		showMoveModal.value = false
	} catch (error) {
		logger.error('Failed to move selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function favoriteSelection(): Promise<void> {
	try {
		loadingCount.value++
		await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 1)
	} catch (error) {
		logger.error('Failed to favorite selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function unFavoriteSelection(): Promise<void> {
	try {
		loadingCount.value++
		await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 0)
	} catch (error) {
		logger.error('Failed to unfavorite selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function downloadSelection(): Promise<void> {
	try {
		loadingCount.value++
		await downloadFiles(selectedFileIds.value.map((fileId) => files.value[fileId]))
	} catch (error) {
		logger.error('Failed to download selection', { error })
	} finally {
		loadingCount.value--
	}
}

onMounted(() => {
	fetchFaceContent(props.faceName)
})
</script>

<style lang="scss" scoped>
@use './FaceContent.scss';
</style>

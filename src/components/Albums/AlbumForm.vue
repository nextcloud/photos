<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<form v-if="!showCollaboratorView" class="album-form" @submit.prevent="submit()">
		<div class="form-inputs">
			<NcTextField
				ref="nameInput"
				v-model.trim="albumName"
				type="text"
				name="name"
				:helperText="albumNameValidationError"
				:error="albumNameValidationError !== undefined"
				:required="true"
				:label="t('photos', 'Name of the album')" />
			<NcTextField
				v-model="albumLocation"
				name="location"
				type="text"
				:label="t('photos', 'Location of the album')">
				<template #default>
					<MapMarkerOutline :size="20" />
				</template>
			</NcTextField>
		</div>

		<PhotosFiltersInput
			:selectedFilters="albumFilters"
			@selectFilter="selectFilter" />
		<PhotosFiltersDisplay
			:selectedFilters="albumFilters"
			@deselectFilter="deselectFilter" />

		<div class="form-buttons">
			<span class="left-buttons">
				<NcButton
					v-if="displayBackButton"
					variant="tertiary"
					@click="back">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton
					v-if="sharingEnabled && !editMode"
					variant="secondary"
					:disabled="!canSubmit"
					@click="showCollaboratorView = true">
					<template #icon>
						<AccountMultiplePlusOutline :size="20" />
					</template>
					{{ t('photos', 'Add collaborators') }}
				</NcButton>
				<NcButton
					variant="primary"
					:disabled="!canSubmit"
					@click="submit()">
					<template #icon>
						<NcLoadingIcon v-if="loading" :size="20" />
						<SendOutline v-else :size="20" />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</NcButton>
			</span>
		</div>
	</form>
	<CollaboratorsSelectionForm
		v-else
		:albumName="albumName"
		:allowPublicLink="false">
		<template #default="{ collaborators }">
			<span class="left-buttons">
				<NcButton
					variant="tertiary"
					@click="showCollaboratorView = false">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton
					variant="primary"
					:disabled="!canSubmit"
					@click="submit(collaborators)">
					<template #icon>
						<NcLoadingIcon v-if="loading" :size="20" />
						<SendOutline v-else :size="20" />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</NcButton>
			</span>
		</template>
	</CollaboratorsSelectionForm>
</template>

<script setup lang="ts">
import type { Collection } from '../../services/collectionFetcher.ts'
import type { FilterOption } from '../../services/PhotosFilters/PhotosFilter.ts'
import type { Album, AlbumEditableProperties, Collaborator } from '../../store/albums.ts'

import { InvalidFilenameError, InvalidFilenameErrorReason, validateFilename } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { generateRemoteUrl } from '@nextcloud/router'
import { computed, nextTick, onMounted, ref, toRaw, useTemplateRef } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import AccountMultiplePlusOutline from 'vue-material-design-icons/AccountMultiplePlusOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import PhotosFiltersDisplay from '../PhotosFilters/PhotosFiltersDisplay.vue'
import PhotosFiltersInput from '../PhotosFilters/PhotosFiltersInput.vue'
import CollaboratorsSelectionForm from './CollaboratorsSelectionForm.vue'
import { photosFilters as filters } from '../../services/PhotosFilters/index.ts'
import { albumsPrefix } from '../../store/albums.ts'
import { useAlbumsStore } from '../../store/albums.ts'
import { useCollectionsStore } from '../../store/collections.ts'

const props = withDefaults(defineProps<{
	album?: Album | null
	filtersValue?: Record<string, unknown[]>
	displayBackButton?: boolean
}>(), {
	album: null,
	filtersValue: () => ({}),
	displayBackButton: false,
})

const emit = defineEmits<{
	back: []
	done: [event: { album: Collection, changes?: string[] }]
}>()

const albumsStore = useAlbumsStore()
const collectionsStore = useCollectionsStore()

const nameInput = useTemplateRef<InstanceType<typeof NcTextField>>('nameInput')

const showCollaboratorView = ref(false)
const albumName = ref('')
const albumLocation = ref('')
const albumFilters = ref<Record<string, unknown[]>>(filters.reduce((acc, filter) => ({ ...acc, [filter.id]: [] }), {}))
const loading = ref(false)

const editMode = computed<boolean>(() => props.album !== null)

const sharingEnabled = computed<boolean>(() => OC.Share !== undefined)

const albumFileName = computed<string>(() => albumsStore.getAlbumName(albumName.value))

const albumNameValidationError = computed<string | undefined>(() => {
	// If loading is true, it means that the album is being created
	// so this condition will eventually become true
	// but we don't want to show the error message while loading
	const existingAlbum = albumsStore.albums[albumFileName.value]
	if (existingAlbum !== undefined && props.album !== existingAlbum && !loading.value) {
		return t('files', 'This name is already in use.')
	}

	try {
		validateFilename(albumName.value)
	} catch (error) {
		if (!(error instanceof InvalidFilenameError)) {
			throw error
		}

		switch (error.reason) {
			case InvalidFilenameErrorReason.Character:
				return t('files', '"{char}" is not allowed inside a filename.', { char: error.segment })
			case InvalidFilenameErrorReason.ReservedName:
				return undefined // We don't need to enforce that for albums.
			case InvalidFilenameErrorReason.Extension:
				return undefined // We don't need to enforce that for albums.
			default:
				return t('files', 'Invalid filename.')
		}
	}

	return undefined
})

const canSubmit = computed(() => albumName.value !== '' && albumNameValidationError.value === undefined && !loading.value)

function submit(collaborators: Collaborator[] = []) {
	if (!canSubmit.value) {
		return
	}

	if (editMode.value) {
		handleUpdateAlbum()
	} else {
		handleCreateAlbum(collaborators)
	}
}

async function handleCreateAlbum(collaborators: Collaborator[] = []) {
	try {
		loading.value = true

		const localAlbum = resultToNode({
			basename: albumName.value,
			filename: albumsPrefix + '/' + albumName.value,
			lastmod: '',
			size: 0,
			type: 'directory',
			etag: null,
			props: {
				displayname: albumName.value,
				resourcetype: {},
				nbItems: 0,
				location: albumLocation.value,
				'last-photo': -1,
				date: moment().format('MMMM YYYY'),
				collaborators,
				filters: props.filtersValue,
				source: generateRemoteUrl(`dav/${albumFileName.value}`),
			},
		}, albumsPrefix) as Collection

		let album = await collectionsStore.createCollection(localAlbum)

		if (album === undefined) {
			return
		}

		const propertiesToUpdate: Partial<AlbumEditableProperties> = {}

		if (albumLocation.value !== '') {
			propertiesToUpdate.location = albumLocation.value
		}

		if (albumLocation.value !== '' || collaborators.length !== 0) {
			propertiesToUpdate.collaborators = collaborators
		}

		if (Object.keys(props.filtersValue).length > 0) {
			propertiesToUpdate.filters = props.filtersValue
		}

		album = await collectionsStore.updateCollection(albumFileName.value, propertiesToUpdate)

		emit('done', { album })
	} finally {
		loading.value = false
	}
}

async function handleUpdateAlbum() {
	try {
		loading.value = true

		let album = toRaw(props.album)?.clone() as Album
		const changes: string[] = []

		if (props.album !== null && props.album.basename !== albumName.value) {
			changes.push('name')
			album = await collectionsStore.renameCollection(props.album.root + props.album.path, albumName.value) as Album

			if (album === props.album) {
				return // Abort, and do not close the form if renaming failed
			}
		}

		if (props.album !== null && props.album.attributes.location !== albumLocation.value) {
			changes.push('location')
			album = await collectionsStore.updateCollection(album.root + album.path, { location: albumLocation.value }) as Album
		}

		if (props.album !== null && JSON.stringify(props.album.attributes.filters) !== JSON.stringify(albumFilters.value)) {
			changes.push('filters')
			album = await collectionsStore.updateCollection(album.root + album.path, { filters: albumFilters.value }) as Album
		}

		emit('done', { album, changes })
	} finally {
		loading.value = false
	}
}

function selectFilter(filterOption: FilterOption<unknown>) {
	albumFilters.value[filterOption.filterId].push(filterOption.value)
}

function deselectFilter(filterOption: { filterId: string, value: unknown }) {
	const index = albumFilters.value[filterOption.filterId].indexOf(filterOption.value)

	if (index !== -1) {
		albumFilters.value[filterOption.filterId].splice(index, 1)
	}
}

function back() {
	emit('back')
}

onMounted(() => {
	if (editMode.value) {
		albumName.value = props.album?.basename as string
		albumLocation.value = props.album?.attributes.location ?? ''
		albumFilters.value = {
			...albumFilters.value,
			...structuredClone(toRaw(props.album?.attributes.filters ?? {})),
		}
	} else {
		albumFilters.value = {
			...albumFilters.value,
			...structuredClone(toRaw(props.filtersValue)),
		}
	}

	nextTick(() => {
		nameInput.value!.$el.getElementsByTagName('input')[0].focus()
	})
})
</script>

<style lang="scss" scoped>
.album-form {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 350px;
	padding: calc(var(--default-grid-baseline) * 4);

	.form-title {
		font-weight: bold;
	}

	.form-subtitle {
		color: var(--color-text-lighter);
	}

	.form-inputs {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 4);
	}

	.form-buttons {
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		.left-buttons,
		.right-buttons {
			display: flex;
			gap: calc(var(--default-grid-baseline) * 4);
		}

		.right-buttons {
			justify-content: flex-end;
		}
	}
}

.left-buttons {
	flex-grow: 1;
}

@media only screen and (max-width: 1020px) {
	.right-buttons {
		justify-content: flex-end;
		flex-direction: column;
	}
}
</style>

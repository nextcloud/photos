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
				:helper-text="albumNameValidationError"
				:error="albumNameValidationError !== undefined"
				:required="true"
				:label="t('photos', 'Name of the album')" />
			<NcTextField
				:value.sync="albumLocation"
				name="location"
				type="text"
				:label="t('photos', 'Location of the album')">
				<template #default>
					<MapMarkerOutline :size="20" />
				</template>
			</NcTextField>
		</div>

		<PhotosFiltersInput
			:selected-filters="albumFilters"
			@select-filter="selectFilter" />
		<PhotosFiltersDisplay
			:selected-filters="albumFilters"
			@deselect-filter="deselectFilter" />

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
		:album-name="albumName"
		:allow-public-link="false">
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

<script lang='ts'>
import type { PropType } from 'vue'
import type { FilterOption } from '../../services/PhotosFilters/PhotosFilter.ts'
import type { Album, AlbumEditableProperties, Collaborator } from '../../store/albums.ts'

import { InvalidFilenameError, InvalidFilenameErrorReason, validateFilename } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { generateRemoteUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import AccountMultiplePlusOutline from 'vue-material-design-icons/AccountMultiplePlusOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import PhotosFiltersDisplay from '../PhotosFilters/PhotosFiltersDisplay.vue'
import PhotosFiltersInput from '../PhotosFilters/PhotosFiltersInput.vue'
import CollaboratorsSelectionForm from './CollaboratorsSelectionForm.vue'
import filters from '../../services/PhotosFilters/index.ts'
import { albumsPrefix } from '../../store/albums.ts'

export default {
	name: 'AlbumForm',

	components: {
		MapMarkerOutline,
		AccountMultiplePlusOutline,
		SendOutline,
		NcButton,
		NcLoadingIcon,
		NcTextField,
		CollaboratorsSelectionForm,
		PhotosFiltersInput,
		PhotosFiltersDisplay,
	},

	props: {
		album: {
			type: Object as PropType<Album | null>,
			default: null,
		},

		filtersValue: {
			type: Object as PropType<Record<string, unknown[]>>,
			default: () => ({}),
		},

		displayBackButton: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			showCollaboratorView: false,
			albumName: '',
			albumLocation: '',
			albumFilters: filters.reduce((acc, filter) => ({ ...acc, [filter.id]: [] }), {}),
			loading: false,
		}
	},

	computed: {
		editMode(): boolean {
			return this.album !== null
		},

		sharingEnabled(): boolean {
			return OC.Share !== undefined
		},

		albumFileName(): string {
			return this.$store.getters.getAlbumName(this.albumName)
		},

		albumNameValidationError(): string | undefined {
			// If loading is true, it means that the album is being created
			// so this condition will eventually become true
			// but we don't want to show the error message while loading
			const existingAlbum = this.$store.getters.albums[this.albumFileName]
			if (existingAlbum !== undefined && this.album !== existingAlbum && !this.loading) {
				return t('files', 'This name is already in use.')
			}

			try {
				validateFilename(this.albumName)
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
		},

		canSubmit() {
			return this.albumName !== '' && this.albumNameValidationError === undefined && !this.loading
		},
	},

	mounted() {
		if (this.editMode) {
			this.albumName = this.album?.basename as string
			this.albumLocation = this.album?.attributes.location ?? ''
			this.albumFilters = {
				...this.albumFilters,
				...structuredClone(this.album?.attributes.filters ?? {}),
			}
		} else {
			this.albumFilters = {
				...this.albumFilters,
				...structuredClone(this.filtersValue),
			}
		}

		this.$nextTick(() => {
			(this.$refs!.nameInput! as NcTextField).$el.getElementsByTagName('input')[0].focus()
		})
	},

	methods: {
		submit(collaborators: Collaborator[] = []) {
			if (!this.canSubmit) {
				return
			}

			if (this.editMode) {
				this.handleUpdateAlbum()
			} else {
				this.handleCreateAlbum(collaborators)
			}
		},

		async handleCreateAlbum(collaborators: Collaborator[] = []) {
			try {
				this.loading = true

				const localAlbum = resultToNode({
					basename: this.albumName,
					filename: albumsPrefix + '/' + this.albumName,
					lastmod: '',
					size: 0,
					type: 'directory',
					etag: null,
					props: {
						displayname: this.albumName,
						resourcetype: {},
						nbItems: 0,
						location: this.albumLocation,
						'last-photo': -1,
						date: moment().format('MMMM YYYY'),
						collaborators,
						filters: this.filtersValue,
						source: generateRemoteUrl(`dav/${this.albumFileName}`),
					},
				}, albumsPrefix)

				let album = await this.$store.dispatch('createCollection', { collection: localAlbum })

				if (album === undefined) {
					return
				}

				const propertiesToUpdate: Partial<AlbumEditableProperties> = {}

				if (this.albumLocation !== '') {
					propertiesToUpdate.location = this.albumLocation
				}

				if (this.albumLocation !== '' || collaborators.length !== 0) {
					propertiesToUpdate.collaborators = collaborators
				}

				if (Object.keys(this.filtersValue).length > 0) {
					propertiesToUpdate.filters = this.filtersValue
				}

				album = await this.$store.dispatch('updateCollection', {
					collectionFileName: this.albumFileName,
					properties: propertiesToUpdate,
				})

				this.$emit('done', { album })
			} finally {
				this.loading = false
			}
		},

		async handleUpdateAlbum() {
			try {
				this.loading = true

				let album = this.album?.clone() as Album
				const changes: string[] = []

				if (this.album !== null && this.album.basename !== this.albumName) {
					changes.push('name')
					album = await this.$store.dispatch('renameCollection', { collectionFileName: this.album.root + this.album.path, newBaseName: this.albumName }) as Album

					if (album === this.album) {
						return // Abort, and do not close the form if renaming failed
					}
				}

				if (this.album !== null && this.album.attributes.location !== this.albumLocation) {
					changes.push('location')
					album = await this.$store.dispatch('updateCollection', { collectionFileName: album.root + album.path, properties: { location: this.albumLocation } }) as Album
				}

				if (this.album !== null && JSON.stringify(this.album.attributes.filters) !== JSON.stringify(this.albumFilters)) {
					changes.push('filters')
					album = await this.$store.dispatch('updateCollection', { collectionFileName: album.root + album.path, properties: { filters: this.albumFilters } }) as Album
				}

				this.$emit('done', { album, changes })
			} finally {
				this.loading = false
			}
		},

		selectFilter(filterOption: FilterOption<unknown>) {
			this.albumFilters[filterOption.filterId].push(filterOption.value)
		},

		deselectFilter(filterOption: { filterId: string, value: unknown }) {
			const index = this.albumFilters[filterOption.filterId].indexOf(filterOption.value)

			if (index !== -1) {
				this.albumFilters[filterOption.filterId].splice(index, 1)
			}
		},

		back() {
			this.$emit('back')
		},

		t,
	},
}
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

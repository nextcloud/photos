<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<form v-if="!showCollaboratorView" class="album-form" @submit.prevent="submit()">
		<div class="form-inputs">
			<NcTextField
				ref="nameInput"
				:value.sync="albumName"
				type="text"
				name="name"
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

		<PhotosFiltersDisplay :filters-value="filtersValue" />

		<div class="form-buttons">
			<span class="left-buttons">
				<NcButton
					v-if="displayBackButton"
					type="tertiary"
					@click="back">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton
					v-if="sharingEnabled && !editMode"
					type="secondary"
					:disabled="albumName.trim() === '' || loading"
					@click="showCollaboratorView = true">
					<template #icon>
						<AccountMultiplePlusOutline :size="20" />
					</template>
					{{ t('photos', 'Add collaborators') }}
				</NcButton>
				<NcButton
					type="primary"
					:disabled="albumName === '' || loading"
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
					type="tertiary"
					@click="showCollaboratorView = false">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton
					type="primary"
					:disabled="albumName.trim() === '' || loading"
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

import { resultToNode } from '@nextcloud/files/dav'
import { translate } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { generateRemoteUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import AccountMultiplePlusOutline from 'vue-material-design-icons/AccountMultiplePlusOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import PhotosFiltersDisplay from '../PhotosFilters/PhotosFiltersDisplay.vue'
import CollaboratorsSelectionForm from './CollaboratorsSelectionForm.vue'
import {
	type Album, type AlbumEditableProperties, type Collaborator,

	albumsPrefix,
} from '../../store/albums.ts'

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
		PhotosFiltersDisplay,
	},

	props: {
		album: {
			type: Object as PropType<Album | null>,
			default: null,
		},

		filtersValue: {
			type: Object as PropType<Record<string, unknown>>,
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
	},

	mounted() {
		if (this.editMode) {
			this.albumName = this.album?.basename as string
			this.albumLocation = this.album?.attributes.location ?? ''
		}

		this.$nextTick(() => {
			(this.$refs!.nameInput! as NcTextField).$el.getElementsByTagName('input')[0].focus()
		})
	},

	methods: {
		submit(collaborators: Collaborator[] = []) {
			if (this.albumName === '' || this.loading) {
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

				if (this.album !== null && this.album.basename !== this.albumName) {
					album = await this.$store.dispatch('renameCollection', { collectionFileName: this.album.root + this.album.path, newBaseName: this.albumName }) as Album
				}

				if (this.album !== null && this.album.attributes.location !== this.albumLocation) {
					album = await this.$store.dispatch('updateCollection', { collectionFileName: album.root + album.path, properties: { location: this.albumLocation } }) as Album
				}

				this.$emit('done', { album })
			} finally {
				this.loading = false
			}
		},

		back() {
			this.$emit('back')
		},

		t: translate,
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

		.left-buttons, .right-buttons {
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

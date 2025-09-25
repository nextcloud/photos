<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<form v-if="!showCollaboratorView" class="album-form" @submit.prevent="submit">
		<div class="form-inputs">
			<NcTextField ref="nameInput"
				:value.sync="albumName"
				type="text"
				name="name"
				:helper-text="albumNameValidationError"
				:error="albumNameValidationError !== undefined"
				:required="true"
				:label="t('photos', 'Name of the album')" />
			<NcTextField :value.sync="albumLocation"
				name="location"
				type="text"
				:label="t('photos', 'Location of the album')">
				<template #default>
					<MapMarker :size="20" />
				</template>
			</NcTextField>
		</div>
		<div class="form-buttons">
			<span class="left-buttons">
				<NcButton v-if="displayBackButton"
					type="tertiary"
					@click="back">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton v-if="sharingEnabled && !editMode"
					type="secondary"
					:disabled="!canSubmit"
					@click="showCollaboratorView = true">
					<template #icon>
						<AccountMultiplePlus :size="20" />
					</template>
					{{ t('photos', 'Add collaborators') }}
				</NcButton>
				<NcButton type="primary"
					:disabled="!canSubmit"
					@click="submit()">
					<template #icon>
						<NcLoadingIcon v-if="loading" :size="20" />
						<Send v-else :size="20" />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</NcButton>
			</span>
		</div>
	</form>
	<CollaboratorsSelectionForm v-else
		:album-name="albumName"
		:allow-public-link="false">
		<template #default="{ collaborators }">
			<span class="left-buttons">
				<NcButton type="tertiary"
					@click="showCollaboratorView = false">
					{{ t('photos', 'Back') }}
				</NcButton>
			</span>
			<span class="right-buttons">
				<NcButton type="primary"
					:disabled="albumName.trim() === '' || loading"
					@click="submit(collaborators)">
					<template #icon>
						<NcLoadingIcon v-if="loading" :size="20" />
						<Send v-else :size="20" />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</NcButton>
			</span>
		</template>
	</CollaboratorsSelectionForm>
</template>
<script>
import { mapActions } from 'vuex'

import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import AccountMultiplePlus from 'vue-material-design-icons/AccountMultiplePlus.vue'
import Send from 'vue-material-design-icons/Send.vue'

import { NcButton, NcLoadingIcon, NcTextField } from '@nextcloud/vue'
import { InvalidFilenameError, InvalidFilenameErrorReason, validateFilename } from '@nextcloud/files'
import { translate } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { generateRemoteUrl } from '@nextcloud/router'

import CollaboratorsSelectionForm from './CollaboratorsSelectionForm.vue'

export default {
	name: 'AlbumForm',

	components: {
		MapMarker,
		AccountMultiplePlus,
		Send,
		NcButton,
		NcLoadingIcon,
		NcTextField,
		CollaboratorsSelectionForm,
	},

	props: {
		/** @type {import('vue').PropType<import('../../store/albums.js').Album|null>} */
		album: {
			type: Object,
			default: null,
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
		/**
		 * @return {boolean} Whether sharing is enabled.
		 */
		editMode() {
			return this.album !== null
		},

		/**
		 * @return {boolean} Whether sharing is enabled.
		 */
		sharingEnabled() {
			return OC.Share !== undefined
		},

		/**
		 * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
		 */
		albumFileName() {
			return this.$store.getters.getAlbumName(this.albumName)
		},

		albumNameValidationError() {
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
			this.albumName = this.album.basename
			this.albumLocation = this.album.location ?? ''
		}

		this.$nextTick(() => {
			this.$refs.nameInput.$el.getElementsByTagName('input')[0].focus()
		})
	},

	methods: {
		...mapActions(['createCollection', 'renameCollection', 'updateCollection']),

		/** @param {import('../../store/albums.js').Collaborator[]} collaborators */
		submit(collaborators = []) {
			if (!this.canSubmit) {
				return
			}

			if (this.editMode) {
				this.handleUpdateAlbum()
			} else {
				this.handleCreateAlbum(collaborators)
			}
		},

		/** @param {import('../../store/albums.js').Collaborator[]} collaborators */
		async handleCreateAlbum(collaborators = []) {
			try {
				this.loading = true
				let album = await this.createCollection({
					collection: {
						basename: this.albumName,
						filename: this.albumFileName,
						nbItems: 0,
						location: this.albumLocation,
						lastPhoto: -1,
						date: moment().format('MMMM YYYY'),
						collaborators,
						source: generateRemoteUrl(`dav/${this.albumFileName}`),
					},
				})

				if (album === undefined) {
					return
				}

				if (this.albumLocation !== '' || collaborators.length !== 0) {
					album = await this.updateCollection(
						{
							collectionFileName: this.albumFileName,
							properties: {
								location: this.albumLocation,
								collaborators,
							},
						})
				}

				this.$emit('done', { album })
			} finally {
				this.loading = false
			}
		},

		async handleUpdateAlbum() {
			try {
				this.loading = true

				let album = { ...this.album }

				if (this.album.basename !== this.albumName) {
					album = await this.renameCollection({ collectionFileName: this.album.filename, newBaseName: this.albumName })
				}

				if (this.album.location !== this.albumLocation) {
					album = await this.updateCollection({ collectionFileName: album.filename, properties: { location: this.albumLocation } })
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
	height: 350px;
	padding: calc(var(--default-grid-baseline) * 4);

	.form-title {
		font-weight: bold;
	}

	.form-subtitle {
		color: var(--color-text-lighter);
	}

	.form-inputs {
		flex: 1;
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

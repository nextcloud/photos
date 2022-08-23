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
	<form v-if="!showCollaboratorView" class="album-form" @submit.prevent="submit">
		<div class="form-inputs">
			<input ref="nameInput"
				v-model.trim="albumName"
				type="text"
				name="name"
				required
				autofocus="true"
				:placeholder="t('photos', 'Name of the album')">
			<label>
				<MapMarker /><input v-model.trim="albumLocation"
					name="location"
					type="text"
					:placeholder="t('photos', 'Location of the album')">
			</label>
		</div>
		<div class="form-buttons">
			<span class="left-buttons">
				<Button v-if="displayBackButton"
					:aria-label="t('photos', 'Go back to the previous view')"
					type="tertiary"
					@click="back">
					{{ t('photos', 'Back') }}
				</Button>
			</span>
			<span class="right-buttons">
				<!-- <Button v-if="!editMode"
					:aria-label="t('photos', 'Go to the add collaborators view.')"
					type="secondary"
					:disabled="albumName.trim() === '' || loading"
					@click="showCollaboratorView = true">
					<template #icon>
						<AccountMultiplePlus />
					</template>
					{{ t('photos', 'Add collaborators') }}
				</Button> -->
				<Button :aria-label="editMode ? t('photos', 'Save.') : t('photos', 'Create the album.')"
					type="primary"
					:disabled="albumName === '' || loading"
					@click="submit()">
					<template #icon>
						<Loader v-if="loading" />
						<Send v-else />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</Button>
			</span>
		</div>
	</form>
	<CollaboratorsSelectionForm v-else
		class="add-collaborators-form"
		@cancel="showCollaboratorView = true">
		<template slot-scope="{collaborators}">
			<span class="left-buttons">
				<Button :aria-label="t('photos', 'Back to the new album form.')"
					type="tertiary"
					@click="showCollaboratorView = false">
					{{ t('photos', 'Back') }}
				</Button>
			</span>
			<span class="right-buttons">
				<Button :aria-label="editMode ? t('photos', 'Save.') : t('photos', 'Create the album.')"
					type="primary"
					:disabled="albumName.trim() === '' || loading"
					@click="submit(collaborators)">
					<template #icon>
						<Loader v-if="loading" />
						<Send v-else />
					</template>
					{{ editMode ? t('photos', 'Save') : t('photos', 'Create album') }}
				</Button>
			</span>
		</template>
	</CollaboratorsSelectionForm>
</template>
<script>
import { mapActions } from 'vuex'
import MapMarker from 'vue-material-design-icons/MapMarker'
// import AccountMultiplePlus from 'vue-material-design-icons/AccountMultiplePlus'
import Send from 'vue-material-design-icons/Send'

import { Button } from '@nextcloud/vue'
import moment from '@nextcloud/moment'

import Loader from './Loader.vue'
import CollaboratorsSelectionForm from './CollaboratorsSelectionForm.vue'

export default {
	name: 'AlbumForm',

	components: {
		Button,
		MapMarker,
		// AccountMultiplePlus,
		Send,
		Loader,
		CollaboratorsSelectionForm,
	},

	props: {
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
		editMode() {
			return this.album !== null
		},
	},

	mounted() {
		if (this.editMode) {
			this.albumName = this.album.basename
			this.albumLocation = this.album.location
		}

		this.$nextTick(() => {
			this.$refs.nameInput.focus()
		})
	},

	methods: {
		...mapActions(['createAlbum', 'renameAlbum', 'updateAlbumLocation']),

		submit(collaborators = []) {
			if (this.albumName === '' || this.loading) {
				return
			}

			if (this.editMode) {
				this.handleUpdateAlbum(collaborators)
			} else {
				this.handleCreateAlbum(collaborators)
			}
		},

		async handleCreateAlbum(collaborators = []) {
			try {
				this.loading = true
				const album = await this.createAlbum({
					album: {
						basename: this.albumName,
						nbItems: 0,
						location: this.albumLocation,
						lastPhoto: '',
						date: moment().format('MMMM YYYY'),
						collaborators,
					},
				})
				this.$emit('done', { album })
			} finally {
				this.loading = false
			}
		},

		async handleUpdateAlbum(collaborators = []) {
			try {
				this.loading = true

				let album = { ...this.album }

				if (this.album.basename !== this.albumName) {
					album = await this.renameAlbum({ currentAlbumName: this.album.basename, newAlbumName: this.albumName })
				}

				if (this.album.location !== this.albumLocation) {
					album.location = await this.updateAlbumLocation({ albumName: this.albumName, newLocation: this.albumLocation })
				}

				this.$emit('done', { album })
			} finally {
				this.loading = false
			}
		},

		back() {
			this.$emit('back')
		},
	},
}
</script>
<style lang="scss" scoped>
.album-form {
	display: flex;
	flex-direction: column;
	height: 350px;
	padding: 16px;

	.form-title {
		font-weight: bold;
	}

	.form-subtitle {
		color: var(--color-text-lighter);
	}

	.form-inputs {
		flex-grow: 1;
		justify-items: flex-end;

		input {
			width: 100%;
		}

		label {
			display: flex;
			margin-top: 16px;

			::v-deep svg {
				margin-right: 12px;
			}
		}
	}

	.form-buttons {
		display: flex;
		justify-content: space-between;

		.left-buttons, .right-buttons {
			display: flex;
		}

		.right-buttons {
			justify-content: flex-end;
		}

		button {
			margin-right: 16px;
		}
	}
}
</style>

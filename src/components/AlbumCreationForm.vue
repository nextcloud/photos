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
	<form v-if="!showCollaboratorView" class="album-creation-form">
		<div class="form-inputs">
			<input ref="nameInput"
				v-model="albumName"
				type="text"
				name="name"
				required
				autofocus="true"
				:placeholder="t('photos', 'Name of the new album')">
			<label>
				<MapMarker /><input v-model="albumLocation"
					type="text"
					name="location"
					:placeholder="t('photos', 'Add location')">
			</label>
		</div>
		<div class="form-buttons">
			<span class="left-buttons">
				<Button v-if="displayBackButton"
					:aria-label="t('photo', 'Go back to the previous view')"
					type="tertiary"
					@click="back">
					{{ t('photo', 'Back') }}
				</Button>
			</span>
			<span class="right-buttons">

				<Button :aria-label="t('photo', 'Go to the add collaborators view.')"
					type="secondary"
					:disabled="albumName.trim() === '' || loading"
					@click="showCollaboratorView = true">
					<template #icon>
						<AccountMultiplePlus />
					</template>
					{{ t('photo', 'Add collaborators') }}
				</Button>
				<Button :aria-label="t('photo', 'Create the album.')"
					type="primary"
					:disabled="albumName.trim() === '' || loading"
					@click="createAlbum">
					<template #icon>
						<Loader v-if="loading" />
						<Send v-else />
					</template>
					{{ t('photo', 'Create album') }}
				</Button>
			</span>
		</div>
	</form>
	<CollaboratorsSelectionForm v-else
		class="add-collaborators-form"
		@cancel="showCollaboratorView = true"
		@submit="createAlbum">
		<template slot-scope="{collaborators}">
			<span class="left-buttons">
				<Button :aria-label="t('photo', 'Back to the new album form.')"
					type="tertiary"
					@click="showCollaboratorView = false">
					{{ t('photo', 'Back') }}
				</Button>
			</span>
			<span class="right-buttons">
				<Button :aria-label="t('photo', 'Create the album.')"
					type="primary"
					:disabled="albumName.trim() === '' || loading"
					@click="createAlbum(collaborators)">
					<template #icon>
						<Loader v-if="loading" />
						<Send v-else />
					</template>
					{{ t('photo', 'Create album') }}
				</Button>
			</span>
		</template>
	</CollaboratorsSelectionForm>
</template>
<script>
import MapMarker from 'vue-material-design-icons/MapMarker'
import AccountMultiplePlus from 'vue-material-design-icons/AccountMultiplePlus'
import Send from 'vue-material-design-icons/Send'

import { Button } from '@nextcloud/vue'

import Loader from '../components/Loader.vue'
import CollaboratorsSelectionForm from '../components/CollaboratorsSelectionForm.vue'

export default {
	name: 'AlbumCreationForm',

	components: {
		Button,
		MapMarker,
		AccountMultiplePlus,
		Send,
		Loader,
		CollaboratorsSelectionForm,
	},

	props: {
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

	mounted() {
		this.$nextTick(() => {
			this.$refs.nameInput.focus()
		})
	},

	methods: {
		async createAlbum(collaborators = []) {
			try {
				this.loading = true
				const album = await this.$store.dispatch('createAlbum', {
					album: {
						name: this.albumName,
						location: this.albumLocation,
						collaborators,
					},
				})
				this.$emit('album-created', { album })
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
.album-creation-form {
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

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
	<div class="manage-collaborators">
		<h2 class="manage-collaborators__title">
			{{ t('photos', 'Add collaborators') }}
		</h2>
		<div class="manage-collaborators__subtitle">
			{{ t('photos', 'Add people or groups who can edit your album') }}
		</div>

		<form class="manage-collaborators__form" @submit.prevent>
			<NcPopover ref="popover" :auto-size="true" :distance="0">
				<label slot="trigger" class="manage-collaborators__form__input">
					<NcTextField :value.sync="searchText"
						autocomplete="off"
						type="search"
						name="search"
						:aria-label="t('photos', 'Search for collaborators')"
						aria-autocomplete="list"
						:aria-controls="`manage-collaborators__form__selection-${randomId} manage-collaborators__form__list-${randomId}`"
						:placeholder="t('photos', 'Search people or groups')"
						@input="searchCollaborators">
						<Magnify :size="16" />
					</NcTextField>
					<NcLoadingIcon v-if="loadingCollaborators" />
				</label>

				<ul v-if="searchResults.length !== 0" :id="`manage-collaborators__form__list-${randomId}`" class="manage-collaborators__form__list">
					<li v-for="result of searchResults" :key="result.key">
						<a>
							<NcListItemIcon :id="availableCollaborators[result.key].id"
								class="manage-collaborators__form__list__result"
								:title="availableCollaborators[result.key].id"
								:search="searchText"
								:user="availableCollaborators[result.key].id"
								:display-name="availableCollaborators[result.key].label"
								:aria-label="t('photos', 'Add {collaboratorLabel} to the collaborators list', {collaboratorLabel: availableCollaborators[result.key].label})"
								@click="selectEntity(result.key)" />
						</a>
					</li>
				</ul>
				<NcEmptyContent v-else
					key="emptycontent"
					class="manage-collaborators__form__list--empty"
					:title="t('photos', 'No collaborators available')">
					<AccountGroup slot="icon" />
				</NcEmptyContent>
			</NcPopover>
		</form>

		<ul class="manage-collaborators__selection">
			<li v-for="collaboratorKey of selectedCollaboratorsKeys"
				:key="collaboratorKey"
				class="manage-collaborators__selection__item">
				<NcListItemIcon :id="availableCollaborators[collaboratorKey].id"
					:display-name="availableCollaborators[collaboratorKey].label"
					:title="availableCollaborators[collaboratorKey].id"
					:user="availableCollaborators[collaboratorKey].id">
					<NcButton type="tertiary"
						:aria-label="t('photos', 'Remove {collaboratorLabel} from the collaborators list', {collaboratorLabel: availableCollaborators[collaboratorKey].label})"
						@click="unselectEntity(collaboratorKey)">
						<Close slot="icon" :size="20" />
					</NcButton>
				</NcListItemIcon>
			</li>
		</ul>

		<div class="actions">
			<div v-if="allowPublicLink" class="actions__public-link">
				<template v-if="publicLink">
					<NcButton class="manage-collaborators__public-link-button"
						@click="copyPublicLink">
						<template v-if="publicLinkCopied">
							{{ t('photos', 'Public link copied!') }}
						</template>
						<template v-else>
							{{ t('photos', 'Copy public link') }}
						</template>
						<template #icon>
							<Check v-if="publicLinkCopied" />
							<ContentCopy v-else />
						</template>
					</NcButton>
					<NcButton @click="deletePublicLink">
						<Close slot="icon" />
					</NcButton>
				</template>
				<NcButton v-else
					class="manage-collaborators__public-link-button"
					@click="createPublicLinkForAlbum">
					<Earth slot="icon" />
					{{ t('photos', 'Share via public link') }}
				</NcButton>
			</div>

			<div class="actions__slot">
				<slot :collaborators="selectedCollaborators" />
			</div>
		</div>
	</div>
</template>

<script>
import Magnify from 'vue-material-design-icons/Magnify'
import Close from 'vue-material-design-icons/Close'
import AccountGroup from 'vue-material-design-icons/AccountGroup'
import Earth from 'vue-material-design-icons/Earth'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'
import { generateOcsUrl } from '@nextcloud/router'
import { NcButton, NcListItemIcon, NcLoadingIcon, NcPopover, NcTextField, NcEmptyContent } from '@nextcloud/vue'

import logger from '../../services/logger.js'

const SHARE = {
	TYPE: {
		USER: 0,
		GROUP: 1,
		// LINK: 3,
	},
}

export default {
	name: 'CollaboratorsSelectionForm',

	components: {
		Magnify,
		Close,
		AccountGroup,
		Earth,
		NcLoadingIcon,
		NcButton,
		NcListItemIcon,
		NcTextField,
		NcPopover,
		NcEmptyContent,
	},

	props: {
		albumName: {
			type: String,
			required: true,
		},

		collaborators: {
			type: Array,
			default: () => [],
		},

		publicLink: {
			type: String,
			default: '',
		},

		allowPublicLink: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			searchText: '',
			availableCollaborators: {},
			selectedCollaboratorsKeys: [],
			currentSearchResults: [],
			loadingCollaborators: false,
			randomId: Math.random().toString().substring(2, 10),
			publicLinkCopied: false,
			config: {
				minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0,
			},
		}
	},

	computed: {
		/**
		 * @return {string[]}
		 */
		searchResults() {
			return this.currentSearchResults
				.filter(({ id }) => id !== getCurrentUser().uid)
				.map(({ type, id }) => `${type}:${id}`)
				.filter(key => !this.selectedCollaboratorsKeys.includes(key))
				.map((key) => ({ key, height: 48 }))
		},

		/**
		 * @return {object[]}
		 */
		selectedCollaborators() {
			return this.selectedCollaboratorsKeys.map((collaboratorKey) => this.availableCollaborators[collaboratorKey])
		},
	},

	mounted() {
		this.searchCollaborators()
		this.selectedCollaboratorsKeys = this.collaborators.map(({ type, id }) => `${type}:${id}`)
		this.availableCollaborators = {
			...this.availableCollaborators,
			...this.collaborators
				.reduce((collaborators, collaborator) => ({ ...collaborators, [`${collaborator.type}:${collaborator.id}`]: collaborator }), {}),
		}
	},

	methods: {
		/**
		 * Fetch possible collaborators.
		 */
		async searchCollaborators() {
			try {
				if (this.searchText.length < this.config.minSearchStringLength) {
					return
				}

				this.loadingCollaborators = true
				const response = await axios.get(generateOcsUrl('core/autocomplete/get'), {
					params: {
						search: this.searchText,
						itemType: 'share-recipients',
						shareTypes: [
							SHARE.TYPE.USER,
							SHARE.TYPE.GROUP,
						],
					},
				})

				this.currentSearchResults = response.data.ocs.data
					.map(collaborator => {
						let type = -1
						switch (collaborator.source) {
						case 'users':
							type = OC.Share.SHARE_TYPE_USER
							break
						case 'groups':
							type = OC.Share.SHARE_TYPE_GROUP
							break
						}

						return { ...collaborator, type }
					})
				this.availableCollaborators = {
					...this.availableCollaborators,
					...this.currentSearchResults
						.reduce((collaborators, collaborator) => ({ ...collaborators, [`${collaborator.type}:${collaborator.id}`]: collaborator }), {}),
				}
			} catch (error) {
				this.errorFetchingCollaborators = error
				logger.error(t('photos', 'Failed to fetch collaborators list.'), error)
				showError(t('photos', 'Failed to fetch collaborators list.'))
			} finally {
				this.loadingCollaborators = false
			}
		},

		// TODO: implement public sharing
		async createPublicLinkForAlbum() {
			return axios.put(generateOcsUrl(`apps/photos/createPublicLink/${this.albumName}`))
		},

		async deletePublicLink() {
			return axios.delete(generateOcsUrl(`apps/photos/createPublicLink/${this.albumName}`))
		},

		async copyPublicLink() {
			await navigator.clipboard.writeText(this.publicLink)
			this.publicLinkCopied = true
			setTimeout(() => {
				this.publicLinkCopied = false
			}, 10000)
		},

		selectEntity(collaboratorKey) {
			if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
				return
			}

			this.$refs.popover.$refs.popover.hide()
			this.selectedCollaboratorsKeys.push(collaboratorKey)
		},

		unselectEntity(collaboratorKey) {
			const index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey)
			this.selectedCollaboratorsKeys.splice(index, 1)
		},
	},
}
</script>

<style lang="scss" scoped>
.manage-collaborators {
	display: flex;
	flex-direction: column;
	padding: 20px;
	height: 500px;

	&__title {
		font-weight: bold;
	}

	&__subtitle {
		color: var(--color-text-lighter);
	}

	&__public-link-button {
		margin: 4px 0;
	}

	&__form {
		margin-top: 4px 0;
		display: flex;
		flex-direction: column;

		&__input {
			position: relative;
			display: block;

			input {
				width: 100%;
				padding-left: 34px;
			}

			.loading-icon {
				position: absolute;
				top: calc(36px / 2 - 20px / 2);
				right: 8px;
			}
		}

		&__list {
			padding: 8px;

			&__result {
				padding: 8px;
				border-radius: 100px;
				box-sizing: border-box;

				&, & * {
					cursor: pointer !important;
				}

				&:hover {
					background: var(--color-background-dark);
				}
			}

			&--empty {
				margin: 100px 0;
			}
		}
	}

	&__selection {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
		flex-grow: 1;

		&__item {
			border-radius: var(--border-radius-pill);
			padding:  0 8px;

			&:hover {
				background: var(--color-background-dark);
			}
		}
	}

	.actions {
		display: flex;
		margin-top: 8px;

		&__public-link {
			display: flex;
			align-items: center;
		}

		&__slot {
			flex-grow: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
}
</style>

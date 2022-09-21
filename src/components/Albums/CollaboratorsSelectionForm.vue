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
					<li v-for="collaboratorKey of searchResults" :key="collaboratorKey">
						<a>
							<NcListItemIcon :id="availableCollaborators[collaboratorKey].id"
								class="manage-collaborators__form__list__result"
								:title="availableCollaborators[collaboratorKey].id"
								:search="searchText"
								:user="availableCollaborators[collaboratorKey].id"
								:display-name="availableCollaborators[collaboratorKey].label"
								:aria-label="t('photos', 'Add {collaboratorLabel} to the collaborators list', {collaboratorLabel: availableCollaborators[collaboratorKey].label})"
								@click="selectEntity(collaboratorKey)" />
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
			<li v-for="collaboratorKey of listableSelectedCollaboratorsKeys"
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
				<template v-if="isPublicLinkSelected">
					<NcButton class="manage-collaborators__public-link-button"
						:aria-label="t('photos', 'Copy the public link')"
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
					<NcButton type="tertiary" :aria-label="t('photos', 'Delete the public link')" @click="deletePublicLink">
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
import { mapActions } from 'vuex'

import Magnify from 'vue-material-design-icons/Magnify'
import Close from 'vue-material-design-icons/Close'
import Check from 'vue-material-design-icons/Check'
import ContentCopy from 'vue-material-design-icons/ContentCopy'
import AccountGroup from 'vue-material-design-icons/AccountGroup'
import Earth from 'vue-material-design-icons/Earth'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { NcButton, NcListItemIcon, NcLoadingIcon, NcPopover, NcTextField, NcEmptyContent } from '@nextcloud/vue'

import logger from '../../services/logger.js'

/**
 * @typedef {object} Collaborator
 * @property {string} id - The id of the collaborator.
 * @property {string} label - The label of the collaborator for display.
 * @property {0|1|3} type - The type of the collaborator.
 */

export default {
	name: 'CollaboratorsSelectionForm',

	components: {
		Magnify,
		Close,
		AccountGroup,
		ContentCopy,
		Check,
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

		/** @type {import('vue').PropType<Collaborator[]>} */
		collaborators: {
			type: Array,
			default: () => [],
		},

		allowPublicLink: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			searchText: '',
			/** @type {Object<string, Collaborator>} */
			availableCollaborators: {},
			/** @type {string[]} */
			selectedCollaboratorsKeys: [],
			/** @type {Collaborator[]} */
			currentSearchResults: [],
			loadingCollaborators: false,
			randomId: Math.random().toString().substring(2, 10),
			publicLinkCopied: false,
			config: {
				minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0,
			},
			/** @type {Collaborator} */
			publicLink: {
				id: (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).substring(0, 15),
				label: t('photos', 'Public link'),
				type: OC.Share.SHARE_TYPE_LINK,
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
				.filter(collaboratorKey => !this.selectedCollaboratorsKeys.includes(collaboratorKey))
		},

		/**
		 * @return {string[]}
		 */
		listableSelectedCollaboratorsKeys() {
			return this.selectedCollaboratorsKeys
				.filter(collaboratorKey => this.availableCollaborators[collaboratorKey].type !== OC.Share.SHARE_TYPE_LINK)
		},

		/**
		 * @return {Collaborator[]}
		 */
		selectedCollaborators() {
			return this.selectedCollaboratorsKeys
				.map((collaboratorKey) => this.availableCollaborators[collaboratorKey])
		},

		/**
		 * @return {boolean}
		 */
		isPublicLinkSelected() {
			return this.selectedCollaborators
				.some(collaborator => collaborator.type === OC.Share.SHARE_TYPE_LINK)

		},
	},

	mounted() {
		this.searchCollaborators()

		const initialCollaborators = this.collaborators.reduce(this.indexCollaborators, {})
		const publicLink = this.collaborators.find(collaborator => collaborator.type === OC.Share.SHARE_TYPE_LINK)

		if (publicLink !== undefined) {
			this.publicLink = publicLink
		}

		this.selectedCollaboratorsKeys = Object.keys(initialCollaborators)
		this.availableCollaborators = {
			[`${this.publicLink.type}:${this.publicLink.id}`]: this.publicLink,
			...this.availableCollaborators,
			...initialCollaborators,
		}
	},

	methods: {
		...mapActions(['updateAlbum']),

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
							OC.Share.SHARE_TYPE_USER,
							OC.Share.SHARE_TYPE_GROUP,
						],
					},
				})

				this.currentSearchResults = response.data.ocs.data
					.map(collaborator => {
						switch (collaborator.source) {
						case 'users':
							return { id: collaborator.id, label: collaborator.label, type: OC.Share.SHARE_TYPE_USER }
						case 'groups':
							return { id: collaborator.id, label: collaborator.label, type: OC.Share.SHARE_TYPE_GROUP }
						default:
							throw new Error(`Invalid collaborator source ${collaborator.source}`)
						}
					})

				this.availableCollaborators = {
					...this.availableCollaborators,
					...this.currentSearchResults.reduce(this.indexCollaborators, {}),
				}
			} catch (error) {
				this.errorFetchingCollaborators = error
				logger.error(t('photos', 'Failed to fetch collaborators list.'), error)
				showError(t('photos', 'Failed to fetch collaborators list.'))
			} finally {
				this.loadingCollaborators = false
			}
		},

		/**
		 * @param {Object<string, Collaborator>} collaborators - Index of collaborators
		 * @param {Collaborator} collaborator - A collaborator
		 */
		indexCollaborators(collaborators, collaborator) {
			return { ...collaborators, [`${collaborator.type}:${collaborator.id}`]: collaborator }
		},

		async createPublicLinkForAlbum() {
			this.selectEntity(`${this.publicLink.type}:${this.publicLink.id}`)
			await this.updateAlbumCollaborators()
		},

		async deletePublicLink() {
			this.unselectEntity(`${this.publicLink.type}:${this.publicLink.id}`)

			this.publicLinkCopied = false

			delete this.availableCollaborators[`${this.publicLink.type}:${this.publicLink.id}`]
			this.publicLink = {
				id: (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).substring(0, 15),
				label: t('photos', 'Public link'),
				type: OC.Share.SHARE_TYPE_LINK,
			}
			this.availableCollaborators[`${this.publicLink.type}:${this.publicLink.id}`] = this.publicLink

			await this.updateAlbumCollaborators()
		},

		async updateAlbumCollaborators() {
			await this.updateAlbum({
				albumName: this.albumName,
				properties: {
					collaborators: this.selectedCollaborators,
				},
			})
		},

		async copyPublicLink() {
			await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${generateUrl(`apps/photos/public/${getCurrentUser().uid}/${this.publicLink.id}`)}`)
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
			height: 500px;
			overflow: scroll;
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

			button {
				margin-left: 8px;
			}
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

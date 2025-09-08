<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="manage-collaborators">
		<h2 class="manage-collaborators__title">
			{{ t('photos', 'Add collaborators') }}
		</h2>

		<form class="manage-collaborators__form" @submit.prevent>
			<NcSelectUsers
				v-model="selectedUsers"
				input-id="sharing-search-input"
				:input-label="t('photos', 'Add people or groups who can edit your album')"
				:loading="loadingCollaborators"
				label="label"
				:filterable="false"
				:placeholder="t('photos', 'Search people or groups')"
				:clear-search-on-blur="() => false"
				:multiple="true"
				:append-to-body="false"
				:options="searchResults"
				@search="searchCollaborators"
				@option:selected="({ key }) => selectEntity(key)">
				{{ t('photos', 'No recommendations. Start typing.') }}
			</NcSelectUsers>
		</form>

		<div class="actions">
			<div v-if="allowPublicLink" class="actions__public-link">
				<template v-if="isPublicLinkSelected && publicLink.id !== ''">
					<NcButton
						class="manage-collaborators__public-link-button"
						:aria-label="t('photos', 'Copy the public link')"
						:title="publicLinkURL"
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
					<NcButton
						variant="tertiary"
						:aria-label="t('photos', 'Delete the public link')"
						@click="deletePublicLink">
						<Close slot="icon" />
					</NcButton>
				</template>
				<NcButton
					v-else
					:disabled="isPublicLinkSelected && publicLink.id === ''"
					:aria-label="t('photos', 'Create public link share')"
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

<script lang='ts'>

import type { AxiosResponse } from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { PropType } from 'vue'
import type { Collaborator } from '../../store/albums.js'

import AccountGroupOutlineSvg from '@mdi/svg/svg/account-group-outline.svg'
import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { translate } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelectUsers from '@nextcloud/vue/components/NcSelectUsers'
import Check from 'vue-material-design-icons/Check.vue'
import Close from 'vue-material-design-icons/Close.vue'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import Earth from 'vue-material-design-icons/Earth.vue'
import FetchCollectionContentMixin from '../../mixins/FetchCollectionContentMixin.js'
import logger from '../../services/logger.js'
import { albumsExtraProps } from '../../store/albums.ts'

interface IUserData {
	key: string
	id: string
	user: string
	displayName: string
	iconSvg: string
	type: 'user' | 'group'
}

interface IUserAutocompleteResult {
	id: string
	label: string
	icon: 'icon-user' | 'icon-group'
	shareWithDisplayNameUnique: string
	source: 'users' | 'groups'
	subline: string
	status: {
		status: string
		message?: string
		icon?: string
		clearAt?: number
	}
}

export default {
	name: 'CollaboratorsSelectionForm',

	components: {
		Close,
		ContentCopy,
		Check,
		Earth,
		NcButton,
		NcSelectUsers,
	},

	mixins: [FetchCollectionContentMixin],

	props: {
		albumName: {
			type: String,
			required: true,
		},

		collaborators: {
			type: Array as PropType<Collaborator[]>,
			default: () => [],
		},

		allowPublicLink: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			availableCollaborators: {} as Record<string, Collaborator>,
			selectedCollaboratorsKeys: [] as string[],
			currentSearchResults: [] as Collaborator[],
			loadingCollaborators: false,
			randomId: Math.random().toString().substring(2, 10),
			publicLinkCopied: false,
			collaboratorTypes: ShareType,
			config: {
				minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0,
			},
		}
	},

	computed: {
		searchResults(): IUserData[] {
			return this.currentSearchResults
				.filter(({ id }) => id !== getCurrentUser()?.uid)
				.map((collaborator) => {
					return {
						key: `${collaborator.type}:${collaborator.id}`,
						id: collaborator.id,
						user: collaborator.id,
						displayName: collaborator.label,
						type: (collaborator.type === ShareType.User ? 'user' : 'group') as 'user' | 'group',
						iconSvg: collaborator.type === ShareType.Group ? AccountGroupOutlineSvg : undefined,
					}
				})
				.filter(({ key }) => !this.selectedCollaboratorsKeys.includes(key))
		},

		selectedCollaborators(): Collaborator[] {
			return this.selectedCollaboratorsKeys
				.map((collaboratorKey) => this.availableCollaborators[collaboratorKey])
		},

		selectedUsers: {
			get(): IUserData[] {
				return this.selectedCollaborators
					.filter(({ type }) => type !== ShareType.Link)
					.map((collaborator) => ({
						key: `${collaborator.type}:${collaborator.id}`,
						id: collaborator.id,
						user: collaborator.id,
						displayName: collaborator.label,
						type: collaborator.type === ShareType.User ? 'user' : 'group',
						iconSvg: collaborator.type === ShareType.Group ? AccountGroupOutlineSvg : undefined,
					}))
			},

			set(newValue: IUserData[]) {
				this.selectedCollaboratorsKeys = newValue.map(({ key }) => key)
			},
		},

		isPublicLinkSelected(): boolean {
			return this.selectedCollaboratorsKeys.includes(`${ShareType.Link}`)
		},

		publicLink(): Collaborator {
			return this.availableCollaborators[ShareType.Link]
		},

		publicLinkURL(): string {
			return `${window.location.protocol}//${window.location.host}${generateUrl(`apps/photos/public/${this.publicLink.id}`)}`
		},

		albumFileName(): string {
			return this.$store.getters.getAlbumName(this.albumName)
		},
	},

	watch: {
		collaborators(collaborators) {
			this.populateCollaborators(collaborators)
		},
	},

	mounted() {
		this.populateCollaborators(this.collaborators)
	},

	methods: {
		/**
		 * Fetch possible collaborators.
		 *
		 * @param query
		 */
		async searchCollaborators(query: string) {
			if (query === undefined) {
				return
			}

			query = query.trim()

			if (query.length < this.config.minSearchStringLength) {
				return
			}

			try {
				this.loadingCollaborators = true
				const response = await axios.get(generateOcsUrl('core/autocomplete/get'), {
					params: {
						search: query,
						itemType: 'share-recipients',
						shareTypes: [
							ShareType.User,
							ShareType.Group,
						],
					},
				}) as AxiosResponse<OCSResponse<IUserAutocompleteResult[]>>

				this.currentSearchResults = response.data.ocs.data
					.map((collaborator) => {
						switch (collaborator.source) {
							case 'users':
								return { id: collaborator.id, label: collaborator.label, type: ShareType.User }
							case 'groups':
								return { id: collaborator.id, label: collaborator.label, type: ShareType.Group }
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
				logger.error(this.t('photos', 'Failed to fetch collaborators list.'), { error })
				showError(this.t('photos', 'Failed to fetch collaborators list.'))
			} finally {
				this.loadingCollaborators = false
			}
		},

		/**
		 * Populate selectedCollaboratorsKeys and availableCollaborators.
		 *
		 * @param collaborators
		 */
		populateCollaborators(collaborators: Collaborator[]) {
			const initialCollaborators = collaborators.reduce(this.indexCollaborators, {})
			this.selectedCollaboratorsKeys = Object.keys(initialCollaborators)
			this.availableCollaborators = {
				3: {
					id: '',
					label: this.t('photos', 'Public link'),
					type: ShareType.Link,
				},

				...this.availableCollaborators,
				...initialCollaborators,
			}
		},

		indexCollaborators(collaborators: Record<string, Collaborator>, collaborator: Collaborator) {
			return { ...collaborators, [`${collaborator.type}${collaborator.type === ShareType.Link ? '' : ':'}${collaborator.type === ShareType.Link ? '' : collaborator.id}`]: collaborator }
		},

		async createPublicLinkForAlbum() {
			this.selectEntity(`${ShareType.Link}`)
			await this.updateAlbumCollaborators()
			await this.fetchCollection(
				this.albumFileName,
				albumsExtraProps,
			)
		},

		async deletePublicLink() {
			this.unselectEntity(`${ShareType.Link}`)
			this.availableCollaborators[3] = {
				id: '',
				label: this.t('photos', 'Public link'),
				type: ShareType.Link,
			}
			this.publicLinkCopied = false
			await this.updateAlbumCollaborators()
		},

		async updateAlbumCollaborators() {
			try {
				await this.$store.dispatch('updateCollection', {
					collectionFileName: this.albumFileName,
					properties: {
						collaborators: this.selectedCollaborators,
					},
				})
			} catch (error) {
				logger.error('[PublicAlbumContent] Error updating album', { error })
				showError(this.t('photos', 'Failed to update album.'))
			}
		},

		async copyPublicLink() {
			await navigator.clipboard.writeText(this.publicLinkURL)
			this.publicLinkCopied = true
			setTimeout(() => {
				this.publicLinkCopied = false
			}, 10000)
		},

		selectEntity(collaboratorKey) {
			if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
				return
			}

			this.selectedCollaboratorsKeys.push(collaboratorKey)
		},

		unselectEntity(collaboratorKey) {
			const index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey)

			if (index === -1) {
				return
			}

			this.selectedCollaboratorsKeys.splice(index, 1)
		},

		t: translate,
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
		flex-grow: 1;

		&__input {
			position: relative;
			display: block;

			input {
				width: 100%;
				padding-inline-start: 34px;
			}

			.loading-icon {
				position: absolute;
				top: calc(36px / 2 - 20px / 2);
				inset-inline-end: 8px;
			}
		}

		&__list {
			padding: 8px;
			height: 350px;
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
		margin-top: 32px;
		flex-grow: 1;

		&__item {
			border-radius: var(--border-radius-pill);
			padding:  0 8px;

			&:hover {
				background: var(--color-background-dark);
			}

			:deep(.option) {
				gap: 4px;
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
				margin-inline-start: 8px;
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

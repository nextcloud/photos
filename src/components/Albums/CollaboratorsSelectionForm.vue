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
				inputId="sharing-search-input"
				:inputLabel="t('photos', 'Add people or groups who can edit your album')"
				:loading="loadingCollaborators"
				:placeholder="t('photos', 'Search people or groups')"
				:multiple="true"
				:options="searchResults"
				@search="searchCollaborators">
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
						<template #icon>
							<Close />
						</template>
					</NcButton>
				</template>
				<NcButton
					v-else
					:disabled="isPublicLinkSelected && publicLink.id === ''"
					:aria-label="t('photos', 'Create public link share')"
					class="manage-collaborators__public-link-button"
					@click="createPublicLinkForAlbum">
					<template #icon>
						<Earth />
					</template>
					{{ t('photos', 'Share via public link') }}
				</NcButton>
			</div>

			<div class="actions__slot">
				<slot :collaborators="selectedCollaborators" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { AxiosResponse } from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { Collaborator } from '../../store/albums.ts'

import AccountGroupOutlineSvg from '@mdi/svg/svg/account-group-outline.svg'
import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import { computed, onMounted, ref, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelectUsers from '@nextcloud/vue/components/NcSelectUsers'
import Check from 'vue-material-design-icons/Check.vue'
import Close from 'vue-material-design-icons/Close.vue'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import Earth from 'vue-material-design-icons/Earth.vue'
import { useFetchCollectionContent } from '../../composables/useFetchCollectionContent.ts'
import { logger } from '../../services/logger.ts'
import { albumsExtraProps } from '../../store/albums.ts'
import { useAlbumsStore } from '../../store/albums.ts'
import { useCollectionsStore } from '../../store/collections.ts'

interface IUserData {
	key: string
	id: string
	user: string
	displayName: string
	iconSvg?: string
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

const props = withDefaults(defineProps<{
	albumName: string
	collaborators?: Collaborator[]
	allowPublicLink?: boolean
}>(), {
	collaborators: () => [],
	allowPublicLink: true,
})

const albumsStore = useAlbumsStore()
const collectionsStore = useCollectionsStore()
const { fetchCollection } = useFetchCollectionContent()

const availableCollaborators = ref<Record<string, Collaborator>>({})
const selectedCollaboratorsKeys = ref<string[]>([])
const currentSearchResults = ref<Collaborator[]>([])
const loadingCollaborators = ref(false)
// Sequence number of the latest lookup, to tell the answers of the ones before it apart.
const searchSequence = ref(0)
const publicLinkCopied = ref(false)
const config = ref({
	minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0,
})

const searchResults = computed<IUserData[]>(() => {
	return currentSearchResults.value
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
		.filter(({ key }) => !selectedCollaboratorsKeys.value.includes(key))
})

const selectedCollaborators = computed<Collaborator[]>(() => {
	return selectedCollaboratorsKeys.value
		.map((collaboratorKey) => availableCollaborators.value[collaboratorKey])
})

const selectedUsers = computed<IUserData[]>({
	get() {
		return selectedCollaborators.value
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
		selectedCollaboratorsKeys.value = newValue.map(({ key }) => key)
	},
})

const isPublicLinkSelected = computed<boolean>(() => selectedCollaboratorsKeys.value.includes(`${ShareType.Link}`))

const publicLink = computed<Collaborator>(() => availableCollaborators.value[ShareType.Link])

const publicLinkURL = computed<string>(() => `${window.location.protocol}//${window.location.host}${generateUrl(`apps/photos/public/${publicLink.value.id}`)}`)

const albumFileName = computed<string>(() => albumsStore.getAlbumName(props.albumName))

watch(() => props.collaborators, (collaborators) => {
	populateCollaborators(collaborators)
})

/**
 * Fetch possible collaborators.
 *
 * @param query
 */
async function searchCollaborators(query: string) {
	if (query === undefined) {
		return
	}

	query = query.trim()

	if (query.length < config.value.minSearchStringLength) {
		return
	}

	const sequence = ++searchSequence.value

	try {
		loadingCollaborators.value = true
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

		if (sequence !== searchSequence.value) {
			return
		}

		currentSearchResults.value = response.data.ocs.data
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

		availableCollaborators.value = {
			...availableCollaborators.value,
			...currentSearchResults.value.reduce(indexCollaborators, {}),
		}
	} catch (error) {
		if (sequence !== searchSequence.value) {
			return
		}

		logger.error(t('photos', 'Failed to fetch collaborators list.'), { error })
		showError(t('photos', 'Failed to fetch collaborators list.'))
	} finally {
		if (sequence === searchSequence.value) {
			loadingCollaborators.value = false
		}
	}
}

/**
 * Populate selectedCollaboratorsKeys and availableCollaborators.
 *
 * @param collaborators
 */
function populateCollaborators(collaborators: Collaborator[]) {
	const initialCollaborators = collaborators.reduce(indexCollaborators, {})
	selectedCollaboratorsKeys.value = Object.keys(initialCollaborators)
	availableCollaborators.value = {
		3: {
			id: '',
			label: t('photos', 'Public link'),
			type: ShareType.Link,
		},

		...availableCollaborators.value,
		...initialCollaborators,
	}
}

function indexCollaborators(collaborators: Record<string, Collaborator>, collaborator: Collaborator) {
	return { ...collaborators, [`${collaborator.type}${collaborator.type === ShareType.Link ? '' : ':'}${collaborator.type === ShareType.Link ? '' : collaborator.id}`]: collaborator }
}

async function createPublicLinkForAlbum() {
	selectEntity(`${ShareType.Link}`)
	await updateAlbumCollaborators()
	await fetchCollection(
		albumFileName.value,
		albumsExtraProps,
	)
}

async function deletePublicLink() {
	unselectEntity(`${ShareType.Link}`)
	availableCollaborators.value[3] = {
		id: '',
		label: t('photos', 'Public link'),
		type: ShareType.Link,
	}
	publicLinkCopied.value = false
	await updateAlbumCollaborators()
}

async function updateAlbumCollaborators() {
	try {
		await collectionsStore.updateCollection(albumFileName.value, { collaborators: selectedCollaborators.value })
	} catch (error) {
		logger.error('[PublicAlbumContent] Error updating album', { error })
		showError(t('photos', 'Failed to update album.'))
	}
}

async function copyPublicLink() {
	await navigator.clipboard.writeText(publicLinkURL.value)
	publicLinkCopied.value = true
	setTimeout(() => {
		publicLinkCopied.value = false
	}, 10000)
}

function selectEntity(collaboratorKey: string) {
	if (selectedCollaboratorsKeys.value.includes(collaboratorKey)) {
		return
	}

	selectedCollaboratorsKeys.value.push(collaboratorKey)
}

function unselectEntity(collaboratorKey: string) {
	const index = selectedCollaboratorsKeys.value.indexOf(collaboratorKey)

	if (index === -1) {
		return
	}

	selectedCollaboratorsKeys.value.splice(index, 1)
}

onMounted(() => {
	populateCollaborators(props.collaborators)
})
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

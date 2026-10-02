<template>
	<div class="manage-collaborators">
		<div class="actions">
			<h2 class="sharing-link-list-caption">
				{{ t('photos', 'Link to copy') }}
			</h2>

			<span>{{ albumName }}</span>

			<div v-if="allowPublicLink" class="actions__public-link">
				<div class="actions__sharing-entry">
					<span class="sharing-entry__title">{{ title }}</span>
					<div class="sharing-link">
						{{ canViewText }}
					</div>
				</div>

				<template v-if="hasPublicLink">
					<NcButton
						:aria-label="t('photos', 'Copy the public link')"
						:title="publicLinkURL"
						:variant="publicLinkCopied ? 'success' : 'secondary'"
						@click="copyPublicLink">
						<template #icon>
							<span :class="publicLinkCopied ? 'icon-checkmark' : 'icon-clipboard'" class="icon" />
						</template>
					</NcButton>

					<NcButton
						:aria-label="t('photos', 'Delete the public link')"
						@click="deletePublicLink">
						<template #icon>
							<span class="icon icon-delete" />
						</template>
					</NcButton>
				</template>

				<NcButton
					v-else
					:aria-label="t('photos', 'Create public link share')"
					@click="createPublicLink">
					{{ t('photos', 'Create new link') }}
				</NcButton>
			</div>

			<div class="actions__slot">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Collaborator } from '../../store/albums.js'
import { showError } from '@nextcloud/dialogs'
import { translate } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { ShareType } from '@nextcloud/sharing'
import NcButton from '@nextcloud/vue/components/NcButton'
import CalendarMonthIcon from 'vue-material-design-icons/CalendarMonth.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import EyeIcon from 'vue-material-design-icons/EyeCircleOutline.vue'
import FetchCollectionContentMixin from '../../mixins/FetchCollectionContentMixin.ts'
import { logger } from '../../services/logger.ts'
import { albumsExtraProps, albumsPrefix } from '../../store/albums.ts'
import { useCollectionsStore } from '../../store/collections.ts'

export default {
	name: 'AlbumShare',
	components: {
		NcButton,
		EyeIcon,
		ChevronRightIcon,
		CalendarMonthIcon,
	},

	mixins: [FetchCollectionContentMixin],

	props: {
		albumName: {
			type: String,
			required: true,
		},
		allowPublicLink: {
			type: Boolean,
			default: true,
		},
		collaborators: {
			type: Array as PropType<Collaborator[]>,
			default: () => [],
		},
	},

    setup() {
        return {
            collectionsStore: useCollectionsStore(),
        }
    },

	data() {
		return {
			publicLinkId: '',
			publicLinkCopied: false,
			availableCollaborators: {} as Record<string, Collaborator>,
		}
	},

	computed: {
		hasPublicLink(): boolean {
			return this.publicLinkId !== ''
		},
		publicLinkURL(): string {
			return `${window.location.protocol}//${window.location.host}${generateUrl(`apps/photos/public/${this.publicLinkId}`)}`
		},
		title(): string {
			return this.t('files_sharing', 'Share link')
		},
		canViewText(): string {
			return this.t('nmcsharing', 'Anyone with the link can only view')
		},
        albumFileName(): string {
            return `${albumsPrefix}/${this.albumName}`
        },
		publicLink(): Collaborator {
			return this.availableCollaborators[ShareType.Link]
		},
	},

	watch: {
		collaborators(collaborators) {
			const link = (collaborators || []).find((c: Collaborator) => c.type === ShareType.Link)
			this.publicLinkId = link ? link.id : ''
			this.availableCollaborators = {
				...this.availableCollaborators,
				[ShareType.Link]: {
					id: this.publicLinkId,
					label: this.t('photos', 'Public link'),
					type: ShareType.Link,
				},
			}
		},
	},

	mounted() {
		const link = (this.collaborators || []).find((c: Collaborator) => c.type === ShareType.Link)
		if (link) {
			this.publicLinkId = link.id
			this.availableCollaborators = {
				...this.availableCollaborators,
				[ShareType.Link]: {
					id: this.publicLinkId,
					label: this.t('photos', 'Public link'),
					type: ShareType.Link,
				},
			}
		}
	},

	methods: {
		async createPublicLink() {
			try {
				const newCollaborators = [
					...this.collaborators.filter((c: Collaborator) => c.type !== ShareType.Link),
					{ id: '', label: this.t('photos', 'Public link'), type: ShareType.Link },
				]
                await this.collectionsStore.updateCollection(
                    this.albumFileName,
                    { collaborators: newCollaborators },
                )
				const collection = await this.fetchCollection(this.albumFileName, albumsExtraProps)
				const link = (collection?.attributes?.collaborators || []).find((c: Collaborator) => c.type === ShareType.Link)
				this.publicLinkId = link ? link.id : ''
				this.availableCollaborators = {
					...this.availableCollaborators,
					[ShareType.Link]: {
						id: this.publicLinkId,
						label: this.t('photos', 'Public link'),
						type: ShareType.Link,
					},
				}
			} catch (error) {
				logger.error('[AlbumShare] Error creating public link', { error })
				showError(this.t('photos', 'Failed to create public link.'))
			}
		},
		async deletePublicLink() {
			try {
				const newCollaborators = this.collaborators.filter((c: Collaborator) => c.type !== ShareType.Link)
                await this.collectionsStore.updateCollection(
                    this.albumFileName,
                    { collaborators: newCollaborators },
                )
				await this.fetchCollection(this.albumFileName, albumsExtraProps)
				this.publicLinkId = ''
				this.publicLinkCopied = false
				this.availableCollaborators[ShareType.Link] = { id: '', label: this.t('photos', 'Public link'), type: ShareType.Link }
			} catch (error) {
				logger.error('[AlbumShare] Error deleting public link', { error })
				showError(this.t('photos', 'Failed to delete public link.'))
			}
		},
		async copyPublicLink() {
			await navigator.clipboard.writeText(this.publicLinkURL)
			this.publicLinkCopied = true
			setTimeout(() => (this.publicLinkCopied = false), 3000)
		},
		t: translate,
	},
}
</script>

<style scoped>
.manage-collaborators {
	padding: 20px;
}

.actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

.actions__public-link {
	display: flex;
	align-items: center;
	gap: 8px;
}

.actions__slot {
	margin-inline-start: auto;
}
</style>

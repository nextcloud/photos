<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photo-actions" :class="{ 'photo-actions--open': menuOpen }" @click.stop>
		<NcActions
			:aria-label="t('photos', 'Actions for {name}', { name: photo.basename })"
			force-menu
			:open="menuOpen"
			@update:open="menuOpen = $event">
			<template #icon>
				<DotsVertical :size="20" />
			</template>

			<NcActionButton close-after-click @click="metadataShown = true">
				<template #icon>
					<InformationOutline :size="20" />
				</template>
				{{ t('photos', 'View metadata') }}
			</NcActionButton>

			<NcActionButton v-if="canEdit" close-after-click @click="metadataEditShown = true">
				<template #icon>
					<PencilOutline :size="20" />
				</template>
				{{ t('photos', 'Edit metadata') }}
			</NcActionButton>

			<NcActionButton v-if="isLoggedIn" close-after-click @click="toggleFavorite">
				<template #icon>
					<Star v-if="photo.favorite" :size="20" />
					<StarOutline v-else :size="20" />
				</template>
				{{ photo.favorite
					? t('photos', 'Remove from favorites')
					: t('photos', 'Add to favorites') }}
			</NcActionButton>

			<NcActionButton v-if="canTag" close-after-click @click="tagsShown = true">
				<template #icon>
					<TagMultipleOutline :size="20" />
				</template>
				{{ t('photos', 'Manage tags') }}
			</NcActionButton>

			<NcActionButton v-if="isLoggedIn" close-after-click @click="albumPickerShown = true">
				<template #icon>
					<ImageMultipleOutline :size="20" />
				</template>
				{{ t('photos', 'Add to album') }}
			</NcActionButton>

			<NcActionButton v-if="canShare" close-after-click @click="share">
				<template #icon>
					<ShareVariantOutline :size="20" />
				</template>
				{{ t('photos', 'Share') }}
			</NcActionButton>

			<NcActionSeparator v-if="canDelete" />

			<NcActionButton v-if="canDelete" close-after-click @click="deleteConfirmationShown = true">
				<template #icon>
					<TrashCanOutline :size="20" />
				</template>
				{{ t('photos', 'Delete') }}
			</NcActionButton>
		</NcActions>

		<PhotoMetadataDialog
			v-if="metadataShown"
			:photo="photo"
			@close="metadataShown = false" />

		<PhotoMetadataEditDialog
			v-if="metadataEditShown"
			:photo="photo"
			@close="metadataEditShown = false" />

		<PhotoTagsDialog
			v-if="tagsShown"
			:photo="photo"
			@close="tagsShown = false" />

		<NcModal
			v-if="albumPickerShown"
			:label-id="`album-picker-${photo.fileid}`"
			@close="albumPickerShown = false">
			<AlbumPicker @album-picked="addToAlbum" />
		</NcModal>

		<NcDialog
			v-if="deleteConfirmationShown"
			:name="t('photos', 'Delete photo')"
			@update:open="deleteConfirmationShown = false">
			<p>{{ t('photos', 'Are you sure you want to move "{name}" to the trash?', { name: photo.basename }) }}</p>

			<template #actions>
				<NcButton variant="tertiary" @click="deleteConfirmationShown = false">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="error" @click="confirmDelete">
					{{ t('photos', 'Move to trash') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script lang="ts" setup>
import type { Album } from '../store/albums.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { Permission } from '@nextcloud/files'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, ref } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcModal from '@nextcloud/vue/components/NcModal'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import InformationOutline from 'vue-material-design-icons/InformationOutline.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import TagMultipleOutline from 'vue-material-design-icons/TagMultipleOutline.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import AlbumPicker from './Albums/AlbumPicker.vue'
import PhotoMetadataDialog from './PhotoMetadataDialog.vue'
import PhotoMetadataEditDialog from './PhotoMetadataEditDialog.vue'
import PhotoTagsDialog from './PhotoTagsDialog.vue'
import areTagsInstalled from '../services/AreTagsInstalled.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'

const props = defineProps<{
	/** Photo the actions apply to. */
	photo: PhotoTarget
}>()

// The photo is gone from the server once it is deleted, but each view keeps
// its own list of the photos it shows and has to drop it from there.
const emit = defineEmits<{
	(event: 'deleted', photo: PhotoTarget): void
}>()

const menuOpen = ref(false)
const metadataShown = ref(false)
const metadataEditShown = ref(false)
const tagsShown = ref(false)
const albumPickerShown = ref(false)
const deleteConfirmationShown = ref(false)

// Public shares are browsed without an account, the actions writing anything
// have nowhere to write to.
const isLoggedIn = getCurrentUser() !== null

// Writing is the permission to change the content of the photo, which is what
// the server checks before it stores corrected metadata.
const canEdit = computed(() => isLoggedIn && (props.photo.permissions & Permission.WRITE) !== 0)
const canShare = computed(() => isLoggedIn && (props.photo.permissions & Permission.SHARE) !== 0)
const canDelete = computed(() => isLoggedIn && (props.photo.permissions & Permission.DELETE) !== 0)

// Tags belong to their own app, and the server refuses to put one on a photo
// the account cannot write to.
const canTag = computed(() => areTagsInstalled && canEdit.value)

// The sharing UI lives in the details sidebar of the Files app, and its API
// needs a navigation context which the photos app does not set up, so the user
// is sent there with the sidebar already open.
function share(): void {
	window.location.href = generateUrl('/apps/files/files/{fileid}?opendetails=true', { fileid: props.photo.fileid })
}

async function toggleFavorite(): Promise<void> {
	const favorite = !props.photo.favorite

	try {
		await store.dispatch('setPhotoFavorite', { photo: props.photo, favorite })
	} catch (error) {
		logger.error('Error setting the favorite state of a photo', { error, filename: props.photo.basename })
		showError(favorite
			? t('photos', 'Failed to add {fileName} to the favorites', { fileName: props.photo.basename })
			: t('photos', 'Failed to remove {fileName} from the favorites', { fileName: props.photo.basename }))
	}
}

async function addToAlbum(album: Album): Promise<void> {
	albumPickerShown.value = false

	await store.dispatch('addFilesToCollection', {
		collectionFileName: album.root + album.path,
		fileIdsToAdd: [props.photo.fileid.toString()],
	})
}

async function confirmDelete(): Promise<void> {
	deleteConfirmationShown.value = false

	try {
		await store.dispatch('deletePhoto', props.photo)
		emit('deleted', props.photo)
	} catch (error) {
		logger.error('Error deleting a photo', { error, filename: props.photo.basename })
		showError(t('photos', 'Failed to delete {fileName}', { fileName: props.photo.basename }))
	}
}
</script>

<style lang="scss" scoped>
.photo-actions {
	position: absolute;
	z-index: 5; // above the preview layers
	inset-block-start: calc(var(--default-grid-baseline) * 2);
	inset-inline-start: calc(var(--default-grid-baseline) * 2);
	opacity: 0;
	transition: opacity var(--animation-quick) ease-out;

	// The menu is detached from the tile, so hovering it does not keep the
	// tile hovered: the trigger has to stay visible on its own.
	&--open {
		opacity: 1;
	}

	// The button sits on top of the photo, which can be of any color.
	:deep(.button-vue) {
		background-color: rgba(0, 0, 0, 0.4);
		color: #fff;

		&:hover,
		&:focus-visible {
			background-color: rgba(0, 0, 0, 0.6);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.photo-actions {
		transition: none;
	}
}
</style>

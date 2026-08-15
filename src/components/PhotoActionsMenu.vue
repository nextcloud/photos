<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photo-actions" :class="{ 'photo-actions--open': menuOpen }" @click.stop>
		<NcActions
			:aria-label="t('photos', 'Actions for {name}', { name: file.basename })"
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

			<NcActionButton close-after-click @click="metadataEditShown = true">
				<template #icon>
					<PencilOutline :size="20" />
				</template>
				{{ t('photos', 'Edit metadata') }}
			</NcActionButton>

			<NcActionButton close-after-click @click="emit('request-add-to-album', file)">
				<template #icon>
					<ImageMultipleOutline :size="20" />
				</template>
				{{ t('photos', 'Add to album') }}
			</NcActionButton>

			<NcActionButton close-after-click @click="emit('request-share', file)">
				<template #icon>
					<ShareVariantOutline :size="20" />
				</template>
				{{ t('photos', 'Share') }}
			</NcActionButton>

			<NcActionSeparator />

			<NcActionButton close-after-click @click="deleteConfirmationShown = true">
				<template #icon>
					<TrashCanOutline :size="20" />
				</template>
				{{ t('photos', 'Delete') }}
			</NcActionButton>
		</NcActions>

		<NcDialog
			v-if="metadataShown"
			:name="t('photos', 'Photo metadata')"
			@update:open="metadataShown = false">
			<NcLoadingIcon v-if="exifEntries === undefined" :size="32" class="photo-actions__loading" />

			<dl v-else class="photo-actions__metadata">
				<div class="photo-actions__metadata__entry">
					<dt>{{ t('photos', 'Filename') }}</dt>
					<dd>{{ file.basename }}</dd>
				</div>
				<div v-for="entry in exifEntries" :key="entry.label" class="photo-actions__metadata__entry">
					<dt>{{ entry.label }}</dt>
					<dd>{{ entry.value }}</dd>
				</div>
			</dl>

			<!-- EXIF is optional, so an empty summary is a normal outcome rather than an error. -->
			<p v-if="exifEntries?.length === 0" class="photo-actions__metadata__empty">
				{{ t('photos', 'This photo carries no camera metadata.') }}
			</p>
		</NcDialog>

		<PhotoMetadataEditDialog
			v-if="metadataEditShown"
			:file="file"
			@close="metadataEditShown = false" />

		<NcDialog
			v-if="deleteConfirmationShown"
			:name="t('photos', 'Delete photo')"
			@update:open="deleteConfirmationShown = false">
			<p>{{ t('photos', 'Are you sure you want to move "{name}" to the trash?', { name: file.basename }) }}</p>

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
import type { PhotoFile } from '../store/files.ts'
import type { ExifEntry } from '../utils/exif.ts'

import { translate as t } from '@nextcloud/l10n'
import { ref, watch } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import InformationOutline from 'vue-material-design-icons/InformationOutline.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import PhotoMetadataEditDialog from './PhotoMetadataEditDialog.vue'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { getExifSummary } from '../utils/exif.ts'

const props = defineProps<{
	/** Photo the actions apply to. */
	file: PhotoFile
}>()

// Adding to an album, sharing and deleting need the surrounding view: it owns
// the album picker, the file list and the selection.
const emit = defineEmits<{
	(event: 'request-add-to-album', file: PhotoFile): void
	(event: 'request-share', file: PhotoFile): void
	(event: 'request-delete', file: PhotoFile): void
}>()

const menuOpen = ref(false)
const metadataShown = ref(false)
const metadataEditShown = ref(false)
const deleteConfirmationShown = ref(false)

/** Metadata of the photo, `undefined` while it is being fetched. */
const exifEntries = ref<ExifEntry[] | undefined>()

// The EXIF properties are not part of the file listings, so they are only
// fetched once the user asks for them.
watch(metadataShown, async (shown) => {
	if (!shown) {
		return
	}

	exifEntries.value = undefined
	exifEntries.value = getExifSummary(await fetchPhotoExif(props.file))
})

function confirmDelete(): void {
	deleteConfirmationShown.value = false
	emit('request-delete', props.file)
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

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}

	&__metadata {
		margin: 0;

		&__entry {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: calc(var(--default-grid-baseline) * 4);
		}

		dt {
			color: var(--color-text-maxcontrast);
		}

		dd {
			margin: 0;
			font-variant-numeric: tabular-nums;
			word-break: break-all;
		}

		&__empty {
			color: var(--color-text-maxcontrast);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.photo-actions {
		transition: none;
	}
}
</style>

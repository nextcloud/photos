<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Per-photo overflow menu. Renders a 3-dot button on the tile that
	opens an actions popup with: view metadata (EXIF), add to album,
	share, delete. Visible on hover / focus / when the menu is open;
	hidden otherwise so the tile remains visually quiet.

	Action semantics:
	- "View metadata" is handled inline (we own the dialog). Reuses the
	  same EXIF lines logic as the slideshow.
	- "Add to album" emits `request-add-to-album` to the parent, which
	  reuses the existing AlbumPicker flow with this file pre-selected.
	- "Share" emits `request-share` to the parent, which opens the NC
	  Files sidebar (its sharing tab handles the heavy lifting).
	- "Delete" prompts via NcDialog and emits `request-delete` once the
	  user confirms.
-->

<template>
	<div class="photo-actions" @click.stop @pointerdown.stop>
		<NcActions
			:aria-label="t('photos', 'Photo actions')"
			:forceMenu="true">
			<template #icon>
				<DotsVertical :size="20" />
			</template>

			<NcActionButton
				:closeAfterClick="true"
				@click="onViewMetadata">
				<template #icon>
					<InformationOutline :size="20" />
				</template>
				{{ t('photos', 'View metadata') }}
			</NcActionButton>

			<NcActionButton
				:closeAfterClick="true"
				@click="onAddToAlbum">
				<template #icon>
					<ImageMultipleOutline :size="20" />
				</template>
				{{ t('photos', 'Add to album') }}
			</NcActionButton>

			<NcActionButton
				:closeAfterClick="true"
				@click="onShare">
				<template #icon>
					<ShareVariantOutline :size="20" />
				</template>
				{{ t('photos', 'Share') }}
			</NcActionButton>

			<NcActionSeparator />

			<NcActionButton
				:closeAfterClick="true"
				@click="onDelete">
				<template #icon>
					<DeleteOutline :size="20" />
				</template>
				{{ t('photos', 'Delete') }}
			</NcActionButton>
		</NcActions>

		<!-- Inline EXIF dialog. Reuses the same field-selection logic as
			the slideshow overlay; renders an empty-state message when the
			photo has no EXIF data so the dialog is still informative. -->
		<NcDialog
			v-if="metadataDialogOpen"
			:name="t('photos', 'Photo metadata')"
			size="small"
			@closing="metadataDialogOpen = false">
			<dl v-if="exifLines.length > 0" class="photo-actions__exif">
				<template v-for="line in exifLines" :key="line.label">
					<dt>{{ line.label }}</dt>
					<dd>{{ line.value }}</dd>
				</template>
				<dt>{{ t('photos', 'Filename') }}</dt>
				<dd>{{ file.basename }}</dd>
			</dl>
			<p v-else class="photo-actions__exif__empty">
				{{ t('photos', 'No camera metadata is available for this photo.') }}
			</p>
		</NcDialog>

		<!-- Confirm before destructive delete. -->
		<NcDialog
			v-if="confirmDeleteOpen"
			:name="t('photos', 'Delete photo')"
			size="small"
			@closing="confirmDeleteOpen = false">
			<p>
				{{ t('photos', 'Are you sure you want to move "{name}" to the trash?', { name: file.basename }) }}
			</p>
			<template #actions>
				<NcButton variant="tertiary" @click="confirmDeleteOpen = false">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="error" @click="confirmDelete">
					{{ t('photos', 'Move to trash') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { PhotoFile } from '../store/files.ts'

import { translate as t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import InformationOutline from 'vue-material-design-icons/InformationOutline.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'

export default defineComponent({
	name: 'PhotoActionsMenu',

	components: {
		DeleteOutline,
		DotsVertical,
		ImageMultipleOutline,
		InformationOutline,
		NcActionButton,
		NcActionSeparator,
		NcActions,
		NcButton,
		NcDialog,
		ShareVariantOutline,
	},

	props: {
		file: {
			type: Object as PropType<PhotoFile>,
			required: true,
		},
	},

	emits: ['request-add-to-album', 'request-share', 'request-delete'],

	data() {
		return {
			metadataDialogOpen: false,
			confirmDeleteOpen: false,
		}
	},

	computed: {
		// Same field selection as Slideshow.exifLines — kept duplicated
		// rather than pulling it into a shared util because the surface
		// is small and a shared "exifLinesFor" helper would create an
		// import dependency we can't justify yet. Refactor when a third
		// caller appears.
		exifLines(): { label: string, value: string }[] {
			const attrs = this.file.attributes as Record<string, unknown>
			const exif = (attrs['metadata-photos-exif'] ?? {}) as Record<string, string | number>
			const ifd0 = (attrs['metadata-photos-ifd0'] ?? {}) as Record<string, string | number>

			const lines: { label: string, value: string }[] = []

			if (ifd0.Make || ifd0.Model) {
				const make = (ifd0.Make ?? '').toString().trim()
				const model = (ifd0.Model ?? '').toString().trim()
				const camera = [make, model].filter(Boolean).join(' ')
				if (camera.length > 0) {
					lines.push({ label: t('photos', 'Camera'), value: camera })
				}
			}

			if (exif.FNumber) {
				lines.push({ label: t('photos', 'Aperture'), value: `ƒ/${exif.FNumber}` })
			}

			if (exif.FocalLength) {
				lines.push({ label: t('photos', 'Focal length'), value: `${exif.FocalLength} mm` })
			}

			if (exif.ExposureTime) {
				lines.push({ label: t('photos', 'Exposure'), value: `${exif.ExposureTime} s` })
			}

			if (exif.ISOSpeedRatings) {
				lines.push({ label: t('photos', 'ISO'), value: String(exif.ISOSpeedRatings) })
			}

			return lines
		},
	},

	methods: {
		t,

		onViewMetadata() {
			this.metadataDialogOpen = true
		},

		onAddToAlbum() {
			this.$emit('request-add-to-album', this.file)
		},

		onShare() {
			this.$emit('request-share', this.file)
		},

		onDelete() {
			this.confirmDeleteOpen = true
		},

		confirmDelete() {
			this.confirmDeleteOpen = false
			this.$emit('request-delete', this.file)
		},
	},
})
</script>

<style lang="scss" scoped>
.photo-actions {
	position: absolute;
	top: 4px;
	inset-inline-start: 4px;
	z-index: 3;

	// Drop-shadow on the button so it's legible against any photo.
	:deep(.button-vue) {
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		backdrop-filter: blur(8px);

		&:hover, &:focus-visible {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	&__exif {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 8px 16px;
		margin: 0;

		dt {
			text-transform: uppercase;
			letter-spacing: 0.06em;
			font-size: 0.75rem;
			font-weight: 600;
			color: var(--color-text-maxcontrast);
			align-self: center;
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
</style>

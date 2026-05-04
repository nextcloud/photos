<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Per-photo overflow menu. Renders a 3-dot button on the tile that
	opens an actions popup. Visible on hover / focus / when the menu
	is open; hidden otherwise so the tile remains visually quiet.

	Action ownership:
	- "View metadata" is handled inline (we own the dialog). Reuses the
	  same EXIF lines logic as the slideshow.
	- "Favorite" / "Unfavorite" is handled inline via the photos store's
	  `toggleFavoriteForFiles` action — same DAV PROPPATCH the bulk-
	  selection ActionFavorite uses, no parent involvement needed.
	- "Manage tags…" is handled inline via the systemtags-relations
	  DAV tree (services/PhotoTagService.ts). Opens a dialog with a
	  checkbox list of the user's tags + a "create tag" input.
	- "Add to album" emits `request-add-to-album` to the parent — the
	  album-picker UI is owned by the surrounding view (TimelineView,
	  FoldersView, etc.) because each has its own picker context.
	- "Share" emits `request-share` to the parent.
	- "Delete" prompts via NcDialog and emits `request-delete` once the
	  user confirms.

	The `file` prop accepts a structurally-minimal type — fileid +
	basename + optional attributes — so the same component can render
	on both the rich PhotoFile from the timeline and the lighter
	FoldersNode from the folders view. EXIF / favorite UI gracefully
	degrades when the corresponding attributes are absent (e.g.
	"View metadata" still shows the filename).
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
				@click="onEditMetadata">
				<template #icon>
					<PencilOutline :size="20" />
				</template>
				{{ t('photos', 'Edit metadata…') }}
			</NcActionButton>

			<NcActionButton
				:closeAfterClick="true"
				@click="onToggleFavorite">
				<template #icon>
					<Star v-if="isFavorite" :size="20" />
					<StarOutline v-else :size="20" />
				</template>
				{{ isFavorite
					? t('photos', 'Remove from favorites')
					: t('photos', 'Add to favorites') }}
			</NcActionButton>

			<NcActionButton
				:closeAfterClick="true"
				@click="onManageTags">
				<template #icon>
					<TagMultipleOutline :size="20" />
				</template>
				{{ t('photos', 'Manage tags…') }}
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

		<!-- Per-user EXIF editor dialog. Mounted only when the user
			opened it so the API call doesn't fire for every tile in
			the grid. -->
		<MetadataEditDialog
			v-if="editDialogOpen"
			:fileId="fileIdNumber"
			:initialTakenAt="initialTakenAt"
			:initialGpsLat="initialGpsLat"
			:initialGpsLng="initialGpsLng"
			@close="editDialogOpen = false" />

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

		<!-- Tag picker. Opens on "Manage tags…", lists user-visible
			system tags with a checkbox per tag. Editing is "live":
			toggling the checkbox immediately fires assign / unassign
			against systemtags-relations, no separate Save step. The
			"create tag" input at the bottom creates + assigns in one
			go, then refreshes the list. -->
		<NcDialog
			v-if="tagDialogOpen"
			:name="t('photos', 'Manage tags')"
			size="small"
			@closing="tagDialogOpen = false">
			<div v-if="tagsLoading" class="photo-actions__tags__loading">
				<NcLoadingIcon :size="20" />
			</div>
			<template v-else>
				<p v-if="tagOptions.length === 0" class="photo-actions__tags__empty">
					{{ t('photos', 'No tags exist yet — type below to create the first one.') }}
				</p>
				<ul v-else class="photo-actions__tags__list">
					<li
						v-for="tag in tagOptions"
						:key="tag.id">
						<NcCheckboxRadioSwitch
							:modelValue="assignedIds.has(tag.id)"
							:disabled="busyTagIds.has(tag.id) || !tag.canAssign"
							@update:modelValue="(v) => onToggleTag(tag, v)">
							{{ tag.displayName }}
						</NcCheckboxRadioSwitch>
					</li>
				</ul>
			</template>

			<form class="photo-actions__tags__create" @submit.prevent="onCreateTag">
				<NcTextField
					v-model="newTagName"
					:label="t('photos', 'Create new tag')"
					:placeholder="t('photos', 'Tag name')"
					:disabled="creatingTag" />
				<NcButton
					type="submit"
					variant="primary"
					:disabled="newTagName.trim() === '' || creatingTag">
					<template #icon>
						<NcLoadingIcon v-if="creatingTag" :size="16" />
						<Plus v-else :size="16" />
					</template>
					{{ t('photos', 'Add') }}
				</NcButton>
			</form>
		</NcDialog>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { PhotoTag } from '../services/PhotoTagService.ts'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import InformationOutline from 'vue-material-design-icons/InformationOutline.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import TagMultipleOutline from 'vue-material-design-icons/TagMultipleOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import MetadataEditDialog from './MetadataEditDialog.vue'
import logger from '../services/logger.ts'
import {
	assignTagToFile,
	createTag,
	fetchAllTags,
	fetchTagsForFile,
	unassignTagFromFile,
} from '../services/PhotoTagService.ts'

// Minimum-viable file shape. PhotoFile (timeline) and FoldersNode
// (folder view) both satisfy this — the actions menu doesn't depend
// on full attribute coverage; missing fields just gracefully
// degrade.
export interface ActionMenuFile {
	fileid: number | string
	basename: string
	path?: string
	attributes?: Record<string, unknown>
}

export default defineComponent({
	name: 'PhotoActionsMenu',

	components: {
		DeleteOutline,
		DotsVertical,
		ImageMultipleOutline,
		InformationOutline,
		MetadataEditDialog,
		NcActionButton,
		NcActionSeparator,
		NcActions,
		NcButton,
		NcCheckboxRadioSwitch,
		NcDialog,
		NcLoadingIcon,
		NcTextField,
		PencilOutline,
		Plus,
		ShareVariantOutline,
		Star,
		StarOutline,
		TagMultipleOutline,
	},

	props: {
		file: {
			type: Object as PropType<ActionMenuFile>,
			required: true,
		},
	},

	emits: ['request-add-to-album', 'request-share', 'request-delete'],

	data() {
		return {
			metadataDialogOpen: false,
			editDialogOpen: false,
			confirmDeleteOpen: false,
			tagDialogOpen: false,
			tagsLoading: false,
			tagOptions: [] as PhotoTag[],
			assignedIds: new Set<number>(),
			busyTagIds: new Set<number>(),
			newTagName: '',
			creatingTag: false,
		}
	},

	computed: {
		// Same field selection as Slideshow.exifLines — kept duplicated
		// rather than pulling it into a shared util because the surface
		// is small and a shared "exifLinesFor" helper would create an
		// import dependency we can't justify yet. Refactor when a third
		// caller appears.
		exifLines(): { label: string, value: string }[] {
			const attrs = (this.file.attributes ?? {}) as Record<string, unknown>
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

		isFavorite(): boolean {
			const attrs = (this.file.attributes ?? {}) as Record<string, unknown>
			return attrs.favorite === 1
		},

		fileIdNumber(): number {
			return typeof this.file.fileid === 'number'
				? this.file.fileid
				: Number.parseInt(String(this.file.fileid))
		},

		// EXIF-derived seeds for the edit dialog. The dialog reads
		// these as fallbacks when the user hasn't stored an
		// override yet, AND uses them as the "reset to original"
		// target.
		initialTakenAt(): number | null {
			const attrs = (this.file.attributes ?? {}) as Record<string, unknown>
			const raw = attrs['metadata-photos-original_date_time']
			return typeof raw === 'number' && raw > 0 ? raw : null
		},

		initialGpsLat(): number | null {
			return this.extractGpsCoord('latitude')
		},

		initialGpsLng(): number | null {
			return this.extractGpsCoord('longitude')
		},
	},

	methods: {
		t,

		onViewMetadata() {
			this.metadataDialogOpen = true
		},

		onEditMetadata() {
			this.editDialogOpen = true
		},

		// Pull a single GPS axis out of the EXIF metadata. The
		// `metadata-photos-gps` shape is `{latitude, longitude}` —
		// produced server-side by ExifMetadataProvider and now also
		// by IndexController.composeItem when an override exists.
		extractGpsCoord(axis: 'latitude' | 'longitude'): number | null {
			const attrs = (this.file.attributes ?? {}) as Record<string, unknown>
			const gps = attrs['metadata-photos-gps'] as Record<string, unknown> | undefined
			if (gps === undefined) {
				return null
			}
			const raw = gps[axis]
			return typeof raw === 'number' ? raw : null
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

		// Toggle favorite via the photos store action so the change
		// flows through the same DAV PROPPATCH + optimistic-update
		// path the bulk-selection action uses. We don't await — the
		// store mutation runs synchronously and the menu closes
		// immediately; failures revert via the action's own error
		// handler (showError + commit revert).
		onToggleFavorite() {
			const target = this.isFavorite ? 0 : 1
			this.$store.dispatch('toggleFavoriteForFiles', {
				fileIds: [this.fileIdNumber.toString()],
				favoriteState: target,
			})
		},

		async onManageTags() {
			this.tagDialogOpen = true
			await this.refreshTags()
		},

		async refreshTags() {
			this.tagsLoading = true
			try {
				const [all, assigned] = await Promise.all([
					fetchAllTags(),
					fetchTagsForFile(this.fileIdNumber),
				])
				this.tagOptions = all.sort((a, b) => a.displayName.localeCompare(b.displayName))
				this.assignedIds = new Set(assigned.map((tag) => tag.id))
			} catch (e) {
				showError(t('photos', 'Failed to load tags'))
				// Close on hard failure — leaving the dialog open with
				// nothing in it would be confusing.
				this.tagDialogOpen = false
				throw e
			} finally {
				this.tagsLoading = false
			}
		},

		async onToggleTag(tag: PhotoTag, value: boolean) {
			if (this.busyTagIds.has(tag.id)) {
				return
			}
			// Optimistic update so the checkbox flips without waiting
			// for the DAV round trip.
			const next = new Set(this.assignedIds)
			if (value) {
				next.add(tag.id)
			} else {
				next.delete(tag.id)
			}
			this.assignedIds = next

			const nextBusy = new Set(this.busyTagIds)
			nextBusy.add(tag.id)
			this.busyTagIds = nextBusy

			try {
				if (value) {
					await assignTagToFile(this.fileIdNumber, tag)
				} else {
					await unassignTagFromFile(this.fileIdNumber, tag)
				}
			} catch (e) {
				// Revert on failure.
				const reverted = new Set(this.assignedIds)
				if (value) {
					reverted.delete(tag.id)
				} else {
					reverted.add(tag.id)
				}
				this.assignedIds = reverted
				showError(value
					? t('photos', 'Failed to add tag "{name}"', { name: tag.displayName })
					: t('photos', 'Failed to remove tag "{name}"', { name: tag.displayName }))
				logger.error('photos: tag operation failed', { error: e })
			} finally {
				const cleared = new Set(this.busyTagIds)
				cleared.delete(tag.id)
				this.busyTagIds = cleared
			}
		},

		async onCreateTag() {
			const name = this.newTagName.trim()
			if (name === '' || this.creatingTag) {
				return
			}
			this.creatingTag = true
			try {
				const newId = await createTag(name)
				const placeholder = {
					id: newId,
					displayName: name,
					userVisible: true,
					userAssignable: true,
					canAssign: true,
				}
				await assignTagToFile(this.fileIdNumber, placeholder)
				this.newTagName = ''
				await this.refreshTags()
			} catch (e) {
				showError(t('photos', 'Failed to create tag "{name}"', { name }))
				logger.error('photos: tag operation failed', { error: e })
			} finally {
				this.creatingTag = false
			}
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

	&__tags {
		&__loading {
			display: flex;
			justify-content: center;
			padding: 16px 0;
		}

		&__empty {
			color: var(--color-text-maxcontrast);
			margin: 8px 0;
		}

		&__list {
			max-height: 280px;
			overflow-y: auto;
			margin-block-end: 16px;
			padding-inline-end: 4px;

			li {
				padding: 2px 0;
			}
		}

		&__create {
			display: flex;
			gap: 8px;
			align-items: end;
			border-top: 1px solid var(--color-border);
			padding-top: 12px;

			:deep(.input-field) {
				flex: 1;
			}
		}
	}
}
</style>

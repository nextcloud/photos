<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Manage tags')"
		size="small"
		@update:open="emit('close')">
		<NcLoadingIcon v-if="loading" :size="32" class="photo-tags__loading" />

		<div v-else class="photo-tags">
			<p v-if="tags.length === 0" class="photo-tags__empty">
				{{ t('photos', 'No tag exists yet, the field below creates the first one.') }}
			</p>

			<fieldset v-else class="photo-tags__list">
				<legend>{{ t('photos', 'Tags of {name}', { name: photo.basename }) }}</legend>

				<NcCheckboxRadioSwitch
					v-for="tag of tags"
					:key="tag.id"
					:model-value="assignedTagIds.includes(tag.id)"
					:disabled="!tag.canAssign || busyTagIds.includes(tag.id)"
					@update:model-value="toggle(tag, $event)">
					{{ tag.displayName }}
				</NcCheckboxRadioSwitch>
			</fieldset>

			<form class="photo-tags__create" @submit.prevent="create">
				<NcTextField
					v-model="newTagName"
					:label="t('photos', 'Create new tag')"
					:disabled="creating" />

				<NcButton
					variant="primary"
					type="submit"
					:disabled="newTagName.trim() === '' || creating">
					<template #icon>
						<NcLoadingIcon v-if="creating" :size="20" />
						<Plus v-else :size="20" />
					</template>
					{{ t('photos', 'Add') }}
				</NcButton>
			</form>
		</div>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoTag } from '../services/PhotoTagService.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Plus from 'vue-material-design-icons/Plus.vue'
import logger from '../services/logger.ts'
import {
	assignTagToFile,
	createTag,
	fetchAllTags,
	fetchTagsForFile,
	isTagNameTaken,
	unassignTagFromFile,
} from '../services/PhotoTagService.ts'

const props = defineProps<{
	/** Photo to manage the tags of. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

const loading = ref(true)
const creating = ref(false)

const tags = ref<PhotoTag[]>([])
const assignedTagIds = ref<number[]>([])
/** Tags of a request that is still on its way, which cannot be toggled again. */
const busyTagIds = ref<number[]>([])
const newTagName = ref('')

onMounted(load)

/**
 * Read the tags of the account and the ones of the photo.
 */
async function load(): Promise<void> {
	loading.value = true

	try {
		const [allTags, photoTags] = await Promise.all([
			fetchAllTags(),
			fetchTagsForFile(props.photo.fileid),
		])

		tags.value = allTags.sort((a, b) => a.displayName.localeCompare(b.displayName))
		assignedTagIds.value = photoTags.map(({ id }) => id)
	} catch (error) {
		logger.error('Error loading the tags of a photo', { error, filename: props.photo.basename })
		showError(t('photos', 'Failed to load the tags'))
		// A dialog holding nothing to manage is of no use.
		emit('close')
	} finally {
		loading.value = false
	}
}

/**
 * Put a tag on the photo or take it off again.
 *
 * The checkbox is moved before the server has confirmed it, so that several tags
 * can be ticked in a row, and moved back if the request turns out to fail.
 *
 * @param tag - Tag to assign or unassign
 * @param assigned - Whether the tag should end up on the photo
 */
async function toggle(tag: PhotoTag, assigned: boolean): Promise<void> {
	if (busyTagIds.value.includes(tag.id)) {
		return
	}

	setAssigned(tag.id, assigned)
	busyTagIds.value = [...busyTagIds.value, tag.id]

	try {
		if (assigned) {
			await assignTagToFile(props.photo.fileid, tag)
		} else {
			await unassignTagFromFile(props.photo.fileid, tag)
		}
	} catch (error) {
		setAssigned(tag.id, !assigned)
		logger.error('Error changing the tags of a photo', { error, filename: props.photo.basename })
		showError(assigned
			? t('photos', 'Failed to add the tag "{tag}"', { tag: tag.displayName })
			: t('photos', 'Failed to remove the tag "{tag}"', { tag: tag.displayName }))
	} finally {
		busyTagIds.value = busyTagIds.value.filter((id) => id !== tag.id)
	}
}

/**
 * Create the tag that was typed and put it on the photo.
 */
async function create(): Promise<void> {
	const displayName = newTagName.value.trim()
	if (displayName === '' || creating.value) {
		return
	}

	creating.value = true

	try {
		const tag = {
			id: await createTag(displayName),
			displayName,
			userVisible: true,
			userAssignable: true,
			canAssign: true,
		}

		await assignTagToFile(props.photo.fileid, tag)

		newTagName.value = ''
		tags.value = [...tags.value, tag].sort((a, b) => a.displayName.localeCompare(b.displayName))
		setAssigned(tag.id, true)
	} catch (error) {
		logger.error('Error creating a tag for a photo', { error, filename: props.photo.basename })
		showError(isTagNameTaken(error)
			? t('photos', 'A tag named "{tag}" already exists', { tag: displayName })
			: t('photos', 'Failed to create the tag "{tag}"', { tag: displayName }))
	} finally {
		creating.value = false
	}
}

/**
 * @param tagId - Id of the tag to mark
 * @param assigned - Whether the tag is on the photo
 */
function setAssigned(tagId: number, assigned: boolean): void {
	assignedTagIds.value = assigned
		? [...assignedTagIds.value, tagId]
		: assignedTagIds.value.filter((id) => id !== tagId)
}
</script>

<style lang="scss" scoped>
.photo-tags {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 4);

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}

	&__empty {
		color: var(--color-text-maxcontrast);
	}

	&__list {
		// A long list of tags scrolls, the field creating one stays in reach.
		max-height: 280px;
		overflow-y: auto;
		border: none;

		legend {
			color: var(--color-text-maxcontrast);
		}
	}

	&__create {
		display: flex;
		gap: calc(var(--default-grid-baseline) * 2);
		align-items: end;
		border-block-start: 1px solid var(--color-border);
		padding-block-start: calc(var(--default-grid-baseline) * 3);

		:deep(.input-field) {
			flex: 1;
		}
	}
}
</style>

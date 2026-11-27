<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Share link')"
		size="small"
		:isForm="result === null"
		:noClose="sharing"
		@submit="share"
		@update:open="close">
		<div v-if="result === null" class="quick-share">
			<p>
				{{ n('photos', 'The selected photo is put into a new album that anyone with the link can view. You can manage or unshare it in Albums.', 'The {count} selected photos are put into a new album that anyone with the link can view. You can manage or unshare it in Albums.', fileIds.length, { count: fileIds.length }) }}
			</p>
			<NcTextField
				v-model.trim="albumName"
				:label="t('photos', 'Name of the album')"
				:disabled="sharing"
				:error="albumNameError !== undefined"
				:helperText="albumNameError ?? ''"
				:required="true" />
			<NcNoteCard v-if="errorMessage !== ''" type="error">
				{{ errorMessage }}
			</NcNoteCard>
		</div>

		<div v-else class="quick-share">
			<p>
				{{ t('photos', 'Anyone with this link can view the album "{albumName}".', { albumName: result.album.basename }) }}
			</p>
			<NcNoteCard v-if="result.skippedCount > 0" type="warning">
				{{ n('photos', '{count} photo could not be added to the album.', '{count} photos could not be added to the album.', result.skippedCount, { count: result.skippedCount }) }}
			</NcNoteCard>
			<NcTextField
				:modelValue="result.link"
				:label="t('photos', 'Public link')"
				readonly />
			<NcButton :aria-label="t('photos', 'Copy the public link')" @click="copyLink">
				<template #icon>
					<Check v-if="copied" :size="20" />
					<ContentCopy v-else :size="20" />
				</template>
				{{ copied ? t('photos', 'Public link copied!') : t('photos', 'Copy public link') }}
			</NcButton>
			<svg
				class="quick-share__qr"
				:viewBox="`0 0 ${qrCode.size} ${qrCode.size}`"
				role="img"
				:aria-label="t('photos', 'QR code of the public link')">
				<path :d="qrCode.path" />
			</svg>
		</div>

		<template #actions>
			<template v-if="result === null">
				<NcButton variant="tertiary" :disabled="sharing" @click="close">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="primary" type="submit" :disabled="!canShare">
					<template #icon>
						<NcLoadingIcon v-if="sharing" :size="20" />
						<LinkVariant v-else :size="20" />
					</template>
					{{ t('photos', 'Create link') }}
				</NcButton>
			</template>
			<template v-else>
				<NcButton variant="tertiary" @click="openAlbum">
					{{ t('photos', 'Open album') }}
				</NcButton>
				<NcButton variant="primary" @click="close">
					{{ t('photos', 'Done') }}
				</NcButton>
			</template>
		</template>
	</NcDialog>
</template>

<script setup lang="ts">
import type { QuickShareResult } from '../../services/quickShare.ts'

import { showError } from '@nextcloud/dialogs'
import { n, t } from '@nextcloud/l10n'
import { encode } from 'uqr'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Check from 'vue-material-design-icons/Check.vue'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import LinkVariant from 'vue-material-design-icons/LinkVariant.vue'
import { fetchCollections } from '../../services/collectionFetcher.ts'
import { logger } from '../../services/logger.ts'
import { getQuickShareAlbumName, QuickShareError, shareFilesByLink } from '../../services/quickShare.ts'
import { albumsExtraProps, albumsPrefix, getAlbumNameError, useAlbumsStore } from '../../store/albums.ts'
import { useCollectionsStore } from '../../store/collections.ts'

const props = defineProps<{
	/** Photos to share. */
	fileIds: string[]
}>()

const emit = defineEmits<{
	close: []
}>()

const router = useRouter()
const albumsStore = useAlbumsStore()
const collectionsStore = useCollectionsStore()

const albumName = ref(getQuickShareAlbumName([]))
const sharing = ref(false)
const errorMessage = ref('')
const result = ref<QuickShareResult | null>(null)
const copied = ref(false)

const albumNameError = computed<string | undefined>(() => {
	if (albumsStore.getAlbum(albumName.value) !== undefined) {
		return t('files', 'This name is already in use.')
	}

	return getAlbumNameError(albumName.value)
})

const canShare = computed(() => albumName.value !== '' && albumNameError.value === undefined && !sharing.value)

// Dark modules drawn as one path, on the light background the scanners expect.
const qrCode = computed(() => {
	const { data, size } = encode(result.value?.link ?? '', { ecc: 'M', border: 2 })
	const path = data
		.flatMap((row, y) => row.map((dark, x) => (dark ? `M${x} ${y}h1v1h-1z` : '')))
		.join('')

	return { size, path }
})

async function share(): Promise<void> {
	if (!canShare.value) {
		return
	}

	sharing.value = true
	errorMessage.value = ''

	try {
		result.value = await shareFilesByLink(albumName.value, props.fileIds)
	} catch (error) {
		logger.error('Error sharing the selection by link', { error })
		errorMessage.value = error instanceof QuickShareError
			? error.message
			: t('photos', 'The link could not be created, nothing was shared.')
	} finally {
		sharing.value = false
	}
}

async function copyLink(): Promise<void> {
	try {
		await navigator.clipboard.writeText(result.value!.link)
	} catch (error) {
		logger.error('Error copying the public link', { error })
		showError(t('photos', 'The link could not be copied, copy it from the field instead.'))
		return
	}

	copied.value = true
	setTimeout(() => {
		copied.value = false
	}, 10000)
}

function openAlbum(): void {
	router.push(`/albums/${result.value!.album.basename}`)
	close()
}

function close(): void {
	emit('close')
}

// The albums are listed to propose a name none of them uses yet.
onMounted(async () => {
	const proposedName = albumName.value

	try {
		collectionsStore.addCollections(await fetchCollections(albumsPrefix, {}, albumsExtraProps))
	} catch (error) {
		logger.warn('Could not list the albums', { error })
	}

	if (albumName.value === proposedName) {
		albumName.value = getQuickShareAlbumName(Object.values(albumsStore.albums).map(({ basename }) => basename))
	}
})
</script>

<style lang="scss" scoped>
.quick-share {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);
	padding-block-end: calc(var(--default-grid-baseline) * 2);

	&__qr {
		align-self: center;
		width: 200px;
		height: 200px;
		background: #fff;
		fill: #000;
		border-radius: var(--border-radius);
	}
}
</style>

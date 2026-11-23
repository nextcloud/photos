<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Best shot')"
		size="normal"
		@update:open="emit('close')">
		<p aria-live="polite">
			{{ status }}
		</p>

		<NcLoadingIcon v-if="scores === null" class="best-shot__loading" :size="32" />

		<ul class="best-shot__photos" :aria-label="t('photos', 'Photos taken in one go')">
			<li
				v-for="(file, index) in files"
				:key="file.fileid"
				class="best-shot__photo"
				:class="{ 'best-shot__photo--best': index === bestIndex }">
				<img
					class="best-shot__preview"
					:src="getPreviewUrl(file, 256)"
					:alt="file.basename"
					decoding="async">
				<span v-if="index === bestIndex" class="best-shot__badge">
					<StarFourPoints :size="16" />
					{{ t('photos', 'Best shot') }}
				</span>
			</li>
		</ul>

		<template #actions>
			<NcButton variant="tertiary" @click="emit('close')">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<NcButton variant="error" :disabled="!canKeepBest" @click="emit('keep', others)">
				{{ t('photos', 'Keep best, move others to trash') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'

import { Permission } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { computed, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import StarFourPoints from 'vue-material-design-icons/StarFourPoints.vue'
import { scoreSharpness } from '../services/bestShot.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'
import { indexOfSharpest } from '../utils/sharpness.ts'

const props = defineProps<{
	/** The photos of a burst, in the order the viewer shows them. */
	files: PhotoFile[]
}>()

const emit = defineEmits<{
	close: []
	/** The photos to move to the trash, which is every one but the best. */
	keep: [others: PhotoFile[]]
}>()

// Sharpness of each photo, null until all of them are measured.
const scores = ref<Array<number | null> | null>(null)

// A photo that could not be measured may well be the best one, so the burst is
// only ranked once every photo of it has a score.
const bestIndex = computed<number>(() => scores.value === null || scores.value.includes(null) ? -1 : indexOfSharpest(scores.value))

const others = computed<PhotoFile[]>(() => props.files.filter((_, index) => index !== bestIndex.value))

const canKeepBest = computed<boolean>(() => bestIndex.value !== -1
	&& others.value.every((file) => (file.permissions & Permission.DELETE) !== 0))

const status = computed<string>(() => {
	if (scores.value === null) {
		return t('photos', 'Comparing the sharpness of these photos …')
	}
	if (bestIndex.value === -1) {
		return t('photos', 'These photos could not be compared.')
	}
	return n(
		'photos',
		'"{name}" is the sharpest of these %n photo.',
		'"{name}" is the sharpest of these %n photos.',
		props.files.length,
		{ name: props.files[bestIndex.value].basename },
	)
})

onMounted(async () => {
	scores.value = await scoreSharpness(props.files)
})
</script>

<style lang="scss" scoped>
.best-shot {
	&__loading {
		margin-block: calc(var(--default-grid-baseline) * 2);
	}

	&__photos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
		gap: calc(var(--default-grid-baseline) * 2);
		margin-block: calc(var(--default-grid-baseline) * 3);
	}

	&__photo {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--border-radius-large);
		background: var(--color-background-dark);

		&--best {
			outline: 3px solid var(--color-primary-element);
			outline-offset: -3px;
		}
	}

	&__preview {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__badge {
		position: absolute;
		inset-block-end: var(--default-grid-baseline);
		inset-inline: var(--default-grid-baseline);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--default-grid-baseline);
		padding: 2px calc(var(--default-grid-baseline) * 2);
		border-radius: var(--border-radius-pill);
		background: var(--color-primary-element);
		color: var(--color-primary-element-text);
		font-weight: 600;
		white-space: nowrap;
	}
}
</style>

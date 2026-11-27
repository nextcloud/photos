<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Photo frame settings')"
		size="normal"
		@update:open="emit('close')">
		<div class="photo-frame-settings">
			<fieldset>
				<legend>{{ t('photos', 'Show') }}</legend>
				<NcCheckboxRadioSwitch
					v-for="option in sourceOptions"
					:key="option.value"
					type="radio"
					name="photo-frame-source"
					:value="option.value"
					:modelValue="modelValue.source"
					@update:modelValue="update({ source: option.value })">
					{{ option.label }}
				</NcCheckboxRadioSwitch>
			</fieldset>

			<NcSelect
				v-if="modelValue.source === 'album'"
				:modelValue="modelValue.albumName || null"
				:inputLabel="t('photos', 'Album')"
				:placeholder="t('photos', 'Choose an album')"
				:options="albumNames"
				:loading="loadingCollections"
				:clearable="false"
				@update:modelValue="update({ albumName: $event ?? '' })" />

			<NcSelect
				:modelValue="intervalOptions.find((option) => option.value === modelValue.interval)"
				:inputLabel="t('photos', 'Change photo every')"
				:options="intervalOptions"
				:clearable="false"
				@update:modelValue="update({ interval: $event.value })" />

			<NcCheckboxRadioSwitch
				type="switch"
				:modelValue="modelValue.shuffle"
				@update:modelValue="update({ shuffle: $event })">
				{{ t('photos', 'Shuffle') }}
			</NcCheckboxRadioSwitch>

			<p class="photo-frame-settings__hint">
				{{ t('photos', 'To show the frame on a TV, open this page in the browser of the TV, or cast this browser tab to it from the browser menu.') }}
			</p>
		</div>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { FrameSettings, FrameSource } from '../utils/photoFrame.ts'

import { n, t } from '@nextcloud/l10n'
import { computed, onMounted } from 'vue'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import { useFetchCollections } from '../composables/useFetchCollections.ts'
import { albumsExtraProps, albumsPrefix, useAlbumsStore } from '../store/albums.ts'
import { FRAME_INTERVALS } from '../utils/photoFrame.ts'

const props = defineProps<{
	modelValue: FrameSettings
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', value: FrameSettings): void
	(event: 'close'): void
}>()

const albumsStore = useAlbumsStore()
const { fetchCollections, loadingCollections } = useFetchCollections()

const sourceOptions: { value: FrameSource, label: string }[] = [
	{ value: 'onThisDay', label: t('photos', 'On this day') },
	{ value: 'favorites', label: t('photos', 'Favorites') },
	{ value: 'album', label: t('photos', 'An album') },
	{ value: 'all', label: t('photos', 'All photos') },
]

const intervalOptions = FRAME_INTERVALS.map((seconds) => ({
	value: seconds,
	label: seconds < 60
		? n('photos', '%n second', '%n seconds', seconds)
		: n('photos', '%n minute', '%n minutes', seconds / 60),
}))

const albumNames = computed(() => Object.values(albumsStore.albums).map((album) => album.basename))

onMounted(() => fetchCollections(albumsPrefix, albumsExtraProps))

/**
 * @param changes - Settings to change
 */
function update(changes: Partial<FrameSettings>): void {
	emit('update:modelValue', { ...props.modelValue, ...changes })
}
</script>

<style lang="scss" scoped>
.photo-frame-settings {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);
	padding-block-end: calc(var(--default-grid-baseline) * 4);

	legend {
		font-weight: bold;
	}

	&__hint {
		color: var(--color-text-maxcontrast);
	}
}
</style>

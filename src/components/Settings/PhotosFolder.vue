<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="folder">
		<component :is="rootFolderIcon" v-if="path === '/'" />
		<FolderOutline v-else />
		<span class="folder__info">
			<div class="folder__path">{{ folderName }}</div>
			<div v-if="subname !== ''">
				{{ subname }}
			</div>
		</span>
		<NcButton
			v-if="canDelete"
			variant="tertiary"
			:aria-label="t('photos', 'Delete source directory')"
			@click="emitRemoveSourceFolder">
			<template #icon>
				<Close :size="20" />
			</template>
		</NcButton>
	</div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import Close from 'vue-material-design-icons/Close.vue'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'

const props = withDefaults(defineProps<{
	path: string
	canDelete?: boolean
	rootFolderLabel: string
	rootFolderIcon: Component
}>(), {
	canDelete: false,
})

const emit = defineEmits<{
	removeFolder: []
}>()

const folderName = computed(() => {
	if (props.path === '/') {
		return props.rootFolderLabel
	} else {
		return props.path.split('/').pop()
	}
})

/**
 * Return the summary path of the folder
 * Examples:
 *  - /        ==> Home
 *  - /a       ==> nothing
 *  - /a/b     ==> /a
 *  - /a/b/c   ==> /a/b
 *  - /a/b/c/d ==> /a/b
 */
const subname = computed(() => {
	const slashesCount = (props.path.match(/\//g) ?? []).length

	switch (slashesCount) {
		case 1:
			return ''
		case 2:
			return props.path.split('/').splice(0, 2).join('/')
		default:
			return props.path.split('/').splice(0, 3).join('/')
	}
})

function emitRemoveSourceFolder() {
	emit('removeFolder')
}
</script>

<style lang="scss" scoped>
.folder {
	display: flex;
	gap: 16px;
	min-width: 300px;

	&__info {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
	}

	&__path {
		font-weight: bold;
	}
}
</style>

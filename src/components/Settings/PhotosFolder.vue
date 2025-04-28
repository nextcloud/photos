<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="folder">
		<component :is="rootFolderIcon" v-if="path === '/'" />
		<Folder v-else />
		<span class="folder__info">
			<div class="folder__path">{{ folderName }}</div>
			<div v-if="subname !== ''">
				{{ subname }}
			</div>
		</span>
		<NcButton v-if="canDelete"
			type="tertiary"
			:aria-label="t('photos', 'Delete source directory')"
			@click="emitRemoveSourceFolder">
			<template #icon>
				<Close :size="20" />
			</template>
		</NcButton>
	</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import Folder from 'vue-material-design-icons/Folder.vue'
import Close from 'vue-material-design-icons/Close.vue'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import { translate as t } from '@nextcloud/l10n'

export default defineComponent({
	name: 'PhotosFolder',

	components: {
		NcButton,
		Folder,
		Close,
	},

	props: {
		path: {
			type: String,
			required: true,
		},
		canDelete: {
			type: Boolean,
			default: false,
		},
		rootFolderLabel: {
			type: String,
			required: true,
		},
		rootFolderIcon: {
			type: Object,
			required: true,
		},
	},

	emits: ['remove-folder'],

	computed: {
		folderName() {
			if (this.path === '/') {
				return this.rootFolderLabel
			} else {
				return this.path.split('/').pop()
			}
		},

		/**
		 * Return the summary path of the folder
		 * Examples:
		 *  - /        ==> Home
		 *  - /a       ==> nothing
		 *  - /a/b     ==> /a
		 *  - /a/b/c   ==> /a/b
		 *  - /a/b/c/d ==> /a/b
		 */
		subname() {
			const slashesCount = (this.path.match(/\//g) ?? []).length

			switch (slashesCount) {
			case 1:
				return ''
			case 2:
				return this.path.split('/').splice(0, 2).join('/')
			default:
				return this.path.split('/').splice(0, 3).join('/')
			}
		},
	},

	methods: {
		emitRemoveSourceFolder() {
			this.$emit('remove-folder')
		},

		t,
	},
})
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

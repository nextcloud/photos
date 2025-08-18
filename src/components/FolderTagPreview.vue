<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<RouterLink
		class="folder"
		:to="toLink"
		:aria-label="ariaLabel">
		<img
			v-if="previewUrl"
			class="folder__image"
			:src="previewUrl"
			alt=""
			@error="onPreviewFail(file)">

		<span v-else class="folder__image folder__image--placeholder">
			<FolderOutline
				class="folder__icon"
				:size="96"
				fill-color="var(--color-primary-element)" />
		</span>

		<span class="folder__details">
			<FolderOutline />
			<span class="folder__title">{{ name }}</span>
		</span>
	</RouterLink>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { Route } from 'vue-router'
import type { FoldersNode } from '../services/FolderContent.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { RouterLink } from 'vue-router'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'

export default {
	name: 'FolderTagPreview',

	components: {
		FolderOutline,
		RouterLink,
	},

	props: {
		name: {
			type: String,
			required: true,
		},

		path: {
			type: String,
			default: '',
		},

		fileList: {
			type: Array as PropType<FoldersNode[]>,
			default: () => [],
		},
	},

	data() {
		return {
			failed: [] as number[],
		}
	},

	computed: {
		// folder is empty
		isEmpty() {
			return this.previewList.length === 0
		},

		ariaLabel() {
			return t('photos', 'Open the "{name}" folder', { name: this.name })
		},

		/**
		 * Previews list without the failed ones
		 */
		previewList(): FoldersNode[] {
			return this.fileList
				.filter((file) => this.failed.indexOf(file.fileid) === -1)
		},

		previewUrl() {
			if (this.previewList.length === 0) {
				return null
			}

			// TODO: Check that etag is not null
			const { fileid, etag } = this.previewList.at(-1) as FoldersNode
			// use etag to force cache reload if file changed
			return generateUrl(`/core/preview?fileId=${fileid}&c=${etag}&x=${250}&y=${250}&forceIcon=0&a=0`)
		},

		/**
		 * We do not want encoded slashes when browsing by folder
		 * so we generate a new valid route object based on the
		 * current named route, get the final url back, decode it
		 * and use it as a direct string.
		 * Which vue-router does not encode afterwards!
		 */
		toLink(): Route {
			// Remove leading /file/{userId}
			const prefix = `/files/${getCurrentUser()?.uid}`
			let path = this.path.replace(new RegExp(`^${prefix}`), '')

			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.+)/i
			path = (regex.exec(path) as string[])[1]

			// apply to current route
			return { ...this.$route, params: { path: path.split('/') } }
		},
	},

	methods: {
		onPreviewFail({ fileid }) {
			this.failed.push(fileid)
		},

		t,
	},
}
</script>

<style lang="scss" scoped>
.folder {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: var(--border-radius-large);

	&:hover,
	&:focus {
		background-color: var(--color-background-dark);
	}

	&__image {
		width: 200px;
		height: 200px;
		object-fit: cover;
		border-radius: var(--border-radius-large);

		&--placeholder {
			background-color: var(--color-primary-element-light);
		}
	}

	&__icon {
		width: 100%;
		height: 100%;
	}

	&__details {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 16px;
		width: 200px;
	}

	&__title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 20px;
		margin-bottom: 2px;
		line-height: 30px;
		color: var(--color-main-text);
	}
}
</style>

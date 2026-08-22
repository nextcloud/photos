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
			@error="onPreviewFail">

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
import type { File } from '@nextcloud/files'
import type { PropType } from 'vue'
import type { Route } from 'vue-router'

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

		/** Path of the folder, relative to the root of the account. */
		path: {
			type: String,
			default: '',
		},

		fileList: {
			type: Array as PropType<File[]>,
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
		previewList(): File[] {
			return this.fileList
				.filter((file) => this.failed.indexOf(file.fileid as number) === -1)
		},

		/** The photo the folder is shown under, the last one that has not failed. */
		cover(): File | undefined {
			return this.previewList.at(-1)
		},

		previewUrl(): string | null {
			if (this.cover === undefined) {
				return null
			}

			// use etag to force cache reload if file changed
			return generateUrl(`/core/preview?fileId=${this.cover.id}&c=${this.cover.attributes.etag}&x=${250}&y=${250}&forceIcon=0&a=0`)
		},

		/**
		 * We do not want encoded slashes when browsing by folder
		 * so we generate a new valid route object based on the
		 * current named route, get the final url back, decode it
		 * and use it as a direct string.
		 * Which vue-router does not encode afterwards!
		 */
		toLink(): Route {
			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.+)/i
			const path = (regex.exec(this.path) as string[])[1]

			// apply to current route
			return { ...this.$route, params: { path: path.split('/') } }
		},
	},

	methods: {
		/**
		 * Drop the photo whose preview could not be shown, so that the folder falls
		 * back to the next one it holds — and to its icon once none is left.
		 */
		onPreviewFail(): void {
			if (this.cover !== undefined) {
				this.failed.push(this.cover.fileid as number)
			}
		},

		t,
	},
}
</script>

<style lang="scss" scoped>
.folder {
	// The tile size is given by the layout, the preview fills it.
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 8px;
	border-radius: var(--border-radius-large);

	&:hover,
	&:focus {
		background-color: var(--color-background-dark);
	}

	&__image {
		// The image takes all the space the title does not need.
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		object-fit: cover;
		border-radius: var(--border-radius-large);

		&--placeholder {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--color-primary-element-light);
		}
	}

	&__icon {
		max-width: 100%;
		max-height: 100%;
	}

	&__details {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		width: 100%;
	}

	&__title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-main-text);
	}
}
</style>

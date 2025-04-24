<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<router-link class="tag-cover" :to="`/tags/${tag.attributes['display-name']}`">
		<img v-if="tag.attributes['files-assigned'] !== 0"
			class="tag-cover__image"
			:src="coverUrl">
		<div v-else class="tag-cover__image tag-cover__image--placeholder">
			<ImageMultipleIcon :size="128" />
		</div>
		<div class="tag-cover__details">
			<div class="tag-cover__details__first-line">
				<h3 class="tag-cover__details__name">
					{{ t('recognize', tag.attributes['display-name']) }}
				</h3>
			</div>
			<div class="tag-cover__details__second-line">
				{{ n('photos', '%n photo', '%n photos', count) }}
			</div>
		</div>
	</router-link>
</template>

<script lang='ts'>
import { defineComponent, type PropType } from 'vue'
import ImageMultipleIcon from 'vue-material-design-icons/ImageMultiple.vue'

import { generateUrl } from '@nextcloud/router'
import { translate as t, translatePlural as n } from '@nextcloud/l10n'

import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import type { Tag } from '../store/systemtags.js'

export default defineComponent({
	name: 'TagCover',

	components: {
		ImageMultipleIcon,
	},

	mixins: [
		AbortControllerMixin,
	],

	props: {
		tag: {
			type: Object as PropType<Tag>,
			required: true,
		},
	},

	data() {
		return {
			loadCover: false,
			observer: null as IntersectionObserver|null,
		}
	},

	computed: {
		tags() {
			return this.$store.state.systemtags.tags
		},

		files() {
			return this.$store.state.files.files
		},

		coverUrl(): string {
			if (!this.loadCover) {
				return ''
			}
			return generateUrl(`/core/preview?fileId=${this.tag.attributes['reference-fileid']}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		count() {
			return this.tag.attributes['files-assigned']
		},
	},

	watch: {
		loadCover() {
			if (this.tag.attributes['files-assigned']) {
				return
			}
			this.$store.dispatch('fetchTagFiles', { id: this.tag.attributes.id, signal: this.abortController.signal })
		},
	},

	mounted() {
		this.observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				this.loadCover = true
				this.observer?.disconnect()
			}
		})
		this.observer.observe(this.$el)
	},

	methods: {
		t,
		n,
	},
})
</script>
<style scoped lang="scss">
.tag-cover {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: 12px;

	&:hover, &:focus {
		background: var(--color-background-dark);
	}

	&__image {
		width: 350px;
		height: 350px;
		object-fit: cover;
		border-radius: 12px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
			height: 250px;
		}

		&--placeholder {
			background: var(--color-primary-element-light);

			:deep(.material-design-icon) {
				width: 100%;
				height: 100%;

				.material-design-icon__svg {
					fill: var(--color-primary-element);
				}
			}
		}
	}

	&__details {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		width: 350px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
		}

		&__first-line {
			display: flex;
		}

		&__second-line {
			display: flex;
			color: var(--color-text-lighter);
		}

		&__name {
			flex-grow: 1;
			margin: 0;
			font-weight: normal;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

		}
	}

}
</style>

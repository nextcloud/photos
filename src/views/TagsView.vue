<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<!-- Errors handlers-->
		<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')" />

		<NcEmptyContent v-if="!loading && tagsList.length === 0" :name="t('photos', 'No tags yet')" :description="t('photos', 'Photos with tags will show up here')" />

		<NcLoadingIcon v-if="loading" class="loader" />

		<div v-else class="container">
			<h2 v-if="popularTags.length">
				{{ t('photos', 'Popular tags') }}
			</h2>
			<div class="popular-tags">
				<TagCover v-for="tag in popularTags" :key="tag.attributes.id" :tag="tag" />
			</div>
			<h2 v-if="tagsList.length">
				{{ t('photos', 'All tags') }}
			</h2>
			<div class="tags">
				<TagCover v-for="tag in tagsList" :key="tag.attributes.id" :tag="tag" />
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import TagCover from '../components/TagCover.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import logger from '../services/logger.js'

export default defineComponent({
	name: 'TagsView',
	components: {
		TagCover,
		NcLoadingIcon,
		NcEmptyContent,
	},

	mixins: [AbortControllerMixin],

	data() {
		return {
			error: null as boolean | null,
			loading: false,
			showTags: false,
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		tags() {
			return this.$store.state.systemtags.tags
		},

		tagsNames() {
			return this.$store.state.systemtags.names
		},

		tagsList() {
			return Object.keys(this.tagsNames)
				.map((tagName) => this.tags[this.tagsNames[tagName]])
				.filter((tag) => tag && tag.attributes.id)
		},

		popularTags() {
			return Object.keys(this.tagsNames)
				.filter((tagName) => (this.tags[this.tagsNames[tagName]].attributes['files-assigned']) > 50)
				.sort((a, b) => (this.tags[this.tagsNames[b]]['files-assigned']) - (this.tags[this.tagsNames[a]]['files-assigned']))
				.slice(0, 9)
				.map((tagName) => this.tags[this.tagsNames[tagName]])
		},
	},

	async beforeMount() {
		await this.fetchRootContent()
	},

	methods: {
		async fetchRootContent() {
			// close any potential opened viewer
			window.OCA.Viewer.close()

			this.error = null

			try {
				// fetch content
				if (!this.tagsList.length) {
					this.loading = true
					await this.$store.dispatch('fetchAllTags', {
						signal: this.abortController.signal,
					})
				}
			} catch (error) {
				logger.error('Failed to fetch tags', { error })
				this.error = true
			} finally {
				// done loading
				this.loading = false
			}
		},

		t,
	},

})
</script>

<style lang="scss" scoped>
.loader {
	margin-top: 30vh;
}

.container {
	padding-inline-start: 44px;

	> h2 {
		margin-inline-start: 14px;
		margin-top: 40px;
	}
}

.popular-tags, .tags {
	display: flex;
	flex-direction: row;
	gap: 8px;
	flex-wrap: wrap;
}
</style>

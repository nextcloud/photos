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
				<TagCover v-for="tag in popularTags" :key="tag.id" :tag="tag" />
			</div>
			<h2 v-if="tagsList.length">
				{{ t('photos', 'All tags') }}
			</h2>
			<div class="tags">
				<TagCover v-for="tag in tagsList" :key="tag.id" :tag="tag" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import { NcEmptyContent, NcLoadingIcon } from '@nextcloud/vue'

import TagCover from '../components/TagCover.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import logger from '../services/logger'

export default {
	name: 'Tags',
	components: {
		TagCover,
		NcLoadingIcon,
		NcEmptyContent,
	},
	mixins: [AbortControllerMixin],

	data() {
		return {
			error: null,
			loading: false,
			showTags: false,
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'tags',
			'tagsNames',
		]),

		tagsList() {
			return Object.keys(this.tagsNames)
				.map(tagName => this.tags[this.tagsNames[tagName]])
				.filter(tag => tag && tag.id)
		},

		popularTags() {
			return Object.keys(this.tagsNames)
				.filter(tagName => (this.tags[this.tagsNames[tagName]].filesAssigned) > 50)
				.sort((a, b) => (this.tags[this.tagsNames[b]].filesAssigned || this.tagCounts[b]) - (this.tags[this.tagsNames[a]].filesAssigned || this.tagCounts[a]))
				.slice(0, 9)
				.map(tagName => this.tags[this.tagsNames[tagName]])
		},
	},

	async beforeMount() {
		await this.fetchRootContent()
	},

	methods: {
		async fetchRootContent() {
			// close any potential opened viewer
			OCA.Viewer.close()

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
				logger.error(error)
				this.error = true
			} finally {
				// done loading
				this.loading = false
			}
		},
	},

}
</script>

<style lang="scss" scoped>
.loader {
	margin-top: 30vh;
}

.container {
	padding-left: 44px;

	> h2 {
		margin-left: 14px;
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

<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Corentin Mors <medias@pixelswap.fr>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<div>
		<!-- Errors handlers-->
		<NcEmptyContent v-if="error" :title="t('photos', 'An error occurred')" />

		<NcEmptyContent v-if="!loading && !tagsList.length" :title="t('photos', 'No tags yet')" :description="t('photos', 'Photos with tags will show up here')" />

		<NcLoadingIcon v-if="loading" class="loader" />

		<div v-else class="container">
			<h2 v-if="popularTags.length">
				{{ t('photos', 'Popular tags') }}
			</h2>
			<div class="popular-tags">
				<TagCover v-for="tag in popularTags" :key="tag.id" :tag="tag" />
			</div>
			<h2 v-if="tagsList.length">
				All tags
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
import { loadState } from '@nextcloud/initial-state'

import TagCover from '../components/TagCover.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'

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
			tagCounts: loadState('photos', 'tag-counts'),
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
				.filter(tagName => (this.tags[this.tagsNames[tagName]].files.length || this.tagCounts[tagName]) > 50)
				.sort((a, b) => (this.tags[this.tagsNames[b]].files.length || this.tagCounts[b]) - (this.tags[this.tagsNames[a]].files.length || this.tagCounts[a]))
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
				console.error(error)
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

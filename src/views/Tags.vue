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
		<EmptyContent v-if="error">
			{{ t('photos', 'An error occurred') }}
		</EmptyContent>

		<EmptyContent v-if="!loading && !hasTagsWithFiles" key="emptycontent" illustration-name="empty">
			{{ t('photos', 'No tags yet') }}
			<template #desc>
				{{ t('photos', 'Photos with tags will show up here') }}
			</template>
		</EmptyContent>

		<Loader v-if="loading" class="loader" />

		<div v-else>
			<div class="grid-container">
				<div v-if="hasCategoriesWithFiles" class="things">
					<ThingsCategory v-for="category in Object.keys(CATEGORIES)" :key="category" :title="category" />
					<div v-if="!showTags" class="expand-box">
						<Button aria-label="Show more tags" @click="expandTags()">
							More
						</Button>
					</div>
				</div>
				<div v-if="showTags || !hasCategoriesWithFiles" class="tags">
					<Tag v-for="tag in tagsList" :key="tag.id" :tag="tag" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Button } from '@nextcloud/vue'

import EmptyContent from '../components/EmptyContent'
import Tag from '../components/Tag'

import { CATEGORIES } from '../services/Things'
import ThingsCategory from '../components/ThingsCategory'
import Loader from '../components/Loader'
import AbortControllerMixin from '../mixins/AbortControllerMixin'


export default {
	name: 'Tags',
	components: {
		Loader,
		ThingsCategory,
		Tag,
		EmptyContent,
		Button,
	},
	mixins: [AbortControllerMixin],

	data() {
		return {
			error: null,
			loading: false,
			showTags: false,
			CATEGORIES,
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
			return Object.values(this.tagsNames).map((tagsId) => this.tags[tagsId]).filter(tag => tag && tag.id)
		},

		hasTagsWithFiles() {
			return Object.values(this.tags).some(tag => !!tag.files.length)
		},

		hasCategoriesWithFiles() {
			return Object.values(CATEGORIES)
				.flatMap(tagName => this.tags[this.tagsNames[tagName]])
				.filter(Boolean)
				.some(tag => !tag.files.length)
		},
	},

	async beforeMount() {
		await this.fetchRootContent()
	},

	methods: {
		async fetchRootContent() {
			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (!this.tags[this.tagId]) {
				this.loading = true
			}
			this.error = null

			try {
				// fetch content
				await this.$store.dispatch('fetchAllTags' {
						signal: this.abortController.signal,
				})
			} catch (error) {
				console.error(error)
				this.error = true
			} finally {
				// done loading
				this.loading = false
			}
		},
		expandTags() {
			this.showTags = true
		},
	},
}
</script>

<style lang="scss" scoped>
.loader {
	margin-top: 30vh;
}

.things, .tags {
	display: flex;
	flex-direction: row;
	gap: 8px;
	flex-wrap: wrap;
	margin-top: 44px;
}

.expand-box {
	height: 250px;
	width: 250px;
	display: flex;
	flex-direction: column;
	align-items: center;

	> * {
		margin-top: 45%;
	}
}
</style>

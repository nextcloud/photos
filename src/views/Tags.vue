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
	<!-- Errors handlers-->
	<EmptyContent v-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Folder content -->
	<div v-else-if="!loading">
		<Navigation
			key="navigation"
			:basename="path"
			:filename="'/' + path"
			:root-title="rootTitle" />
		<EmptyContent v-if="isEmpty" key="emptycontent" illustration-name="empty">
			{{ t('photos', 'No tags yet') }}
			<template #desc>
				{{ t('photos', 'Photos with tags will show up here') }}
			</template>
		</EmptyContent>

		<div v-else class="grid-container">
			<VirtualGrid
				ref="virtualgrid"
				:items="contentList"
				:get-column-count="() => gridConfig.count"
				:get-grid-gap="() => gridConfig.gap" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import VirtualGrid from 'vue-virtual-grid'

import getSystemTags from '../services/SystemTags'
import getTaggedImages from '../services/TaggedImages'

import EmptyContent from '../components/EmptyContent'
import Tag from '../components/Tag'
import File from '../components/File'
import Navigation from '../components/Navigation'

import GridConfigMixin from '../mixins/GridConfig'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Tags',
	components: {
		VirtualGrid,
		EmptyContent,
		Navigation,
	},
	mixins: [GridConfigMixin],
	props: {
		rootTitle: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			required: true,
		},
		isRoot: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			error: null,
			cancelRequest: null,
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'tags',
			'tagsNames',
		]),

		// current tag id from current path
		tagId() {
			return this.$store.getters.tagId(this.path)
		},

		// current tag
		tag() {
			return this.tags[this.tagId]
		},

		tagsList() {
			return Object.values(this.tagsNames).map((tagsId) => this.tags[tagsId])
		},

		// files list of the current tag
		fileList() {
			return this.tag && this.tag.files
				.map(id => this.files[id])
				.filter(file => !!file)
		},

		contentList() {
			if (this.isRoot) {
				return this.tagsList.flatMap((tag) => {
					return tag.id === ''
						? []
						: [{
							id: `tag-${tag.id}`,
							injected: {
								...tag,
							},
							width: 256,
							height: 256,
							columnSpan: 1,
							renderComponent: Tag,
						}]
				})
			}
			return this.fileList.map((file) => {
				return {
					id: `file-${file.fileid}`,
					injected: {
						...file,
						list: this.fileList,
					},
					width: 256,
					height: 256,
					columnSpan: 1,
					renderComponent: File,
				}
			})
		},

		isEmpty() {
			if (this.isRoot) {
				return Object.keys(this.tagsNames).length === 0
			}
			return this.fileList.length === 0
		},
	},

	watch: {
		async path() {
			// if we don't have the tag in the store yet,
			// we need to fetch the list first
			if (!this.tagId) {
				await this.fetchRootContent()
			}

			// if we're not in the root, we fetch the data
			if (!this.isRoot) {
				this.fetchContent()
			}
		},
	},

	beforeDestroy() {
		// cancel any pending requests
		if (this.cancelRequest) {
			this.cancelRequest('Navigated away')
		}
	},

	async beforeMount() {
		// if we don't have the tag in the store yet,
		// we need to fetch the list first
		if (!this.tagId) {
			await this.fetchRootContent()
		}

		// if we're not in the root, we fetch the data
		if (!this.isRoot) {
			this.fetchContent()
		}
	},

	methods: {
		async fetchRootContent() {
			// cancel any pending requests
			if (this.cancelRequest) {
				this.cancelRequest('Changed folder')
			}

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (!this.tags[this.tagId]) {
				this.$emit('update:loading', true)
			}
			this.error = null

			// init cancellable request
			const { request, cancel } = cancelableRequest(getSystemTags)
			this.cancelRequest = cancel

			try {
				// fetch content
				const tags = await request()
				this.$store.dispatch('updateTags', tags)
			} catch (error) {
				console.error(error)
				this.error = true
			} finally {
				// done loading
				this.$emit('update:loading', false)
				this.cancelRequest = null
			}

		},

		async fetchContent() {
			// cancel any pending requests
			if (this.cancelRequest) {
				this.cancelRequest()
			}

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (!this.tags[this.tagId]) {
				this.$emit('update:loading', true)
			}
			this.error = null

			// init cancellable request
			const { request, cancel } = cancelableRequest(getTaggedImages)
			this.cancelRequest = cancel

			try {
				// get data
				const files = await request(this.tagId)
				this.$store.dispatch('updateTag', { id: this.tagId, files })
				this.$store.dispatch('appendFiles', files)
			} catch (error) {
				console.error(error)
				this.error = true
			} finally {
				// done loading
				this.$emit('update:loading', false)
				this.cancelRequest = null
			}
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/GridSizes.scss';

.grid-container {
	@include grid-sizes using ($marginTop, $marginW) {
		padding: 0px #{$marginW}px 256px #{$marginW}px;
	}
}
</style>

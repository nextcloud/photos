<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @license GNU AGPL version 3 or any later version
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
	<EmptyContent v-else-if="!loading && isEmpty" illustration-name="empty">
		{{ t('photos', 'No tags yet') }}
		<template #desc>
			{{ t('photos', 'Photos with tags will show up here') }}
		</template>
	</EmptyContent>

	<!-- Folder content -->
	<Grid v-else>
		<Navigation
			key="navigation"
			:basename="path"
			:filename="'/' + path"
			:root-title="rootTitle" />
		<template v-if="isRoot">
			<Tag v-for="id in tagsNames"
				:key="id"
				v-bind="tags[id]"
				:fileid="id"
				:basename="tags[id].displayName" />
		</template>
		<template v-else>
			<File v-for="file in fileList" :key="file.fileid" v-bind="file" />
		</template>
	</Grid>
</template>

<script>
import { mapGetters } from 'vuex'

import getSystemTags from '../services/SystemTags'
import getTaggedImages from '../services/TaggedImages'

import EmptyContent from './EmptyContent'
import Tag from '../components/Tag'
import File from '../components/File'
import Grid from '../components/Grid'
import Navigation from '../components/Navigation'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Tags',
	components: {
		EmptyContent,
		File,
		Tag,
		Grid,
		Navigation,
	},
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
			cancelRequest: () => {},
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
		// files list of the current tag
		fileList() {
			return this.tag && this.tag.files
				.map(id => this.files[id])
				.filter(file => !!file)
		},

		isEmpty() {
			return Object.keys(this.tagsNames).length === 0
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
		this.cancelRequest('Changed view')
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
			this.cancelRequest('Changed folder')

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

			const tags = await request()
			this.$store.dispatch('updateTags', tags)

			// done loading
			this.$emit('update:loading', false)
		},

		async fetchContent() {
			// cancel any pending requests
			this.cancelRequest()

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

			// get data
			const files = await request(this.tagId)
			this.$store.dispatch('updateTag', { id: this.tagId, files })
			this.$store.dispatch('appendFiles', files)

			// done loading
			this.$emit('update:loading', false)
		},
	},

}
</script>

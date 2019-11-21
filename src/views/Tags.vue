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
	<Grid v-else-if="isRoot">
		<Navigation v-if="tag"
			key="navigation"
			:basename="tagname"
			:filename="'/' + tagname"
			:root-title="t('photos', 'Tags')" />
		<Tag v-for="id in tagsNames"
			:key="id"
			v-bind="tags[id]"
			:fileid="id"
			:basename="tags[id].displayName" />
	</Grid>
</template>

<script>
import { mapGetters } from 'vuex'

import getSystemTags from '../services/SystemTags'

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
		tagname: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			required: true,
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
			return this.$store.getters.tagId(this.tagname)
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

		isRoot() {
			return this.tagname === ''
		},

		isEmpty() {
			return Object.keys(this.tagsNames).length === 0
		},
	},

	watch: {
		tagname(name) {
			this.fetchRootContent()
		},
	},

	async beforeMount() {
		this.fetchRootContent()
	},

	methods: {
		async fetchRootContent() {
			// cancel any pending requests
			this.cancelRequest()

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (!this.tags[this.folderId]) {
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
	},

}
</script>

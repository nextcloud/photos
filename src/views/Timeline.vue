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
	<EmptyContent v-if="error === 404" illustration-name="folder">
		{{ t('photos', 'This folder does not exists') }}
	</EmptyContent>
	<EmptyContent v-else-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>
	<EmptyContent v-else-if="!loading && isEmpty" illustration-name="empty">
		{{ t('photos', 'No photos in here') }}
	</EmptyContent>

	<!-- Folder content -->
	<Grid v-else-if="!loading">
		<File v-for="file in fileList" :key="file.fileid" v-bind="file" />
	</Grid>
</template>

<script>
import { mapGetters } from 'vuex'

import getPhotos from '../services/PhotoSearch'

import EmptyContent from '../components/EmptyContent'
import File from '../components/File'
import Grid from '../components/Grid'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Timeline',
	components: {
		EmptyContent,
		File,
		Grid,
	},
	props: {
		loading: {
			type: Boolean,
			required: true,
		},
		onlyFavorites: {
			type: Boolean,
			default: false,
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
			'timeline',
		]),

		fileList() {
			return this.timeline
				.map(id => this.files[id])
				.filter(file => !!file)
		},

		// is current folder empty?
		isEmpty() {
			return this.fileList.length === 0
		},
	},

	watch: {
		async onlyFavorites() {
			// content is completely different
			this.$emit('update:loading', true)
			this.fetchContent()
		},
	},

	async beforeMount() {
		this.fetchContent()
	},

	beforeDestroy() {
		this.cancelRequest()
	},

	methods: {
		async fetchContent() {
			// cancel any pending requests
			this.cancelRequest('Changed view')

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (this.timeline.length === 0) {
				this.$emit('update:loading', true)
			}
			this.error = null

			// init cancellable request
			const { request, cancel } = cancelableRequest(getPhotos)
			this.cancelRequest = cancel

			try {
				// get content and current folder info
				const files = await request(this.onlyFavorites)
				this.$store.dispatch('updateTimeline', files)
				this.$store.dispatch('appendFiles', files)
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.error = 404
						setTimeout(() => {
							this.$router.push({ name: this.$route.name })
						}, 3000)
					} else {
						this.error = error
					}
				}
				// cancelled request, moving on...
				console.error('Error fetching timeline', error)
			} finally {
				// done loading even with errors
				this.$emit('update:loading', false)
			}
		},
	},

}
</script>

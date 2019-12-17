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
	<VirtualGrid v-else-if="!loading"
		:component="getComponent"
		:list="fileList"
		:loading-page="loadingPage"
		:props="getProps"
		@bottomReached="onBottomReached" />
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'debounce'

import getPhotos from '../services/PhotoSearch'

import EmptyContent from '../components/EmptyContent'
import File from '../components/File'
import VirtualGrid from '../components/VirtualGrid'

import cancelableRequest from '../utils/CancelableRequest'
import arrayToChunk from '../utils/ArrayChunk'
import GridConfigMixin from '../mixins/GridConfig'

export default {
	name: 'Timeline',
	components: {
		EmptyContent,
		VirtualGrid,
	},
	mixins: [GridConfigMixin],
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
			cancelRequest: () => {},
			done: false,
			error: null,
			loadingPage: false,
			page: 0,
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

		// the list chunked in rows for the virtual list
		chunkedList() {
			return arrayToChunk(this.fileList, this.gridConfig.count)
		},
	},

	watch: {
		async onlyFavorites() {
			// reset component
			this.resetState()

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
			// only one simultaneous page load
			if (this.loadingPage) {
				return
			}

			// cancel any pending requests
			this.cancelRequest('Changed view')

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (this.timeline.length === 0) {
				this.$emit('update:loading', true)
			}
			this.error = null
			this.loadingPage = true

			// init cancellable request
			const { request, cancel } = cancelableRequest(getPhotos)
			this.cancelRequest = cancel

			try {
				// get content and current folder info
				const files = await request(this.onlyFavorites, {
					page: this.page,
					perPage: this.gridConfig.count * 5, // we load 5 rows,
				})
				this.$store.dispatch('updateTimeline', files)
				this.$store.dispatch('appendFiles', files)

				// next time we load this script, we load the next page if the list returned
				if (files.length === this.gridConfig.count * 5) {
					this.page++
				} else {
					console.debug('We loaded the last page')
					this.done = true
				}
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
				this.loadingPage = false
			}
		},

		/**
		 * Return the props based on the element
		 * Here we want to bind the full fileinfo
		 * object so we stupidly return it whole!
		 *
		 * @param {Object} item the scoped item from the VirtualGrid
		 * @returns {Object}
		 */
		getProps(item) {
			return item
		},

		/**
		 * Return the component based on the element
		 * We only have files in the Timeline,
		 * so we return Files!
		 *
		 * @returns {Object}
		 */
		getComponent() {
			return File
		},

		debounceOnBottomReached: debounce(function() {
			this.onBottomReached()
		}, 1000),

		/**
		 * When virtual grid reach the bottom,
		 * we load the next page
		 */
		onBottomReached() {
			// if we're currently loading or if a previous
			// request returned the last page, we stop
			if (this.loadingPage || this.done) {
				return
			}

			console.debug('Loading next page', this.page)
			this.fetchContent()
		},

		/**
		 * Reset this component data to a pristine state
		 */
		resetState() {
			this.$store.dispatch('resetTimeline')
			this.done = false
			this.error = null
			this.loadingPage = false
			this.page = 0
			this.page = 0
		}

	},

}
</script>

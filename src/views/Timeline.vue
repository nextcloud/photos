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

	<!-- Folder content -->
	<div v-else-if="!loading">
		<Navigation
			v-if="isEmpty"
			key="navigation"
			:basename="path"
			:filename="'/'"
			:root-title="rootTitle" />

		<EmptyContent v-if="isEmpty" illustration-name="empty">
			{{ t('photos', 'No photos in here') }}
		</EmptyContent>

		<div class="grid-container">
			<VirtualGrid
				ref="virtualgrid"
				:update-function="getContent"
				:update-trigger-margin="700" />
		</div>
	</div>
</template>

<script>
import * as moment from 'moment'

import getPhotos from '../services/PhotoSearch'

import EmptyContent from '../components/EmptyContent'
import FileVirtualGrid from '../components/FileVirtualGrid'
import SeparatorVirtualGrid from '../components/SeparatorVirtualGrid'
import VirtualGrid from 'vue-virtual-grid'
import Navigation from '../components/Navigation'

import cancelableRequest from '../utils/CancelableRequest'
import GridConfigMixin from '../mixins/GridConfig'

export default {
	name: 'Timeline',
	components: {
		EmptyContent,
		VirtualGrid,
		Navigation,
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
		rootTitle: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			cancelRequest: null,
			done: false,
			error: null,
			loadingPage: false,
			isEmpty: false,
			lastSection: '',
		}
	},

	watch: {
		async onlyFavorites() {
			// reset component
			this.resetState()
		},
	},

	async beforeMount() {
		this.$emit('update:loading', false)
		this.loadingPage = false
	},

	beforeDestroy() {
		// cancel any pending requests
		if (this.cancelRequest) {
			this.cancelRequest('Changed view')
		}
	},

	methods: {
		async getContent(params) {
			if (this.done) {
				return Promise.resolve([])
			}

			// cancel any pending requests
			if (this.cancelRequest) {
				this.cancelRequest('Changed view')
			}

			// done loading even with errors
			const { request, cancel } = cancelableRequest(getPhotos)
			this.cancelRequest = cancel

			try {
				const files = await request(this.onlyFavorites, {
					page: params.offset,
					perPage: 30,
				})

				if (files.length === params.offset === 0) {
					this.isEmpty = true
				}

				if (files.length !== 30) {
					this.done = true
				}

				return files.flatMap((file, index) => {
					const finalArray = []
					const currentSection = this.getFormatedDate(file.lastmod, 'YYYY MMMM')
					if (
						currentSection
						!== this.getFormatedDate(files[index - 1]?.lastmod, 'YYYY MMMM')
						&& (this.lastSection !== currentSection)
					) {
						finalArray.push({
							id: `title-${index}`,
							injected: {
								year: this.getFormatedDate(file.lastmod, 'YYYY'),
								month: this.getFormatedDate(file.lastmod, 'MMMM'),
							},
							height: 90,
							columnSpan: 0,
							newRow: true,
							renderComponent: SeparatorVirtualGrid,
						})
						this.lastSection = currentSection
					}
					finalArray.push({
						id: `img-${file.fileid}`,
						injected: {
							...file,
							list: this.$refs.virtualgrid.getCurrentItems,
							loadMore: this.$refs.virtualgrid.loadMoreData,
						},
						width: 256,
						height: 256,
						columnSpan: 1,
						renderComponent: FileVirtualGrid,
					})
					return finalArray
				})
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
				} else if (params.offset === 0) {
					this.isEmpty = true
				}

				// cancelled request, moving on...
				console.error('Error fetching timeline', error)
				return Promise.resolve([])
			} finally {
				// done loading even with errors
				this.$emit('update:loading', false)
				this.loadingPage = false
				this.cancelRequest = null
			}
		},

		/**
		 * Reset this component data to a pristine state
		 */
		resetState() {
			this.$store.dispatch('resetTimeline')
			this.done = false
			this.isEmpty = false
			this.error = null
			this.loadingPage = false
			this.$refs.virtualgrid.resetGrid()
		},

		getFormatedDate(string, format) {
			return moment(string).format(format)
		},

	},

}
</script>

<style lang="scss" scoped>
.grid-container {
	padding: 66px;
}
</style>

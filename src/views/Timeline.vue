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
				:get-column-count="() => gridConfig.count"
				:get-grid-gap="() => gridConfig.gap"
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

			const numberOfImagesPerBatch = this.gridConfig.count * 5 // loading 5 rows

			try {
				// Load next batch of images
				const files = await request(this.onlyFavorites, {
					page: params.offset, // offset is incremented +1 by the virtualgrid lib
					perPage: numberOfImagesPerBatch,
				})

				// If first batch of images is empty, there is no images
				if (files.length === params.offset === 0) {
					this.isEmpty = true
				}

				// If we get less files than requested that means we got to the end
				if (files.length !== numberOfImagesPerBatch) {
					this.done = true
				}

				/** The goal of this flat map is to return an array of images separated by titles (months)
				 * ie: [{month1}, {image1}, {image2}, {month2}, {image3}, {image4}, {image5}]
				 * First we get the current month+year of the image
				 * We compare it to the previous image month+year
				 * If there is a difference we have to insert a title object before the current image
				 * If it's equal we just add the current image to the array
				 * Note: the injected param of objects are used to pass custom params to the grid lib
				 * In our case injected could be an image/video (aka file) or a title (year/month)
				 * Note2: titles are rendered full width and images are rendered on 1 column and 256x256 ratio
				 */
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
							columnSpan: 0, // means full width
							newRow: true,
							renderComponent: SeparatorVirtualGrid,
						})
						this.lastSection = currentSection // we keep track of the last section for the next batch
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
				} else if (params.offset === 0) { // if we get an error at first batch we assume list is empty
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
$previous: 0;
@each $size, $config in get('sizes') {
	$marginTop: map-get($config, 'marginTop');
	$marginW: map-get($config, 'marginW');
	// if this is the last entry, only use min-width
	$rule: '(min-width: #{$previous}px) and (max-width: #{$size}px)';
	@if $size == 'max' {
		$rule: '(min-width: #{$previous}px)';
	}
	@media #{$rule} {
		.grid-container {
			padding: #{$marginTop}px #{$marginW}px #{$marginW}px #{$marginW}px;
		}
	}
	$previous: $size;
}
</style>

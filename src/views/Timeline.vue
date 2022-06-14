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
	<EmptyContent v-if="error === 404" illustration-name="folder">
		{{ t('photos', 'This folder does not exist') }}
	</EmptyContent>
	<EmptyContent v-else-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Folder content -->
	<div v-else>
		<Navigation v-if="isEmpty"
			key="navigation"
			:basename="path"
			:filename="'/'"
			:root-title="rootTitle" />

		<div v-else class="photos-container">
			<PhotosHeader :selection="selection" @uncheck-items="onUncheckItems" />

			<Loader v-if="nbFetchedFiles === 0 && loading" />

			<TiledLayout ref="tiledLayout" :items="itemsList">
				<VirtualScrolling slot-scope="{rows}"
					:use-window="true"
					:rows="rows"
					@need-content="getContent">
					<TiledRows slot-scope="{renderedRows}" :rows="renderedRows">
						<template slot-scope="{row, item}">
							<h3 v-if="item.sectionHeader" class="section-header">
								<!-- TODO: uncomment to activate section selection -->
								<!-- <CheckboxRadioSwitch v-if="allowSelection"
								class="selection-checkbox"
								:checked="selectedSections[item.id]"
								@update:checked="(value) => onSectionToggle(item.id)"> -->
								<b>{{ item.id | dateMonth }}</b>
								{{ item.id | dateYear }}
								<!-- </CheckboxRadioSwitch> -->
							</h3>

							<File v-else
								:item="files[item.id]"
								:allow-selection="true"
								:selected="selectedItems[item.id] === true"
								:visibility="row.visibility"
								:semaphore="semaphore"
								@click="openViewer"
								@select-toggled="onItemSelectToggle" />
						</template>
					</TiledRows>
				</VirtualScrolling>
			</TiledLayout>

			<Loader v-if="loading" />

			<EmptyContent v-if="isEmpty" illustration-name="empty">
				{{ t('photos', 'No photos in here') }}
			</EmptyContent>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import moment from '@nextcloud/moment'

import cancelableRequest from '../utils/CancelableRequest.js'

import getPhotos from '../services/PhotoSearch.js'
import { allMimes } from '../services/AllowedMimes.js'
import logger from '../services/logger.js'

import TiledLayout from '../components/TiledLayout.vue'
import TiledRows from '../components/TiledRows.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import PhotosHeader from '../components/PhotosHeader.vue'
import EmptyContent from '../components/EmptyContent.vue'
import File from '../components/File.vue'
import Navigation from '../components/Navigation.vue'
import Loader from '../components/Loader.vue'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'

export default {
	name: 'Timeline',
	components: {
		EmptyContent,
		Navigation,
		TiledLayout,
		TiledRows,
		VirtualScrolling,
		PhotosHeader,
		Loader,
		File,
	},

	filters: {
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateMonth(date) {
			return moment(date, 'YYYYMM').format('MMMM')
		},
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateYear(date) {
			return moment(date, 'YYYYMM').format('YYYY')
		},
	},

	beforeRouteLeave(from, to, next) {
		// cancel any pending requests
		if (this.cancelRequest) {
			this.cancelRequest('Changed view')
		}
		this.resetState()
		return next()
	},

	props: {
		onlyFavorites: {
			type: Boolean,
			default: false,
		},
		mimesType: {
			type: Array,
			default: () => allMimes,
		},
		rootTitle: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			default: '',
		},
		onThisDay: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			loading: false,
			cancelRequest: null,
			done: false,
			error: null,
			selectedItems: {},
			nbFetchedFiles: 0,
			semaphore: new SemaphoreWithPriority(30),
			semaphoreSymbol: null,
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
		]),

		/**
		 * List of loaded medias.
		 *
		 * @return {import('../services/TiledLayout').TiledItem[]}
		 */
		fileList() {
			const today = moment().format('DDMM')
			return Object.values(this.files)
				.filter(file => !this.onlyFavorites || file.favorite === 1)
				.filter(file => this.mimesType.includes(file.mime))
				.filter(file => !this.onThisDay || file.day === today)
				.map(file => ({
					id: file.fileid,
					width: file.fileMetadataSizeParsed.width,
					height: file.fileMetadataSizeParsed.height,
					ratio: file.fileMetadataSizeParsed.width / file.fileMetadataSizeParsed.height,
				}))
		},

		/**
		 * @return {Object<string, import('../services/TiledLayout').TiledItem[]>}
		 */
		fileListByMonth() {
			const itemsByMonth = {}
			for (const item of this.fileList) {
				itemsByMonth[this.files[item.id].month] = itemsByMonth[this.files[item.id].month] ?? []
				itemsByMonth[this.files[item.id].month].push(item)
			}
			return itemsByMonth
		},

		/**
		 * @return {import('../services/TiledLayout').TiledItem[]}
		 */
		itemsList() {
			const fileListByMonth = this.fileListByMonth
			return Object
				.keys(fileListByMonth)
				.sort((date1, date2) => date1 > date2 ? -1 : 1)
				.flatMap((month) => {
					// Insert month item in the list.
					return [
						{
							id: month,
							sectionHeader: true,
							height: 75,
						},
						...fileListByMonth[month].sort((item1, item2) => this.files[item1.id].timestamp > this.files[item2.id].timestamp ? -1 : 1),
					]
				})
		},

		/**
		 * Is current folder empty?
		 *
		 * @return  {boolean}
		 */
		isEmpty() {
			return this.fileList.length === 0
		},

		/**
		 * Is current folder empty?
		 *
		 * @type {Object<string, boolean>}
		 */
		selectedSections() {
			return Object.entries(this.fileListByMonth)
				.reduce((selectedSections, [month, items]) => {
					return {
						...selectedSections,
						[month]: !items.some((item) => this.selectedItems[item.id] !== true),
					}
				}, {})
		},

		/** @return {import('../services/TiledLayout').TiledItem[]} */
		selection() {
			return Object.keys(this.selectedItems).filter(fileId => this.selectedItems[fileId])
		},
	},

	watch: {
		$route(from, to) {
			// cancel any pending requests
			if (this.cancelRequest) {
				this.cancelRequest('Changed view')
			}
			this.resetState()
			this.getContent()
		},
		async onThisDay() {
			// reset component
			this.resetState()
			this.getContent()
		},
	},

	mounted() {
		this.getContent()
	},

	beforeDestroy() {
		// cancel any pending requests
		if (this.cancelRequest) {
			this.cancelRequest('Changed view')
		}
	},

	methods: {
		/**
		 * Return next batch of data depending on global offset
		 */
		async getContent() {
			if (this.done || this.loading) {
				return
			}

			try {
				this.loading = true
				this.semaphoreSymbol = await this.semaphore.acquire(() => 0, 'timeline')

				const { request, cancel } = cancelableRequest(getPhotos)
				this.cancelRequest = cancel

				const numberOfImagesPerBatch = 1000

				// Load next batch of images
				const files = await request(this.onlyFavorites, {
					// We reuse already fetched files in the store when moving from one tab to another, but to make sure that we have all the files, we keep an internal counter (nbFetchedFiles).
					// Some files will be fetched twice, but we have less loading time when switching between tabs.
					firstResult: this.nbFetchedFiles,
					nbResults: numberOfImagesPerBatch,
					mimesType: this.mimesType,
					onThisDay: this.onThisDay,
				})

				// If we get less files than requested that means we got to the end
				if (files.length !== numberOfImagesPerBatch) {
					this.done = true
				}

				this.nbFetchedFiles += files.length

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
				logger.error('Error fetching timeline', error)
			} finally {
				this.loading = false
				this.cancelRequest = null
				await this.semaphore.release(this.semaphoreSymbol)
				this.semaphoreSymbol = null
			}
		},

		/**
		 * Reset this component data to a pristine state
		 */
		resetState() {
			this.done = false
			this.error = null
			this.lastSection = ''
			this.loading = false
			this.nbFetchedFiles = 0
			this.$refs.tiledLayout?.$el.scrollTo(0, 0)
		},

		onItemSelectToggle({ id, value }) {
			this.$set(this.selectedItems, id, value)
		},

		// onSectionToggle(sectionId) {
		// const shouldCheck = !this.selectedSections[sectionId]
		// this.fileListByMonth[sectionId].forEach(item => this.$set(this.selectedItems, item.id, shouldCheck))
		// },

		onUncheckItems(itemIds) {
			itemIds.forEach(itemId => this.$set(this.selectedItems, itemId, false))
		},

		openViewer(itemId) {
			const item = this.files[itemId]
			OCA.Viewer.open({
				path: item.filename,
				list: this.itemsList.filter(item => !item.sectionHeader).map(item => this.files[item.id]),
				loadMore: item.loadMore ? async () => await item.loadMore(true) : () => [],
				canLoop: item.canLoop,
			})
		},
	},
}
</script>
<style lang="scss" scoped>
	.section-header {
		padding: 32px 0 16px 2px;
	}
</style>

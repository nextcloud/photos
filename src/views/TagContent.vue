<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Corentin Mors <medias@pixelswap.fr>
 - @author Marcel Klehr <mklehr@gmx.net>
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
	<NcEmptyContent v-if="error" :title="t('photos', 'An error occurred')" />

	<NcLoadingIcon v-else-if="loading" class="loader" />

	<!-- Folder content -->
	<div v-else>
		<div class="photos-navigation">
			<NcActions class="photos-navigation__back">
				<NcActionButton @click="$router.push({name: 'tags'})">
					<template #icon>
						<ArrowLeft />
					</template>
					{{ t('photos', 'Back to tags overview') }}
				</NcActionButton>
			</NcActions>
			<h2 class="photos-navigation__title">
				{{ path }}
			</h2>
		</div>
		<div class="heading-subline">
			{{ n('photos', '%n photo', '%n photos', fileIds.length,) }}
		</div>
		<NcEmptyContent v-if="isEmpty" :title="t('photos', 'No photos with this tag yet')" />

		<FilesListViewer class="tag__photos"
			:container-element="appContent"
			:file-ids="fileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loading">
			<File slot-scope="{file, distance}"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:distance="distance"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

import { NcEmptyContent, NcActions, NcActionButton, NcLoadingIcon, isMobile } from '@nextcloud/vue'

import File from '../components/File.vue'
import FilesListViewer from '../components/FilesListViewer.vue'

import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'

export default {
	name: 'TagContent',
	components: {
		File,
		FilesListViewer,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcLoadingIcon,
		ArrowLeft,
	},
	mixins: [
		isMobile,
		FilesSelectionMixin,
		AbortControllerMixin,
	],
	props: {
		path: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			error: null,
			loading: false,
			appContent: document.getElementById('app-content-vue'),
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
		fileIds() {
			return this.tag ? this.tag.files : []
		},

		isEmpty() {
			return this.fileIds.length === 0
		},
	},

	watch: {
		async path() {
			this.fetchContent()
		},
	},

	async beforeMount() {
		this.fetchContent()
	},

	methods: {
		async fetchContent() {
			// close any potential opened viewer
			OCA.Viewer.close()

			this.loading = true
			this.error = null

			try {
				// if we don't already have some cached data let's show a loader
				if (!this.tags[this.tagId]) {
					await this.$store.dispatch('fetchAllTags', { signal: this.abortController.signal })
				}

				await this.$store.dispatch('fetchTagFiles', { id: this.tagId, signal: this.abortController.signal })
			} catch (error) {
				console.error(error)
				this.error = true
			} finally {
				// done loading
				this.loading = false
			}
		},

		openViewer(fileId) {
			const file = this.files[fileId]
			OCA.Viewer.open({
				path: file.filename,
				list: this.fileIds.map(fileId => this.files[fileId]),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},
	},
}
</script>
<style scoped lang="scss">
.loader {
	margin-top: 30vh;
}

.photos-navigation {
	display: flex;
	height: 44px;
	padding: 0 40px;
	align-items: center;
	max-width: 100%;

	h2 {
		padding: 0;
		margin: 0;
	}
}

.heading-subline {
	margin-left: 85px;
	margin-top: -11px;
	color: var(--color-text-maxcontrast);
}

.tag__photos {
	padding: 0 64px;
}
</style>

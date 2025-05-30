<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')" />

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
		<NcEmptyContent v-if="isEmpty" :name="t('photos', 'No photos with this tag yet')" />

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

<script lang='ts'>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'
import { useIsMobile } from '@nextcloud/vue/dist/Composables/useIsMobile.js'
import { translatePlural as n, translate as t } from '@nextcloud/l10n'

import File from '../components/File.vue'
import FilesListViewer from '../components/FilesListViewer.vue'

import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import { toViewerFileInfo } from '../utils/fileUtils.js'
import logger from '../services/logger.js'

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
		FilesSelectionMixin,
		AbortControllerMixin,
	],
	props: {
		path: {
			type: String,
			default: '',
		},
	},

	setup() {
		return {
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			error: null as boolean|null,
			loading: false,
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		tags() {
			return this.$store.state.systemtags.tags
		},

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
			return this.$store.state.systemtags.tagsFiles[this.tagId]
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
			window.OCA.Viewer.close()

			this.loading = true
			this.error = null

			try {
				// if we don't already have some cached data let's show a loader
				if (!this.tags[this.tagId]) {
					await this.$store.dispatch('fetchAllTags', { signal: this.abortController.signal })
				}

				if (this.tag && !this.fileIds) {
					await this.$store.dispatch('fetchTagFiles', { id: this.tagId, signal: this.abortController.signal })
				}
			} catch (error) {
				logger.error('Failed to fetch tags', { error })
				this.error = true
			} finally {
				// done loading
				this.loading = false
			}
		},

		openViewer(fileId: number) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: this.fileIds.map(fileId => toViewerFileInfo(this.files[fileId])),
			})
		},

		t,
		n,
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

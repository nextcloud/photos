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
	<EmptyContent v-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Folder content -->
	<div v-else-if="!loading">
		<div class="photos-navigation">
			<Actions class="photos-navigation__back">
				<ActionButton @click="$router.push({name: 'tags'})">
					<template #icon>
						<ArrowLeft />
					</template>
					{{ t('photos', 'Back to tags overview') }}
				</ActionButton>
			</Actions>
			<h2 class="photos-navigation__title">
				{{ t('photos', category) }}
			</h2>
		</div>
		<EmptyContent v-if="isEmpty" key="emptycontent" illustration-name="empty">
			{{ t('photos', 'No tags yet') }}
			<template #desc>
				{{ t('photos', 'Photos with tags will show up here') }}
			</template>
		</EmptyContent>

		<FilesListViewer class="category__photos"
			:use-window="true"
			:file-ids="fileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loading">
			<File slot-scope="{file, visibility}"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:visibility="visibility"
				:semaphore="semaphore"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft'

import EmptyContent from '../components/EmptyContent'
import File from '../components/File'

import FilesListViewer from '../components/FilesListViewer'
import { isMobile } from '@nextcloud/vue'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin'
import { CATEGORIES } from '../services/Things'

export default {
	name: 'CategoryContent',
	components: {
		File,
		FilesListViewer,
		EmptyContent,
		Actions,
		ActionButton,
		ArrowLeft,
	},
	mixins: [
		isMobile,
		FilesSelectionMixin,
	],
	props: {
		category: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			error: null,
			loading: false,
			semaphore: new SemaphoreWithPriority(30),
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
		tagIds() {
			return CATEGORIES[this.category]
				.map(tagName => this.tagsNames[tagName])
				.filter(Boolean)
		},

		// files list of the current category
		fileIds() {
			return [...new Set(this.tagIds.flatMap(tagId => this.tags[tagId].files))]
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

			if (!this.tagIds.length) {
				await this.$store.dispatch('fetchAllTags')
			}
			this.error = null

			try {
				await Promise.all(this.tagIds.map(tagId =>
					this.$store.dispatch('fetchTagFiles', { id: tagId })
				))
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
</style>

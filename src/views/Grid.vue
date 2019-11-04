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
		{{ t('photos', 'This folder does not contain pictures') }}
	</EmptyContent>

	<!-- Folder content -->
	<transition-group v-else
		class="photos-grid"
		role="grid"
		name="list"
		tag="div">
		<Navigation v-if="folder" key="navigation" v-bind="folder" />
		<Folder v-for="dir in folderList" :key="dir.id" :folder="dir" />
		<File v-for="file in fileList" :key="file.id" v-bind="file" />
		<div key="footer" role="none" class="photos-grid__footer-spacer" />
	</transition-group>
</template>

<script>
import { mapGetters } from 'vuex'

// import getFolder from '../services/FolderInfo'
import getPictures from '../services/FileList'
// import searchPhotos from '../services/PhotoSearch'

import EmptyContent from './EmptyContent'
import Folder from '../components/Folder'
import File from '../components/File'
import Navigation from '../components/Navigation'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Grid',
	components: {
		EmptyContent,
		File,
		Folder,
		Navigation,
	},
	props: {
		path: {
			type: String,
			default: '/',
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
			'folders',
		]),

		// current folder id from current path
		folderId() {
			return this.$store.getters.folderId(this.path)
		},

		// files list of the current folder
		folder() {
			return this.files[this.folderId]
		},
		folderContent() {
			return this.folders[this.folderId]
		},
		fileList() {
			const t0 = performance.now()
			const list = this.folderContent
				&& this.folderContent
					.map(id => this.files[id])
					.filter(file => !!file)
			const t1 = performance.now()
			console.debug('perf: fileList', `${t1 - t0}ms`)
			return list
		},

		// subfolders of the current folder
		subFolders() {
			return this.folderId
				&& this.files[this.folderId]
				&& this.files[this.folderId].folders
		},
		folderList() {
			const t0 = performance.now()
			const list = this.subFolders
				&& this.subFolders
					.map(id => this.files[id])
					.filter(file => !!file)
			const t1 = performance.now()
			console.debug('perf: folderList', `${t1 - t0}ms`)
			return list
		},

		// is current folder empty?
		isEmpty() {
			return !this.haveFiles && !this.haveFolders
		},
		haveFiles() {
			return !!this.fileList && this.fileList.length !== 0
		},
		haveFolders() {
			return !!this.folderList && this.folderList.length !== 0
		},
	},

	watch: {
		path(path) {
			console.debug('changed:', path)
			this.fetchFolderContent()
		},
	},

	async beforeMount() {
		console.debug('beforemount: GRID')
		this.fetchFolderContent()
	},

	methods: {
		async fetchFolderContent() {
			console.debug('start: fetchFolderContent', this.path)
			// cancel any pending requests
			this.cancelRequest()

			// close any potential opened viewer
			OCA.Viewer.close()

			// if we don't already have some cached data let's show a loader
			if (!this.files[this.folderId]) {
				this.$emit('update:loading', true)
			}
			this.error = null

			// init cancellable request
			const { request, cancel } = cancelableRequest(getPictures)
			this.cancelRequest = cancel

			try {
				// get content and current folder info
				const { folder, folders, files } = await request(this.path)
				this.$store.dispatch('addPath', { path: this.path, id: folder.id })
				this.$store.dispatch('updateFolders', { id: folder.id, files, folders })
				this.$store.dispatch('updateFiles', { folder, files, folders })
				console.debug('end: fetchFolderContent', this.path)
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.error = 404
						setTimeout(() => {
							this.$router.push({ name: 'root' })
						}, 3000)
					} else {
						this.error = error
					}
				}
				// cancelled request, moving on...
				console.error(error)
				console.debug('cancelled: fetchFolderContent', this.path)
			} finally {
				// done loading even with errors
				this.$emit('update:loading', false)
			}
		},
	},

}
</script>

<style lang="scss">
.photos-grid {
	display: grid;
	align-items: center;
	justify-content: center;
	gap: 8px;
	grid-template-columns: repeat(10, 1fr);
	position: relative;
	// always put one more row of grid for the spacer
	&__footer-spacer {
		// always add one row, so placing it on the first
		// column will always add one more
		grid-column: 1;
		// same height as the width
		padding-bottom: 100%;
	}
}

.list-move {
	transition: transform var(--animation-quick);
}

// TODO: use mixins/GridSizes as soon as node-sass supports it
// needs node-sass 5.0 (with libsass 3.6)
// https://github.com/sass/node-sass/pull/2312
$previous: 0;
@each $size, $config in get('sizes') {
	$count: map-get($config, 'count');
	$marginTop: map-get($config, 'marginTop');
	$marginW: map-get($config, 'marginW');

	// if this is the last entry, only use min-width
	$rule: '(min-width: #{$previous}px) and (max-width: #{$size}px)';
	@if $size == 'max' {
		$rule: '(min-width: #{$previous}px)';
	}

	@media #{$rule} {
		.photos-grid {
			padding: #{$marginTop}px #{$marginW}px #{$marginW}px #{$marginW}px;
			grid-template-columns: repeat($count, 1fr);
		}
	}
	$previous: $size;
}
</style>

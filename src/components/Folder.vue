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
	<router-link :class="{'folder--clear': isEmpty}"
		class="folder"
		:to="to"
		:aria-label="ariaLabel">
		<transition name="fade">
			<div v-show="loaded"
				:class="`folder-content--grid-${fileList.length}`"
				class="folder-content"
				role="none">
				<img v-for="file in fileList"
					:key="file.fileid"
					:src="generateImgSrc(file)"
					alt=""
					@load="loaded = true">
			</div>
		</transition>
		<div
			class="folder-name">
			<span :class="[!isEmpty ? 'icon-white' : 'icon-dark', icon]"
				class="folder-name__icon"
				role="img" />
			<p :id="ariaUuid" class="folder-name__name">
				{{ basename }}
			</p>
		</div>
		<div class="cover" role="none" />
	</router-link>
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import { mapGetters } from 'vuex'

import getAlbumContent from '../services/AlbumContent'
import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Folder',
	inheritAttrs: false,

	props: {
		basename: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		fileid: {
			type: Number,
			required: true,
		},
		icon: {
			type: String,
			default: 'icon-folder',
		},
		showShared: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			loaded: false,
			cancelRequest: () => {},
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'folders',
		]),

		// files list of the current folder
		folderContent() {
			return this.folders[this.fileid]
		},
		fileList() {
			return this.folderContent
				? this.folderContent
					.slice(0, 4) // only get the 4 first images
					.map(id => this.files[id])
					.filter(file => !!file)
				: []
		},

		// folder is empty
		isEmpty() {
			return this.fileList.length === 0
		},

		ariaUuid() {
			return `folder-${this.fileid}`
		},
		ariaLabel() {
			return t('photos', 'Open the "{name}" sub-directory', { name: this.basename })
		},

		/**
		 * We do not want encoded slashes when browsing by folder
		 * so we generate a new valid route object, get the final url back
		 * decode it and use it as a direct string, which vue-router
		 * does not encode afterwards
		 * @returns {string}
		 */
		to() {
			const route = Object.assign({}, this.$route, {
				// always remove first slash
				params: { path: this.filename.substr(1) },
			})
			return decodeURIComponent(this.$router.resolve(route).resolved.path)
		},
	},

	async created() {
		// init cancellable request
		const { request, cancel } = cancelableRequest(getAlbumContent)
		this.cancelRequest = cancel

		try {
			// get data
			const { folder, folders, files } = await request(this.filename, {shared: this.showShared})
			this.$store.dispatch('updateFolders', { fileid: folder.fileid, files, folders })
			this.$store.dispatch('updateFiles', { folder, files, folders })
		} catch (error) {
			if (error.response && error.response.status) {
				console.error('Failed to get folder content', this.folder, error.response)
			}
			// else we just cancelled the request
		}
	},

	beforeDestroy() {
		this.cancelRequest('Navigated away')
	},

	methods: {
		generateImgSrc({ fileid, etag }) {
			// use etag to force cache reload if file changed
			return generateUrl(`/core/preview?fileId=${fileid}&x=${256}&y=${256}&a=true&v=${etag}`)
		},

		fetch() {
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/FileFolder.scss';

.folder-content {
	position: absolute;
	display: grid;
	width: 100%;
	height: 100%;
	// folder layout if less than 4 pictures
	&--grid-1 {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
	&--grid-2 {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
	}
	&--grid-3 {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		img:first-child {
			grid-column: span 2;
		}
	}
	&--grid-4 {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}
	img {
		width: 100%;
		height: 100%;

		object-fit: cover;
	}
}

$name-height: 1.2rem;

.folder-name {
	position: absolute;
	z-index: 3;
	display: flex;
	overflow: hidden;
	flex-direction: column;
	width: 100%;
	height: 100%;
	transition: opacity var(--animation-quick) ease-in-out;
	opacity: 1;
	&__icon {
		height: 40%;
		margin-top: calc(30% - #{$name-height} / 2); // center name+icon
		background-size: 40%;
	}
	&__name {
		overflow: hidden;
		height: $name-height;
		padding: 0 10px;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-main-background);
		text-shadow: 0 0 8px var(--color-main-text);
		font-size: $name-height;
		line-height: $name-height;
	}
}

// Cover management empty/full
.folder {
	// if no img, let's display the folder icon as default black
	&--clear {
		.folder-name__icon {
			opacity: .3;
		}
		.folder-name__name {
			color: var(--color-main-text);
			text-shadow: 0 0 8px var(--color-main-background);
		}
	}

	// show the cover as background
	// if  there are pictures in it
	// so we can sho the folder+name above it
	&:not(.folder--clear) {
		.cover {
			opacity: .3;
		}

		// hide everything but pictures
		// on hover/active/focus
		&.active,
		&:active,
		&:hover,
		&:focus {
			.folder-name,
			.cover {
				opacity: 0;
			}
		}
	}
}

</style>

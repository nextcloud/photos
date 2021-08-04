<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<router-link :class="{'folder--clear': isEmpty}"
		class="folder"
		:to="to"
		:aria-label="ariaLabel">
		<!-- Images preview -->
		<transition name="fade">
			<div v-show="loaded"
				:class="`folder-content--grid-${previewList.length}`"
				class="folder-content"
				role="none">
				<img v-for="file in previewList"
					:key="file.fileid"
					:src="generateImgSrc(file)"
					alt=""
					@load="loaded = true"
					@error="onPreviewFail(file)">
			</div>
		</transition>

		<div
			class="folder-name">
			<span :class="[!isEmpty ? 'icon-white' : 'icon-dark', icon]"
				class="folder-name__icon"
				role="img" />
			<p :id="ariaUuid" class="folder-name__name">
				{{ name }}
			</p>
		</div>

		<div class="cover" role="none" />
	</router-link>
</template>

<script>
import { generateUrl } from '@nextcloud/router'

export default {
	name: 'FolderTagPreview',

	props: {
		icon: {
			type: String,
			default: 'icon-folder',
		},
		id: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		fileList: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			loaded: false,
			failed: [],
		}
	},

	computed: {
		// folder is empty
		isEmpty() {
			return this.previewList.length === 0
		},

		ariaUuid() {
			return `folder-${this.id}`
		},
		ariaLabel() {
			return t('photos', 'Open the "{name}" sub-directory', { name: this.name })
		},

		/**
		 * Previews list without the failed ones
		 *
		 * @return {object[]} the previews fileinfo
		 */
		previewList() {
			return this.fileList
				.filter(file => this.failed.indexOf(file.fileid) === -1)
		},

		/**
		 * We do not want encoded slashes when browsing by folder
		 * so we generate a new valid route object based on the
		 * current named route, get the final url back, decode it
		 * and use it as a direct string.
		 * Which vue-router does not encode afterwards!
		 *
		 * @return {string}
		 */
		to() {
			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.+)/i
			const path = regex.exec(this.path)[1]

			// apply to current route
			return Object.assign({}, this.$route, {
				params: { path: path.split('/') },
			})
		},
	},

	methods: {
		generateImgSrc({ fileid, etag }) {
			// use etag to force cache reload if file changed
			return generateUrl(`/core/preview?fileId=${fileid}&x=${256}&y=${256}&a=true&v=${etag}`)
		},
		onPreviewFail({ fileid }) {
			this.failed.push(fileid)
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

$name-height: 1rem;

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

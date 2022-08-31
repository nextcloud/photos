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
	<FolderTagPreview :id="item.injected.id"
		icon="icon-tag"
		:name="item.injected.displayName"
		:path="item.injected.displayName"
		:file-list="fileList" />
</template>

<script>
import { mapGetters } from 'vuex'

import getTaggedImages from '../services/TaggedImages'
import FolderTagPreview from './FolderTagPreview'
import AbortControllerMixin from '../mixins/AbortControllerMixin'

export default {
	name: 'Tag',

	components: {
		FolderTagPreview,
	},

	mixins: [
		AbortControllerMixin,
	],
	inheritAttrs: false,

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'tags',
		]),

		// files list of the current folder
		folderContent() {
			return this.tags[this.item.injected.id].files
		},
		fileList() {
			return this.folderContent
				? this.folderContent
					.map(id => this.files[id])
					.filter(file => !!file)
					.slice(0, 4) // only get the 4 first images
				: []
		},
	},

	async created() {
		try {
			// get data
			const files = await getTaggedImages(this.item.injected.id, {
				signal: this.abortController.signal,
			})
			this.$store.dispatch('updateTag', { id: this.item.injected.id, files })
			this.$store.dispatch('appendFiles', files)
		} catch (error) {
			if (error.response && error.response.status) {
				console.error('Failed to get folder content', this.item.injected.id, error.response)
			}
		}
	},

}
</script>

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
	<FolderTagPreview :id="id"
		icon="icon-tag"
		:name="displayName"
		:path="displayName"
		:file-list="fileList" />
</template>

<script>
import { mapGetters } from 'vuex'

import getTaggedImages from '../services/TaggedImages'
import cancelableRequest from '../utils/CancelableRequest'
import FolderTagPreview from './FolderTagPreview'

export default {
	name: 'Tag',

	components: {
		FolderTagPreview,
	},
	inheritAttrs: false,

	props: {
		displayName: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			cancelRequest: () => {},
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'tags',
		]),

		// files list of the current folder
		folderContent() {
			return this.tags[this.id].files
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

	beforeDestroy() {
		this.cancelRequest('Navigated away')
	},

	async created() {
		// init cancellable request
		const { request, cancel } = cancelableRequest(getTaggedImages)
		this.cancelRequest = cancel

		try {
			// get data
			const files = await request(this.id)
			this.$store.dispatch('updateTag', { id: this.id, files })
			this.$store.dispatch('appendFiles', files)
		} catch (error) {
			if (error.response && error.response.status) {
				console.error('Failed to get folder content', this.id, error.response)
			}
			// else we just cancelled the request
		}
	},

}
</script>

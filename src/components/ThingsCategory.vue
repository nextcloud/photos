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
	<div v-show="folderContent.length" class="things-category">
		<FolderTagPreview :id="Object.keys(CATEGORIES).indexOf(title)"
			icon="icon-tag"
			:name="t('photos', title)"
			:to="{name:'categorycontent', params:{category: title}}"
			:file-list="fileList" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import FolderTagPreview from './FolderTagPreview'
import { CATEGORIES } from '../services/Things'

export default {
	name: 'ThingsCategory',

	components: {
		FolderTagPreview,
	},
	inheritAttrs: false,

	props: {
		title: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			CATEGORIES,
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'tags',
			'tagsNames',
		]),

		// tags list of the current category
		categoryTags() {
			return CATEGORIES[this.title]
				.map(tagName => this.tags[this.tagsNames[tagName]])
				.filter(Boolean)
		},

		// files list of the current category
		folderContent() {
			return this.categoryTags.flatMap(tag => tag.files)
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
		Promise.all(this.categoryTags.map(tag =>
			this.$store.dispatch('fetchTagFiles', { id: tag.id })
		))
	},

}
</script>
<style scoped lang="scss">
.things-category {
	height: 250px;
	width: 250px;
}
</style>

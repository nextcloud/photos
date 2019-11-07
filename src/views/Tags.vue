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
	<!-- <EmptyContent v-if="error === 404" illustration-name="folder">
		{{ t('photos', 'This folder does not exists') }}
	</EmptyContent>
	<EmptyContent v-else-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>
	<EmptyContent v-else-if="!loading && isEmpty" illustration-name="empty">
		{{ t('photos', 'This folder does not contain pictures') }}
	</EmptyContent> -->

	<!-- Folder content -->
	<!-- <Grid v-else>
		<Navigation v-if="folder" key="navigation" v-bind="folder" />
		<Folder v-for="dir in folderList" :key="dir.id" :folder="dir" />
		<File v-for="file in fileList" :key="file.id" v-bind="file" />
	</Grid> -->
	<span>Test</span>
</template>

<script>
import { mapGetters } from 'vuex'

import getSystemTags from '../services/SystemTags'

import EmptyContent from './EmptyContent'
import Folder from '../components/Folder'
import File from '../components/File'
import Grid from '../components/Grid'
import Navigation from '../components/Navigation'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Tags',
	components: {
		EmptyContent,
		File,
		Folder,
		Grid,
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
			'tags',
		]),
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
			await getSystemTags()
		},
	},

}
</script>

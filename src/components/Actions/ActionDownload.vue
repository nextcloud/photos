<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
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
	<NcActionLink :close-after-click="true"
		:href="downloadUrl"
		:download="downloadUrl"
		:aria-label="title">
		{{ title }}
		<slot slot="icon" name="icon" />
	</NcActionLink>
</template>

<script>
import { mapGetters } from 'vuex'

import { generateUrl } from '@nextcloud/router'
import { NcActionLink } from '@nextcloud/vue'

export default {
	name: 'ActionDownload',

	components: {
		NcActionLink,
	},

	props: {
		title: {
			type: String,
			required: true,
		},

		selectedFileIds: {
			type: Array,
			required: true,
		},
	},

	computed: {
		...mapGetters([
			'files',
		]),

		downloadUrl() {
			const params = new URLSearchParams()
			const filePaths = this.fileNames.map(fileName => '/' + fileName.split('/').splice(3).join('/'))
			params.append('files', JSON.stringify(filePaths))

			return generateUrl(`/apps/files/ajax/download.php?${params}`)
		},

		fileNames() {
			return this.selectedFileIds.map(fileId => this.files[fileId].filename)
		},
	},
}
</script>

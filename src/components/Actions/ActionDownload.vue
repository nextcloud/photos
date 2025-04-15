<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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

<script lang='ts'>
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

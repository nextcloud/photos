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
import type { PropType } from 'vue'

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
			type: Array as PropType<string[]>,
			required: true,
		},
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		downloadUrl() {
			const params = new URLSearchParams()
			params.append('files', JSON.stringify(this.paths))

			// TODO: FIX ME
			return generateUrl(`/apps/files/ajax/download.php?${params}`)
		},

		paths() {
			return this.selectedFileIds.map(fileId => this.files[fileId].path)
		},
	},
}
</script>

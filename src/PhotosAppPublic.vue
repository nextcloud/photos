<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent appName="photos">
		<!--
		Needed for isPublicShare to return true
		https://github.com/nextcloud-libraries/nextcloud-sharing/blob/15f38dfdeb2c72501008e5ae89d3eb424b83aed5/lib/publicShare.ts#L12-L20
		 -->
		<input
			id="isPublic"
			type="hidden"
			name="isPublic"
			value="1">
		<NcAppContent>
			<router-view />

			<!-- svg img loading placeholder (linked to the File component) -->
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="svgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="imgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="videoplaceholder" />
		</NcAppContent>
	</NcContent>
</template>

<script setup lang="ts">
import { generateUrl } from '@nextcloud/router'
import { onBeforeMount, onBeforeUnmount } from 'vue'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcContent from '@nextcloud/vue/components/NcContent'
import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'
import { logger } from './services/logger.ts'

/**
 * Register the service worker once the page is loaded, to keep the load performant.
 */
async function registerServiceWorker() {
	try {
		const url = generateUrl('/apps/photos/service-worker.js', {}, { noRewrite: true })
		const registration = await navigator.serviceWorker.register(url, { scope: generateUrl('/apps/photos') })
		logger.debug('SW registered: ', { registration })
	} catch (error) {
		logger.error('SW registration failed: ', { error })
	}
}

onBeforeMount(() => {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', registerServiceWorker)
	} else {
		logger.debug('Service Worker is not enabled on this browser.')
	}
})

onBeforeUnmount(() => {
	window.removeEventListener('load', registerServiceWorker)
})
</script>

<style lang="scss">
.app-content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-content: space-between;
}

.app-navigation__photos:deep(.app-navigation-entry-icon.icon-photos) {
	background-size: 20px;
}
</style>

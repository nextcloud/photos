<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent app-name="photos">
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

<script lang='ts'>
import { generateUrl } from '@nextcloud/router'

import { NcContent, NcAppContent } from '@nextcloud/vue'

import logger from './services/logger.js'
import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'

export default {
	name: 'PhotosPublic',
	components: {
		NcAppContent,
		NcContent,
	},
	data() {
		return {
			svgplaceholder,
			imgplaceholder,
			videoplaceholder,
		}
	},

	async beforeMount() {
		if ('serviceWorker' in navigator) {
			// Use the window load event to keep the page load performant
			window.addEventListener('load', async () => {
				try {
					const url = generateUrl('/apps/photos/service-worker.js', {}, { noRewrite: true })
					const registration = await navigator.serviceWorker.register(url, { scope: generateUrl('/apps/photos') })
					logger.debug('SW registered: ', { registration })
				} catch (error) {
					logger.error('SW registration failed: ', { error })
				}
			})
		} else {
			logger.debug('Service Worker is not enabled on this browser.')
		}
	},

	beforeDestroy() {
		window.removeEventListener('load', () => {
			navigator.serviceWorker.register(generateUrl('/apps/photos/service-worker.js', {}, {
				noRewrite: true,
			}))
		})
	},
}
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

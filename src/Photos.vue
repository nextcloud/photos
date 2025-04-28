<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent app-name="photos">
		<NcAppNavigation :aria-label="t('photos', 'Photos')">
			<template #list>
				<NcAppNavigationItem :to="{name: 'all_media'}"
					:name="t('photos', 'All media')"
					class="app-navigation__all_media"
					data-id-app-nav-item="all-media"
					exact>
					<ImageIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/photos"
					:name="t('photos', 'Photos')"
					data-id-app-nav-item="photos">
					<Camera slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/videos"
					:name="t('photos', 'Videos')"
					data-id-app-nav-item="videos">
					<VideoIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'albums'}"
					:name="t('photos', 'Albums')"
					data-id-app-nav-item="albums">
					<FolderMultipleImage slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'sharedAlbums'}"
					:name="t('photos', 'Collaborative albums')"
					data-id-app-nav-item="shared-albums">
					<AccountGroup slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="showPeopleMenuEntry"
					:to="{name: 'faces'}"
					:name="t('photos', 'People')"
					data-id-app-nav-item="faces">
					<template #icon>
						<AccountBoxMultipleOutline :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'folders'}"
					:name="t('photos', 'Folders')"
					data-id-app-nav-item="folders">
					<Folder slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/favorites"
					:name="t('photos', 'Favorites')"
					data-id-app-nav-item="favorites">
					<Star slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'thisday'}"
					:name="t('photos', 'On this day')"
					data-id-app-nav-item="this-day">
					<CalendarToday slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'shared'}"
					:name="t('photos', 'Shared with you')"
					data-id-app-nav-item="shared">
					<ShareVariant slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="areTagsInstalled"
					:to="{name: 'tags'}"
					:name="t('photos', 'Tags')"
					data-id-app-nav-item="tags">
					<Tag slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'places'}"
					:name="t('photos', 'Places')"
					data-id-app-nav-item="places">
					<MapMarker slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="showLocationMenuEntry"
					:to="{name: 'maps'}"
					:name="t('photos', 'Map')"
					data-id-app-nav-item="maps">
					<MapIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
			</template>
			<template #footer>
				<div class="app-navigation__footer">
					<NcButton type="tertiary"
						alignment="start"
						wide
						@click="showSettings">
						<template #icon>
							<Cog slot="icon" :size="20" />
						</template>
						{{ t('photos', 'Photos settings') }}
					</NcButton>
				</div>
			</template>
		</NcAppNavigation>
		<NcAppContent>
			<RouterView />

			<!-- svg img loading placeholder (linked to the File component) -->
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="svgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="imgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="videoplaceholder" />
		</NcAppContent>

		<!-- Main settings Modal-->
		<SettingsDialog :open.sync="openedSettings" />
	</NcContent>
</template>

<script lang='ts'>
import { getCurrentUser } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'
import { loadState } from '@nextcloud/initial-state'

import Camera from 'vue-material-design-icons/Camera.vue'
import ImageIcon from 'vue-material-design-icons/Image.vue'
import VideoIcon from 'vue-material-design-icons/Video.vue'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'
import Folder from 'vue-material-design-icons/Folder.vue'
import Star from 'vue-material-design-icons/Star.vue'
import CalendarToday from 'vue-material-design-icons/CalendarToday.vue'
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue'
import Tag from 'vue-material-design-icons/Tag.vue'
import MapIcon from 'vue-material-design-icons/Map.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline.vue'
import Cog from 'vue-material-design-icons/Cog.vue'

import NcContent from '@nextcloud/vue/dist/Components/NcContent.js'
import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js'
import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation.js'
import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

import SettingsDialog from './components/Settings/SettingsDialog.vue'

import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'
import areTagsInstalled from './services/AreTagsInstalled.js'
import isMapsInstalled from './services/IsMapsInstalled.js'
import isRecognizeInstalled from './services/IsRecognizeInstalled.js'
import isAppStoreEnabled from './services/IsAppStoreEnabled.js'
import logger from './services/logger.js'

export default {
	name: 'Photos',
	components: {
		AccountBoxMultipleOutline,
		Cog,
		CalendarToday,
		Camera,
		AccountGroup,
		Folder,
		FolderMultipleImage,
		ImageIcon,
		ShareVariant,
		Star,
		Tag,
		VideoIcon,
		MapIcon,
		MapMarker,
		NcAppContent,
		NcAppNavigation,
		NcAppNavigationItem,
		NcButton,
		NcContent,
		SettingsDialog,
	},
	data() {
		return {
			svgplaceholder,
			imgplaceholder,
			videoplaceholder,
			areTagsInstalled,

			showLocationMenuEntry: getCurrentUser() === null
				? false
				: (getCurrentUser().isAdmin && isAppStoreEnabled) || isMapsInstalled,
			showPeopleMenuEntry: getCurrentUser() === null
				? false
				: (getCurrentUser().isAdmin && loadState('photos', 'showPeopleMenuEntry', true) && isAppStoreEnabled) || isRecognizeInstalled,

			openedSettings: false,
		}
	},
	async beforeMount() {
		// Register excluded paths
		const files = loadState('photos', 'nomedia-paths', [])
		this.$store.dispatch('setNomediaPaths', files)
		logger.debug('Known .nomedia and .noimage  paths', { files })

		if ('serviceWorker' in navigator) {
			// Use the window load event to keep the page load performant
			window.addEventListener('load', () => {
				navigator.serviceWorker.register(generateUrl('/apps/photos/service-worker.js', {}, {
					noRewrite: true,
				}), {
					scope: generateUrl('/apps/photos'),
				}).then(registration => {
					logger.debug('SW registered: ', { registration })
				}).catch(registrationError => {
					logger.error('SW registration failed: ', { registrationError })
				})

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

	methods: {
		showSettings() {
			this.openedSettings = true
		},
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

.app-navigation__photos :deep(.app-navigation-entry-icon.icon-photos) {
	background-size: 20px;
}

.app-navigation__footer {
	padding: calc(var(--default-grid-baseline) * 2);
}
</style>

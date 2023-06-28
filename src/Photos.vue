<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<NcContent app-name="photos">
		<NcAppNavigation>
			<template #list>
				<NcAppNavigationItem :to="{name: 'all_media'}"
					class="app-navigation__all_media"
					:title="t('photos', 'All media')"
					exact>
					<ImageIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/photos" :title="t('photos', 'Photos')">
					<Camera slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/videos" :title="t('photos', 'Videos')">
					<VideoIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'albums'}" :title="t('photos', 'Albums')">
					<FolderMultipleImage slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'sharedAlbums'}" :title="t('photos', 'Collaborative albums')">
					<AccountGroup slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="showPeopleMenuEntry" :to="{name: 'faces'}" :title="t('photos', 'People')">
					<template #icon>
						<AccountBoxMultipleOutline :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'folders'}" :title="t('photos', 'Folders')">
					<Folder slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem to="/favorites" :title="t('photos', 'Favorites')">
					<Star slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'thisday'}" :title="t('photos', 'On this day')">
					<CalendarToday slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'shared'}" :title="t('photos', 'Shared with you')">
					<ShareVariant slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="areTagsInstalled"
					:to="{name: 'tags'}"
					:title="t('photos', 'Tags')">
					<Tag slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'places'}" :title="t('photos', 'Places')">
					<MapMarker slot="icon" :size="20" />
				</NcAppNavigationItem>
				<NcAppNavigationItem v-if="showLocationMenuEntry"
					:to="{name: 'maps'}"
					:title="t('photos', 'Map')">
					<MapIcon slot="icon" :size="20" />
				</NcAppNavigationItem>
			</template>
			<template #footer>
				<NcAppNavigationItem :title="t('photos', 'Photos settings')" @click="showSettings">
					<Cog slot="icon" :size="20" />
				</NcAppNavigationItem>
			</template>
		</NcAppNavigation>
		<NcAppContent :page-heading="pageHeading">
			<router-view />

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

<script>
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

import { NcContent, NcAppContent, NcAppNavigation, NcAppNavigationItem } from '@nextcloud/vue'

import SettingsDialog from './components/Settings/SettingsDialog.vue'

import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'
import areTagsInstalled from './services/AreTagsInstalled.js'
import isMapsInstalled from './services/IsMapsInstalled.js'
import isRecognizeInstalled from './services/IsRecognizeInstalled.js'
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
				: getCurrentUser().isAdmin || isMapsInstalled,
			showPeopleMenuEntry: getCurrentUser() === null
				? false
				: getCurrentUser().isAdmin || isRecognizeInstalled,

			openedSettings: false,
		}
	},

	computed: {
		pageHeading() {
			return this.$route.meta.rootTitle?.(this.$route)
		},
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

.app-navigation__photos:deep .app-navigation-entry-icon.icon-photos {
	background-size: 20px;
}
</style>

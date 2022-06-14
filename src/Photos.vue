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
	<Content app-name="photos">
		<AppNavigation>
			<template #list>
				<AppNavigationItem :to="{name: 'all_media'}"
					class="app-navigation__all_media"
					:title="t('photos', 'All media')"
					exact>
					<template #icon>
						<ImageIcon />
					</template>
				</AppNavigationItem>
				<AppNavigationItem to="/photos" :title="t('photos', 'Photos')">
					<template #icon>
						<Camera />
					</template>
				</AppNavigationItem>
				<AppNavigationItem to="/videos" :title="t('photos', 'Videos')">
					<template #icon>
						<VideoIcon />
					</template>
				</AppNavigationItem>
				<AppNavigationItem :to="{name: 'albums'}" :title="t('photos', 'Albums')">
					<template #icon>
						<FolderMultipleImage />
					</template>
				</AppNavigationItem>
				<AppNavigationItem :to="{name: 'folders'}" :title="t('photos', 'Folders')">
					<template #icon>
						<Folder />
					</template>
				</AppNavigationItem>
				<AppNavigationItem to="/favorites" :title="t('photos', 'Favorites')">
					<template #icon>
						<Star />
					</template>
				</AppNavigationItem>
				<AppNavigationItem :to="{name: 'thisday'}" :title="t('photos', 'On this day')">
					<template #icon>
						<CalendarToday />
					</template>
				</AppNavigationItem>
				<AppNavigationItem :to="{name: 'shared'}" :title="t('photos', 'Shared with you')">
					<template #icon>
						<ShareVariant />
					</template>
				</AppNavigationItem>
				<AppNavigationItem v-if="areTagsInstalled"
					:to="{name: 'tags'}"
					:title="t('photos', 'Tagged photos')">
					<template #icon>
						<Tag />
					</template>
				</AppNavigationItem>
				<AppNavigationItem v-if="showLocationMenuEntry"
					:to="{name: 'maps'}"
					:title="t('photos', 'Locations')">
					<template #icon>
						<MapMarker />
					</template>
				</AppNavigationItem>
			</template>
			<template #footer>
				<AppNavigationSettings :title="t('photos', 'Photos settings')">
					<CroppedLayoutSettings />
				</AppNavigationSettings>
			</template>
		</AppNavigation>
		<AppContent>
			<router-view />

			<!-- svg img loading placeholder (linked to the File component) -->
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="svgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="imgplaceholder" />
			<!-- eslint-disable-next-line vue/no-v-html (because it's an SVG file) -->
			<span class="hidden-visually" role="none" v-html="videoplaceholder" />
		</AppContent>
	</Content>
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
import Tag from 'vue-material-design-icons/Tag.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import AppNavigationSettings from '@nextcloud/vue/dist/Components/AppNavigationSettings'

import CroppedLayoutSettings from './components/Settings/CroppedLayoutSettings.vue'
import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'
import isMapsInstalled from './services/IsMapsInstalled.js'
import areTagsInstalled from './services/AreTagsInstalled.js'

export default {
	name: 'Photos',
	components: {
		Content,
		CroppedLayoutSettings,
		AppContent,
		AppNavigation,
		AppNavigationItem,
		AppNavigationSettings,
		ImageIcon,
		Camera,
		VideoIcon,
		FolderMultipleImage,
		Folder,
		Star,
		CalendarToday,
		Tag,
		MapMarker,
		ShareVariant,
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
		}
	},

	async beforeMount() {
		if ('serviceWorker' in navigator) {
			// Use the window load event to keep the page load performant
			window.addEventListener('load', () => {
				navigator.serviceWorker.register(generateUrl('/apps/photos/service-worker.js'), {
					scope: '/',
				}).then(registration => {
					console.debug('SW registered: ', registration)
				}).catch(registrationError => {
					console.error('SW registration failed: ', registrationError)
				})

			})
		} else {
			console.debug('Service Worker is not enabled on this browser.')
		}

		const files = loadState('photos', 'nomedia-paths', [])
		this.$store.dispatch('setNomediaPaths', files)
	},

	beforeDestroy() {
		window.removeEventListener('load', () => {
			navigator.serviceWorker.register(generateUrl('/apps/photos/service-worker.js'))
		})
	},
}
</script>
<style lang="scss" scoped>
.app-content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-content: space-between;
}

.app-navigation__photos::v-deep .app-navigation-entry-icon.icon-photos {
	background-size: 20px;
}
</style>

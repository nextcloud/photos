<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent app-name="photos">
		<NcAppNavigation :aria-label="t('photos', 'Photos')">
			<template v-if="isTimelineView" #search>
				<PhotosFiltersInput
					:selected-filters="selectedFilters"
					@select-filter="selectFilter" />
				<PhotosFiltersDisplay
					:selected-filters="selectedFilters"
					@deselect-filter="deselectFilter" />
			</template>

			<template #list>
				<NcAppNavigationItem
					:to="{ name: 'all_media' }"
					:name="t('photos', 'All media')"
					class="app-navigation__all_media"
					data-id-app-nav-item="all-media"
					exact>
					<template #icon="{ active }">
						<ImageIcon v-if="active" :size="20" />
						<ImageOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					to="/photos"
					:name="t('photos', 'Photos')"
					data-id-app-nav-item="photos">
					<template #icon="{ active }">
						<Camera v-if="active" :size="20" />
						<CameraOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					to="/videos"
					:name="t('photos', 'Videos')"
					data-id-app-nav-item="videos">
					<template #icon="{ active }">
						<VideoIcon v-if="active" :size="20" />
						<VideoOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'albums' }"
					:name="t('photos', 'Albums')"
					data-id-app-nav-item="albums">
					<template #icon="{ active }">
						<ImageMultiple v-if="active" :size="20" />
						<ImageMultipleOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'sharedAlbums' }"
					:name="t('photos', 'Collaborative albums')"
					data-id-app-nav-item="sharedalbums">
					<template #icon="{ active }">
						<AccountGroup v-if="active" :size="20" />
						<AccountGroupOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					v-if="showPeopleMenuEntry"
					:to="{ name: 'faces' }"
					:name="t('photos', 'People')"
					data-id-app-nav-item="faces">
					<template #icon="{ active }">
						<AccountBoxMultiple v-if="active" :size="20" />
						<AccountBoxMultipleOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'folders' }"
					:name="t('photos', 'Folders')"
					data-id-app-nav-item="folders">
					<template #icon="{ active }">
						<Folder v-if="active" :size="20" />
						<FolderOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					to="/favorites"
					:name="t('photos', 'Favorites')"
					data-id-app-nav-item="favorites">
					<template #icon="{ active }">
						<Star v-if="active" :size="20" />
						<StarOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'thisday' }"
					:name="t('photos', 'On this day')"
					data-id-app-nav-item="this-day">
					<template #icon="{ active }">
						<CalendarToday v-if="active" :size="20" />
						<CalendarTodayOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'shared' }"
					:name="t('photos', 'Shared with you')"
					data-id-app-nav-item="shared">
					<template #icon="{ active }">
						<ShareVariant v-if="active" :size="20" />
						<ShareVariantOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					v-if="areTagsInstalled"
					:to="{ name: 'tags' }"
					:name="t('photos', 'Tags')"
					data-id-app-nav-item="tags">
					<template #icon="{ active }">
						<Tag v-if="active" :size="20" />
						<TagOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					:to="{ name: 'places' }"
					:name="t('photos', 'Places')"
					data-id-app-nav-item="places">
					<template #icon="{ active }">
						<MapMarker v-if="active" :size="20" />
						<MapMarkerOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem
					v-if="showLocationMenuEntry"
					:to="{ name: 'maps' }"
					:name="t('photos', 'Map')"
					data-id-app-nav-item="maps">
					<template #icon="{ active }">
						<MapIcon v-if="active" :size="20" />
						<MapOutline v-else :size="20" />
					</template>
				</NcAppNavigationItem>
			</template>
			<template #footer>
				<div class="app-navigation__footer">
					<NcButton
						variant="tertiary"
						alignment="start"
						wide
						@click="showSettings">
						<template #icon>
							<CogOutline :size="20" />
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
import type { FilterOption } from './services/PhotosFilters/PhotosFilter.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { storeToRefs } from 'pinia'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcContent from '@nextcloud/vue/components/NcContent'
import AccountBoxMultiple from 'vue-material-design-icons/AccountBoxMultiple.vue'
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline.vue'
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue'
import AccountGroupOutline from 'vue-material-design-icons/AccountGroupOutline.vue'
import CalendarToday from 'vue-material-design-icons/CalendarToday.vue'
import CalendarTodayOutline from 'vue-material-design-icons/CalendarTodayOutline.vue'
import Camera from 'vue-material-design-icons/Camera.vue'
import CameraOutline from 'vue-material-design-icons/CameraOutline.vue'
import CogOutline from 'vue-material-design-icons/CogOutline.vue'
import Folder from 'vue-material-design-icons/Folder.vue'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import ImageIcon from 'vue-material-design-icons/Image.vue'
import ImageMultiple from 'vue-material-design-icons/ImageMultiple.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue'
import MapIcon from 'vue-material-design-icons/Map.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import MapOutline from 'vue-material-design-icons/MapOutline.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import Tag from 'vue-material-design-icons/Tag.vue'
import TagOutline from 'vue-material-design-icons/TagOutline.vue'
import VideoIcon from 'vue-material-design-icons/Video.vue'
import VideoOutline from 'vue-material-design-icons/VideoOutline.vue'
import PhotosFiltersDisplay from './components/PhotosFilters/PhotosFiltersDisplay.vue'
import PhotosFiltersInput from './components/PhotosFilters/PhotosFiltersInput.vue'
import SettingsDialog from './components/Settings/SettingsDialog.vue'
import svgplaceholder from './assets/file-placeholder.svg'
import imgplaceholder from './assets/image.svg'
import videoplaceholder from './assets/video.svg'
import areTagsInstalled from './services/AreTagsInstalled.ts'
import isAppStoreEnabled from './services/IsAppStoreEnabled.ts'
import isMapsInstalled from './services/IsMapsInstalled.ts'
import isRecognizeInstalled from './services/IsRecognizeInstalled.ts'
import logger from './services/logger.ts'
import useFilterStore from './store/filters.ts'

export default {
	name: 'PhotosApp',
	components: {
		AccountBoxMultiple,
		AccountBoxMultipleOutline,
		CogOutline,
		CalendarToday,
		CalendarTodayOutline,
		Camera,
		CameraOutline,
		AccountGroup,
		AccountGroupOutline,
		Folder,
		FolderOutline,
		ImageMultiple,
		ImageMultipleOutline,
		ImageIcon,
		ImageOutline,
		ShareVariant,
		ShareVariantOutline,
		Star,
		StarOutline,
		Tag,
		TagOutline,
		VideoIcon,
		VideoOutline,
		MapIcon,
		MapOutline,
		MapMarker,
		MapMarkerOutline,
		NcAppContent,
		NcAppNavigation,
		NcAppNavigationItem,
		NcButton,
		NcContent,
		SettingsDialog,
		PhotosFiltersInput,
		PhotosFiltersDisplay,
	},

	setup() {
		const filtersStore = useFilterStore()
		const { selectedFilters } = storeToRefs(filtersStore)

		return {
			selectedFilters,
		}
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

	computed: {
		isTimelineView() {
			return ['all_media', 'photos', 'videos'].includes(this.$store.state.route.name || '')
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
				}).then((registration) => {
					logger.debug('SW registered: ', { registration })
				}).catch((registrationError) => {
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

		selectFilter(filterOption: FilterOption<unknown>) {
			this.selectedFilters[filterOption.filterId].push(filterOption.value)
		},

		deselectFilter(filterOption: { filterId: string, value: unknown }) {
			const index = this.selectedFilters[filterOption.filterId].indexOf(filterOption.value)

			if (index !== -1) {
				this.selectedFilters[filterOption.filterId].splice(index, 1)
			}
		},

		t,
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

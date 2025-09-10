/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { App, Component, ComponentPublicInstance } from 'vue'
import type { PhotosTabType } from './views/PhotosTab.vue'

import InformationOutline from '@mdi/svg/svg/information-outline.svg?raw'
import { registerDavProperty } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { createApp } from 'vue'

registerDavProperty('nc:metadata-photos-exif')
registerDavProperty('nc:metadata-photos-ifd0')
registerDavProperty('nc:metadata-photos-gps')
registerDavProperty('nc:metadata-photos-place')

// Init Photos tab component
let LazyPhotosTab: Component | null = null
let photosTabApp: App<Element> | null = null
let activityTabInstance: ComponentPublicInstance<PhotosTabType> | null = null

const photosTab = new OCA.Files.Sidebar.Tab({
	id: 'photos',
	name: t('photos', 'Details'),
	iconSvg: InformationOutline,

	async mount(el, fileInfo) {
		// only load if needed
		if (LazyPhotosTab === null) {
			const { default: PhotosTab } = await import('./views/PhotosTab.vue')
			LazyPhotosTab = PhotosTab
		}
		// destroy previous instance if available
		if (photosTabApp) {
			photosTabApp.unmount()
		}
		photosTabApp = createApp(LazyPhotosTab)
		// No need to await this, we will show a loading indicator instead
		activityTabInstance = photosTabApp.mount(el)
		activityTabInstance.update(fileInfo)
	},
	update(fileInfo) {
		activityTabInstance!.update(fileInfo)
	},
	destroy() {
		photosTabApp?.unmount()
		photosTabApp = null
	},
})

window.addEventListener('DOMContentLoaded', async function() {
	if (window.OCA.Files && window.OCA.Files.Sidebar) {
		window.OCA.Files.Sidebar.registerTab(photosTab)
		const { default: PhotosTab } = await import(/* webpackPreload: true */ './views/PhotosTab.vue')
		LazyPhotosTab = PhotosTab
	}
})

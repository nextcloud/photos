/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import InformationOutline from '@mdi/svg/svg/information-outline.svg?raw'
import { translate as t, translatePlural as n } from '@nextcloud/l10n'
import { registerDavProperty } from '@nextcloud/files/dav'

Vue.prototype.t = t
Vue.prototype.n = n

registerDavProperty('nc:metadata-photos-exif')
registerDavProperty('nc:metadata-photos-ifd0')
registerDavProperty('nc:metadata-photos-gps')
registerDavProperty('nc:metadata-photos-place')

// Init Photos tab component
let PhotosTabView = null
let PhotosTabInstance = null
const photosTab = new OCA.Files.Sidebar.Tab({
	id: 'photos',
	name: t('photos', 'Details'),
	iconSvg: InformationOutline,

	async mount(el, fileInfo, context) {
		// only load if needed
		if (PhotosTabView === null) {
			const { default: PhotosTab } = await import('./views/PhotosTab.vue')
			PhotosTabView = PhotosTabView ?? Vue.extend(PhotosTab)
		}
		// destroy previous instance if available
		if (PhotosTabInstance) {
			PhotosTabInstance.$destroy()
		}
		PhotosTabInstance = new PhotosTabView({
			// Better integration with vue parent component
			parent: context,
		})
		// No need to await this, we will show a loading indicator instead
		PhotosTabInstance.update(fileInfo)
		PhotosTabInstance.$mount(el)
	},
	update(fileInfo) {
		PhotosTabInstance.update(fileInfo)
	},
	destroy() {
		PhotosTabInstance.$destroy()
		PhotosTabInstance = null
	},
})

window.addEventListener('DOMContentLoaded', async function() {
	if (OCA.Files && OCA.Files.Sidebar) {
		window.OCA.Files.Sidebar.registerTab(photosTab)
		const { default: PhotosTab } = await import(/* webpackPreload: true */ './views/PhotosTab.vue')
		PhotosTabView = PhotosTabView ?? Vue.extend(PhotosTab)
	}
})

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import InformationOutline from '@mdi/svg/svg/information-outline.svg?raw'
import { translate as t, translatePlural as n } from '@nextcloud/l10n'
import { getRequestToken } from '@nextcloud/auth'
import { generateFilePath } from '@nextcloud/router'
import { registerDavProperty } from '@nextcloud/files'

Vue.prototype.t = t
Vue.prototype.n = n

// eslint-disable-next-line no-undef, camelcase
__webpack_nonce__ = btoa(getRequestToken() ?? '')
// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = generateFilePath('photos', '', 'js/')

registerDavProperty('nc:metadata-photos-original_date_time', { nc: 'http://nextcloud.org/ns' })
registerDavProperty('nc:metadata-photos-exif', { nc: 'http://nextcloud.org/ns' })
registerDavProperty('nc:metadata-photos-ifd0', { nc: 'http://nextcloud.org/ns' })
registerDavProperty('nc:metadata-photos-gps', { nc: 'http://nextcloud.org/ns' })
registerDavProperty('nc:metadata-photos-place', { nc: 'http://nextcloud.org/ns' })

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
		OCA.Files.Sidebar.registerTab(photosTab)
		const { default: PhotosTab } = await import(/* webpackPreload: true */ './views/PhotosTab.vue')
		PhotosTabView = PhotosTabView ?? Vue.extend(PhotosTab)
	}
})

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import InformationOutline from '@mdi/svg/svg/information-outline.svg?raw'
import { registerSidebarTab } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'
import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import Vue, { defineAsyncComponent } from 'vue'
import vueCustomElement from 'vue-custom-element'
const PhotosTab = defineAsyncComponent(() => import('./views/PhotosTab.vue'))

Vue.prototype.t = t
Vue.prototype.n = n

registerDavProperty('nc:metadata-photos-exif')
registerDavProperty('nc:metadata-photos-ifd0')
registerDavProperty('nc:metadata-photos-gps')
registerDavProperty('nc:metadata-photos-place')

Vue.use(vueCustomElement)

const tagName = 'photos-files-sidebar-tab'

registerSidebarTab({
	id: 'photos',
	order: 50,
	displayName: t('photos', 'Details'),
	iconSvgInline: InformationOutline,
	enabled() {
		return true
	},
	tagName,
	async onInit() {
		if (window.customElements.get(tagName)) {
			// element already defined
			return
		}
		Vue.customElement(tagName, PhotosTab, {
			shadow: false,
		})
	},
})

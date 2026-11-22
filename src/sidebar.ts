/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import InformationOutline from '@mdi/svg/svg/information-outline.svg?raw'
import { subscribe } from '@nextcloud/event-bus'
import { getSidebar, registerSidebarTab } from '@nextcloud/files'
import { translate as t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { defineAsyncComponent, defineCustomElement } from 'vue'
import { allMimes } from './services/AllowedMimes.ts'

const tagName = 'photos-sidebar-tab'

registerSidebarTab({
	id: 'photos',
	tagName,
	// Ahead of the tabs of the other apps, the details are what the sidebar is
	// opened for from the photos app.
	order: 0,
	displayName: t('photos', 'Details'),
	iconSvgInline: InformationOutline,
	enabled: ({ node }) => node.mime !== undefined && allMimes.includes(node.mime),

	async onInit() {
		const PhotosTab = defineAsyncComponent(() => import('./views/PhotosTab.vue'))
		window.customElements.define(tagName, defineCustomElement(PhotosTab, {
			shadowRoot: false,
		}))
	},
})

// Outside of the files app nothing answers the "Open sidebar" action of the
// viewer, which also asks for every photo it moves to while the sidebar is open.
subscribe('viewer:sidebar:open', (node) => getSidebar().open(node))
// The sidebar only accompanies the viewer here, there is no file list behind it.
getViewer().addEventListener('close', () => getSidebar().close())

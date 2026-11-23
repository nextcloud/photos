/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type * as NextcloudFiles from '@nextcloud/files'
import type { INode, ISidebarTab } from '@nextcloud/files'

import { emit } from '@nextcloud/event-bus'
import { getSidebarTabs } from '@nextcloud/files'
import { beforeAll, describe, expect, test, vi } from 'vitest'

const { sidebar, viewer } = vi.hoisted(() => ({
	sidebar: { open: vi.fn(), close: vi.fn() },
	viewer: new EventTarget(),
}))

vi.mock('@nextcloud/files', async (importOriginal) => ({
	...await importOriginal<typeof NextcloudFiles>(),
	getSidebar: () => sidebar,
}))
vi.mock('@nextcloud/viewer', () => ({ getViewer: () => viewer }))
vi.mock('./services/AllowedMimes.ts', () => ({ allMimes: ['image/jpeg', 'video/mp4'] }))
vi.mock('./views/PhotosTab.vue', () => ({ default: { render: () => null } }))

let tab: ISidebarTab

beforeAll(async () => {
	await import('./sidebar.ts')
	tab = getSidebarTabs().find(({ id }) => id === 'photos')!
})

describe('photos sidebar tab', () => {
	test('is registered with the files sidebar', () => {
		expect(tab).toBeDefined()
		expect(tab.tagName).toBe('photos-sidebar-tab')
	})

	test('is only enabled for the photos and videos the app shows', () => {
		const enabled = (mime?: string) => tab.enabled!({ node: { mime } as INode })

		expect(enabled('image/jpeg')).toBe(true)
		expect(enabled('video/mp4')).toBe(true)
		expect(enabled('application/pdf')).toBe(false)
		expect(enabled(undefined)).toBe(false)
	})

	test('defines its element once it is first shown', async () => {
		expect(customElements.get('photos-sidebar-tab')).toBeUndefined()

		await tab.onInit!()

		expect(customElements.get('photos-sidebar-tab')).toBeDefined()
	})
})

describe('photos sidebar with the viewer', () => {
	test('opens the sidebar for the photo the viewer asks for', () => {
		const node = { source: 'http://nextcloud.local/remote.php/dav/files/admin/a.jpg' } as INode
		emit('viewer:sidebar:open', node)

		expect(sidebar.open).toHaveBeenCalledWith(node)
	})

	test('closes the sidebar along with the viewer', () => {
		viewer.dispatchEvent(new CustomEvent('close'))

		expect(sidebar.close).toHaveBeenCalledOnce()
	})
})

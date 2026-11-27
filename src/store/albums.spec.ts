/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ShareType } from '@nextcloud/sharing'
import { describe, expect, test, vi } from 'vitest'
import { buildLocalAlbum, getAlbumNameError, getPublicAlbumLink } from './albums.ts'

vi.hoisted(() => {
	// @nextcloud/files reads the user from the page, out of reach of the module mock.
	document.head.dataset.user = 'alice'
	// Capabilities the file name validation falls back to without an initial state.
	Object.assign(window, { _oc_capabilities: { files: {} } })
})

vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showConfirmation: vi.fn() }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

describe('buildLocalAlbum', () => {
	test('places the album under the albums of the user', () => {
		const album = buildLocalAlbum('Trip')

		expect(album.root + album.path).toBe('/photos/alice/albums/Trip')
		expect(album.basename).toBe('Trip')
		expect(album.attributes.nbItems).toBe(0)
		expect(album.attributes.collaborators).toEqual([])
	})

	test('carries the given properties', () => {
		const collaborators = [{ id: 'bob', label: 'Bob', type: ShareType.User as const }]
		const album = buildLocalAlbum('Trip', { location: 'Lisbon', collaborators })

		expect(album.attributes.location).toBe('Lisbon')
		expect(album.attributes.collaborators).toEqual(collaborators)
	})
})

describe('getAlbumNameError', () => {
	test('accepts a plain name', () => {
		expect(getAlbumNameError('Shared on 22 Nov 2026')).toBeUndefined()
	})

	test('refuses a name holding a slash', () => {
		expect(getAlbumNameError('a/b')).toBe('"/" is not allowed inside a filename.')
	})
})

describe('getPublicAlbumLink', () => {
	test('builds the absolute address of the public page', () => {
		const link = getPublicAlbumLink('aBc123')

		expect(link.startsWith(window.location.origin)).toBe(true)
		expect(link).toMatch(/\/apps\/photos\/public\/aBc123$/)
	})
})

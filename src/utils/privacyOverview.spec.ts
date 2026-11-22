/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PrivacyItem, PrivacyOverview } from './privacyOverview.ts'

import { describe, expect, test } from 'vitest'
import { tileServerHost } from './mapTiles.ts'
import { buildPrivacyItems, privacyStateLabel } from './privacyOverview.ts'

const TILES = 'https://{s}.tile.example.org/{z}/{x}/{y}.png'

/**
 * Build a server overview with everything turned off.
 *
 * @param overrides - Facts to change
 */
function overview(overrides: Partial<PrivacyOverview> = {}): PrivacyOverview {
	return {
		places: { enabled: false, source: 'download.example.com' },
		recognize: false,
		ai: { known: true, tasks: [] },
		publicLinkAlbums: 0,
		...overrides,
	}
}

/**
 * Find an item by its id.
 *
 * @param items - The items to search
 * @param id - Id of the item
 */
function item(items: PrivacyItem[], id: PrivacyItem['id']): PrivacyItem {
	const found = items.find((entry) => entry.id === id)
	if (!found) {
		throw new Error(`No item ${id}`)
	}
	return found
}

describe('tileServerHost', () => {
	test('drops the subdomain placeholder', () => {
		expect(tileServerHost('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')).toBe('tile.openstreetmap.org')
	})

	test('keeps a host without placeholder', () => {
		expect(tileServerHost('https://tiles.example.net/{z}/{x}/{y}.png')).toBe('tiles.example.net')
	})
})

describe('buildPrivacyItems', () => {
	test('lists every item in a fixed order', () => {
		expect(buildPrivacyItems(overview(), TILES).map(({ id }) => id))
			.toEqual(['storage', 'places', 'map', 'recognize', 'ai', 'publicLinks'])
	})

	test('reports the map tile server as external, naming its host', () => {
		const map = item(buildPrivacyItems(overview(), TILES), 'map')

		expect(map.state).toBe('external')
		expect(map.description).toContain('tile.example.org')
	})

	test('names where the city list for place names comes from', () => {
		const places = item(buildPrivacyItems(overview({ places: { enabled: true, source: 'download.example.com' } }), TILES), 'places')

		expect(places.state).toBe('local')
		expect(places.description).toContain('download.example.com')
	})

	test('reports disabled features as off', () => {
		const items = buildPrivacyItems(overview(), TILES)

		expect(item(items, 'places').state).toBe('off')
		expect(item(items, 'recognize').state).toBe('off')
		expect(item(items, 'ai').state).toBe('off')
		expect(item(items, 'publicLinks').state).toBe('off')
	})

	test('reports recognition as local when Recognize is enabled', () => {
		expect(item(buildPrivacyItems(overview({ recognize: true }), TILES), 'recognize').state).toBe('local')
	})

	test('counts albums shared by public link', () => {
		const links = item(buildPrivacyItems(overview({ publicLinkAlbums: 3 }), TILES), 'publicLinks')

		expect(links.state).toBe('on')
		expect(links.description).toContain('3 albums')
	})

	test('lists AI tasks with their provider and never claims they are local', () => {
		const ai = item(buildPrivacyItems(overview({
			ai: { known: true, tasks: [{ name: 'Analyze images', provider: 'Vision & Co' }, { name: 'Describe', provider: null }] },
		}), TILES), 'ai')

		expect(ai.state).toBe('unknown')
		expect(ai.details).toEqual(['Analyze images, by Vision & Co', 'Describe'])
	})

	test('reports AI as unknown when the server could not list the tasks', () => {
		expect(item(buildPrivacyItems(overview({ ai: { known: false, tasks: [] } }), TILES), 'ai').state).toBe('unknown')
	})

	test('reports server facts as unknown when they could not be loaded', () => {
		const items = buildPrivacyItems(null, TILES)

		expect(Object.fromEntries(items.map(({ id, state }) => [id, state]))).toEqual({
			storage: 'local',
			places: 'unknown',
			map: 'external',
			recognize: 'unknown',
			ai: 'unknown',
			publicLinks: 'unknown',
		})
	})
})

describe('privacyStateLabel', () => {
	test('labels every state', () => {
		expect(privacyStateLabel('local')).toBe('On this server')
		expect(privacyStateLabel('external')).toBe('External service')
		expect(privacyStateLabel('on')).toBe('On')
		expect(privacyStateLabel('off')).toBe('Off')
		expect(privacyStateLabel('unknown')).toBe('Unknown')
	})
})

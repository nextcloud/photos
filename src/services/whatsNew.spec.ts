/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WhatsNewEntry } from './whatsNew.ts'

import { describe, expect, test } from 'vitest'
import { compareVersions, getInstalledVersion, getUnseenEntries, getWhatsNewEntries, normalizeVersion } from './whatsNew.ts'

const entries: WhatsNewEntry[] = [
	{ version: '9.1.0', highlights: [{ title: 'Newer', description: '' }] },
	{ version: '9.0.0', highlights: [{ title: 'Older', description: '' }] },
]

const versions = (list: WhatsNewEntry[]) => list.map(({ version }) => version)

describe('normalizeVersion', () => {
	test.each([
		['9.0.0', '9.0.0'],
		['9.0.0-dev.0', '9.0.0'],
		['10.2', '10.2'],
		['9.1.3.4', '9.1.3'],
		['', ''],
		['dev', ''],
	])('reads %j as %j', (version, expected) => {
		expect(normalizeVersion(version)).toBe(expected)
	})
})

describe('getInstalledVersion', () => {
	test('is the plain version of the app the build was made from', () => {
		expect(getInstalledVersion()).toMatch(/^\d+\.\d+\.\d+$/)
	})
})

describe('compareVersions', () => {
	test('compares number by number rather than as text', () => {
		expect(compareVersions('9.10.0', '9.9.0')).toBeGreaterThan(0)
		expect(compareVersions('9.0.1', '10.0.0')).toBeLessThan(0)
	})

	test('treats missing numbers as zero', () => {
		expect(compareVersions('9', '9.0.0')).toBe(0)
		expect(compareVersions('9.1', '9.0.5')).toBeGreaterThan(0)
	})
})

describe('getUnseenEntries', () => {
	test('has nothing for a user who never opened the app before', () => {
		expect(getUnseenEntries(entries, '9.1.0', '')).toEqual([])
	})

	test('has nothing when the installed version is unknown', () => {
		expect(getUnseenEntries(entries, '', '8.0.0')).toEqual([])
	})

	test('has every release since the last seen version after an update', () => {
		expect(versions(getUnseenEntries(entries, '9.1.0', '8.2.0'))).toEqual(['9.1.0', '9.0.0'])
		expect(versions(getUnseenEntries(entries, '9.1.0', '9.0.0'))).toEqual(['9.1.0'])
	})

	test('has nothing once the installed version was seen', () => {
		expect(getUnseenEntries(entries, '9.1.0', '9.1.0')).toEqual([])
		expect(getUnseenEntries(entries, '9.1.2', '9.1.1')).toEqual([])
	})

	test('leaves out releases newer than the installed version', () => {
		expect(versions(getUnseenEntries(entries, '9.0.3', '8.2.0'))).toEqual(['9.0.0'])
	})
})

describe('getWhatsNewEntries', () => {
	test('lists plain versions, newest first, each with highlights', () => {
		const list = getWhatsNewEntries()

		expect(list.length).toBeGreaterThan(0)
		for (const [index, entry] of list.entries()) {
			expect(normalizeVersion(entry.version)).toBe(entry.version)
			expect(entry.highlights.length).toBeGreaterThan(0)
			if (index > 0) {
				expect(compareVersions(list[index - 1].version, entry.version)).toBeGreaterThan(0)
			}
		}
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File, Folder } from '@nextcloud/files'
import { describe, expect, test } from 'vitest'
import { isEndToEndEncrypted } from './fileUtils.ts'

const SOURCE = 'https://cloud.example.org/remote.php/dav/files/alice'

describe('isEndToEndEncrypted', () => {
	test('is true for a folder the server marks as encrypted', () => {
		const folder = new Folder({ id: 1, source: `${SOURCE}/Vault`, owner: 'alice', root: '/files/alice', attributes: { 'is-encrypted': 1 } })

		expect(isEndToEndEncrypted(folder)).toBe(true)
	})

	test('is false for a regular folder', () => {
		const marked = new Folder({ id: 2, source: `${SOURCE}/Trip`, owner: 'alice', root: '/files/alice', attributes: { 'is-encrypted': 0 } })
		const unmarked = new Folder({ id: 3, source: `${SOURCE}/Other`, owner: 'alice', root: '/files/alice' })

		expect(isEndToEndEncrypted(marked)).toBe(false)
		expect(isEndToEndEncrypted(unmarked)).toBe(false)
	})

	test('is false for a file, whatever its attributes', () => {
		const file = new File({ id: 4, source: `${SOURCE}/cat.jpg`, owner: 'alice', root: '/files/alice', mime: 'image/jpeg', attributes: { 'is-encrypted': 1 } })

		expect(isEndToEndEncrypted(file)).toBe(false)
	})
})

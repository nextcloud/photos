/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { getAddedBy, isInFolder } from './familyLibrary.ts'

describe('isInFolder', () => {
	test('matches the folder and what lies inside of it', () => {
		expect(isInFolder('/Family', '/Family')).toBe(true)
		expect(isInFolder('/Family/2024/beach.jpg', '/Family')).toBe(true)
		expect(isInFolder('/Family/beach.jpg', '/Family/')).toBe(true)
	})

	test('does not match a sibling sharing the prefix', () => {
		expect(isInFolder('/Family photos/beach.jpg', '/Family')).toBe(false)
		expect(isInFolder('/Photos/beach.jpg', '/Family')).toBe(false)
	})

	test('treats the root as holding everything', () => {
		expect(isInFolder('/Family/beach.jpg', '/')).toBe(true)
	})
})

describe('getAddedBy', () => {
	test('prefers the recorded uploader over the owner', () => {
		expect(getAddedBy({
			'metadata-photos-added-by': 'bob',
			'photos-added-by-display-name': 'Bob Builder',
			'owner-id': 'alice',
			'owner-display-name': 'Alice',
		})).toEqual({ userId: 'bob', displayName: 'Bob Builder' })
	})

	test('falls back to the user id without a display name', () => {
		expect(getAddedBy({ 'metadata-photos-added-by': 'bob' })).toEqual({ userId: 'bob', displayName: 'bob' })
	})

	test('reads numeric user ids as strings', () => {
		expect(getAddedBy({ 'metadata-photos-added-by': 1234 })).toEqual({ userId: '1234', displayName: '1234' })
	})

	test('falls back to the owner of files stored before uploads were recorded', () => {
		expect(getAddedBy({ 'owner-id': 'alice', 'owner-display-name': 'Alice', 'mount-type': 'shared' }))
			.toEqual({ userId: 'alice', displayName: 'Alice' })
	})

	test('does not take the owner of a group folder file for its uploader', () => {
		expect(getAddedBy({ 'owner-id': 'carol', 'owner-display-name': 'Carol', 'mount-type': 'group' })).toBeNull()
	})

	test('knows nobody without uploader nor owner', () => {
		expect(getAddedBy({})).toBeNull()
	})
})

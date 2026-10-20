/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from './collectionFetcher.ts'

import { Folder } from '@nextcloud/files'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
	getFaceClusterId,
	isContactLinkingAvailable,
	linkFaceToContact,
	parseFaceContact,
	searchContacts,
	setContactPhotoFromFace,
	unlinkFace,
} from './recognizeContacts.ts'

const { axios, getCapabilities } = vi.hoisted(() => ({
	axios: {
		get: vi.fn(),
		put: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	},
	getCapabilities: vi.fn(),
}))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/capabilities', () => ({ getCapabilities }))
vi.mock('@nextcloud/router', () => ({
	generateOcsUrl: (path: string, params: Record<string, string | number> = {}) => '/ocs/v2.php' + path.replace(/\{(\w+)\}/g, (_match, key) => String(params[key])),
}))

const contact = {
	uid: 'uid-1',
	addressBook: 'contacts',
	addressBookName: 'Contacts',
	displayName: 'Alice',
	hasPhoto: true,
	readOnly: false,
	url: 'https://cloud.example.org/apps/contacts/direct/contact/uid-1~contacts',
	photoUrl: 'https://cloud.example.org/remote.php/dav/addressbooks/users/alice/contacts/uid-1.vcf?photo',
}

/**
 * A face the way the WebDAV listing hands it over.
 *
 * @param attributes - Properties recognize reported for the face
 */
function face(attributes: Record<string, unknown>): Collection {
	return new Folder({
		id: 100,
		source: 'https://cloud.example.org/remote.php/dav/recognize/alice/faces/Alice',
		owner: 'alice',
		root: '/recognize/alice/faces',
		attributes,
	}) as Collection
}

describe('recognizeContacts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('contact linking is available only when recognize announces it', () => {
		getCapabilities.mockReturnValue({ recognize: { faces: { contactLinking: true } } })
		expect(isContactLinkingAvailable()).toBe(true)

		getCapabilities.mockReturnValue({ recognize: { faces: {} } })
		expect(isContactLinkingAvailable()).toBe(false)

		getCapabilities.mockReturnValue({})
		expect(isContactLinkingAvailable()).toBe(false)
	})

	test('parseFaceContact reads the HTML encoded link of the listing', () => {
		const encoded = JSON.stringify({ linkSource: 'auto', contact }).replace(/"/g, '&quot;')
		expect(parseFaceContact(face({ 'face-contact': encoded }))).toEqual({ linkSource: 'auto', contact })
	})

	test('parseFaceContact handles faces without a link', () => {
		expect(parseFaceContact(face({ 'face-contact': JSON.stringify({ linkSource: null, contact: null }) }))).toEqual({ linkSource: null, contact: null })
		expect(parseFaceContact(face({}))).toEqual({ linkSource: null, contact: null })
		expect(parseFaceContact(face({ 'face-contact': 'not json' }))).toEqual({ linkSource: null, contact: null })
	})

	test('getFaceClusterId reads the id of the person', () => {
		expect(getFaceClusterId(face({ 'face-cluster-id': '42' }))).toBe(42)
		expect(getFaceClusterId(face({ 'face-cluster-id': 7 }))).toBe(7)
		expect(getFaceClusterId(face({}))).toBeNull()
		expect(getFaceClusterId(face({ 'face-cluster-id': '' }))).toBeNull()
	})

	test('searchContacts queries the recognize API', async () => {
		axios.get.mockResolvedValue({ data: { ocs: { data: [contact] } } })

		await expect(searchContacts('Ali')).resolves.toEqual([contact])
		expect(axios.get).toHaveBeenCalledWith('/ocs/v2.php/apps/recognize/api/v1/contacts', { params: { search: 'Ali', limit: 50 } })
	})

	test('linkFaceToContact and unlinkFace address the person by id', async () => {
		const updated = { id: 3, title: 'Alice', name: 'Alice', linkSource: 'manual', contact }
		axios.put.mockResolvedValue({ data: { ocs: { data: updated } } })
		axios.delete.mockResolvedValue({ data: { ocs: { data: { ...updated, linkSource: 'manual', contact: null } } } })

		await expect(linkFaceToContact(3, contact)).resolves.toEqual(updated)
		expect(axios.put).toHaveBeenCalledWith('/ocs/v2.php/apps/recognize/api/v1/faces/3/contact', { addressBook: 'contacts', uid: 'uid-1' })

		await expect(unlinkFace(3)).resolves.toEqual({ ...updated, contact: null })
		expect(axios.delete).toHaveBeenCalledWith('/ocs/v2.php/apps/recognize/api/v1/faces/3/contact')
	})

	test('setContactPhotoFromFace posts the detection', async () => {
		axios.post.mockResolvedValue({ data: { ocs: { data: contact } } })

		await expect(setContactPhotoFromFace(9)).resolves.toEqual(contact)
		expect(axios.post).toHaveBeenCalledWith('/ocs/v2.php/apps/recognize/api/v1/faces/detections/9/contact-photo')
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { searchContacts, setContactPhoto } from './contacts.ts'

const axios = vi.hoisted(() => ({ request: vi.fn(), get: vi.fn(), put: vi.fn() }))

vi.mock('@nextcloud/axios', () => ({ default: axios }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const HOME = '/remote.php/dav/addressbooks/users/alice/'

/**
 * @param responses - Entries of the multistatus as `[href, prop]`
 */
function multistatus(responses: Array<[string, string]>): { data: string } {
	return {
		data: `<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">${
			responses.map(([href, prop]) => `<d:response><d:href>${href}</d:href><d:propstat><d:prop>${prop}</d:prop></d:propstat></d:response>`).join('')
		}</d:multistatus>`,
	}
}

describe('contacts service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('searches every address book and skips the ones failing', async () => {
		axios.request.mockImplementation(async ({ method, url }) => {
			if (method === 'PROPFIND') {
				return multistatus([
					[HOME, '<d:resourcetype><d:collection/></d:resourcetype>'],
					[`${HOME}contacts/`, '<d:resourcetype><d:collection/><card:addressbook/></d:resourcetype>'],
					[`${HOME}broken/`, '<d:resourcetype><d:collection/><card:addressbook/></d:resourcetype>'],
				])
			}
			if (url === `${HOME}broken/`) {
				throw new Error('Forbidden')
			}
			return multistatus([
				[`${HOME}contacts/a.vcf`, '<card:address-data>BEGIN:VCARD&#13;\nFN:Tom &amp; Anna&#13;\nBDAY:1990-06-14&#13;\nEND:VCARD&#13;\n</card:address-data>'],
				[`${HOME}contacts/b.vcf`, '<card:address-data>BEGIN:VCARD&#13;\nEND:VCARD&#13;\n</card:address-data>'],
			])
		})

		expect(await searchContacts('Tom & <Anna>')).toEqual([
			{ url: `${HOME}contacts/a.vcf`, fullName: 'Tom & Anna', birthday: { month: 6, day: 14 } },
		])
		expect(axios.request.mock.calls[0][0].url).toContain('/addressbooks/users/alice/')
		const report = axios.request.mock.calls.find(([options]) => options.url === `${HOME}contacts/`)![0]
		expect(report.method).toBe('REPORT')
		expect(report.data).toContain('>Tom &#38; &#60;Anna&#62;</card:text-match>')
	})

	test('writes the picture only onto the version of the contact it read', async () => {
		axios.get.mockResolvedValue({ data: 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Anna\r\nEND:VCARD\r\n', headers: { etag: '"abc"' } })

		await setContactPhoto({ url: `${HOME}contacts/a.vcf`, fullName: 'Anna', birthday: null }, 'JPEG')

		expect(axios.put).toHaveBeenCalledWith(
			`${HOME}contacts/a.vcf`,
			'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Anna\r\nPHOTO;ENCODING=b;TYPE=JPEG:JPEG\r\nEND:VCARD\r\n',
			{ headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'If-Match': '"abc"' } },
		)
	})
})

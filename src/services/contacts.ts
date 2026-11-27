/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Contact } from '../utils/contacts.ts'

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { loadState } from '@nextcloud/initial-state'
import { generateRemoteUrl } from '@nextcloud/router'
import { parseContact, setVCardPhoto } from '../utils/contacts.ts'

export const isContactsInstalled = loadState('photos', 'contacts', false) as boolean

const DAV = 'DAV:'
const CARDDAV = 'urn:ietf:params:xml:ns:carddav'
const XML_HEADERS = { 'Content-Type': 'application/xml; charset=utf-8', Depth: '1' }

let addressBooks: Promise<string[]> | null = null

/**
 * @param parent - Document or element to search in
 * @param namespace - Namespace of the elements to find
 * @param name - Local name of the elements to find
 */
function findElements(parent: Document | Element, namespace: string, name: string): Element[] {
	return [...parent.getElementsByTagName('*')].filter((element) => element.namespaceURI === namespace && element.localName === name)
}

/**
 * @param xml - A WebDAV multistatus response
 */
function parseResponses(xml: string): Element[] {
	return findElements(new DOMParser().parseFromString(xml, 'application/xml'), DAV, 'response')
}

/**
 * @param response - An entry of a multistatus response
 */
function getHref(response: Element): string {
	return findElements(response, DAV, 'href')[0]?.textContent ?? ''
}

/**
 * List the paths of the address books of the current user.
 */
async function fetchAddressBooks(): Promise<string[]> {
	const { data } = await axios.request<string>({
		method: 'PROPFIND',
		url: generateRemoteUrl(`dav/addressbooks/users/${encodeURIComponent(getCurrentUser()?.uid ?? '')}/`),
		data: '<d:propfind xmlns:d="DAV:"><d:prop><d:resourcetype/></d:prop></d:propfind>',
		headers: XML_HEADERS,
		responseType: 'text',
	})
	return parseResponses(data)
		.filter((response) => findElements(response, CARDDAV, 'addressbook').length > 0)
		.map(getHref)
}

/**
 * Search the address books of the current user for contacts whose name
 * contains the given text. Only the name and the birthday are fetched.
 *
 * @param name - Text to search the names for
 * @param signal - Signal to abort the search with
 */
export async function searchContacts(name: string, signal?: AbortSignal): Promise<Contact[]> {
	addressBooks ??= fetchAddressBooks().catch((error) => {
		addressBooks = null
		throw error
	})
	const escapedName = name.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)
	const query = `<card:addressbook-query xmlns:d="DAV:" xmlns:card="${CARDDAV}">
		<d:prop><card:address-data><card:prop name="FN"/><card:prop name="BDAY"/></card:address-data></d:prop>
		<card:filter><card:prop-filter name="FN"><card:text-match collation="i;unicode-casemap" match-type="contains">${escapedName}</card:text-match></card:prop-filter></card:filter>
		<card:limit><card:nresults>25</card:nresults></card:limit>
	</card:addressbook-query>`

	const results = await Promise.allSettled((await addressBooks).map(async (url) => {
		const { data } = await axios.request<string>({ method: 'REPORT', url, data: query, headers: XML_HEADERS, responseType: 'text', signal })
		return parseResponses(data)
			.map((response) => parseContact(getHref(response), findElements(response, CARDDAV, 'address-data')[0]?.textContent ?? ''))
			.filter((contact) => contact !== null)
	}))
	return results.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
}

/**
 * Replace the picture of a contact. The write is refused by the server
 * when the contact changed since it was read.
 *
 * @param contact - The contact to change
 * @param base64 - The new picture as a base64 encoded JPEG
 */
export async function setContactPhoto(contact: Contact, base64: string): Promise<void> {
	const { data, headers } = await axios.get<string>(contact.url, { responseType: 'text' })
	await axios.put(contact.url, setVCardPhoto(data, base64), {
		headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'If-Match': headers.etag },
	})
}

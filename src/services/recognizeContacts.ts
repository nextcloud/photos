/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosResponse } from '@nextcloud/axios'
import type { OCSResponse } from '@nextcloud/typings/ocs'
import type { Collection } from './collectionFetcher.ts'

import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { generateOcsUrl } from '@nextcloud/router'
import he from 'he'

/** A contact of one of the address books of the account, as recognize sees it. */
export type RecognizeContact = {
	uid: string
	/** URI of the address book holding the contact */
	addressBook: string
	addressBookName: string
	displayName: string
	hasPhoto: boolean
	/** The address book cannot be written to, so the contact cannot receive a photo */
	readOnly: boolean
	/** Page of the contact in the Contacts app, null when that app is not available */
	url: string | null
	photoUrl: string | null
}

/** How a person relates to a contact. */
export type FaceContactLink = {
	/** Who made the link, null when the person was never linked */
	linkSource: 'auto' | 'manual' | null
	/** The linked contact, null when the person is not linked or the contact is gone */
	contact: RecognizeContact | null
}

/** A person as the recognize contact API returns it. */
export type RecognizeFace = {
	id: number
	title: string
	/** Name of the person on the recognize WebDAV endpoint */
	name: string
	linkSource: 'auto' | 'manual' | null
	contact: RecognizeContact | null
}

const API_BASE = '/apps/recognize/api/v1'

/**
 * Whether the installed recognize can link people to contacts.
 */
export function isContactLinkingAvailable(): boolean {
	const capabilities = getCapabilities() as { recognize?: { faces?: { contactLinking?: boolean } } }
	return capabilities?.recognize?.faces?.contactLinking === true
}

/**
 * The contact a person is linked to, read from the WebDAV listing of the faces.
 *
 * @param face - The person
 */
export function parseFaceContact(face: Collection): FaceContactLink {
	const raw = (face.attributes as Record<string, unknown>)['face-contact']
	if (typeof raw !== 'string' || raw === '') {
		return { linkSource: null, contact: null }
	}
	try {
		const parsed = JSON.parse(he.decode(raw)) as Partial<FaceContactLink>
		return {
			linkSource: parsed.linkSource ?? null,
			contact: parsed.contact ?? null,
		}
	} catch {
		return { linkSource: null, contact: null }
	}
}

/**
 * The id recognize gave a person, read from the WebDAV listing of the faces.
 *
 * @param face - The person
 */
export function getFaceClusterId(face: Collection): number | null {
	const raw = (face.attributes as Record<string, unknown>)['face-cluster-id']
	const id = Number(raw)
	return raw !== undefined && raw !== '' && Number.isInteger(id) ? id : null
}

/**
 * Search the contacts of the account by name or email address.
 *
 * @param search - Part of the name or email, empty for the first contacts
 * @param limit - Maximum number of contacts
 */
export async function searchContacts(search: string, limit: number = 50): Promise<RecognizeContact[]> {
	const response = await axios.get(generateOcsUrl(`${API_BASE}/contacts`), {
		params: { search, limit },
	}) as AxiosResponse<OCSResponse<RecognizeContact[]>>
	return response.data.ocs.data
}

/**
 * Link a person to a contact.
 *
 * @param clusterId - Id of the person
 * @param contact - The contact to link
 */
export async function linkFaceToContact(clusterId: number, contact: Pick<RecognizeContact, 'addressBook' | 'uid'>): Promise<RecognizeFace> {
	const response = await axios.put(generateOcsUrl(`${API_BASE}/faces/{clusterId}/contact`, { clusterId }), {
		addressBook: contact.addressBook,
		uid: contact.uid,
	}) as AxiosResponse<OCSResponse<RecognizeFace>>
	return response.data.ocs.data
}

/**
 * Remove the link between a person and their contact. The person is not linked again automatically.
 *
 * @param clusterId - Id of the person
 */
export async function unlinkFace(clusterId: number): Promise<RecognizeFace> {
	const response = await axios.delete(generateOcsUrl(`${API_BASE}/faces/{clusterId}/contact`, { clusterId })) as AxiosResponse<OCSResponse<RecognizeFace>>
	return response.data.ocs.data
}

/**
 * Use a face as the photo of the contact the person is linked to.
 *
 * @param detectionId - Id of the face detection
 */
export async function setContactPhotoFromFace(detectionId: number): Promise<RecognizeContact> {
	const response = await axios.post(generateOcsUrl(`${API_BASE}/faces/detections/{detectionId}/contact-photo`, { detectionId })) as AxiosResponse<OCSResponse<RecognizeContact>>
	return response.data.ocs.data
}

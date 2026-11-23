/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type Birthday = { month: number, day: number }

export type Contact = {
	/** Path of the vCard on the server. */
	url: string
	fullName: string
	birthday: Birthday | null
}

type Detection = { x: number, y: number, width: number, height: number }

const DAY = 24 * 60 * 60 * 1000

/**
 * Read the value of a vCard property, unfolded and unescaped.
 *
 * @param vcard - The vCard to read
 * @param name - Name of the property
 */
function getVCardValue(vcard: string, name: string): string | null {
	const match = vcard.replace(/\r?\n[ \t]/g, '').match(new RegExp(`^(?:[\\w-]+\\.)?${name}(?:;[^:\\r\\n]*)?:(.*)$`, 'im'))
	return match === null
		? null
		: match[1].trim().replace(/\\(.)/g, (_, char) => char.toLowerCase() === 'n' ? ' ' : char)
}

/**
 * Read the day and month of a vCard BDAY value like `1990-06-14`, `19900614` or `--0614`.
 *
 * @param value - The BDAY value
 */
export function parseBirthday(value: string | null): Birthday | null {
	const match = value?.match(/^(?:\d{4}|--)-?(\d{2})-?(\d{2})/)
	if (!match) {
		return null
	}
	const birthday = { month: Number(match[1]), day: Number(match[2]) }
	// 2000 is a leap year, so the 29th of February is accepted.
	return birthday.month >= 1 && birthday.month <= 12 && birthday.day >= 1 && birthday.day <= new Date(2000, birthday.month, 0).getDate()
		? birthday
		: null
}

/**
 * Build a contact from its vCard, null when it carries no name.
 *
 * @param url - Path of the vCard on the server
 * @param vcard - The vCard, or the part of it holding FN and BDAY
 */
export function parseContact(url: string, vcard: string): Contact | null {
	const fullName = getVCardValue(vcard, 'FN')
	return fullName
		? { url, fullName, birthday: parseBirthday(getVCardValue(vcard, 'BDAY')) }
		: null
}

/**
 * Make names comparable regardless of case, accents and spacing.
 *
 * @param name - The name to normalize
 */
function normalizeName(name: string): string {
	return name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Pick the contacts to suggest for a typed name: exact matches first,
 * then names starting with it, then names containing it. Contacts
 * sharing a name are suggested once.
 *
 * @param contacts - Contacts to pick from
 * @param query - The typed name
 * @param limit - How many contacts to suggest at most
 */
export function suggestContacts(contacts: Contact[], query: string, limit = 5): Contact[] {
	const needle = normalizeName(query)
	if (needle === '') {
		return []
	}
	const rank = (contact: Contact): number => {
		const name = normalizeName(contact.fullName)
		return name === needle ? 0 : name.startsWith(needle) ? 1 : name.split(' ').some((part) => part.startsWith(needle)) ? 2 : 3
	}
	const seen = new Set<string>()
	return contacts
		.filter((contact) => normalizeName(contact.fullName).includes(needle))
		.sort((a, b) => rank(a) - rank(b) || a.fullName.localeCompare(b.fullName))
		.filter((contact) => {
			const name = normalizeName(contact.fullName)
			return seen.has(name) ? false : seen.add(name)
		})
		.slice(0, limit)
}

/**
 * Find the contact a person is named after, preferring one with a birthday
 * when several contacts share the name.
 *
 * @param contacts - Contacts to look in
 * @param name - Name of the person
 */
export function findContactByName(contacts: Contact[], name: string): Contact | undefined {
	const matches = contacts.filter((contact) => normalizeName(contact.fullName) === normalizeName(name))
	return matches.find((contact) => contact.birthday !== null) ?? matches[0]
}

/**
 * Whether a date lies on a birthday or on the day before or after it, in any
 * year. A birthday on the 29th of February counts as the 28th in common years.
 *
 * @param date - The date to check, read in local time
 * @param birthday - The birthday
 */
export function isAroundBirthday(date: Date, birthday: Birthday): boolean {
	const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	// The neighbouring years cover birthdays at the turn of the year.
	return [-1, 0, 1].some((offset) => {
		const year = date.getFullYear() + offset
		const lastDayOfMonth = new Date(year, birthday.month, 0).getDate()
		return Math.abs(day - Date.UTC(year, birthday.month - 1, Math.min(birthday.day, lastDayOfMonth))) <= DAY
	})
}

/**
 * Replace the picture of a vCard with a JPEG.
 *
 * @param vcard - The vCard to change
 * @param base64 - The JPEG, base64 encoded
 */
export function setVCardPhoto(vcard: string, base64: string): string {
	let inPhoto = false
	const lines = vcard.split(/\r?\n/).filter((line) => {
		// Folded lines continue the property of the line before.
		inPhoto = /^[ \t]/.test(line) ? inPhoto : /^(?:[\w-]+\.)?PHOTO[;:]/i.test(line)
		return !inPhoto && line !== ''
	})
	const photo = /^VERSION:4/im.test(vcard)
		? `PHOTO:data:image/jpeg;base64,${base64}`
		: `PHOTO;ENCODING=b;TYPE=JPEG:${base64}`
	const folded = [photo.slice(0, 75), ...(photo.slice(75).match(/.{1,74}/g) ?? []).map((part) => ` ${part}`)]
	const end = lines.findLastIndex((line) => /^END:VCARD$/i.test(line.trim()))
	lines.splice(end === -1 ? lines.length : end, 0, ...folded)
	return lines.join('\r\n') + '\r\n'
}

/**
 * Get the square of a picture showing a detected face with some room
 * around it, in pixels and kept inside the picture.
 *
 * @param detection - Position of the face, relative to the size of the picture
 * @param width - Width of the picture
 * @param height - Height of the picture
 */
export function getFaceSquare(detection: Detection, width: number, height: number): { x: number, y: number, size: number } {
	const size = Math.round(Math.min(width, height, Math.max(detection.width * width, detection.height * height) * 1.8))
	const clamp = (center: number, max: number): number => Math.round(Math.min(Math.max(center - size / 2, 0), max - size))
	return {
		x: clamp((detection.x + detection.width / 2) * width, width),
		y: clamp((detection.y + detection.height / 2) * height, height),
		size,
	}
}

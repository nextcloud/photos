/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Contact } from './contacts.ts'

import { describe, expect, test } from 'vitest'
import { findContactByName, getFaceSquare, isAroundBirthday, parseBirthday, parseContact, setVCardPhoto, suggestContacts } from './contacts.ts'

/**
 * @param fullName - Name of the contact
 * @param birthday - Birthday as `MM-DD`, if any
 */
function contact(fullName: string, birthday?: string): Contact {
	return { url: `/dav/${fullName}.vcf`, fullName, birthday: birthday ? parseBirthday(`--${birthday}`) : null }
}

describe('parseContact', () => {
	test('reads the name and the birthday', () => {
		expect(parseContact('/a.vcf', 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Anna Example\r\nBDAY:1990-06-14\r\nEND:VCARD\r\n'))
			.toEqual({ url: '/a.vcf', fullName: 'Anna Example', birthday: { month: 6, day: 14 } })
	})

	test('unfolds and unescapes the name, and accepts grouped and parametrised properties', () => {
		expect(parseContact('/a.vcf', 'BEGIN:VCARD\nitem1.FN;CHARSET=UTF-8:Example\\, An\n na\nBDAY;VALUE=date:19900614\nEND:VCARD'))
			.toEqual({ url: '/a.vcf', fullName: 'Example, Anna', birthday: { month: 6, day: 14 } })
	})

	test('ignores cards without a name', () => {
		expect(parseContact('/a.vcf', 'BEGIN:VCARD\r\nN:;;;;\r\nEND:VCARD')).toBeNull()
	})
})

describe('parseBirthday', () => {
	test.each([
		['1990-06-14', { month: 6, day: 14 }],
		['19900614', { month: 6, day: 14 }],
		['--0614', { month: 6, day: 14 }],
		['--06-14', { month: 6, day: 14 }],
		['1990-06-14T00:00:00Z', { month: 6, day: 14 }],
		['2000-02-29', { month: 2, day: 29 }],
		['1990-13-01', null],
		['1990-02-30', null],
		['circa 1990', null],
		[null, null],
	])('%s', (value, expected) => {
		expect(parseBirthday(value)).toEqual(expected)
	})
})

describe('suggestContacts', () => {
	const contacts = [contact('Joanna Smith'), contact('Marianne'), contact('Anna Example'), contact('Ánna'), contact('Bob'), contact('Lee Ann')]

	test('orders exact matches, then prefixes, then word starts, then the rest', () => {
		expect(suggestContacts(contacts, ' anna ').map((c) => c.fullName)).toEqual(['Ánna', 'Anna Example', 'Joanna Smith'])
		expect(suggestContacts(contacts, 'ann').map((c) => c.fullName)).toEqual(['Ánna', 'Anna Example', 'Lee Ann', 'Joanna Smith', 'Marianne'])
	})

	test('limits the suggestions and suggests a name once', () => {
		expect(suggestContacts(contacts, 'ann', 2)).toHaveLength(2)
		expect(suggestContacts([contact('Bob'), contact('bob')], 'bo')).toHaveLength(1)
	})

	test('suggests nothing for an empty name', () => {
		expect(suggestContacts(contacts, '  ')).toEqual([])
	})
})

describe('findContactByName', () => {
	test('matches the whole name regardless of case, accents and spacing', () => {
		const contacts = [contact('Anna Example Jr'), contact('Ánna  Example')]

		expect(findContactByName(contacts, 'anna example')).toBe(contacts[1])
		expect(findContactByName(contacts, 'Anna')).toBeUndefined()
	})

	test('prefers the contact with a birthday among namesakes', () => {
		const contacts = [contact('Anna'), contact('Anna', '06-14')]

		expect(findContactByName(contacts, 'Anna')).toBe(contacts[1])
	})
})

describe('isAroundBirthday', () => {
	test.each([
		[new Date(2019, 5, 12, 23, 59), false],
		[new Date(2019, 5, 13, 0, 0), true],
		[new Date(2021, 5, 14, 12, 0), true],
		[new Date(2024, 5, 15, 23, 59), true],
		[new Date(2024, 5, 16, 0, 0), false],
	])('14 June: %s', (date, expected) => {
		expect(isAroundBirthday(date, { month: 6, day: 14 })).toBe(expected)
	})

	test('covers the turn of the year', () => {
		expect(isAroundBirthday(new Date(2022, 11, 31, 18), { month: 1, day: 1 })).toBe(true)
		expect(isAroundBirthday(new Date(2022, 11, 30, 18), { month: 1, day: 1 })).toBe(false)
		expect(isAroundBirthday(new Date(2023, 0, 1, 2), { month: 12, day: 31 })).toBe(true)
	})

	test('celebrates the 29th of February on the 28th in common years', () => {
		const birthday = { month: 2, day: 29 }

		expect(isAroundBirthday(new Date(2024, 1, 29), birthday)).toBe(true)
		expect(isAroundBirthday(new Date(2024, 2, 1), birthday)).toBe(true)
		expect(isAroundBirthday(new Date(2023, 1, 27), birthday)).toBe(true)
		expect(isAroundBirthday(new Date(2023, 2, 1), birthday)).toBe(true)
		expect(isAroundBirthday(new Date(2023, 2, 2), birthday)).toBe(false)
	})
})

describe('setVCardPhoto', () => {
	test('adds a folded picture to a vCard 3', () => {
		const vcard = setVCardPhoto('BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Anna\r\nEND:VCARD\r\n', 'A'.repeat(200))
		const lines = vcard.split('\r\n')

		expect(lines.slice(0, 3)).toEqual(['BEGIN:VCARD', 'VERSION:3.0', 'FN:Anna'])
		expect(lines[3]).toBe('PHOTO;ENCODING=b;TYPE=JPEG:' + 'A'.repeat(48))
		expect(lines.slice(3, -2).every((line) => line.length <= 75)).toBe(true)
		expect(lines.slice(3, -2).join('').replace(/ /g, '')).toBe('PHOTO;ENCODING=b;TYPE=JPEG:' + 'A'.repeat(200))
		expect(lines.slice(-2)).toEqual(['END:VCARD', ''])
	})

	test('replaces an existing folded picture and keeps the other properties', () => {
		const vcard = setVCardPhoto('BEGIN:VCARD\nVERSION:4.0\nFN:Anna\nitem1.PHOTO;VALUE=uri:data:image/png;base64,OLD\n OLD\n\tOLD\nNOTE:likes\n PHOTOS\nEND:VCARD\n', 'NEW')

		expect(vcard).toBe('BEGIN:VCARD\r\nVERSION:4.0\r\nFN:Anna\r\nNOTE:likes\r\n PHOTOS\r\nPHOTO:data:image/jpeg;base64,NEW\r\nEND:VCARD\r\n')
	})
})

describe('getFaceSquare', () => {
	test('centres on the face with room around it', () => {
		expect(getFaceSquare({ x: 0.4, y: 0.4, width: 0.2, height: 0.2 }, 1000, 1000)).toEqual({ x: 320, y: 320, size: 360 })
	})

	test('stays inside the picture', () => {
		expect(getFaceSquare({ x: 0, y: 0.9, width: 0.1, height: 0.1 }, 1000, 500)).toEqual({ x: 0, y: 320, size: 180 })
		expect(getFaceSquare({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 }, 800, 600)).toEqual({ x: 100, y: 0, size: 600 })
	})
})

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { pastedFileName, splitAcceptedFiles, toUniqueNames } from './uploadFiles.ts'

const mimes = ['image/jpeg', 'image/png', 'video/mp4']

/**
 * @param name - Name of the file
 * @param type - Mime type of the file
 */
function file(name: string, type: string): File {
	return new File(['content'], name, { type })
}

describe('splitAcceptedFiles', () => {
	test('keeps photos and videos, rejects everything else', () => {
		const photo = file('a.jpg', 'image/jpeg')
		const video = file('b.mp4', 'video/mp4')
		const text = file('c.txt', 'text/plain')
		const folder = file('folder', '')

		expect(splitAcceptedFiles([photo, text, video, folder], mimes)).toEqual({
			accepted: [photo, video],
			rejected: [text, folder],
		})
	})

	test('ignores the case of the mime type', () => {
		const photo = file('a.JPG', 'IMAGE/JPEG')

		expect(splitAcceptedFiles([photo], mimes).accepted).toEqual([photo])
	})

	test('rejects image types the library does not show', () => {
		const photo = file('a.xcf', 'image/x-xcf')

		expect(splitAcceptedFiles([photo], mimes).rejected).toEqual([photo])
	})
})

describe('pastedFileName', () => {
	const date = new Date(2026, 10, 2, 9, 5, 7)

	test('names clipboard image data after the moment of the paste', () => {
		expect(pastedFileName(file('image.png', 'image/png'), date)).toBe('pasted-20261102-090507.png')
	})

	test('names a nameless file', () => {
		expect(pastedFileName(file('', 'image/webp'), date)).toBe('pasted-20261102-090507.webp')
	})

	test('uses the usual extension of the mime type', () => {
		expect(pastedFileName(file('image.jpeg', 'image/jpeg'), date)).toBe('pasted-20261102-090507.jpg')
		expect(pastedFileName(file('image.svg', 'image/svg+xml'), date)).toBe('pasted-20261102-090507.svg')
	})

	test('keeps the name of a copied file', () => {
		expect(pastedFileName(file('Holiday 01.jpg', 'image/jpeg'), date)).toBe('Holiday 01.jpg')
		expect(pastedFileName(file('image.final.png', 'image/png'), date)).toBe('image.final.png')
	})
})

describe('toUniqueNames', () => {
	test('keeps names that are free', () => {
		expect(toUniqueNames(['a.jpg', 'b.jpg'], ['c.jpg'])).toEqual(['a.jpg', 'b.jpg'])
	})

	test('renames a file that exists in the destination', () => {
		expect(toUniqueNames(['a.jpg'], ['a.jpg', 'a (1).jpg'])).toEqual(['a (2).jpg'])
	})

	test('renames files of the same batch that share a name', () => {
		expect(toUniqueNames(['a.jpg', 'a.jpg', 'a.jpg'], [])).toEqual(['a.jpg', 'a (1).jpg', 'a (2).jpg'])
	})

	test('leaves the list of taken names untouched', () => {
		const taken = ['a.jpg']
		toUniqueNames(['a.jpg'], taken)

		expect(taken).toEqual(['a.jpg'])
	})
})

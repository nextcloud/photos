/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { groupShotVariants, mergeStacks, shotName } from './shotVariants.ts'

const MIMES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	heic: 'image/heic',
	png: 'image/png',
	dng: 'image/x-dcraw',
	mov: 'video/quicktime',
}

/**
 * A library of the given files, in the order the grid shows them, named after
 * their index.
 *
 * @param paths - Path of each file, e.g. "/Photos/IMG_1.jpg"
 */
function library(paths: string[]): { fileIds: string[], files: Record<string, PhotoFile> } {
	const fileIds = paths.map((_, index) => `${index}`)
	const files = Object.fromEntries(paths.map((path, index) => {
		const slash = path.lastIndexOf('/')
		const basename = path.slice(slash + 1)
		const extension = basename.slice(basename.lastIndexOf('.') + 1).toLowerCase()
		return [`${index}`, { dirname: path.slice(0, slash), basename, mime: MIMES[extension] } as PhotoFile]
	}))
	return { fileIds, files }
}

describe('shotName', () => {
	test.each([
		['IMG_1234.jpg', 'img_1234', false],
		['IMG_1234.CR2', 'img_1234', false],
		['IMG_1234 (edited).jpg', 'img_1234', true],
		['IMG_1234(edited).jpg', 'img_1234', true],
		['IMG_1234-edited.jpg', 'img_1234', true],
		['IMG_1234_edited.jpg', 'img_1234', true],
		['IMG_1234-EDITED.JPG', 'img_1234', true],
		['IMG_1234-bearbeitet.jpg', 'img_1234', true],
		['IMG_1234-modifié.jpg', 'img_1234', true],
		['IMG_1234~2.jpg', 'img_1234', true],
		['IMG_1234-edited~3.jpg', 'img_1234', true],
		['IMG_E1234.HEIC', 'img_1234', true],
		['photo.tar.gz', 'photo.tar', false],
		['.jpg', '.jpg', false],
		['edited.jpg', 'edited', false],
	])('%s is a variant of %s', (basename, name, edited) => {
		expect(shotName(basename)).toEqual({ name, edited })
	})

	test('keeps names that only look alike apart', () => {
		expect(shotName('IMG_1234 (1).jpg').name).not.toBe('img_1234')
		expect(shotName('IMG_12345.jpg').name).not.toBe('img_1234')
		expect(shotName('IMG_1234edited.jpg').name).not.toBe('img_1234')
	})

	test('matches a name however its accents are encoded', () => {
		expect(shotName('IMG_1-modifié.jpg')).toEqual({ name: 'img_1', edited: true })
	})
})

describe('groupShotVariants', () => {
	test('groups nothing in an empty library', () => {
		expect(groupShotVariants([], {})).toEqual({})
	})

	test('leaves files of distinct shots on their own', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.jpg', '/Photos/IMG_2.jpg'])

		expect(groupShotVariants(fileIds, files)).toEqual({})
	})

	test('stacks RAW and JPEG under the JPEG', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.DNG', '/Photos/IMG_1.JPG'])

		expect(groupShotVariants(fileIds, files)).toEqual({
			1: { leaderId: '1', memberIds: ['1', '0'] },
		})
	})

	test('stacks HEIC and JPEG under the JPEG', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.heic', '/Photos/IMG_1.jpg'])

		expect(groupShotVariants(fileIds, files)).toEqual({
			1: { leaderId: '1', memberIds: ['1', '0'] },
		})
	})

	test('stacks an original under its edited copy, even when the copy is not a JPEG', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.jpg', '/Photos/IMG_1 (edited).png', '/Photos/IMG_1.dng'])

		expect(groupShotVariants(fileIds, files)).toEqual({
			1: { leaderId: '1', memberIds: ['1', '0', '2'] },
		})
	})

	test('prefers an edited JPEG over an edited copy in another format', () => {
		const { fileIds, files } = library(['/Photos/IMG_E1.heic', '/Photos/IMG_1-edited.jpg', '/Photos/IMG_1.heic'])

		expect(groupShotVariants(fileIds, files)[1]?.leaderId).toBe('1')
	})

	test('stacks a video under a picture of the same shot', () => {
		const { fileIds, files } = library(['/Photos/IMG_1-edited.mov', '/Photos/IMG_1.heic'])

		expect(groupShotVariants(fileIds, files)[1]?.leaderId).toBe('1')
	})

	test('keeps the grid order among variants of equal rank', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.heic', '/Photos/IMG_1.dng'])

		expect(groupShotVariants(fileIds, files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
		})
	})

	test('keeps files of the same name in different folders apart', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.jpg', '/Backup/IMG_1.dng'])

		expect(groupShotVariants(fileIds, files)).toEqual({})
	})

	test('skips file ids the library does not hold', () => {
		const { fileIds, files } = library(['/Photos/IMG_1.jpg', '/Photos/IMG_1.dng'])

		expect(groupShotVariants(['missing', ...fileIds], files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
		})
	})
})

describe('mergeStacks', () => {
	test('keeps the variant groups when there are no bursts', () => {
		const variants = { 1: { leaderId: '1', memberIds: ['1', '2'] } }

		expect(mergeStacks(variants, {})).toEqual(variants)
	})

	test('keeps the bursts when there are no variant groups', () => {
		const bursts = { 1: { leaderId: '1', memberIds: ['1', '2'] } }

		expect(mergeStacks({}, bursts)).toEqual(bursts)
	})

	test('takes the variants of every shot of a burst into it, right after that shot', () => {
		const variants = {
			1: { leaderId: '1', memberIds: ['1', '2'] },
			3: { leaderId: '3', memberIds: ['3', '4'] },
		}
		const bursts = { 1: { leaderId: '1', memberIds: ['1', '3', '5'] } }

		expect(mergeStacks(variants, bursts)).toEqual({
			1: { leaderId: '1', memberIds: ['1', '2', '3', '4', '5'] },
		})
	})

	test('keeps a variant group outside every burst as a stack of its own', () => {
		const variants = {
			1: { leaderId: '1', memberIds: ['1', '2'] },
			7: { leaderId: '7', memberIds: ['7', '8'] },
		}
		const bursts = { 3: { leaderId: '3', memberIds: ['3', '1'] } }

		expect(mergeStacks(variants, bursts)).toEqual({
			3: { leaderId: '3', memberIds: ['3', '1', '2'] },
			7: { leaderId: '7', memberIds: ['7', '8'] },
		})
	})
})

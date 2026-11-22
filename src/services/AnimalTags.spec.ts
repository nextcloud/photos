/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Tag } from '../store/systemtags.ts'

import { describe, expect, test } from 'vitest'
import { getAnimalTag, getAnimalTypeTags, groupAnimalPhotos, otherAnimalsSection } from './AnimalTags.ts'

/**
 * A system tag the way the tags listing holds it.
 *
 * @param id - Id of the tag
 * @param name - Display name of the tag
 * @param count - Number of images assigned to the tag
 */
function tag(id: string, name: string, count: number): Tag {
	return { id, attributes: { 'display-name': name, 'files-assigned': count } } as unknown as Tag
}

describe('getAnimalTypeTags', () => {
	test('keeps the tags of kinds of animals, most photos first', () => {
		const tags = [
			tag('1', 'Cat', 3),
			tag('2', 'Beach', 40),
			tag('3', 'Dog', 12),
			tag('4', 'Animal', 20),
			tag('5', 'Wildlife', 5),
			tag('6', 'Wild cat', 1),
		]

		expect(getAnimalTypeTags(tags).map((t) => t.attributes['display-name'])).toEqual(['Dog', 'Cat', 'Wild cat'])
	})

	test('matches tag names regardless of case and orders ties by name', () => {
		const tags = [tag('1', 'rabbit', 2), tag('2', 'BIRD', 2)]

		expect(getAnimalTypeTags(tags).map((t) => t.id)).toEqual(['2', '1'])
	})

	test('leaves out kinds without photos', () => {
		expect(getAnimalTypeTags([tag('1', 'Dog', 0)])).toEqual([])
	})

	test('is empty without any animal tag', () => {
		expect(getAnimalTypeTags([tag('1', 'Beach', 4), tag('2', 'Car', 1)])).toEqual([])
	})
})

describe('getAnimalTag', () => {
	test('finds the generic animal tag', () => {
		expect(getAnimalTag([tag('1', 'Dog', 2), tag('2', 'animal', 3)])?.id).toBe('2')
	})

	test('ignores it without photos', () => {
		expect(getAnimalTag([tag('2', 'Animal', 0)])).toBeUndefined()
	})
})

describe('groupAnimalPhotos', () => {
	test('lists the photos of each kind in the given order', () => {
		const { sections, fileIdsBySection } = groupAnimalPhotos([['Dog', [3, 1]], ['Cat', [2]]], [1, 2, 3])

		expect(sections).toEqual(['Dog', 'Cat'])
		expect(fileIdsBySection).toEqual({ Dog: ['3', '1'], Cat: ['2'] })
	})

	test('shows a photo under every kind it is tagged with', () => {
		const { fileIdsBySection } = groupAnimalPhotos([['Dog', [1]], ['Cat', [1, 2]]], [])

		expect(fileIdsBySection).toEqual({ Dog: ['1'], Cat: ['1', '2'] })
	})

	test('puts photos only tagged as animal last', () => {
		const { sections, fileIdsBySection } = groupAnimalPhotos([['Dog', [1]]], [4, 1, 5])

		expect(sections).toEqual(['Dog', otherAnimalsSection])
		expect(fileIdsBySection[otherAnimalsSection]).toEqual(['4', '5'])
	})

	test('leaves out empty sections', () => {
		const { sections } = groupAnimalPhotos([['Dog', []], ['Cat', [2]]], [2])

		expect(sections).toEqual(['Cat'])
	})

	test('is empty without photos', () => {
		expect(groupAnimalPhotos([], [])).toEqual({ sections: [], fileIdsBySection: {} })
	})
})

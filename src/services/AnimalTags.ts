/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Tag } from '../store/systemtags.ts'

/**
 * Tags recognize assigns to photos by kind of animal: the labels and categories
 * of its image classifier rules (recognize src/rules.yml) for animals, spelled
 * the way recognize names the tags.
 */
export const animalTypes = [
	'Alligator',
	'Ape',
	'Bear',
	'Beetle',
	'Bird',
	'Buffalo',
	'Butterfly',
	'Cat',
	'Chameleon',
	'Cheetah',
	'Chicken',
	'Cow',
	'Crab',
	'Crocodile',
	'Dog',
	'Duck',
	'Elephant',
	'Fish',
	'Fox',
	'Frog',
	'Grasshopper',
	'Hippo',
	'Insect',
	'Leopard',
	'Lion',
	'Lizard',
	'Lobster',
	'Monkey',
	'Ostrich',
	'Owl',
	'Panda',
	'Penguin',
	'Puma',
	'Rabbit',
	'Reptile',
	'Salamander',
	'Scorpion',
	'Shark',
	'Sheep',
	'Snail',
	'Spider',
	'Turtle',
	'Whale',
	'Wild cat',
	'Wolf',
]

/** Tag recognize assigns to every photo of an animal, even without a kind. */
export const animalTag = 'Animal'

/** Section of the photos tagged as animal without any kind. */
export const otherAnimalsSection = 'other'

const animalTypeNames = new Set(animalTypes.map((type) => type.toLowerCase()))

/**
 * Tags of a kind of animal that have photos, the ones with most photos first.
 *
 * @param tags - All tags assigned to images
 */
export function getAnimalTypeTags(tags: Tag[]): Tag[] {
	return tags
		.filter((tag) => animalTypeNames.has(tag.attributes['display-name'].toLowerCase()) && tag.attributes['files-assigned'] !== 0)
		.sort((a, b) => b.attributes['files-assigned'] - a.attributes['files-assigned']
			|| a.attributes['display-name'].localeCompare(b.attributes['display-name']))
}

/**
 * @param tags - All tags assigned to images
 */
export function getAnimalTag(tags: Tag[]): Tag | undefined {
	return tags.find((tag) => tag.attributes['display-name'].toLowerCase() === animalTag.toLowerCase() && tag.attributes['files-assigned'] !== 0)
}

/**
 * Group photos by kind of animal, in the order of the given kinds. A photo shows
 * up under every kind it is tagged with; photos only tagged as animal go to a
 * last section, `otherAnimalsSection`. Empty sections are left out.
 *
 * @param typeFileIds - Photo ids of each kind of animal, by section id
 * @param animalFileIds - Photo ids tagged as animal
 */
export function groupAnimalPhotos(typeFileIds: [string, number[]][], animalFileIds: number[]): { sections: string[], fileIdsBySection: Record<string, string[]> } {
	const sections: string[] = []
	const fileIdsBySection: Record<string, string[]> = {}
	const typedFileIds = new Set<number>()

	for (const [section, fileIds] of typeFileIds) {
		if (fileIds.length === 0) {
			continue
		}
		sections.push(section)
		fileIdsBySection[section] = fileIds.map(String)
		fileIds.forEach((fileId) => typedFileIds.add(fileId))
	}

	const otherFileIds = animalFileIds.filter((fileId) => !typedFileIds.has(fileId))
	if (otherFileIds.length > 0) {
		sections.push(otherAnimalsSection)
		fileIdsBySection[otherAnimalsSection] = otherFileIds.map(String)
	}

	return { sections, fileIdsBySection }
}

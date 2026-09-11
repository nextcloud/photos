import type { File, Folder } from '@nextcloud/files'

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import logger from '../services/logger.js'
import getSystemTags from '../services/SystemTags.js'
import getTaggedImages from '../services/TaggedImages.js'
import { sortCompare } from '../utils/fileUtils.js'
import useFilesStore from './files.ts'

export type Tag = Folder & {
	attributes: {
		id: number
		'display-name': string
		'user-visible': boolean
		'user-assignable': boolean
		'can-assign': boolean
		'files-assigned': number
		'reference-fileid': number
	}
}

export default defineStore('systemtags', () => {
	const tags = ref<Record<number, Tag>>({})
	const names = ref<Record<string, number>>({})
	const tagsFiles = ref<Record<number, number[]>>({})

	/**
	 * Order and save tags.
	 *
	 * @param newTags - Tags to store
	 */
	function updateTags(newTags: Tag[]): void {
		newTags
			.sort((a, b) => sortCompare(a, b, 'display-name'))
			.forEach((tag) => {
				tags.value[tag.attributes.id] = tag
				names.value[tag.attributes['display-name']] = tag.attributes.id
			})
	}

	/**
	 * @param id - Id of the tag to forget
	 */
	function removeTag(id: number): void {
		delete names.value[tags.value[id].attributes['display-name']]
		delete tags.value[id]
	}

	/**
	 * Update the file list of a tag, dropping the tag when it has none left.
	 *
	 * @param id - Id of the tag
	 * @param files - Files assigned to the tag
	 */
	function updateTag(id: number, files: File[]): void {
		if (files.length === 0) {
			removeTag(id)
			return
		}

		// sort by last modified
		const list = files.sort((a, b) => sortCompare(a, b, 'files-assigned'))

		logger.debug(`Overwrite list, id: ${id}`, { list })
		tagsFiles.value[id] = list.map((file) => file.fileid!)
	}

	/**
	 * @param id - Id of the tag
	 * @param signal - Abort signal of the caller
	 */
	async function fetchTagFiles(id: number, signal: AbortSignal): Promise<void> {
		try {
			const files = await getTaggedImages(id, { signal })
			updateTag(id, files)
			useFilesStore().appendFiles(files)
		} catch (error) {
			logger.error(`Failed to get tag content, id: ${id}`, { error })
		}
	}

	/**
	 * @param signal - Abort signal of the caller
	 */
	async function fetchAllTags(signal: AbortSignal): Promise<void> {
		updateTags(await getSystemTags('', { signal }) as Tag[])
	}

	/**
	 * @param name - Display name of the tag
	 */
	function tagId(name: string): number {
		return names.value[name]
	}

	return {
		tags,
		names,
		tagsFiles,
		updateTags,
		removeTag,
		updateTag,
		fetchTagFiles,
		fetchAllTags,
		tagId,
	}
})

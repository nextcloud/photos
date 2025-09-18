/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File, Folder } from '@nextcloud/files'
import type { PhotosContext } from './index.js'

import logger from '../services/logger.js'
import getSystemTags from '../services/SystemTags.js'
import getTaggedImages from '../services/TaggedImages.js'
import { sortCompare } from '../utils/fileUtils.js'

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

const state = {
	tags: {} as Record<number, Tag>,
	names: {} as Record<string, number>,
	tagsFiles: {} as Record<number, number[]>,
}

export type SystemTagsState = typeof state

const mutations = {
	/**
	 * Order and save tags
	 *
	 * @param state
	 * @param tags
	 */
	updateTags(state: SystemTagsState, tags: Tag[]) {
		if (tags.length > 0) {
			// sort by basename
			const list = tags.sort((a, b) => sortCompare(a, b, 'display-name'))

			// store tag and its index
			list.forEach((tag) => {
				state.tags[tag.attributes.id] = tag
				state.names[tag.attributes['display-name']] = tag.attributes.id
			})
		}
	},

	/**
	 * Update tag files list
	 *
	 * @param state
	 * @param root0
	 * @param root0.id
	 */
	removeTag(state: SystemTagsState, { id }: { id: number }) {
		delete state.names[state.tags[id]?.attributes.displayname]
		delete state.tags[id]
	},

	/**
	 * Update tag files list
	 *
	 * @param state
	 * @param root0
	 * @param root0.id
	 * @param root0.files
	 */
	updateTag(state: SystemTagsState, { id, files }: { id: number, files: File[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			delete state.names[state.tags[id]?.attributes.displayname]
			delete state.tags[id]
			return
		}

		// sort by last modified
		const list = files.sort((a, b) => sortCompare(a, b, 'files-assigned'))

		// overwrite list
		logger.debug(`Overwrite list, id: ${id}`, { list })
		state.tagsFiles[id] = list.map((file) => file.fileid).filter((fileid) => fileid !== undefined)
	},
}

const getters = {
	tags: (state: SystemTagsState) => state.tags,
	tagsNames: (state: SystemTagsState) => state.names,
	tag: (state: SystemTagsState) => (id: number) => state.tags[id],
	tagId: (state: SystemTagsState) => (name: string) => state.names[name],
}

const actions = {
	/**
	 * Update files and folders
	 *
	 * @param context
	 * @param tags
	 */
	updateTags(context: PhotosContext<SystemTagsState>, tags: string[]) {
		context.commit('updateTags', tags)
	},

	/**
	 * Update tag files list
	 *
	 * @param context
	 * @param root0
	 * @param root0.id
	 * @param root0.files
	 */
	updateTag(context: PhotosContext<SystemTagsState>, { id, files }: { id: number, files: File[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			context.commit('removeTag', { id })
		}
		context.commit('updateTag', { id, files })
	},

	async fetchTagFiles(context: PhotosContext<SystemTagsState>, { id, signal }: { id: number, signal: AbortSignal }) {
		try {
			// get data
			const files = await getTaggedImages(id, { signal })
			await context.dispatch('updateTag', { id, files })
			await context.dispatch('appendFiles', files)
		} catch (error) {
			logger.error(`Failed to get tag content, id: ${id}`, { error })
		}
	},

	async fetchAllTags(context: PhotosContext<SystemTagsState>, { signal }: { signal: AbortSignal }) {
		const tags = await getSystemTags('', {
			signal,
		})
		await context.dispatch('updateTags', tags)
	},
}

export default { state, mutations, getters, actions }

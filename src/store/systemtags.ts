/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import { sortCompare } from '../utils/fileUtils.js'
import getTaggedImages from '../services/TaggedImages.js'
import getSystemTags from '../services/SystemTags.js'
import logger from '../services/logger.js'
import type { File, Folder } from '@nextcloud/files'
import type { PhotosContext } from './index.js'

const state = {
	tags: {} as Record<string, Tag>,
	names: {} as Record<string, string>,
}

export type SystemTagsState = typeof state

type Tag = Folder & {
	id: string
	files: number[]
}

const mutations = {
	/**
	 * Order and save tags
	 */
	updateTags(state: SystemTagsState, tags: Tag[]) {
		if (tags.length > 0) {
			// sort by basename
			const list = tags.sort((a, b) => sortCompare(a, b, 'displayname'))

			// store tag and its index
			list.forEach(tag => {
				Vue.set(state.tags, tag.id, tag)
				Vue.set(state.names, tag.displayname, tag.id)
			})
		}
	},

	/**
	 * Update tag files list
	 */
	removeTag(state: SystemTagsState, { id }: { id: number }) {
		Vue.delete(state.names, state.tags[id].displayname)
		Vue.delete(state.tags, id)
	},

	/**
	 * Update tag files list
	 */
	updateTag(state: SystemTagsState, { id, files }: { id: number; files: File[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			Vue.delete(state.names, state.tags[id].displayname)
			Vue.delete(state.tags, id)
			return
		}

		// sort by last modified
		const list = files.sort((a, b) => sortCompare(a, b, 'filesAssigned'))

		// overwrite list
		logger.debug(`Overwrite list, id: ${id}`, { list })
		Vue.set(state.tags[id], 'files', list.map(file => file.fileid))
	},
}

const getters = {
	tags: (state: SystemTagsState) => state.tags,
	tagsNames: (state: SystemTagsState) => state.names,
	tag: (state: SystemTagsState) => id => state.tags[id],
	tagId: (state: SystemTagsState) => name => state.names[name],
}

const actions = {
	/**
	 * Update files and folders
	 */
	updateTags(context: PhotosContext<SystemTagsState>, tags: string[]) {
		context.commit('updateTags', tags)
	},

	/**
	 * Update tag files list
	 */
	updateTag(context: PhotosContext<SystemTagsState>, { id, files }: { id: number, files: File[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			context.commit('removeTag', { id })
		}
		context.commit('updateTag', { id, files })
	},

	async fetchTagFiles(context: PhotosContext<SystemTagsState>, { id, signal }: { id: number; signal: AbortSignal }) {
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

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import { sortCompare, type PhotoNode } from '../utils/fileUtils.js'
import getTaggedImages from '../services/TaggedImages.js'
import getSystemTags from '../services/SystemTags.js'
import logger from '../services/logger.js'

const state = {
	tags: {},
	names: {},
}

type SystemTagsState = typeof state

const mutations = {
	/**
	 * Order and save tags
	 */
	updateTags(state: SystemTagsState, tags: string[]) {
		if (tags.length > 0) {
			// sort by basename
			const list = tags.sort((a, b) => sortCompare(a, b, 'displayName'))

			// store tag and its index
			list.forEach(tag => {
				Vue.set(state.tags, tag.id, tag)
				Vue.set(state.names, tag.displayName, tag.id)
			})
		}
	},

	/**
	 * Update tag files list
	 */
	removeTag(state: SystemTagsState, { id }: { id: number }) {
		Vue.delete(state.names, state.tags[id].displayName)
		Vue.delete(state.tags, id)
	},

	/**
	 * Update tag files list
	 */
	updateTag(state: SystemTagsState, { id, files }: { id: number; files: PhotoNode[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			Vue.delete(state.names, state.tags[id].displayName)
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
	updateTags(context, tags: string[]) {
		context.commit('updateTags', tags)
	},

	/**
	 * Update tag files list
	 */
	updateTag(context, { id, files }: { id: number, files: PhotoNode[] }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			context.commit('removeTag', { id })
		}
		context.commit('updateTag', { id, files })
	},

	async fetchTagFiles(context, { id, signal }: { id: number; signal: AbortSignal }) {
		try {
			// get data
			const files = await getTaggedImages(id, { signal })
			await context.dispatch('updateTag', { id, files })
			await context.dispatch('appendFiles', files)
		} catch (error) {
			if (error.response && error.response.status) {
				logger.error(`Failed to get tag content, id: ${id}`, { error })
			} else {
				logger.error(error)
			}
		}
	},

	async fetchAllTags(context, { signal }: { signal: AbortSignal }) {
		const tags = await getSystemTags('', {
			signal,
		})
		await context.dispatch('updateTags', tags)
	},
}

export default { state, mutations, getters, actions }

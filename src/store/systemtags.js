/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import Vue from 'vue'
import { sortCompare } from '../utils/fileUtils.js'
import getTaggedImages from '../services/TaggedImages.js'
import getSystemTags from '../services/SystemTags.js'

const state = {
	tags: {},
	names: {},
}

const mutations = {
	/**
	 * Order and save tags
	 *
	 * @param {object} state vuex state
	 * @param {Array} tags the tags list
	 */
	updateTags(state, tags) {
		if (tags.length > 0) {
			// sort by basename
			const list = tags.sort((a, b) => sortCompare(a, b, 'displayName'))

			// store tag and its index
			list.forEach(tag => {
				Vue.set(state.tags, tag.id, tag)
				Vue.set(state.tags[tag.id], 'files', [])
				Vue.set(state.names, tag.displayName, tag.id)
			})
		}
	},

	/**
	 * Update tag files list
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {number} data.id current tag id
	 */
	removeTag(state, { id }) {
		Vue.delete(state.names, state.tags[id].displayName)
		Vue.delete(state.tags, id)
	},

	/**
	 * Update tag files list
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {number} data.id current tag id
	 * @param {object[]} data.files list of files
	 */
	updateTag(state, { id, files }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			Vue.delete(state.names, state.tags[id].displayName)
			Vue.delete(state.tags, id)
			return
		}

		// sort by last modified
		const list = files.sort((a, b) => sortCompare(a, b, 'lastmod'))

		// overwrite list
		console.info(id, list)
		Vue.set(state.tags[id], 'files', list.map(file => file.fileid))
	},
}

const getters = {
	tags: state => state.tags,
	tagsNames: state => state.names,
	tag: state => id => state.tags[id],
	tagId: state => name => state.names[name],
}

const actions = {
	/**
	 * Update files and folders
	 *
	 * @param {object} context vuex context
	 * @param {Array} tags the tag list
	 */
	updateTags(context, tags) {
		context.commit('updateTags', tags)
	},

	/**
	 * Update tag files list
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {number} data.id current tag id
	 * @param {object[]} data.files list of files
	 */
	updateTag(context, { id, files }) {
		if (files.length === 0) {
			// Remove this tag from the list if there's no files for it
			context.commit('removeTag', { id })
		}
		context.commit('updateTag', { id, files })
	},

	/**
	 *
	 * @param context
	 * @param obj
	 * @param obj.id the tag id to fetch files for
	 * @param obj.signal AbortController signal
	 * @return {Promise<void>}
	 */
	async fetchTagFiles(context, { id, signal }) {
		try {
			// get data
			const files = await getTaggedImages(id, { signal })
			await context.dispatch('updateTag', { id, files })
			await context.dispatch('appendFiles', files)
		} catch (error) {
			if (error.response && error.response.status) {
				console.error('Failed to get tag content', id, error.response)
			}
		}
	},

	async fetchAllTags(context, { signal }) {
		const tags = await getSystemTags('', {
			signal,
		})
		await context.dispatch('updateTags', tags)
	},
}

export default { state, mutations, getters, actions }

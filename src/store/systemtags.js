/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

const state = {
	paths: {},
	tags: {},
}

const mutations = {
	/**
	 * Index folders paths and ids
	 *
	 * @param {Object} state vuex state
	 * @param {Object} data destructuring object
	 * @param {number} data.id current folder id
	 * @param {Array} data.files list of files
	 */
	updateTags(state, { id, files }) {
		if (files.length > 0) {
			// sort by last modified
			const list = files.sort((a, b) => {
				return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime()
			})

			// Set folder list
			Vue.set(state.tags, id, list.map(file => file.id))
		}
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param {Object} state vuex state
	 * @param {Object} data destructuring object
	 * @param {string} data.path path of this folder
	 * @param {number} data.id id of this folder
	 */
	addPath(state, { path, id }) {
		Vue.set(state.paths, path, id)
	},
}

const getters = {
	tags: state => state.tags,
	tag: state => id => state.tags[id],
	tagId: state => path => state.paths[path],
}

const actions = {
	/**
	 * Update files and folders
	 *
	 * @param {Object} context vuex context
	 * @param {Object} data destructuring object
	 * @param {number} data.id current folder id
	 * @param {Array} data.files list of files
	 * @param {Array} data.folders list of folders
	 */
	updateTags(context, { id, files, folders }) {
		context.commit('updateTags', { id, files })

		// then add each folders path indexes
		folders.forEach(folder => context.commit('addPath', { path: folder.filename, id: folder.id }))
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param {Object} context vuex context
	 * @param {Object} data destructuring object
	 * @param {string} data.path path of this folder
	 * @param {number} data.id id of this folder
	 */
	addPath(context, { path, id }) {
		context.commit('addPath', { path, id })
	},
}

export default { state, mutations, getters, actions }

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
 */

const state = {
	timeline: [],
}

const mutations = {
	/**
	 * Update timeline files list
	 *
	 * @param {object} state the store mutations
	 * @param {Array} files the store mutations
	 */
	updateTimeline(state, files) {
		state.timeline.push(...files
			.map(file => file.fileid)
			.filter(id => id >= 0))
	},

	resetTimeline(state) {
		state.timeline = []
	},
}

const getters = {
	timeline: state => state.timeline,
}

const actions = {
	/**
	 * Update timeline files list
	 *
	 * @param {object} context the store mutations
	 * @param {number[]} files list of files ids
	 */
	updateTimeline(context, files = []) {
		// we want all the FileInfo! Folders included!
		context.commit('updateTimeline', files)
	},

	/**
	 * Reset the timeline files list
	 *
	 * @param {object} context the store mutations
	 */
	resetTimeline(context) {
		context.commit('resetTimeline')
	},
}

export default { state, mutations, getters, actions }

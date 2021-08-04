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

import Vue from 'vue'
import { sizes } from '../assets/grid-sizes'

export default new Vue({
	data() {
		return {
			gridConfig: sizes.max,
		}
	},
	watch: {
		gridConfig(val) {
			this.$emit('changed', val)
		},
	},
	created() {
		window.addEventListener('resize', this.handleWindowResize)
		this.handleWindowResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleWindowResize)
	},
	methods: {
		handleWindowResize() {
			// find the first grid size that fit the current window width
			const currentSize = Object.keys(sizes).find(size => size > document.documentElement.clientWidth)
			this.gridConfig = sizes[currentSize] || sizes.max
		},
	},
})

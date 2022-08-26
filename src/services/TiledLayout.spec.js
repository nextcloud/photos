/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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

import { splitItemsInRows } from './TiledLayout.js'

/** @type {import('./TiledLayout.js').TiledItem} */
const sectionHeader1 = {
	id: '202204',
	sectionHeader: true,
	height: 75,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const squareImage1 = {
	id: 'squareImage1',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const sectionHeader2 = {
	id: '202205',
	sectionHeader: true,
	height: 75,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const squareImage2 = {
	id: 'squareImage2',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const squareImage3 = {
	id: 'squareImage3',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const tallImage1 = {
	id: 'tallImage1',
	width: 200,
	height: 10000,
	ratio: 200 / 10000,
}

/** @type {import('./TiledLayout.js').TiledItem} */
const wideImage1 = {
	id: 'wideImage1',
	width: 10000,
	height: 250,
	ratio: 10000 / 250,
}

const items = [sectionHeader1, squareImage1, sectionHeader2, wideImage1, squareImage2, squareImage3, tallImage1]

/** @type {import('./TiledLayout.js').TiledRow[]} */
const expectedLayout = [

	{
		items: [sectionHeader1],
		height: 75,
		key: '202204',
	},
	{
		items: [squareImage1],
		height: 220,
		key: 'squareImage1',
	},
	{
		items: [sectionHeader2],
		height: 75,
		key: '202205',
	},
	{
		items: [wideImage1],
		height: 50,
		key: 'wideImage1',
	},
	{
		items: [squareImage2, squareImage3, tallImage1],
		height: 220,
		key: 'squareImage2-squareImage3-tallImage1',
	},
]

describe('TileLayout', () => {
	test('Adding permissions', () => {
		expect(splitItemsInRows(items, 2000)).toStrictEqual(expectedLayout)
	})
})

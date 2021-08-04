/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// sass plugin to implement js configs into scss
// eslint-disable-next-line node/no-extraneous-require
const sass = require('sass')
const { sizes } = require('../assets/grid-sizes')

const gridConfigKeys = Object.keys(sizes)
const gridConfigMap = new sass.types.Map(gridConfigKeys.length)

gridConfigKeys.forEach((size, index) => {
	const config = sizes[size]
	const configMap = new sass.types.Map(3)

	configMap.setKey(0, new sass.types.String('count'))
	configMap.setValue(0, new sass.types.Number(config.count))
	configMap.setKey(1, new sass.types.String('marginTop'))
	configMap.setValue(1, new sass.types.Number(config.marginTop))
	configMap.setKey(2, new sass.types.String('marginW'))
	configMap.setValue(2, new sass.types.Number(config.marginW))

	gridConfigMap.setKey(index, new sass.types.String(size))
	gridConfigMap.setValue(index, configMap)
})

module.exports = `$sizes: ${gridConfigMap};`

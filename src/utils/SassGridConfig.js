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
 *
 */

// sass plugin to implement js configs into scss

// eslint-disable-next-line n/no-extraneous-require
const sass = require('sass')
// eslint-disable-next-line n/no-extraneous-require
const { OrderedMap } = require('immutable')

const { sizes } = require('../assets/grid-sizes.js')

const gridConfigKeys = Object.keys(sizes)
const gridConfigMap = OrderedMap().asMutable()

gridConfigKeys.forEach(size => {
	const config = sizes[size]
	const configMap = OrderedMap().asMutable()

	configMap.set(new sass.SassString('count'), new sass.SassNumber(config.count))
	configMap.set(new sass.SassString('marginTop'), new sass.SassNumber(config.marginTop))
	configMap.set(new sass.SassString('marginW'), new sass.SassNumber(config.marginW))

	gridConfigMap.set(new sass.SassString(size), new sass.SassMap(configMap))
})

module.exports = `$sizes: ${new sass.SassMap(gridConfigMap)};`

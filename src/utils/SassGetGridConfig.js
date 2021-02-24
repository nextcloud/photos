/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const sass = require('node-sass')
const sassUtils = require('node-sass-utils')(sass)

// sass plugin to implement js configs into scss
const sassVars = require('../assets/grid-sizes')

// Allows us to use js variables in sass so we can havea global config
// https://github.com/planetflash/sharing_variables_js_sass/
const convertStringToSassDimension = function(result) {
	// Only attempt to convert strings
	if (typeof result !== 'string') {
		return result
	}

	const cssUnits = [
		'rem',
		'em',
		'vh',
		'vw',
		'vmin',
		'vmax',
		'ex',
		'%',
		'px',
		'cm',
		'mm',
		'in',
		'pt',
		'pc',
		'ch',
	]
	const parts = result.match(/[a-zA-Z]+|[0-9]+/g)
	const value = parts[0]
	const unit = parts[parts.length - 1]
	if (cssUnits.indexOf(unit) !== -1) {
		result = new sassUtils.SassDimension(parseInt(value, 10), unit)
	}

	return result
}

module.exports = function(keys) {
	keys = keys.getValue().split('.')
	let result = sassVars

	for (let i = 0; i < keys.length; i++) {
		result = result[keys[i]]

		// Convert to SassDimension if dimenssion
		if (typeof result === 'string') {
			result = convertStringToSassDimension(result)
		} else if (typeof result === 'object') {
			Object.keys(result).forEach(function(key) {
				const value = result[key]
				result[key] = convertStringToSassDimension(value)
			})
		}
	}

	result = sassUtils.castToSass(result)
	return result
}

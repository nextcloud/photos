/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// sass plugin to implement js configs into scss

import { OrderedMap } from 'immutable'
import * as sass from 'sass'
import sizes from '../assets/grid-sizes.js'

const gridConfigKeys = Object.keys(sizes)
const gridConfigMap = OrderedMap().asMutable()

gridConfigKeys.forEach((size) => {
	const config = sizes[size]
	const configMap = OrderedMap().asMutable()

	configMap.set(new sass.SassString('count'), new sass.SassNumber(config.count))
	configMap.set(new sass.SassString('marginTop'), new sass.SassNumber(config.marginTop))
	configMap.set(new sass.SassString('marginW'), new sass.SassNumber(config.marginW))

	gridConfigMap.set(new sass.SassString(size), new sass.SassMap(configMap))
})

export default `$sizes: ${new sass.SassMap(gridConfigMap)};`

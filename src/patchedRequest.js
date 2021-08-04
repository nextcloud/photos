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

const request = require('webdav/dist/node/request')

const oldPrepareRequestOptions = request.prepareRequestOptions

// While we wait for official cancellable webdav requests
// https://github.com/perry-mitchell/webdav-client/issues/179
// let's properly forward our axios options through webdav to axios

request.prepareRequestOptions = function(requestOptions, methodOptions) {
	// add our cancelToken support
	if (methodOptions.cancelToken && typeof methodOptions.cancelToken === 'object') {
		requestOptions.cancelToken = methodOptions.cancelToken
	}

	// exploit old method
	oldPrepareRequestOptions(requestOptions, methodOptions)

	// allow us to override the request method
	if (methodOptions.method && typeof methodOptions.method === 'string') {
		requestOptions.method = methodOptions.method
	}
}

module.exports = request

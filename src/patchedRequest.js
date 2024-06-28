/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const request = require('webdav/dist/node/request')

const oldPrepareRequestOptions = request.prepareRequestOptions

// While we wait for official cancellable webdav requests
// https://github.com/perry-mitchell/webdav-client/issues/179
// let's properly forward our axios options through webdav to axios
request.prepareRequestOptions = function(requestOptions, context, methodOptions) {
	// add our cancelToken support
	if (methodOptions.cancelToken && typeof methodOptions.cancelToken === 'object') {
		requestOptions.cancelToken = methodOptions.cancelToken
	}

	// exploit old method
	const finalOptions = oldPrepareRequestOptions(requestOptions, context, methodOptions)

	// allow us to override the request method
	if (methodOptions.method && typeof methodOptions.method === 'string') {
		finalOptions.method = methodOptions.method
	}

	return finalOptions
}

module.exports = request

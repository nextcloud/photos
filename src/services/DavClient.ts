/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClient } from 'webdav'

import { defaultRemoteURL, getClient } from '@nextcloud/files/dav'
import recognizeApiKey from './recognizeApiKey.ts'

export const davClient: WebDAVClient = getClient(defaultRemoteURL, {
	'X-Recognize-Api-Key': recognizeApiKey,
})

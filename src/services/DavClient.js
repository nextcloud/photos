/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createClient, getPatcher } from 'webdav'
import axios from '@nextcloud/axios'
import parseUrl from 'url-parse'
import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'

export const rootPath = 'dav'
export const prefixPath = `/files/${getCurrentUser()?.uid}`

// force our axios
const patcher = getPatcher()
patcher.patch('request', axios)

// init webdav client on default dav endpoint
const remote = generateRemoteUrl(rootPath)
const client = createClient(remote)

export const remotePath = parseUrl(remote).pathname
export default client

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClient } from 'webdav'

import { getClient } from '@nextcloud/files/dav'

export const davClient: WebDAVClient = getClient()

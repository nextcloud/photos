/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'

const imageMimes = loadState('photos', 'image-mimes', [])
const videoMimes = loadState('photos', 'video-mimes', [])
const allMimes = [...imageMimes, ...videoMimes] as string[]

export { allMimes, allMimes as default, imageMimes, videoMimes }

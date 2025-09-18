/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosRootSate } from './store/index.ts'

declare module 'vue' {
	interface ComponentCustomProperties {
		$store: Store<PhotosRootSate>
	}
}

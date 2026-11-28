/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Node } from '@nextcloud/files'

declare module '@nextcloud/event-bus' {
	export interface NextcloudEvents {
		'viewer:sidebar:open': Node
	}
}

export {}

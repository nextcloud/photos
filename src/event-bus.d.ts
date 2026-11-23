/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { INode, Node } from '@nextcloud/files'

declare module '@nextcloud/event-bus' {
	export interface NextcloudEvents {
		'files:node:deleted': Node
		'files:node:updated': Node
		'photos:user-config-changed': { key: string, value: unknown }
		/** Asked by the viewer to show a file in the files sidebar. */
		'viewer:sidebar:open': INode
	}
}

export {}

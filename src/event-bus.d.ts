/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Type augmentations for the events the photos app subscribes to via
 * `@nextcloud/event-bus`. Without these, the generic `subscribe<K>(name, fn)`
 * falls back to its catch-all `Event` payload and type-checks fail because
 * the photos handlers expect typed payloads (e.g. `File` or a config object).
 *
 * The runtime payload shape is owned by the emitter (the server's files
 * app). We declare the shape here only for type-checking purposes.
 */
import type { File } from '@nextcloud/files'

declare module '@nextcloud/event-bus' {
	interface NextcloudEvents {
		'files:node:created': File
		'files:node:updated': File
		'files:node:deleted': File
		// Photos-specific config-changed event from `store/userConfig.ts`.
		// The payload is `{ key: string, value: unknown }`.
		'photos:user-config-changed': { key: string, value: unknown }
	}
}

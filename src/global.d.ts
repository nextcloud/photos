/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		OCA: Record<string, any>,
	}
}

export {}

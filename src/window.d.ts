/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/// <reference types="@nextcloud/typings" />
export {}

declare global {
	interface Window {
		OC: {
			Files: {
				getClient: () => OC.Files.Client
			}
		}
		OCP: Nextcloud.v29.OCP
		OCA: {
			Files: any
		}
		__webpack_nonce__: string
		__webpack_public_path__: string
	}
}

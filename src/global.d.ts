/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ViewerFileInfo } from './utils/fileUtils.ts'

declare global {
	interface Window {
		OCA: {
			Dashboard: {
				register(name: string, callback: (el: HTMLElement) => void): void
			}
			Viewer: {
				open: ({ fileInfo, list }: { fileInfo: ViewerFileInfo, list: ViewerFileInfo[] }) => void
				close: () => void
			}
		}
	}
}

export {}

declare module '*.svg?raw' {
	const content: string
	export default content
}

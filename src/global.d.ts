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
			Files: {
				Sidebar: {
					open: (path: string) => void
					close: () => void
					file: string | null | undefined
					registerTab(tab: unknown): void
					Tab: unknown
				}
			}
			Viewer: {
				open: ({ fileInfo, list, onClose, startSlideshow }: { fileInfo: ViewerFileInfo, list: ViewerFileInfo[], onClose?: () => void, startSlideshow?: boolean }) => void
				close: () => void
			}
		}
		OCP?: {
			Accessibility?: {
				/** Whether the reader opted out of the keyboard shortcuts of the apps. */
				disableKeyboardShortcuts?: () => boolean
			}
		}
	}
}

export {}

declare module '*.svg?raw' {
	const content: string
	export default content
}

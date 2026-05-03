/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ViewerFileInfo } from './utils/fileUtils.ts'

declare global {
	interface Window {
		OCA: typeof OCA
	}

	const OC: {
		dialogs: {
			confirmDestructive(
				text: string,
				title: string,
				buttons: {
					type: number
					confirm: string
					cancel: string
					confirmClasses?: string
				},
				callback: (result: boolean) => void,
				modal?: boolean,
			): void
			YES_NO_BUTTONS: number
		}
		// Set when sharing-related apps (share-by-mail, federation, …) are enabled.
		Share?: unknown
		// Server-side config bag, e.g. OC.config['sharing.minSearchStringLength'].
		config: Record<string, string>
	}

	const OCA: {
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
			open: ({ fileInfo, list }: { fileInfo: ViewerFileInfo, list: ViewerFileInfo[] }) => void
			close: () => void
		}
	}
}

export {}

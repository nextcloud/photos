/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Wildcard ambient module declarations for asset imports.
 * Kept in a stand-alone non-module file so the wildcards aren't shadowed
 * by any module-augmentation behaviour in `global.d.ts`.
 */

declare module '*.svg' {
	const content: string
	export default content
}

declare module '*.svg?raw' {
	const content: string
	export default content
}

declare module '*.png' {
	const content: string
	export default content
}

declare module '*.jpg' {
	const content: string
	export default content
}

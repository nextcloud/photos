/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Client-side classifiers for "smart album" buckets — auto-curated
 * timeline filters that the user never has to maintain. The
 * classifiers run on `PhotoFile` objects as they flow through
 * FetchFilesMixin → store, so the timeline's existing month
 * grouping / virtual scroll / hover preview all just work.
 *
 * These are *heuristics*, not ML inference: a screenshot detector
 * built on filename patterns will miss the rare cases (a user who
 * renamed their iPhone screenshot) but catches the dominant case
 * (every photo named "Screenshot 2024-…" or "Screenshot_…"). The
 * benefit is no infrastructure ask — it's a pure function over
 * data the timeline already has, so smart albums show up
 * instantly and stay in sync as files arrive.
 */

import type { PhotoFile } from '../store/files.ts'

import burstStore from '../store/bursts.ts'

export type SmartAlbumKind = 'screenshots' | 'bursts'

/**
 * iOS / Android / desktop OS screenshot filename patterns. The
 * grammar is intentionally tight — a generic "shot" without any
 * of the structured prefixes wouldn't qualify, so users with a
 * file called "ourshot.jpg" don't accidentally end up in the
 * Screenshots album.
 */
const SCREENSHOT_NAME_PATTERNS: RegExp[] = [
	// iOS: "IMG_2345.PNG" with the leading "Screen Shot ..." renamed
	// flavour from older iOS versions covered by the explicit prefix
	// match below.
	/^Screen[ _-]?Shot[ _-]/i,
	// "Screenshot YYYY-MM-DD …", "Screenshot_YYYY-MM-DD…"
	/^Screenshot[ _-]/i,
	// Modern Android Pixel: "PXL_*", but those are camera photos —
	// excluded on purpose.
	// macOS: "Screenshot YYYY-MM-DD at HH.MM.SS"
	/^Captura de pantalla/i, // macOS Spanish locale
	/^Bildschirmfoto/i, // macOS / Windows German
	/^Captura/i, // generic
]

export function isScreenshot(file: PhotoFile): boolean {
	const name = file.basename ?? ''
	for (const pattern of SCREENSHOT_NAME_PATTERNS) {
		if (pattern.test(name)) {
			return true
		}
	}
	return false
}

/**
 * Member of any burst stack. Reads from the live bursts store so
 * the result reflects the most recent clustering pass rather than
 * a stale snapshot.
 *
 * @param file
 */
export function isBurstMember(file: PhotoFile): boolean {
	const id = file.fileid?.toString()
	if (id === undefined) {
		return false
	}
	const stacks = burstStore().stacks
	for (const leaderId of Object.keys(stacks)) {
		if (stacks[leaderId].memberIds.includes(id)) {
			return true
		}
	}
	return false
}

/**
 * Pick a classifier by SmartAlbumKind. Returns a `(file) => boolean`
 * that the timeline can apply as a filter. Unknown kinds return
 * `() => true` so a typo doesn't silently empty the timeline.
 *
 * @param kind
 */
export function smartAlbumFilter(kind: SmartAlbumKind): (file: PhotoFile) => boolean {
	switch (kind) {
		case 'screenshots':
			return isScreenshot
		case 'bursts':
			return isBurstMember
		default:
			return () => true
	}
}

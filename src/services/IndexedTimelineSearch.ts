/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Indexed-timeline read path. Hits `/apps/photos/api/v1/index/timeline`
 * and converts the enriched rows into `@nextcloud/files` `File` objects
 * matching the shape that the rest of the photos UI already consumes
 * from the legacy DAV fetcher (`PhotoSearch.ts`). The point of going
 * via `File` is that everything downstream — `FilesByMonthMixin`,
 * `FileComponent`, `Slideshow`, the album-add flow — can stay
 * untouched.
 *
 * What's *not* covered here: photos in group folders / external
 * storage / shared mounts. The backend filters the indexed timeline
 * to the user's primary storage so DAV source URLs map cleanly to
 * `/files/<user>/...`. Photos elsewhere are still reachable via the
 * legacy fetcher path that `FetchFilesMixin` falls back to when the
 * indexed call fails or returns nothing.
 */

import type { PhotoSearchOptions } from './PhotoSearch.ts'

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { File } from '@nextcloud/files'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { generateUrl } from '@nextcloud/router'

interface IndexedTimelineRow {
	fileId: number
	name: string
	// `path` is the filecache `path` column, e.g. `files/Photos/IMG.jpg`
	// for the user's home storage. We strip the `files/` prefix
	// before constructing the DAV source.
	path: string
	mimetype: string
	size: number
	mtime: number
	takenAt: number
	etag: string
	permissions: number
	favorite: number
	ownerId: string
	metadata: {
		'photos-exif': Record<string, unknown> | null
		'photos-ifd0': Record<string, unknown> | null
		'photos-gps': Record<string, unknown> | null
		'photos-place': string | null
		'photos-size': { width: number, height: number } | null
		'photos-original_date_time': number | null
	}
}

interface IndexedTimelineResponse {
	items: IndexedTimelineRow[]
	nextBefore: number | null
}

/**
 * Strip the home-storage `files/` prefix from a filecache path and
 * return the DAV-relative path (always starts with `/`). Filecache
 * paths come without a leading slash; DAV paths require one.
 *
 * Example: `files/Photos/IMG.jpg` → `/Photos/IMG.jpg`
 *
 * @param path
 */
function filecachePathToDavRelative(path: string): string {
	const stripped = path.replace(/^files\/?/, '')
	return stripped.startsWith('/') ? stripped : `/${stripped}`
}

function rowToFile(row: IndexedTimelineRow): File {
	const davRelative = filecachePathToDavRelative(row.path)

	// Construct the same attribute shape `resultToNode` produces from
	// a DAV REPORT response — keeps the downstream consumers (store
	// mutation, FilesByMonthMixin, FileComponent) ignorant of which
	// fetcher produced the file.
	const attributes: Record<string, unknown> = {
		etag: row.etag,
		favorite: row.favorite,
		'mount-type': '',
		'owner-id': row.ownerId,
		'metadata-photos-original_date_time': row.takenAt,
	}

	if (row.metadata['photos-size'] !== null) {
		attributes['metadata-photos-size'] = row.metadata['photos-size']
	}
	if (row.metadata['photos-exif'] !== null) {
		attributes['metadata-photos-exif'] = row.metadata['photos-exif']
	}
	if (row.metadata['photos-ifd0'] !== null) {
		attributes['metadata-photos-ifd0'] = row.metadata['photos-ifd0']
	}
	if (row.metadata['photos-gps'] !== null) {
		attributes['metadata-photos-gps'] = row.metadata['photos-gps']
	}
	if (row.metadata['photos-place'] !== null) {
		attributes['metadata-photos-place'] = row.metadata['photos-place']
	}

	return new File({
		source: `${defaultRemoteURL}${defaultRootPath}${davRelative}`,
		root: defaultRootPath,
		id: row.fileId,
		mtime: new Date(row.mtime * 1000),
		mime: row.mimetype,
		size: row.size,
		permissions: row.permissions,
		owner: row.ownerId,
		attributes,
	})
}

/**
 * Cursor passed across calls. The legacy fetcher uses an offset; the
 * indexed one uses the previous page's `taken_at` as a "before"
 * cursor. We tuck it into a module-scoped weak map keyed by the
 * mixin instance via the `firstResult` field that the legacy
 * fetcher uses — when it's 0, we start fresh; otherwise we use the
 * stashed cursor.
 */
const cursorState = new Map<number, number | null>()

/**
 * Drop any stashed cursor (call when the timeline view resets state).
 */
export function resetIndexedCursor(): void {
	cursorState.clear()
}

/**
 * Same shape as the legacy `getPhotos` from `PhotoSearch.ts` — the
 * caller passes `firstResult` and `nbResults`, gets back `File[]`.
 * `firstResult === 0` resets the cursor.
 *
 * Returns an empty array if the user isn't logged in (treat as "no
 * indexed data available" so the caller falls back).
 *
 * Throws on HTTP errors — the caller (FetchFilesMixin) catches and
 * falls back to DAV.
 *
 * @param options
 */
export async function getIndexedPhotos(options: Partial<PhotoSearchOptions> = {}): Promise<File[]> {
	const user = getCurrentUser()
	if (user === null) {
		return []
	}

	const firstResult = options.firstResult ?? 0
	const limit = options.nbResults ?? 200

	// Single-user cursor — there's only one timeline view active at
	// a time. Reset on `firstResult === 0` (the mixin signals this on
	// resetFetchFilesState / route change).
	const cursorKey = 0
	if (firstResult === 0) {
		cursorState.delete(cursorKey)
	}
	const before = cursorState.get(cursorKey) ?? null

	const params: Record<string, string> = { limit: String(limit) }
	if (before !== null) {
		params.before = String(before)
	}

	const { data } = await axios.get<IndexedTimelineResponse>(
		generateUrl('/apps/photos/api/v1/index/timeline'),
		{ params, signal: options.signal },
	)

	if (data.nextBefore !== null) {
		cursorState.set(cursorKey, data.nextBefore)
	}

	return data.items.map(rowToFile)
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ViewerOptions } from '@nextcloud/viewer'

import { getHandlers, getViewer, registerDefaultHandlers } from '@nextcloud/viewer'
import { toViewerNode } from '../utils/fileUtils.ts'

/**
 * Register the views for images, videos and audio.
 *
 * The server registers them on every page as of nextcloud/server#63954. On a
 * server without that, nothing else does, and the viewer would have no view to
 * open a photo with. To be dropped once the app requires such a server.
 */
export function registerViewerHandlers(): void {
	if (!getHandlers().has('images')) {
		registerDefaultHandlers()
	}
}

/**
 * Open a photo in the viewer, with the given photos as its gallery.
 *
 * @param photos - The photos to step through, in the order they are shown
 * @param photo - The photo to open on, one of `photos`
 * @param options - What the viewer does around the gallery
 */
export function openInViewer(photos: File[], photo: File, options?: ViewerOptions): Promise<void> {
	const nodes = photos.map(toViewerNode)
	// The viewer tells the opened photo apart from the rest of the gallery by
	// identity, so it has to be handed the very node of the list.
	const node = nodes.find((node) => node.fileid === photo.fileid)

	return getViewer().open(nodes, node, options)
}

/**
 * Close the viewer, if it is open.
 */
export function closeViewer(): void {
	getViewer().close()
}

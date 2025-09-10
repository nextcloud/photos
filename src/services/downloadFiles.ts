/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import {
	type Node,

	FileType,
} from '@nextcloud/files'

/**
 * Trigger downloading a file.
 *
 * @param url The url of the asset to download
 * @param name Optionally the recommended name of the download (browsers might ignore it)
 */
async function triggerDownload(url: string, name?: string) {
	// try to see if the resource is still available
	await axios.head(url)

	const hiddenElement = document.createElement('a')
	hiddenElement.download = name ?? ''
	hiddenElement.href = url
	hiddenElement.click()
}

/**
 * Find the longest common path prefix of both input paths
 *
 * @param first The first path
 * @param second The second path
 */
function longestCommonPath(first: string, second: string): string {
	const firstSegments = first.split('/').filter(Boolean)
	const secondSegments = second.split('/').filter(Boolean)
	let base = ''
	for (const [index, segment] of firstSegments.entries()) {
		if (index >= second.length) {
			break
		}
		if (segment !== secondSegments[index]) {
			break
		}
		const sep = base === '' ? '' : '/'
		base = `${base}${sep}${segment}`
	}
	return base
}

/**
 * Download the given nodes.
 *
 * If only one node is given, it will be downloaded directly.
 * If multiple nodes are given, they will be zipped and downloaded.
 *
 * @param nodes The node(s) to download
 */
export async function downloadFiles(nodes: Node[]) {
	let url: URL

	if (nodes.length === 1) {
		if (nodes[0]!.type === FileType.File) {
			await triggerDownload(nodes[0]!.encodedSource, nodes[0]!.displayname)
			return
		} else {
			url = new URL(nodes[0]!.encodedSource)
			url.searchParams.append('accept', 'zip')
		}
	} else {
		url = new URL(nodes[0]!.encodedSource)
		let base = url.pathname
		for (const node of nodes.slice(1)) {
			base = longestCommonPath(base, (new URL(node.encodedSource).pathname))
		}
		url.pathname = base

		// The URL contains the path encoded so we need to decode as the query.append will re-encode it
		const filenames = nodes.map((node) => decodeURIComponent(node.encodedSource.slice(url.href.length + 1)))
		url.searchParams.append('accept', 'zip')
		url.searchParams.append('files', JSON.stringify(filenames))
	}

	if (url.pathname.at(-1) !== '/') {
		url.pathname = `${url.pathname}/`
	}

	await triggerDownload(url.href)
}

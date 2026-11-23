/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Whether a request of the service worker belongs to the app shell: the page
 * of the app and the scripts, styles, fonts and icons it is built from.
 * Requests for data never match, so they always go to the network.
 *
 * The function is serialised into the service worker, it must not use
 * anything from outside its own body.
 *
 * @param options - What the service worker knows about the request
 * @param options.request - The request
 * @param options.url - The url of the request
 * @param options.sameOrigin - Whether the request stays on this server
 */
export function isAppShellRequest({ request, url, sameOrigin }: { request: Pick<Request, 'method' | 'mode' | 'destination'>, url: Pick<URL, 'pathname'>, sameOrigin: boolean }): boolean {
	if (!sameOrigin || request.method !== 'GET' || url.pathname.includes('/remote.php/')) {
		return false
	}

	if (request.mode === 'navigate') {
		return !url.pathname.includes('/apps/photos/public/')
	}

	return ['script', 'style', 'font'].includes(request.destination)
		|| (request.destination === 'image' && /\/(img|theming)\//.test(url.pathname))
}

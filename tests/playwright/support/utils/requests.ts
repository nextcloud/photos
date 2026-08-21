/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Page, Response } from '@playwright/test'

/**
 * Any WebDAV request of the app. `remote.php` for a session, `public.php` for a
 * public album, which serves the same collections off a share token.
 */
export const DAV_ENDPOINT = /\/(remote|public)\.php\/dav\//

/** The albums of an account, `$1` capturing the album name if there is one. */
export const ALBUM_ENDPOINT = /\/dav\/photos\/[^/]+\/albums\/?([^/?]*)/

/** The albums shared with an account. */
export const SHARED_ALBUM_ENDPOINT = /\/dav\/photos\/[^/]+\/sharedalbums\/?([^/?]*)/

/** An album reached through its public link. */
export const PUBLIC_ALBUM_ENDPOINT = /\/dav\/photospublic\//

/** The faces recognize detected, exposed under its own endpoint. */
export const FACES_ENDPOINT = /\/dav\/recognize\/[^/]+\/faces\//

/**
 * Wait for a DAV request the app makes, armed before the action that triggers it.
 *
 * The photo grid renders whatever the store holds, and the store is only filled
 * once a listing came back — so "the list did not change yet" and "the list is
 * final" look exactly the same to an assertion. Awaiting the request that fills
 * it is what tells the two apart.
 *
 * Arm the wait *before* the action, then await the returned promise after it:
 * a request that resolves quickly would otherwise be missed entirely.
 *
 * @param page - Page the app runs on
 * @param method - The DAV method to wait for, e.g. `PROPFIND`
 * @param url - Pattern the request URL has to match
 */
export function waitForDavRequest(page: Page, method: string, url: RegExp = DAV_ENDPOINT): Promise<Response> {
	return page.waitForResponse((response) => response.request().method() === method
		&& url.test(response.url()))
}

/**
 * Wait for the contents listing of a collection.
 *
 * The collection itself is fetched under the very same path, only the trailing
 * slash of the contents listing sets the two apart — and it is the contents that
 * fill the photo grid.
 *
 * The names are compared rather than matched: an album name can hold a space and
 * brackets, and a shared album always does, which no pattern built out of it
 * would survive.
 *
 * @param page - Page the app runs on
 * @param collection - Endpoint of the collection, e.g. `albums`
 * @param name - Name of the collection as it is stored
 */
export function waitForCollectionContents(page: Page, collection: 'albums' | 'sharedalbums', name: string): Promise<Response> {
	const expected = `/${collection}/${name}/`

	return page.waitForResponse((response) => {
		if (response.request().method() !== 'PROPFIND') {
			return false
		}

		return decodeURIComponent(new URL(response.url()).pathname).endsWith(expected)
	})
}

/**
 * Wait for the timeline to be (re)fetched.
 *
 * The timeline is filled through a DAV `SEARCH` against the files endpoint,
 * which is what every filter change and every view switch triggers.
 *
 * @param page - Page the app runs on
 */
export function waitForTimelineSearch(page: Page): Promise<Response> {
	return waitForDavRequest(page, 'SEARCH')
}

/**
 * Assert that a DAV request the app fired was accepted.
 *
 * The app updates what it shows before the server has confirmed it and only rolls
 * back on failure, so a rejected request otherwise surfaces as a state that looks
 * right until the next page load.
 *
 * @param response - The response to check
 * @param description - What the request was meant to do, for the message
 */
export async function expectStored(response: Response, description: string): Promise<void> {
	if (response.ok()) {
		return
	}

	throw new Error(`Failed to ${description}: ${response.request().method()} ${response.url()} `
		+ `answered ${response.status()}\n${await response.text()}`)
}

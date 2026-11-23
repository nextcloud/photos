/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type BottomNavigationDestination = {
	/** Name of the route the destination links to. */
	routeName: string
	/** Names of the routes on which the destination is shown as the current one. */
	activeRouteNames: string[]
}

export const bottomNavigationDestinations: BottomNavigationDestination[] = [
	{ routeName: 'all_media', activeRouteNames: ['all_media', 'photos', 'videos'] },
	{ routeName: 'albums', activeRouteNames: ['albums', 'albumsContent'] },
	{ routeName: 'memories', activeRouteNames: ['memories'] },
	{ routeName: 'map', activeRouteNames: ['map'] },
]

/**
 * @param currentRouteName - Name of the route currently shown
 * @return The route name of the destination the current route belongs to, if any
 */
export function getActiveDestination(currentRouteName: unknown): string | undefined {
	return bottomNavigationDestinations
		.find(({ activeRouteNames }) => activeRouteNames.includes(currentRouteName as string))
		?.routeName
}

/** Downward scroll speed, in pixels per millisecond, from which the bar gets out of the way. */
export const FAST_SCROLL_SPEED = 0.6

export type ScrollSample = {
	/** Scroll offset from the top, in pixels. */
	top: number
	/** Time of the measurement, in milliseconds. */
	time: number
}

/**
 * Decide whether the bottom navigation is hidden after a scroll step: a fast
 * scroll down hides it, any scroll up or reaching the top brings it back, and
 * a slow scroll down leaves it as it is.
 *
 * @param hidden - Whether the bar is hidden before the step
 * @param previous - The measurement before the step
 * @param current - The measurement after the step
 */
export function isHiddenAfterScroll(hidden: boolean, previous: ScrollSample, current: ScrollSample): boolean {
	const distance = current.top - previous.top
	if (current.top <= 0 || distance < 0) {
		return false
	}

	const elapsed = current.time - previous.time
	if (distance === 0 || elapsed <= 0) {
		return hidden
	}

	return hidden || distance / elapsed >= FAST_SCROLL_SPEED
}

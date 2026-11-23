/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { RouteLocationNormalized, Router } from 'vue-router'

import { nextTick } from 'vue'

/** The name the content area is captured under, which the cross-fade is styled by. */
export const CONTENT_TRANSITION_NAME = 'photos-content'

/**
 * Whether going from one route to another cross-fades the content area.
 *
 * Not for the first route of the page, which has nothing to fade from, nor
 * for a change of query or hash, which keeps the view. Not without the View
 * Transitions API either, and never when reduced motion is asked for.
 *
 * @param to - The route navigated to
 * @param from - The route navigated from
 */
export function shouldCrossFade(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
	return from.matched.length > 0
		&& to.path !== from.path
		&& typeof document.startViewTransition === 'function'
		&& !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Cross-fade the content area whenever the view changes.
 *
 * The old view is captured once the navigation is settled, lazy views
 * included, and the new one as soon as it is rendered. Only the content area
 * carries a transition name, and only for as long as the cross-fade lasts.
 *
 * @param router - The router of the app
 */
export function installRouteTransition(router: Router): void {
	let rendered: (() => void) | undefined

	router.beforeResolve((to, from) => {
		const content = document.getElementById('app-content-vue')
		if (content === null || !shouldCrossFade(to, from)) {
			return
		}

		return new Promise<void>((resolve) => {
			content.style.setProperty('view-transition-name', CONTENT_TRANSITION_NAME)
			const transition = document.startViewTransition(() => {
				const done = new Promise<void>((resolveRendered) => {
					rendered = resolveRendered
				})
				resolve()
				return done
			})
			// A transition the browser skips rejects `ready`, the navigation goes on regardless.
			transition.ready.catch(() => resolve())
			transition.finished.finally(() => {
				content.style.removeProperty('view-transition-name')
			})
		})
	})

	router.afterEach(async () => {
		await nextTick()
		rendered?.()
		rendered = undefined
	})
}

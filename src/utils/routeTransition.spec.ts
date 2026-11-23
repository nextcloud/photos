/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { RouteLocationNormalized } from 'vue-router'

import { afterEach, describe, expect, test, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { CONTENT_TRANSITION_NAME, installRouteTransition, shouldCrossFade } from './routeTransition.ts'

/**
 * Build the parts of a route the cross-fade is decided by.
 *
 * @param path - Path of the route
 * @param matched - Whether a view is shown for it
 */
function route(path: string, matched = true): RouteLocationNormalized {
	return { path, matched: matched ? [{}] : [] } as unknown as RouteLocationNormalized
}

/**
 * Stub what the browser offers for transitions.
 *
 * @param options - What to stub
 * @param options.reduced - Whether reduced motion is asked for
 * @param options.supported - Whether the View Transitions API exists
 */
function stubBrowser({ reduced = false, supported = true } = {}) {
	vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduced })))
	const startViewTransition = vi.fn((update: () => Promise<void>) => {
		const updated = update()
		return { ready: Promise.resolve(), finished: updated, updateCallbackDone: updated }
	})
	Object.defineProperty(document, 'startViewTransition', { value: supported ? startViewTransition : undefined, configurable: true })
	return startViewTransition
}

afterEach(() => {
	vi.unstubAllGlobals()
	Reflect.deleteProperty(document, 'startViewTransition')
	document.body.innerHTML = ''
})

describe('shouldCrossFade', () => {
	test('cross-fades between two views', () => {
		stubBrowser()
		expect(shouldCrossFade(route('/albums'), route('/'))).toBe(true)
	})

	test('does not for the first route of the page', () => {
		stubBrowser()
		expect(shouldCrossFade(route('/albums'), route('/', false))).toBe(false)
	})

	test('does not when the path stays the same', () => {
		stubBrowser()
		expect(shouldCrossFade(route('/albums'), route('/albums'))).toBe(false)
	})

	test('does not without the View Transitions API', () => {
		stubBrowser({ supported: false })
		expect(shouldCrossFade(route('/albums'), route('/'))).toBe(false)
	})

	test('does not with reduced motion', () => {
		stubBrowser({ reduced: true })
		expect(shouldCrossFade(route('/albums'), route('/'))).toBe(false)
	})
})

describe('installRouteTransition', () => {
	/**
	 * A router with two views, with the content area on the page.
	 */
	async function setup() {
		document.body.innerHTML = '<main id="app-content-vue"></main>'
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/', component: { render: () => null } },
				{ path: '/albums', component: { render: () => null } },
			],
		})
		installRouteTransition(router)
		await router.push('/')
		return router
	}

	test('names the content area for the cross-fade only', async () => {
		const startViewTransition = stubBrowser()
		const router = await setup()
		const content = document.getElementById('app-content-vue') as HTMLElement
		const nameOf = () => content.style.getPropertyValue('view-transition-name')
		expect(startViewTransition).not.toHaveBeenCalled()

		let nameWhenCaptured = ''
		startViewTransition.mockImplementationOnce((update) => {
			nameWhenCaptured = nameOf()
			const updated = update()
			return { ready: Promise.resolve(), finished: updated, updateCallbackDone: updated }
		})
		await router.push('/albums')

		expect(startViewTransition).toHaveBeenCalledOnce()
		expect(nameWhenCaptured).toBe(CONTENT_TRANSITION_NAME)
		await vi.waitFor(() => expect(nameOf()).toBe(''))
		expect(router.currentRoute.value.path).toBe('/albums')
	})

	test('navigates without a transition with reduced motion', async () => {
		const startViewTransition = stubBrowser({ reduced: true })
		const router = await setup()

		await router.push('/albums')
		expect(startViewTransition).not.toHaveBeenCalled()
		expect(router.currentRoute.value.path).toBe('/albums')
	})
})

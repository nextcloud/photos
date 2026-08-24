/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { mountComposable } from './mountComposable.ts'
import { useAbortController } from './useAbortController.ts'

const { router } = vi.hoisted(() => {
	const beforeEach: ((to: object, from: object, next: () => void) => void)[] = []

	return {
		router: {
			guards: beforeEach,
			beforeEach(guard: (to: object, from: object, next: () => void) => void) {
				beforeEach.push(guard)
				return () => beforeEach.splice(beforeEach.indexOf(guard), 1)
			},
			navigate() {
				beforeEach.forEach((guard) => guard({ path: '/to' }, { path: '/from' }, () => {}))
			},
		},
	}
})

vi.mock('../router/index.ts', () => ({ default: router }))

describe('useAbortController', () => {
	beforeEach(() => {
		router.guards.splice(0)
	})

	test('hands out a signal that is not aborted yet', () => {
		const { result } = mountComposable(() => useAbortController())

		expect(result.abortSignal.value.aborted).toBe(false)
	})

	test('aborts the requests in flight and hands out a fresh signal', () => {
		const { result } = mountComposable(() => useAbortController())
		const firstSignal = result.abortSignal.value

		result.abortPendingRequest()

		expect(firstSignal.aborted).toBe(true)
		expect(result.abortSignal.value).not.toBe(firstSignal)
		expect(result.abortSignal.value.aborted).toBe(false)
	})

	test('aborts the requests in flight when the user navigates away', () => {
		const { result } = mountComposable(() => useAbortController())
		const firstSignal = result.abortSignal.value

		router.navigate()

		expect(firstSignal.aborted).toBe(true)
		expect(result.abortSignal.value.aborted).toBe(false)
	})

	test('aborts the requests in flight when the component is destroyed', () => {
		const { result, wrapper } = mountComposable(() => useAbortController())

		wrapper.destroy()

		expect(result.abortSignal.value.aborted).toBe(true)
	})

	test('drops its navigation guard when the component is destroyed', () => {
		const { wrapper } = mountComposable(() => useAbortController())
		expect(router.guards).toHaveLength(1)

		wrapper.destroy()

		expect(router.guards).toHaveLength(0)
	})
})

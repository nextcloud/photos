/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { applyBurstStacks, clusterBursts } from './burstClustering.ts'

/**
 * A library of photos taken at the given moments, in the order the grid shows
 * them, named after their index.
 *
 * @param timestamps - Second each photo was taken at.
 */
function library(timestamps: number[]): { fileIds: string[], files: Record<string, PhotoFile> } {
	const fileIds = timestamps.map((_, index) => `${index}`)
	const files = Object.fromEntries(timestamps.map((timestamp, index) => [`${index}`, { attributes: { timestamp } } as PhotoFile]))
	return { fileIds, files }
}

describe('clusterBursts', () => {
	test('groups nothing in an empty library', () => {
		expect(clusterBursts([], {})).toEqual({})
	})

	test('leaves photos taken far apart on their own', () => {
		const { fileIds, files } = library([300, 200, 100])

		expect(clusterBursts(fileIds, files)).toEqual({})
	})

	test('groups a pair taken within the window', () => {
		const { fileIds, files } = library([102, 100])

		expect(clusterBursts(fileIds, files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
		})
	})

	test('measures the window against the previous photo, so a sustained burst stays one run', () => {
		// Twenty photos a second apart: the first and the last lie far more than a
		// window apart, but every step of the chain is within it.
		const { fileIds, files } = library(Array.from({ length: 20 }, (_, index) => 1000 - index))

		expect(clusterBursts(fileIds, files)).toEqual({
			0: { leaderId: '0', memberIds: fileIds },
		})
	})

	test('ends a run at the first gap wider than the window', () => {
		const { fileIds, files } = library([100, 99, 90, 89])

		expect(clusterBursts(fileIds, files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
			2: { leaderId: '2', memberIds: ['2', '3'] },
		})
	})

	test('keeps a photo without a partner out of the runs around it', () => {
		const { fileIds, files } = library([100, 99, 50, 10, 9])

		expect(clusterBursts(fileIds, files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
			3: { leaderId: '3', memberIds: ['3', '4'] },
		})
	})

	test('skips file ids the library does not hold', () => {
		const { fileIds, files } = library([100, 99])

		expect(clusterBursts(['missing', ...fileIds], files)).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
		})
	})

	test('honours an overridden window', () => {
		const { fileIds, files } = library([110, 100])

		expect(clusterBursts(fileIds, files, { windowSeconds: 10 })).toEqual({
			0: { leaderId: '0', memberIds: ['0', '1'] },
		})
	})

	test('honours an overridden minimum run length', () => {
		const { fileIds, files } = library([102, 101, 100])

		expect(clusterBursts(fileIds, files, { minSize: 4 })).toEqual({})
	})
})

describe('applyBurstStacks', () => {
	test('returns the photos unchanged when nothing was grouped', () => {
		expect(applyBurstStacks(['1', '2', '3'], {})).toEqual(['1', '2', '3'])
	})

	test('replaces the members of a run with its leader, keeping the order', () => {
		const stacks = {
			2: { leaderId: '2', memberIds: ['2', '3', '4'] },
		}

		expect(applyBurstStacks(['1', '2', '3', '4', '5'], stacks)).toEqual(['1', '2', '5'])
	})

	test('folds several runs of one list', () => {
		const stacks = {
			1: { leaderId: '1', memberIds: ['1', '2'] },
			4: { leaderId: '4', memberIds: ['4', '5'] },
		}

		expect(applyBurstStacks(['1', '2', '3', '4', '5'], stacks)).toEqual(['1', '3', '4'])
	})
})

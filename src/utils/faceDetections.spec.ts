/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FaceDetection } from './faceDetections.ts'

import { describe, expect, test } from 'vitest'
import { getFaceCropStyle, getPeopleInPhoto, parseFaceDetections } from './faceDetections.ts'

/**
 * @param overrides - Fields to set on the detection
 */
function detection(overrides: Partial<FaceDetection> = {}): FaceDetection {
	return {
		id: 1,
		clusterId: 10,
		title: 'Alice',
		x: 0.2,
		y: 0.3,
		width: 0.1,
		height: 0.15,
		...overrides,
	}
}

describe('parseFaceDetections', () => {
	test('returns nothing without a value', () => {
		expect(parseFaceDetections(undefined)).toEqual([])
		expect(parseFaceDetections('')).toEqual([])
		expect(parseFaceDetections('[]')).toEqual([])
	})

	test('returns nothing for a value which is not a JSON list', () => {
		expect(parseFaceDetections('not json')).toEqual([])
		expect(parseFaceDetections('{"id":1}')).toEqual([])
		expect(parseFaceDetections(42)).toEqual([])
	})

	test('reads the detections recognize returns', () => {
		const raw = JSON.stringify([
			{ id: 1, userId: 'admin', fileId: 5, x: 0.2, y: 0.3, height: 0.15, width: 0.1, clusterId: 10, title: 'Alice' },
			{ id: 2, userId: 'admin', fileId: 5, x: 0.6, y: 0.3, height: 0.15, width: 0.1, clusterId: null, title: null },
		])
		expect(parseFaceDetections(raw)).toEqual([
			{ id: 1, userId: 'admin', fileId: 5, x: 0.2, y: 0.3, height: 0.15, width: 0.1, clusterId: 10, title: 'Alice' },
			{ id: 2, userId: 'admin', fileId: 5, x: 0.6, y: 0.3, height: 0.15, width: 0.1, clusterId: null, title: null },
		])
	})

	test('decodes HTML entities left in the value', () => {
		expect(parseFaceDetections(`[${JSON.stringify(detection()).replaceAll('"', '&quot;')}]`)).toEqual([detection()])
	})

	test('leaves out malformed detections', () => {
		const raw = JSON.stringify([
			detection(),
			null,
			'face',
			detection({ id: 'x' as unknown as number }),
			detection({ title: 3 as unknown as string }),
			detection({ x: 1.5 }),
			detection({ width: 0 }),
			{ id: 3, clusterId: 10, title: 'Bob' },
		])
		expect(parseFaceDetections(raw)).toEqual([detection()])
	})
})

describe('getPeopleInPhoto', () => {
	test('returns nothing without detections', () => {
		expect(getPeopleInPhoto([])).toEqual([])
	})

	test('lists named faces with their position', () => {
		expect(getPeopleInPhoto([detection()])).toEqual([
			{ name: 'Alice', box: { x: 0.2, y: 0.3, width: 0.1, height: 0.15 } },
		])
	})

	test('leaves out unassigned and unnamed faces', () => {
		expect(getPeopleInPhoto([
			detection({ clusterId: null, title: null }),
			detection({ clusterId: -1, title: null }),
			detection({ clusterId: 11, title: null }),
			detection({ clusterId: 12, title: '  ' }),
		])).toEqual([])
	})

	test('orders people from left to right', () => {
		expect(getPeopleInPhoto([
			detection({ id: 1, title: 'Carol', x: 0.7 }),
			detection({ id: 2, title: 'Alice', x: 0.4 }),
			detection({ id: 3, title: 'Bob', x: 0.1 }),
		]).map((person) => person.name)).toEqual(['Bob', 'Alice', 'Carol'])
	})

	test('lists a person once when several of their faces were detected', () => {
		expect(getPeopleInPhoto([
			detection({ id: 1, x: 0.5 }),
			detection({ id: 2, x: 0.1 }),
		])).toEqual([
			{ name: 'Alice', box: { x: 0.1, y: 0.3, width: 0.1, height: 0.15 } },
		])
	})

	test('does not reorder the given detections', () => {
		const detections = [detection({ id: 1, x: 0.5 }), detection({ id: 2, x: 0.1 })]
		getPeopleInPhoto(detections)
		expect(detections.map((d) => d.id)).toEqual([1, 2])
	})
})

describe('getFaceCropStyle', () => {
	test('centers the face and zooms onto it', () => {
		expect(getFaceCropStyle({ x: 0.25, y: 0.5, width: 0.125, height: 0.25 })).toEqual({
			position: 'absolute',
			top: '50%',
			left: '50%',
			width: `${100 / (0.125 * 1.4)}%`,
			maxWidth: 'none',
			transform: 'translate(-31.25%, -62.5%)',
		})
	})

	test('does not zoom out of faces filling the photo', () => {
		expect(getFaceCropStyle({ x: 0, y: 0, width: 1, height: 1 })).toMatchObject({
			width: '100%',
			transform: 'translate(-50%, -50%)',
		})
	})
})

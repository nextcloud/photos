/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TiledItem, TiledRow } from './TiledLayout.js'

import { describe, expect, test } from 'vitest'
import {
	splitItemsInRows,
	splitSectionInRows,
} from './TiledLayout.js'

const squareImage1 = {
	id: 'squareImage1',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

const squareImage2 = {
	id: 'squareImage2',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

const squareImage3 = {
	id: 'squareImage3',
	width: 200,
	height: 250,
	ratio: 200 / 250,
}

const tallImage1 = {
	id: 'tallImage1',
	width: 200,
	height: 10000,
	ratio: 200 / 10000,
}

const wideImage1 = {
	id: 'wideImage1',
	width: 10000,
	height: 250,
	ratio: 10000 / 250,
}

const items: TiledItem[] = [squareImage1, wideImage1, squareImage2, squareImage3, tallImage1]

const expectedLayout: TiledRow[] = [
	{
		items: [
			{
				...squareImage1,
				// "* 10" to fit the width
				width: squareImage1.width * 10, // 2000
				height: squareImage1.height * 10, // 2500
			},
		],
		height: squareImage1.height * 10, // 2500
		key: 'squareImage1',
	},
	{
		items: [
			{
				...wideImage1,
				// "/ 5" to fit the width
				width: wideImage1.width / 5, // 2000
				height: wideImage1.height / 5, // 50
			},
		],
		height: wideImage1.height / 5, // 50
		key: 'wideImage1',
	},
	{
		items: [
			{
				...squareImage2,
				width: 176,
				height: 220,
			},
			{
				...squareImage3,
				width: 176,
				height: 220,
			},
			{
				...tallImage1,
				width: 4.4,
				height: 220,
			},
		],
		height: 220,
		key: 'squareImage2-squareImage3-tallImage1',
	},
]

describe('TileLayout', () => {
	test('Adding permissions', () => {
		expect(splitItemsInRows(items, 2000)).toStrictEqual(expectedLayout)
	})
})

describe('splitSectionInRows', () => {
	test('lays out a section without groups like its items', () => {
		expect(splitSectionInRows({ id: 'section', items }, 2000)).toStrictEqual(expectedLayout)
	})

	test('lets the groups share a row, each one labelled above its first item', () => {
		const section = {
			id: 'section',
			items: [squareImage1, squareImage2, squareImage3],
			groups: [
				{ id: 'day1', items: [squareImage1, squareImage2] },
				{ id: 'day2', items: [squareImage3] },
			],
		}

		const rows = splitSectionInRows(section, 2000, 200, 32)

		expect(rows).toHaveLength(1)
		expect(rows[0].key).toBe('squareImage1-squareImage2-squareImage3')
		expect(rows[0].height).toBe(252)
		expect(rows[0].labelHeight).toBe(32)
		expect(rows[0].items.map(({ height }) => height)).toStrictEqual([220, 220, 220])
		expect(rows[0].labels).toStrictEqual([
			{ groupId: 'day1', itemId: 'squareImage1', width: 352 },
			{ groupId: 'day2', itemId: 'squareImage3', width: 176 },
		])
	})

	test('labels a group in the row it starts in only', () => {
		const section = {
			id: 'section',
			items: [squareImage1, squareImage2, squareImage3],
			groups: [{ id: 'day1', items: [squareImage1, squareImage2, squareImage3] }],
		}

		const rows = splitSectionInRows(section, 450, 200, 32)

		expect(rows.map(({ key, height, labels }) => ({ key, height, labels }))).toStrictEqual([
			{ key: 'squareImage1-squareImage2', height: 313.25, labels: [{ groupId: 'day1', itemId: 'squareImage1', width: 450 }] },
			{ key: 'squareImage3', height: 220, labels: undefined },
		])
	})

	test('leaves out the label of an empty group', () => {
		const section = {
			id: 'section',
			items: [squareImage1],
			groups: [{ id: 'day1', items: [] }, { id: 'day2', items: [squareImage1] }],
		}

		expect(splitSectionInRows(section, 2000, 200, 32)[0].labels).toStrictEqual([{ groupId: 'day2', itemId: 'squareImage1', width: 176 }])
	})

	test('returns no row before the container is measured', () => {
		const section = { id: 'section', items: [squareImage1], groups: [{ id: 'day1', items: [squareImage1] }] }

		expect(splitSectionInRows(section, 0, 200, 32)).toStrictEqual([])
	})
})

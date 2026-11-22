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

	test('puts a header row before the rows of every group', () => {
		const section = {
			id: 'section',
			items: [squareImage1, squareImage2, squareImage3],
			groups: [
				{ id: 'day1', items: [squareImage1, squareImage2] },
				{ id: 'day2', items: [squareImage3] },
			],
		}

		const rows = splitSectionInRows(section, 2000, 200, 48)

		expect(rows.map(({ key, groupId, height }) => ({ key, groupId, height }))).toStrictEqual([
			{ key: 'group-header-day1', groupId: 'day1', height: 48 },
			{ key: 'squareImage1-squareImage2', groupId: undefined, height: 220 },
			{ key: 'group-header-day2', groupId: 'day2', height: 48 },
			{ key: 'squareImage3', groupId: undefined, height: 220 },
		])
		expect(rows[0].items).toStrictEqual([])
	})

	test('leaves out the header of an empty group', () => {
		const section = {
			id: 'section',
			items: [squareImage1],
			groups: [{ id: 'day1', items: [] }, { id: 'day2', items: [squareImage1] }],
		}

		expect(splitSectionInRows(section, 2000, 200, 48).map(({ key }) => key)).toStrictEqual(['group-header-day2', 'squareImage1'])
	})

	test('returns no row before the container is measured', () => {
		const section = { id: 'section', items: [squareImage1], groups: [{ id: 'day1', items: [squareImage1] }] }

		expect(splitSectionInRows(section, 0, 200, 48)).toStrictEqual([])
	})
})

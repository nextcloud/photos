/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import {
	type GridItem, type GridRow,

	splitItemsInRows,
} from './GridLayout.js'

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

const items: GridItem[] = [squareImage1, wideImage1, squareImage2, squareImage3, tallImage1]

const expectedLayout: GridRow[] = [
	{
		items: [
			{
				...squareImage1,
				width: 256,
				height: 256,
			},
			{
				...wideImage1,
				width: 256,
				height: 256,
			},
			{
				...squareImage2,
				width: 256,
				height: 256,
			},
		],
		height: 256,
		key: 'squareImage1-wideImage1-squareImage2',
	},
	{
		items: [
			{
				...squareImage3,
				width: 256,
				height: 256,
			},
			{
				...tallImage1,
				width: 256,
				height: 256,
			},
		],
		height: 256,
		key: 'squareImage3-tallImage1',
	},
]

describe('GridLayout', () => {
	test('Adding permissions', () => {
		expect(splitItemsInRows(items, 808, 256, 256, 20)).toStrictEqual(expectedLayout)
		expect(splitItemsInRows(items, 800, 256, 256, 20)).toStrictEqual(expectedLayout)
		expect(splitItemsInRows(items, 820, 256, 256, 20)).toStrictEqual(expectedLayout)
	})
})

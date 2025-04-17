/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Define the max width proportions
 * The number (key) indicate the MAX size
 *
 * needs to be compatible with webpack config
 * so no export default {}
 */
export default {
	400: {
		marginTop: 66,
		marginW: 8,
		count: 3,
		folderCount: 1,
	},
	700: {
		marginTop: 66,
		marginW: 8,
		count: 4,
		folderCount: 1,
	},
	1024: {
		marginTop: 66,
		marginW: 44,
		count: 5,
		folderCount: 2,
	},
	1280: {
		marginTop: 66,
		marginW: 44,
		count: 4,
		folderCount: 2,
	},
	1440: {
		marginTop: 88,
		marginW: 66,
		count: 5,
		folderCount: 3,
	},
	1600: {
		marginTop: 88,
		marginW: 66,
		count: 6,
		folderCount: 4,
	},
	2048: {
		marginTop: 88,
		marginW: 66,
		count: 7,
		folderCount: 4,
	},
	2560: {
		marginTop: 88,
		marginW: 88,
		count: 8,
		folderCount: 6,
	},
	3440: {
		marginTop: 88,
		marginW: 88,
		count: 9,
		folderCount: 8,
	},
	max: {
		marginTop: 88,
		marginW: 88,
		count: 10,
		folderCount: 10,
	},
}

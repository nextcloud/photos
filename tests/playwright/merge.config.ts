/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Needed to merge the blob reports of the shards into a single HTML report.
export default {
	testDir: 'tests/playwright/e2e',
	reporter: [['html', { open: 'never' }]],
}

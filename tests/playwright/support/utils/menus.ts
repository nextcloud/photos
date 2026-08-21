/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator } from '@playwright/test'

import { expect } from '@playwright/test'

/** How long to keep retrying to open a menu. */
const OPEN_MENU_TIMEOUT = 15_000

/**
 * Open a menu and make sure it really opened.
 *
 * `NcActions` mounts its popover lazily and can swallow the first click while it
 * is still doing so, which otherwise surfaces much later as a missing menu entry.
 * The click is therefore retried — but only while the menu is closed, so a retry
 * can never toggle an already open menu shut again.
 *
 * @param trigger - The button opening the menu
 * @param menu - The menu it opens
 */
export async function openMenu(trigger: Locator, menu: Locator): Promise<void> {
	await expect(async () => {
		if (!(await menu.isVisible())) {
			await trigger.click()
		}
		await expect(menu).toBeVisible({ timeout: 2000 })
	}).toPass({ timeout: OPEN_MENU_TIMEOUT })
}

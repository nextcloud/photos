/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test'

/** The settings dialog of the app, reached from the footer of its navigation. */
export class PhotosSettingsDialog {
	constructor(public readonly page: Page) {}

	public dialog(): Locator {
		return this.page.getByRole('dialog', { name: 'Photos settings' })
	}

	/**
	 * A folder of the "Media folders" section, i.e. one of the configured source
	 * folders the timelines are built from.
	 *
	 * @param name - Name the folder is shown under, its last path segment
	 */
	private mediaFolder(name: string): Locator {
		return this.dialog().getByRole('listitem').filter({ hasText: name })
	}

	/**
	 * The button removing a media folder from the app's configured source
	 * folders.
	 *
	 * @param name - Name the folder is shown under, its last path segment
	 */
	public removeMediaFolderButton(name: string): Locator {
		return this.mediaFolder(name).getByRole('button', { name: 'Delete source directory' })
	}

	/**
	 * Remove a media folder from the app's configured source folders and wait for
	 * the setting to have been stored.
	 *
	 * @param name - Name the folder is shown under, its last path segment
	 */
	public async removeMediaFolder(name: string): Promise<void> {
		const stored = this.page.waitForResponse((response) => response.request().method() === 'PUT' && response.url().includes('/api/v1/config/photosSourceFolders'))
		await this.removeMediaFolderButton(name).click()
		await stored
	}
}

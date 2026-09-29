/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	window.OCA.Dashboard.register('photos-onthisday', async (el) => {
		// The dashboard loads this entry point even when the widget is not displayed,
		// so the widget itself is only fetched once the dashboard renders it.
		const { mountOnThisDay } = await import('./components/Dashboard/mountOnThisDay.ts')
		global.PhotosOnThisDay = mountOnThisDay(el)
	})
})

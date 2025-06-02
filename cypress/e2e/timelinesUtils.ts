/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 *
 * @param timelineId
 */
export function navigateToTimeline(timelineId: 'all-media' | 'photos' | 'this-day' | 'favorites') {
	cy.url()
		.then((url) => {
			const timelineUrlId = timelineId === 'all-media' ? '' : timelineId
			if (!url.endsWith(`/apps/photos${timelineUrlId}`) && !url.endsWith(`/apps/photos/${timelineUrlId}`)) {
				cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')
				cy.get(`[data-id-app-nav-item="${timelineId}"]`).click()
				cy.wait('@search')
			}
		})
}

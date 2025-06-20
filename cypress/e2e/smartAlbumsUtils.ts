/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function openAlbumSetting() {
	cy.get('button[aria-label="Open actions menu"]').click()
	cy.get('button[aria-label="Edit album details"]').click()
}

export function setDateRangeFilter(dateRange: string) {
	openAlbumSetting()

	cy.get('[data-cy-photos-filters-input] input[type="search"]').type('Custom{enter}', { scrollBehavior: 'nearest' })
	cy.get('[data-cy-photos-filters-input="custom-date-range"] input[name="date"]').type(`${dateRange}{enter}`, { scrollBehavior: 'nearest' })

	cy.intercept({ times: 1, method: 'PROPFIND', url: 'remote.php/dav/photos/*/albums/*' }).as('propfindAlbumContent')
	cy.contains('Save').click()
	cy.wait('@propfindAlbumContent')
}

export function setPlacesFilter(places: string[]) {
	openAlbumSetting()

	for (const place of places) {
		cy.get('[data-cy-photos-filters-input] input[type="search"]').type(`${place}{enter}`, { scrollBehavior: 'nearest' })
	}

	cy.intercept({ times: 1, method: 'PROPFIND', url: 'remote.php/dav/photos/*/albums/*' }).as('propfindAlbumContent')
	cy.contains('Save').click()
	cy.wait('@propfindAlbumContent')
}

export function clearFilters(count: number) {
	for (let i = 0; i < count; i++) {
		cy.intercept({ times: 1, method: 'PROPFIND', url: 'remote.php/dav/photos/*/albums/*' }).as('propfindAlbumContent')
		cy.get('[data-cy-photos-filters-option] button[title="Close"]').eq(0).click()
		cy.wait('@propfindAlbumContent')
	}
}

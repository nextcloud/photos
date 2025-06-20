/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function setDateRangeFilter(dateRange: string) {
	cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')

	cy.get('[data-cy-photos-filters-input] input[type="search"]').type('Custom{enter}', { scrollBehavior: 'nearest' })
	cy.get('[data-cy-photos-filters-input="custom-date-range"] input[name="date"]').type(`${dateRange}{enter}`, { scrollBehavior: 'nearest' })

	cy.wait('@search')
}

export function setPlacesFilter(places: string[]) {
	for (const place of places) {
		cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')
		cy.get('[data-cy-photos-filters-input] input[type="search"]').type(`${place}{enter}`, { scrollBehavior: 'nearest' })
		cy.wait('@search')
	}
}

export function clearFilters(count: number) {
	for (let i = 0; i < count; i++) {
		cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')
		cy.get('[data-cy-photos-filters-option] button[title="Close"]').eq(0).click()
		cy.wait('@search')
	}
}

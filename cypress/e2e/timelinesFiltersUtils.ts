/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 *
 */
export function toggleFilters() {
	cy.get('[data-cy-header-action="toggle-filters"]').click()
}

/**
 *
 * @param dateRange
 */
export function setDateRangeFilter(dateRange: string) {
	cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')

	if (dateRange === '') {
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').clear()
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type('{enter}')
	} else {
		cy.get('[data-cy-photos-filters="date-range"] input[name="date"]').type(`${dateRange}{enter}`, { scrollBehavior: 'nearest' })
	}

	cy.wait('@search')
}

/**
 *
 * @param places
 */
export function setPlacesFilter(places: string[]) {
	if (places.length === 0) {
		cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')
		cy.get('[data-cy-photos-filters="places"] button.vs__deselect').click()
		cy.wait('@search')
	} else {
		for (const place of places) {
			cy.intercept({ times: 2, method: 'SEARCH', url: 'remote.php/dav/' }).as('search')
			cy.get('[data-cy-photos-filters="places"] input[type="search"]').type(`${place}{enter}`, { scrollBehavior: 'nearest' })
			cy.wait('@search')
		}
	}
}

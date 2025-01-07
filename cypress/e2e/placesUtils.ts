/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function navigateToCollection(collectionType: string, collectionName: string) {
	cy.get('.app-navigation__list').contains(collectionType).click()
	cy.get('ul.collections__list').contains(collectionName).click()
}

export function navigateToPlace(locationName: string) {
	navigateToCollection('Places', locationName)
}

export function runOccCommand(command: string) {
	cy.exec(`docker exec --user www-data nextcloud-cypress-tests_photos php ./occ ${command}`)
}

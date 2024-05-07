/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { mount } from 'cypress/vue2'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mount: typeof mount
		}
	}
}

// Example use:
// cy.mount(MyComponent)
Cypress.Commands.add('mount', (component, optionsOrProps) => {
	let instance = null
	const oldMounted = component?.mounted || false

	// Override the mounted method to expose
	// the component instance to cypress
	component.mounted = function() {
		// eslint-disable-next-line
		instance = this
		if (oldMounted) {
			oldMounted()
		}
	}

	// Expose the component with cy.get('@component')
	return mount(component, optionsOrProps).then(() => {
		return cy.wrap(instance).as('component')
	})
})

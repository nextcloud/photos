/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { configureNextcloud, startNextcloud, stopNextcloud, waitOnNextcloud } from '@nextcloud/cypress/docker'
import { defineConfig } from 'cypress'
import { configureVisualRegression } from 'cypress-visual-regression/dist/plugin'

export default defineConfig({
	projectId: 'okzqgr',

	// 16/9 screen ratio
	viewportWidth: 1280,
	viewportHeight: 720,

	requestTimeout: 20000,

	retries: {
		runMode: 0,
		// do not retry in `cypress open`
		openMode: 0,
	},

	// Needed to trigger `after:run` events with cypress open
	experimentalInteractiveRunEvents: true,

	// faster video processing
	videoCompression: false,

	// Visual regression testing
	env: {
		failSilently: false,
		visualRegressionType: 'regression',
	},
	screenshotsFolder: 'cypress/snapshots/actual',
	trashAssetsBeforeRuns: true,

	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		async setupNodeEvents(on, config) {
			configureVisualRegression(on)

			// This allows to store global data (e.g. the name of a snapshot)
			// because Cypress.env() and other options are local to the current spec file.
			const data = {}
			on('task', {
				setVariable({ key, value }) {
					data[key] = value
					return null
				},
				getVariable({ key }) {
					return data[key] ?? null
				},
			})

			// Disable spell checking to prevent rendering differences
			on('before:browser:launch', (browser, launchOptions) => {
				if (browser.family === 'chromium' && browser.name !== 'electron') {
					launchOptions.preferences.default['browser.enable_spellchecking'] = false
					return launchOptions
				}

				if (browser.family === 'firefox') {
					launchOptions.preferences['layout.spellcheckDefault'] = 0
					return launchOptions
				}

				if (browser.name === 'electron') {
					launchOptions.preferences.spellcheck = false
					return launchOptions
				}
			})

			// Remove container after run
			on('after:run', () => {
				if (!process.env.CI) {
					stopNextcloud()
				}
			})

			// Before the browser launches
			// starting Nextcloud testing container
			const ip = await startNextcloud(process.env.BRANCH || 'master', undefined, { exposePort: 8080 })
			// Setting container's IP as base Url
			config.baseUrl = `http://${ip}/index.php`
			await waitOnNextcloud(ip)
			await configureNextcloud(['viewer'])
			return config
		},
	},
})

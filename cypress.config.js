const { defineConfig } = require("cypress");
const browserify = require('@cypress/browserify-preprocessor')

module.exports = defineConfig({
	projectId: 'okzqgr',

	viewportWidth: 1280,
	viewportHeight: 720,
	defaultCommandTimeout: 6000,
	retries: 1,

	env: {
		failSilently: false,
		type: 'actual',
	},

	screenshotsFolder: 'cypress/snapshots/actual',
	trashAssetsBeforeRuns: true,

	e2e: {
		baseUrl: 'http://localhost:8082/index.php',

		setupNodeEvents(on, config) {
			// Fix browserslist extend https://github.com/cypress-io/cypress/issues/2983#issuecomment-570616682
			on('file:preprocessor', browserify())
		},
	},
});

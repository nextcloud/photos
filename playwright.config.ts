/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineConfig, devices } from '@playwright/test'

/** Port the test container is exposed on. Keep in sync with the `webServer` env below. */
const NEXTCLOUD_PORT = 8090

/** Spec file of the faces tests, which get their own project. */
const FACES_SPEC = '**/faces.spec.ts'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/playwright/e2e',
	// Resolves the places of one throwaway account, so the city database is
	// downloaded and indexed before the workers start asking for it in parallel.
	globalSetup: './tests/playwright/global-setup.ts',
	fullyParallel: true,
	timeout: process.env.CI ? 90_000 : undefined,
	// ensure no `test.only` is left in the code causing false positives
	forbidOnly: !!process.env.CI,
	// on CI we retry once to get traces of failures
	retries: process.env.CI ? 1 : 0,
	// we shard on CI to speed up the tests so no parallelism in workers
	workers: process.env.CI ? 1 : undefined,
	// on CI we want to have blob (so we can merge reports and download them for inspection),
	// dot (so we have a quick overview in the logs while the tests are running)
	// github (to have annotations in the PR)
	// locally we just want the html report with the traces
	reporter: process.env.CI ? [['blob'], ['dot'], ['github']] : 'html',
	use: {
		baseURL: `http://localhost:${NEXTCLOUD_PORT}/index.php/`,
		// we record traces but only keep them when the test fails
		trace: 'on-first-retry',
		actionTimeout: 15_000,
		navigationTimeout: 30_000,
		// 16/9, the ratio the tiled photo grid was laid out for
		viewport: { width: 1280, height: 720 },
	},

	projects: [
		{
			name: 'default',
			testIgnore: FACES_SPEC,
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			// The faces tests need recognize to have detected and clustered faces
			// first, which costs minutes of TensorFlow work per worker — hence the
			// generous timeout and the single worker. They also share one classified
			// account and run in declaration order, see the spec for why.
			name: 'faces',
			testMatch: FACES_SPEC,
			fullyParallel: false,
			workers: 1,
			timeout: 45 * 60 * 1000,
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],

	webServer: {
		// Starts the Nextcloud docker container
		command: 'node tests/playwright/start-nextcloud-server.js',
		env: {
			NEXTCLOUD_PORT: String(NEXTCLOUD_PORT),
		},
		// get output of the webserver
		stderr: 'pipe',
		stdout: 'pipe',
		// we use sigterm to notify the script to stop the container
		// if it does not respond, we force kill it after 10 seconds
		gracefulShutdown: {
			signal: 'SIGTERM',
			timeout: 10_000,
		},
		reuseExistingServer: !process.env.CI,
		timeout: 5 * 60 * 1000,
		wait: {
			// we wait for this line to appear in the output of the webserver until consider it done
			stdout: /Nextcloud container ready to run Playwright tests/,
		},
	},
})

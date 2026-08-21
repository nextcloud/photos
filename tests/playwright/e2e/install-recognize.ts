/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { runOcc } from '@nextcloud/e2e-test-server'
import { test as setup } from '@playwright/test'

// eslint-disable-next-line no-empty-pattern
setup('install recognize', async ({ }) => {
	setup.setTimeout(300_000)

	console.log('Installing recognize …')
	await runOcc(['app:install', '--force', 'recognize'], { verbose: true, failOnError: false })
	await runOcc(['maintenance:repair'], { verbose: true, failOnError: false })
})

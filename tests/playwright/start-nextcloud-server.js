/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { configureNextcloud, runExec, runOcc, startNextcloud, stopNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server/docker'

async function start() {
	const port = Number.parseInt(process.env.NEXTCLOUD_PORT ?? '8090', 10)

	const ip = await startNextcloud(process.env.BRANCH, true, {
		exposePort: port,
		forceRecreate: true,
	})

	await waitOnNextcloud(ip)
	// The mounted app is not enabled just because it is mounted, so it is listed
	// here alongside the apps the tests need next to it.
	await configureNextcloud(['photos', 'viewer'])

	process.stdout.write('\nApply custom configuration for Playwright tests\n')

	// Every test seeds its own account through `occ`, so several workers write to
	// the database at the same time — without WAL they serialize on it and start
	// failing with "database is locked".
	await runExec(['php', '-r', '$db = new SQLite3("data/owncloud.db");$db->busyTimeout(5000);$db->exec("PRAGMA journal_mode = wal;");'])
	process.stdout.write('├─ Enabled SQLite WAL mode for better performance\n')

	// otherwise test setup using OCC has to wait for the 3s web cache TTL to expire
	await runOcc(['config:system:set', 'cache_app_config', '--value', 'false', '--type', 'boolean'])
	process.stdout.write('├─ Disabled caching AppConfig\n')

	// createRandomUser() generates short passwords that the policy would reject
	await runOcc(['app:disable', 'password_policy'])
	process.stdout.write('├─ Disabled password policy for random test users\n')

	// A test account is seeded with photos only, so the skeleton would just add
	// files the assertions have to know about but do not care for.
	await runOcc(['config:system:set', 'skeletondirectory', '--value='])
	process.stdout.write('├─ Disabled the default skeleton files for new accounts\n')

	process.stdout.write('├─ Run cron.php to finish installation …\n')
	await runExec(['php', 'cron.php'], { verbose: true })
	process.stdout.write('|  └─ Done\n')

	process.stdout.write('└─ Nextcloud container ready to run Playwright tests\n')
}

async function stop() {
	if (process.env.CI) {
		process.stderr.write('=== Nextcloud log ===\n')
		await runExec(['cat', 'data/nextcloud.log'], { verbose: true })
	}

	process.stderr.write('Stopping Nextcloud server …\n')
	await stopNextcloud()
	process.exit(0)
}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)

await start()

// Idle until Playwright asks us to shut down
while (true) {
	await new Promise((resolvePromise) => setTimeout(resolvePromise, 5000))
}

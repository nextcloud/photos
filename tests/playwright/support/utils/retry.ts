/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

/** How many times a setup round trip is attempted before it fails the test. */
const ATTEMPTS = 3

/** How long to back off after the n-th failed attempt. */
const RETRY_DELAY = 500

/**
 * Run a setup round trip that talks to the server, retrying it a few times.
 *
 * The instance under test runs on SQLite, where writers take turns: creating an
 * account or scanning a folder while another worker is doing the same is answered
 * with "database is locked". That says nothing about what a test is checking, so
 * it may not fail one either — it only has to be waited out.
 *
 * @param action - The round trip to run
 * @param description - What is attempted, for the log message on a failed attempt
 */
export async function withRetry<T>(action: () => Promise<T>, description: string): Promise<T> {
	for (let attempt = 1; attempt < ATTEMPTS; attempt++) {
		try {
			return await action()
		} catch (error) {
			console.info(`Failed to ${description} (attempt ${attempt} of ${ATTEMPTS}), retrying`, error)
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt))
		}
	}

	// The last attempt is outside of the loop so its failure is the one reported.
	return await action()
}

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * The response of a failed request, as the DAV client attaches it to the error
 * it throws.
 */
interface ErrorResponse {
	status?: number
	data?: string
}

/**
 * The response a request failed with, for the errors that carry one.
 *
 * @param error - The caught error
 */
export function getErrorResponse(error: unknown): ErrorResponse | undefined {
	return (error as { response?: ErrorResponse } | undefined)?.response
}

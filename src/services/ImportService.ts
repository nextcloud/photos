/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { isAxiosError } from '@nextcloud/axios'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'

export type ImportField = {
	id: string
	type: 'checkbox' | 'url' | 'password'
	label: string
}

export type ImportProvider = {
	id: string
	name: string
	description: string
	folderHint: string
	fields: ImportField[]
}

export type ImportCount = {
	label: string
	count: number
}

export type ImportStatus = {
	id: string
	provider: string
	folder: string
	dryRun: boolean
	state: 'queued' | 'running' | 'done' | 'failed'
	processed: number
	found: ImportCount[]
	changed: ImportCount[]
	skipped: ImportCount[]
	examples: { path: string, reason: string }[]
	error: string | null
}

export type ImportOptions = Record<string, boolean | string>

const POLL_INTERVAL = 2000

/**
 * List the importers and the last import of the current user.
 */
export async function getImports(): Promise<{ providers: ImportProvider[], status: ImportStatus | null }> {
	const { data } = await axios.get(generateUrl('/apps/photos/api/v1/import'))
	return data
}

/**
 * Queue an import for the current user.
 *
 * @param provider - Id of the importer
 * @param path - Folder to import from, relative to the files of the user
 * @param dryRun - Only count what would be changed
 * @param options - Values of the fields of the importer
 * @throws {Error} With a message for the user when the import cannot start
 */
export async function startImport(provider: string, path: string, dryRun: boolean, options: ImportOptions): Promise<ImportStatus> {
	try {
		const { data } = await axios.post(generateUrl('/apps/photos/api/v1/import'), { provider, path, dryRun, options })
		return data
	} catch (error) {
		const message = isAxiosError(error) ? error.response?.data?.message : undefined
		throw new Error(message ?? t('photos', 'Could not start the import'), { cause: error })
	}
}

/**
 * @param id - Id of the import
 */
export async function getImportStatus(id: string): Promise<ImportStatus> {
	const { data } = await axios.get(generateUrl('/apps/photos/api/v1/import/{id}', { id }))
	return data
}

/**
 * @param status - Status of an import
 */
export function isImportActive(status: ImportStatus | null): boolean {
	return status?.state === 'queued' || status?.state === 'running'
}

/**
 * Poll the status of an import until it finished or the signal aborts.
 *
 * @param id - Id of the import
 * @param onUpdate - Called with each status
 * @param signal - Stops polling when aborted
 * @return The final status, null when aborted
 */
export async function waitForImport(id: string, onUpdate: (status: ImportStatus) => void, signal?: AbortSignal): Promise<ImportStatus | null> {
	while (!signal?.aborted) {
		const status = await getImportStatus(id)
		if (signal?.aborted) {
			break
		}
		onUpdate(status)
		if (!isImportActive(status)) {
			return status
		}
		await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
	}
	return null
}

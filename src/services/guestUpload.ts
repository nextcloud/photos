/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { isAxiosError } from '@nextcloud/axios'
import { formatFileSize } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'

export type GuestUploadSummary = {
	uploaded: number
	errors: string[]
}

/** Statuses after which the following files would be refused as well. */
const STOP_STATUSES = [403, 404, 429, 507]

/**
 * Why a file cannot be sent, checked before uploading; the server checks again.
 * Files the browser has no type for are left to the server.
 *
 * @param file - File picked by the visitor
 * @param maxSize - Largest accepted size in bytes
 * @param allowedMimes - Accepted media types
 */
export function guestUploadError(file: File, maxSize: number, allowedMimes: string[]): string | null {
	if (file.type !== '' && !allowedMimes.includes(file.type)) {
		return t('photos', 'Only photos and videos can be added.')
	}

	if (file.size > maxSize) {
		return t('photos', 'The file is larger than {size}.', { size: formatFileSize(maxSize) })
	}

	return null
}

/**
 * Send the files one after the other to the public album.
 *
 * @param token - Token of the public link
 * @param files - Files picked by the visitor
 * @param guestName - Optional name of the visitor, put in front of the file names
 * @param maxSize - Largest accepted size in bytes
 * @param allowedMimes - Accepted media types
 * @param onProgress - Called with the share of bytes sent so far, from 0 to 1
 */
export async function uploadGuestFiles(
	token: string,
	files: File[],
	guestName: string,
	maxSize: number,
	allowedMimes: string[],
	onProgress: (progress: number) => void = () => {},
): Promise<GuestUploadSummary> {
	const url = generateUrl('/apps/photos/api/v1/public/{token}/upload', { token })
	const totalBytes = files.reduce((total, file) => total + file.size, 0) || 1
	const summary: GuestUploadSummary = { uploaded: 0, errors: [] }
	let sentBytes = 0

	for (const [index, file] of files.entries()) {
		const error = guestUploadError(file, maxSize, allowedMimes)
		if (error !== null) {
			summary.errors.push(`${file.name}: ${error}`)
		} else {
			const data = new FormData()
			data.append('file', file)
			data.append('guestName', guestName.trim())

			try {
				await axios.post(url, data, {
					onUploadProgress: ({ loaded }) => onProgress((sentBytes + Math.min(loaded, file.size)) / totalBytes),
				})
				summary.uploaded++
			} catch (error) {
				const status = isAxiosError(error) ? error.response?.status : undefined
				const message = isAxiosError(error) ? error.response?.data?.message : undefined
				summary.errors.push(`${file.name}: ${message ?? t('photos', 'The file could not be uploaded.')}`)

				if (status !== undefined && STOP_STATUSES.includes(status)) {
					const skipped = files.length - index - 1
					if (skipped > 0) {
						summary.errors.push(n('photos', '%n file was not uploaded.', '%n files were not uploaded.', skipped))
					}
					break
				}
			}
		}

		sentBytes += file.size
		onProgress(sentBytes / totalBytes)
	}

	return summary
}

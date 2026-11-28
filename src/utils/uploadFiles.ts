/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getUniqueName } from '@nextcloud/files'

/** File extensions of the mime types whose subtype is not the extension itself. */
const extensionsByMime: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/svg+xml': 'svg',
	'image/x-icon': 'ico',
	'video/quicktime': 'mov',
}

/**
 * Split files into the ones the library accepts and the ones it does not.
 *
 * @param files - Files that were dropped or pasted
 * @param mimes - Mime types of the photos and videos the library shows
 */
export function splitAcceptedFiles(files: File[], mimes: string[]): { accepted: File[], rejected: File[] } {
	const accepted: File[] = []
	const rejected: File[] = []
	for (const file of files) {
		(mimes.includes(file.type.toLowerCase()) ? accepted : rejected).push(file)
	}
	return { accepted, rejected }
}

/**
 * Name to store a pasted file under. Image data copied from an application
 * carries no name of its own, the browser calls it `image.png`, so it gets a
 * name made of the moment it was pasted. A file copied from a file manager
 * keeps its name.
 *
 * @param file - File of the clipboard
 * @param date - Moment of the paste
 */
export function pastedFileName(file: File, date: Date): string {
	if (file.name !== '' && !/^image\.[a-z0-9]+$/i.test(file.name)) {
		return file.name
	}

	const pad = (value: number) => String(value).padStart(2, '0')
	const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
	const time = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
	const mime = file.type.toLowerCase()
	const extension = extensionsByMime[mime] ?? mime.split('/').pop()

	return `pasted-${day}-${time}.${extension}`
}

/**
 * Give every name a variant that clashes neither with a name that is already
 * taken nor with another name of the list.
 *
 * @param names - Wanted file names
 * @param takenNames - Names that are in use in the destination folder
 */
export function toUniqueNames(names: string[], takenNames: string[]): string[] {
	const taken = [...takenNames]
	return names.map((name) => {
		const uniqueName = getUniqueName(name, taken)
		taken.push(uniqueName)
		return uniqueName
	})
}

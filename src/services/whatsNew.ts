/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '@nextcloud/l10n'

export type WhatsNewHighlight = {
	title: string
	description: string
}

export type WhatsNewEntry = {
	/** App version the highlights were released with, as `major.minor.patch`. */
	version: string
	highlights: WhatsNewHighlight[]
}

/**
 * The curated highlights of the app releases, newest release first.
 */
export function getWhatsNewEntries(): WhatsNewEntry[] {
	return [
		{
			version: '9.0.0',
			highlights: [
				{
					title: t('photos', 'Map'),
					description: t('photos', 'See where your photos were taken on a map of the world.'),
				},
				{
					title: t('photos', 'Memories'),
					description: t('photos', 'Look back at your trips and at the best moments of past years.'),
				},
				{
					title: t('photos', 'Search by file name'),
					description: t('photos', 'Find a photo or video in your timeline by typing a part of its name.'),
				},
				{
					title: t('photos', 'Slideshow'),
					description: t('photos', 'Lean back and let your photos play one after the other.'),
				},
				{
					title: t('photos', 'Grid density'),
					description: t('photos', 'Choose small, medium or large tiles for the photo grids.'),
				},
			],
		},
	]
}

/**
 * The plain version of the installed app, which the build reads from its appinfo.
 */
export function getInstalledVersion(): string {
	return normalizeVersion(appVersion)
}

/**
 * Reduce a version to its `major.minor.patch` numbers, without any pre-release suffix.
 *
 * @param version - Version like `9.0.0-dev.0`
 * @return The plain version, or an empty string if there is none to read
 */
export function normalizeVersion(version: string): string {
	return version.match(/^\d+(\.\d+){0,2}/)?.[0] ?? ''
}

/**
 * Compare two plain versions number by number.
 *
 * @param a - First version
 * @param b - Second version
 * @return Negative if a is older than b, positive if it is newer, zero if they are equal
 */
export function compareVersions(a: string, b: string): number {
	const [partsA, partsB] = [a, b].map((version) => version.split('.').map(Number))
	for (let index = 0; index < 3; index++) {
		const difference = (partsA[index] ?? 0) - (partsB[index] ?? 0)
		if (difference !== 0) {
			return difference
		}
	}
	return 0
}

/**
 * The entries released since the user last looked, up to the installed version.
 *
 * A user without a last seen version is new to the app, so nothing is news to them.
 *
 * @param entries - All entries
 * @param installedVersion - Plain version of the installed app
 * @param lastSeenVersion - Plain version the user saw last, empty if none
 */
export function getUnseenEntries(entries: WhatsNewEntry[], installedVersion: string, lastSeenVersion: string): WhatsNewEntry[] {
	if (installedVersion === '' || lastSeenVersion === '') {
		return []
	}

	return entries.filter(({ version }) => compareVersions(version, lastSeenVersion) > 0
		&& compareVersions(version, installedVersion) <= 0)
}

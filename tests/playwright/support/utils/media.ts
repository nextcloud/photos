/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext } from '@playwright/test'

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { mkdir, uploadFile } from './dav.ts'

/** Folder of the account's home the photos are uploaded into. */
export const PHOTOS_FOLDER = 'Photos'

/** Folder holding the media fixtures, relative to the app root. */
const MEDIA_FIXTURE_DIR = 'tests/playwright/fixtures/media'

/**
 * The photos every test account is seeded with, in the order the timeline shows
 * them — oldest first, which is how a test addresses "the first photo".
 *
 * Their names carry the date they were taken and their EXIF carries the place,
 * both of which the timeline and the filters are asserted on. Keep the two
 * annotated groups in sync with the fixtures if they are ever replaced.
 */
export const MEDIA_FIXTURES = [
	'IMG_20191024_081301.jpg',
	'IMG_20191027_134014.jpg',
	'IMG_20191031_173558.jpg',
	'IMG_20200101_153745.jpg',
	'IMG_20200101_154159.jpg',
] as const

export type MediaFixture = (typeof MEDIA_FIXTURES)[number]

/** Number of photos an account is seeded with. */
export const MEDIA_COUNT = MEDIA_FIXTURES.length

/** A photo taken in Lauris, the only one of the fixtures that was. */
export const PHOTO_IN_LAURIS: MediaFixture = 'IMG_20191024_081301.jpg'

/** File ids of the seeded photos, by file name. */
export type SeededMedia = Record<MediaFixture, string>

/**
 * Upload the media fixtures into the photos folder of an account.
 *
 * Uploading is all it takes for the photos to show up on the timeline: the
 * server extracts the EXIF data, the dimensions and the date a photo was taken
 * while it is being written. Only the *place* of a photo is resolved in a
 * deferred pass, see `generatePhotoPlaces`.
 *
 * @param request - Request context to upload with
 * @param user - Account to upload for
 * @return The file ids of the uploaded photos, which is how the app addresses them
 */
export async function seedMedia(request: APIRequestContext, user: User): Promise<SeededMedia> {
	await mkdir(request, user, PHOTOS_FOLDER)

	// One upload at a time: each of them extracts the metadata of the photo and
	// propagates the size of its folder, and several doing that at once on the same
	// folder contend over the database until one of them is answered with a 503.
	const uploads: (readonly [MediaFixture, string])[] = []
	for (const name of MEDIA_FIXTURES) {
		const content = await readFile(resolve(process.cwd(), MEDIA_FIXTURE_DIR, name))
		uploads.push([name, await uploadFile(request, user, `${PHOTOS_FOLDER}/${name}`, content, 'image/jpeg')])
	}

	return Object.fromEntries(uploads) as SeededMedia
}

/**
 * Name a photo carries inside a collection: the app stores it under its file id
 * so that two collaborators can add files of the same name.
 *
 * @param fileId - File id of the photo
 * @param name - Name of the original file
 */
export function collectionPhotoName(fileId: string, name: string): string {
	return `${fileId}-${name}`
}

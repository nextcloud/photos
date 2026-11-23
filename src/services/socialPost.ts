/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import axios, { isAxiosError } from '@nextcloud/axios'
import { loadState } from '@nextcloud/initial-state'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { davClient } from './DavClient.ts'

/** Photos one post may carry. */
export const MAX_SOCIAL_PHOTOS = 4

/** Longest edge, in pixels, of a photo sent to Social. */
export const MAX_SOCIAL_EDGE = 2048

/** Who sees the post: `private` is the followers only. */
export type SocialVisibility = 'public' | 'unlisted' | 'private'

export type SocialPhoto = {
	photo: PhotoTarget
	/** Alt text of the photo. */
	description: string
}

export type SocialPost = {
	text: string
	visibility: SocialVisibility
	photos: SocialPhoto[]
	/** Shared by the retries of one post, so the server creates it only once. */
	idempotencyKey: string
}

export type SocialPostResult = {
	/** Whether the post waits for a moderator before it is published. */
	heldForReview: boolean
	/** Where the post can be read, `null` when the server did not say. */
	url: string | null
}

export type SocialError = {
	message: string
	/** Page where the account still has to be set up. */
	setupUrl?: string
}

const captionPropFind = `<?xml version="1.0"?>
		<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
			<d:prop>
				<nc:metadata-photos-caption />
			</d:prop>
		</d:propfind>`

/**
 * Whether the Social app is enabled for the current user.
 */
export function isSocialEnabled(): boolean {
	return loadState<boolean>('photos', 'social', false)
}

/**
 * Whether the photos fit in one post.
 *
 * @param photos - Photos to post
 */
export function canPostToSocial(photos: PhotoTarget[]): boolean {
	return photos.length > 0
		&& photos.length <= MAX_SOCIAL_PHOTOS
		&& photos.every((photo) => photo.mime.startsWith('image/'))
}

/**
 * Get the description generated for a photo, to start its alt text from.
 *
 * @param photo - Photo to describe
 * @return The description, empty when the photo has none
 */
export async function fetchPhotoCaption(photo: PhotoTarget): Promise<string> {
	try {
		const response = await davClient.stat(photo.davPath, {
			data: captionPropFind,
			details: true,
		}) as ResponseDataDetailed<FileStat>

		const caption = response.data.props?.['metadata-photos-caption']
		return caption === undefined ? '' : String(caption).trim()
	} catch {
		return ''
	}
}

/**
 * Draw an image again, at most `maxEdge` pixels long.
 *
 * A canvas holds pixels only, so the copy carries none of the metadata of
 * the source, such as the position the photo was taken at.
 *
 * @param source - Image to copy
 * @param maxEdge - Longest edge of the copy, in pixels
 */
export async function downscaleImage(source: Blob, maxEdge: number): Promise<Blob> {
	const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
	const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))

	const canvas = document.createElement('canvas')
	canvas.width = Math.round(bitmap.width * scale)
	canvas.height = Math.round(bitmap.height * scale)
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
	bitmap.close()

	// PNG keeps the transparency JPEG would turn black.
	const type = source.type === 'image/png' ? 'image/png' : 'image/jpeg'

	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob === null ? reject(new Error('Could not encode the image')) : resolve(blob), type, 0.9)
	})
}

/**
 * Get the copy of a photo that is sent to Social.
 *
 * It starts from the server preview, which also exists for formats a browser
 * cannot draw, such as HEIC, and is refused for shares that forbid downloads.
 *
 * @param photo - Photo to send
 */
async function prepareImage(photo: PhotoTarget): Promise<Blob> {
	const { data } = await axios.get<Blob>(
		generateUrl('/apps/photos/api/v1/preview/{fileId}?x={size}&y={size}', { fileId: photo.fileid, size: MAX_SOCIAL_EDGE }),
		{ responseType: 'blob' },
	)

	return downscaleImage(data, MAX_SOCIAL_EDGE)
}

/**
 * Publish photos as a post of the current user, through the client API of the
 * Social app, which takes the session of the browser.
 *
 * @param post - What to publish
 * @throws {Error} When the server refuses an upload or the post
 */
export async function postToSocial(post: SocialPost): Promise<SocialPostResult> {
	const mediaIds: string[] = []

	for (const [index, { photo, description }] of post.photos.entries()) {
		const image = await prepareImage(photo)

		// The original name could say more than the photo, so it is not sent.
		const form = new FormData()
		form.append('file', image, `photo-${index + 1}.${image.type === 'image/png' ? 'png' : 'jpg'}`)
		form.append('description', description.trim())

		const { data } = await axios.post<{ id: string }>(generateUrl('/apps/social/api/v1/media'), form)
		mediaIds.push(data.id)
	}

	try {
		const { data } = await axios.post<{ url: string }>(
			generateUrl('/apps/social/api/v1/statuses'),
			{ status: post.text.trim(), visibility: post.visibility, media_ids: mediaIds },
			{ headers: { 'Idempotency-Key': post.idempotencyKey } },
		)
		// Only a web address is used as a link.
		const url = typeof data.url === 'string' && /^https?:\/\//.test(data.url) ? data.url : null
		return { heldForReview: false, url }
	} catch (error) {
		// The post is stored and appears once a moderator approved it.
		if (isAxiosError(error) && error.response?.data?.held_for_review === true) {
			return { heldForReview: true, url: null }
		}
		throw error
	}
}

/**
 * Explain why posting failed.
 *
 * @param error - Error thrown by `postToSocial`
 */
export function getSocialError(error: unknown): SocialError {
	const data = isAxiosError(error) ? error.response?.data : undefined

	if (data?.code === 'account-not-set-up') {
		return {
			message: t('photos', 'Your Social account is not set up yet. Choose your username in Social, then try again.'),
			setupUrl: generateUrl('/apps/social/'),
		}
	}

	if (typeof data?.error === 'string' && data.error !== '') {
		return { message: t('photos', 'Social refused the post: {error}', { error: data.error }) }
	}

	return { message: t('photos', 'Could not post to Social') }
}

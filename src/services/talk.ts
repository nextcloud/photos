/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import axios, { isAxiosError } from '@nextcloud/axios'
import { getRootPath } from '@nextcloud/files/dav'
import { loadState } from '@nextcloud/initial-state'
import { generateOcsUrl } from '@nextcloud/router'

type TalkCapabilities = {
	spreed?: { features?: string[] }
}

export type Conversation = {
	token: string
	displayName: string
	/** 1 one-to-one, 2 group, 3 public, 4 changelog, 5 former one-to-one, 6 note to self. */
	type: number
	/** What the conversation is attached to, such as `file` for the chat of a file. */
	objectType: string
	/** 0 when the chat can be written to. */
	readOnly: number
	/** Bit mask of what the current user may do in the conversation. */
	permissions: number
	/** Set on conversations hosted by another server. */
	remoteServer?: string
	/** Unix timestamp of the last message or call. */
	lastActivity: number
}

export type SendFailure = {
	photo: PhotoTarget
	/** Reason given by the server, in the language of the user when it has one. */
	message: string
}

const SHARE_TYPE_ROOM = 10
const CONVERSATION_TYPE_CHANGELOG = 4
const PERMISSION_CHAT = 128
// Chats attached to a file or to a password protected share are not listed by Talk either.
const hiddenObjectTypes = ['file', 'share:password']

const talkFeatures = (loadState('core', 'capabilities', {}) as TalkCapabilities).spreed?.features

// The capabilities only carry Talk when it is enabled and the account may use it.
export const isTalkEnabled = talkFeatures !== undefined
export const canSendCaption = talkFeatures?.includes('media-caption') ?? false

/**
 * The conversations of the current user a file can be posted in, the most
 * recently active first.
 *
 * Talk refuses files in read-only and federated conversations and from
 * participants without the chat permission.
 */
export async function fetchConversations(): Promise<Conversation[]> {
	const response = await axios.get(generateOcsUrl('apps/spreed/api/v4/room'), {
		// Listing the conversations in the background must not show the user as online.
		params: { noStatusUpdate: 1 },
	})

	return (response.data.ocs.data as Conversation[])
		.filter((conversation) => conversation.type !== CONVERSATION_TYPE_CHANGELOG
			&& !hiddenObjectTypes.includes(conversation.objectType)
			&& conversation.readOnly === 0
			&& !conversation.remoteServer
			&& (conversation.permissions & PERMISSION_CHAT) !== 0)
		.sort((first, second) => second.lastActivity - first.lastActivity)
}

/**
 * Post photos in a conversation, one after the other so they show up in the
 * chat in the given order.
 *
 * Each photo is shared with the conversation, which gives its participants
 * access to the file and makes Talk post it as a message.
 *
 * @param token - Token of the conversation
 * @param photos - Photos to post
 * @param message - Text shown with the last photo, when Talk supports captions
 * @param onProgress - Called with the number of photos handled so far
 * @return The photos that could not be posted
 */
export async function sendToConversation(
	token: string,
	photos: PhotoTarget[],
	message: string = '',
	onProgress: (done: number) => void = () => {},
): Promise<SendFailure[]> {
	const failures: SendFailure[] = []
	const caption = canSendCaption ? message.trim() : ''

	for (const [index, photo] of photos.entries()) {
		const isLast = index === photos.length - 1

		try {
			await axios.post(generateOcsUrl('apps/files_sharing/api/v1/shares'), {
				shareType: SHARE_TYPE_ROOM,
				shareWith: token,
				path: photo.davPath.slice(getRootPath().length),
				talkMetaData: isLast && caption !== '' ? JSON.stringify({ caption }) : undefined,
			})
		} catch (error) {
			const reason = isAxiosError(error) ? error.response?.data?.ocs?.meta?.message : undefined
			failures.push({ photo, message: reason ?? '' })
		}

		onProgress(index + 1)
	}

	return failures
}

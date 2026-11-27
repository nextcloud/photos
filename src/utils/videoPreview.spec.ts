/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { isPreviewableVideoMime } from './videoPreview.ts'

describe('isPreviewableVideoMime', () => {
	test.each(['video/mp4', 'video/x-m4v', 'video/webm', 'video/ogg'])('plays %s inline', (mime) => {
		expect(isPreviewableVideoMime(mime)).toBe(true)
	})

	test.each(['video/quicktime', 'video/x-matroska', 'image/gif', undefined])('keeps %s to its still preview', (mime) => {
		expect(isPreviewableVideoMime(mime)).toBe(false)
	})
})

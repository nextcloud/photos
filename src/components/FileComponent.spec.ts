/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type * as LivePhoto from '../utils/livePhoto.ts'

import { File } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, ref } from 'vue'
import FileComponent from './FileComponent.vue'
import { getLivePhotoVideoUrl } from '../utils/livePhoto.ts'
import { VIDEO_PREVIEW_DELAY } from '../utils/videoPreview.ts'

const route = vi.hoisted(() => ({ params: {} as Record<string, string> }))

vi.mock('vue-router', () => ({ useRoute: () => route }))
vi.mock('@nextcloud/vue/composables/useIsMobile', () => ({ useIsMobile: () => ref(false) }))
vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({ default: { render: () => h('canvas') } }))
vi.mock('@nextcloud/vue/components/NcCheckboxRadioSwitch', () => ({ default: { render: () => h('input') } }))
vi.mock('./PhotoActionsMenu.vue', () => ({ default: { render: () => h('div') } }))
vi.mock('./FavoriteIcon.vue', () => ({ default: { render: () => h('span') } }))
vi.mock('../services/PreviewService.js', () => ({ isCachedPreview: async () => false }))
vi.mock('../utils/fileUtils.ts', () => ({
	getVideoDurationFromUrl: async () => 3,
	toPhotoTarget: () => ({}),
}))
vi.mock('../utils/livePhoto.ts', async (importOriginal) => ({
	...await importOriginal<typeof LivePhoto>(),
	getLivePhotoVideoUrl: vi.fn(),
}))
vi.mock('../services/DavClient.ts', () => ({ davClient: {} }))

const VIDEO_URL = 'https://cloud.example.org/remote.php/dav/files/alice/Photos/IMG_0001.MOV'

/**
 * Let the media queries of the session answer the given way.
 *
 * @param queries - Whether each media query matches
 * @param queries.hover - Whether the pointer can hover
 * @param queries.reducedMotion - Whether the user asked for reduced motion
 */
function mediaQueries({ hover, reducedMotion }: { hover: boolean, reducedMotion: boolean }) {
	vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
		const matches = (!query.includes('(hover: hover)') || hover)
			&& (!query.includes('(prefers-reduced-motion: no-preference)') || !reducedMotion)
		return { matches, media: query } as MediaQueryList
	})
}

/**
 * A photo of alice, the still of a live photo unless told otherwise.
 *
 * @param mime - Mime type of the file
 * @param attributes - Attributes from the listing
 */
function photo(mime = 'image/heic', attributes: Record<string, unknown> = { 'metadata-files-live-photo': 2 }): PhotoFile {
	return new File({
		id: 1,
		source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos/IMG_0001.HEIC',
		owner: 'alice',
		root: '/files/alice',
		mime,
		attributes: { etag: 'abc', ...attributes },
	}) as PhotoFile
}

/**
 * Mount a tile for the given file and wait for its previews to be set up.
 *
 * @param file - File shown on the tile
 */
async function mountTile(file = photo()) {
	const wrapper = mount(FileComponent, { props: { file } })
	await flushPromises()
	return wrapper
}

/**
 * Let the delay before a preview plays pass.
 */
async function waitForPreview() {
	await vi.advanceTimersByTimeAsync(VIDEO_PREVIEW_DELAY)
	await flushPromises()
}

describe('FileComponent live photos', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		route.params = {}
		vi.mocked(getLivePhotoVideoUrl).mockReset().mockResolvedValue(VIDEO_URL)
		mediaQueries({ hover: true, reducedMotion: false })
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	test('marks the still of a live photo with a badge', async () => {
		expect((await mountTile()).find('.file__live').text()).toBe('LIVE')
		expect((await mountTile(photo('image/jpeg', {}))).find('.file__live').exists()).toBe(false)
		expect((await mountTile(photo('video/quicktime'))).find('.file__live').exists()).toBe(false)
	})

	test('plays the motion once while the pointer rests on the tile', async () => {
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		expect(getLivePhotoVideoUrl).toHaveBeenCalledWith(2)
		expect(wrapper.find('video').exists()).toBe(false)

		await waitForPreview()
		const video = wrapper.find('video')
		expect(video.attributes('src')).toBe(VIDEO_URL)
		expect(video.attributes('loop')).toBeUndefined()
		expect(video.attributes('muted')).toBeDefined()

		await video.trigger('ended')
		expect(wrapper.find('video').exists()).toBe(false)
	})

	test('stops the motion when the pointer leaves the tile', async () => {
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		await wrapper.find('a.file').trigger('mouseleave')

		expect(wrapper.find('video').exists()).toBe(false)
	})

	test('does not start the motion when the pointer left before the video was found', async () => {
		let resolve: (url: string) => void = () => {}
		vi.mocked(getLivePhotoVideoUrl).mockReturnValue(new Promise((r) => {
			resolve = r
		}))
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		await vi.advanceTimersByTimeAsync(VIDEO_PREVIEW_DELAY)
		await wrapper.find('a.file').trigger('mouseleave')
		resolve(VIDEO_URL)
		await flushPromises()

		expect(wrapper.find('video').exists()).toBe(false)
	})

	test('keeps to the still without hover or with reduced motion', async () => {
		mediaQueries({ hover: false, reducedMotion: false })
		let wrapper = await mountTile()
		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		expect(wrapper.find('video').exists()).toBe(false)

		mediaQueries({ hover: true, reducedMotion: true })
		wrapper = await mountTile()
		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		expect(wrapper.find('video').exists()).toBe(false)
		expect(getLivePhotoVideoUrl).not.toHaveBeenCalled()
	})

	test('plays the motion while a finger holds the tile', async () => {
		mediaQueries({ hover: false, reducedMotion: false })
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('pointerdown', { pointerType: 'touch' })
		await waitForPreview()
		expect(wrapper.find('video').attributes('src')).toBe(VIDEO_URL)

		await wrapper.find('a.file').trigger('pointerup', { pointerType: 'touch' })
		expect(wrapper.find('video').exists()).toBe(false)
	})

	test('stops the motion when the hold turns into a scroll', async () => {
		mediaQueries({ hover: false, reducedMotion: false })
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('pointerdown', { pointerType: 'touch' })
		await waitForPreview()
		await wrapper.find('a.file').trigger('pointercancel', { pointerType: 'touch' })

		expect(wrapper.find('video').exists()).toBe(false)
	})

	test('does not play on hold with reduced motion, nor for a photo that is not live', async () => {
		mediaQueries({ hover: false, reducedMotion: true })
		let wrapper = await mountTile()
		await wrapper.find('a.file').trigger('pointerdown', { pointerType: 'touch' })
		await waitForPreview()
		expect(wrapper.find('video').exists()).toBe(false)

		mediaQueries({ hover: false, reducedMotion: false })
		wrapper = await mountTile(photo('image/jpeg', {}))
		await wrapper.find('a.file').trigger('pointerdown', { pointerType: 'touch' })
		await waitForPreview()
		expect(wrapper.find('video').exists()).toBe(false)
		expect(getLivePhotoVideoUrl).not.toHaveBeenCalled()
	})

	test('keeps playing on hover when the mouse button goes down and up', async () => {
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		await wrapper.find('a.file').trigger('pointerdown', { pointerType: 'mouse' })
		await wrapper.find('a.file').trigger('pointerup', { pointerType: 'mouse' })

		expect(wrapper.find('video').exists()).toBe(true)
	})

	test('gives up on a live photo whose video cannot be reached', async () => {
		vi.mocked(getLivePhotoVideoUrl).mockResolvedValue(null)
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		expect(wrapper.find('video').exists()).toBe(false)

		await wrapper.find('a.file').trigger('mouseleave')
		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()
		expect(getLivePhotoVideoUrl).toHaveBeenCalledOnce()
	})

	test('does not look for the motion on a public album', async () => {
		route.params = { token: 'abc' }
		const wrapper = await mountTile()

		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()

		expect(wrapper.find('video').exists()).toBe(false)
		expect(getLivePhotoVideoUrl).not.toHaveBeenCalled()
		expect(wrapper.find('.file__live').exists()).toBe(true)
	})

	test('still plays a video from its own source, looped', async () => {
		const wrapper = await mountTile(photo('video/mp4', {}))

		await wrapper.find('a.file').trigger('mouseenter')
		await waitForPreview()

		const video = wrapper.find('video')
		expect(video.attributes('src')).toBe('https://cloud.example.org/remote.php/dav/files/alice/Photos/IMG_0001.HEIC')
		expect(video.attributes('loop')).toBeDefined()
		expect(getLivePhotoVideoUrl).not.toHaveBeenCalled()
	})
})

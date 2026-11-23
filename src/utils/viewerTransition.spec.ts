/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ViewerSession } from '@nextcloud/viewer'

import { afterEach, describe, expect, test, vi } from 'vitest'
import { openViewerFromTile, tileKeyframe } from './viewerTransition.ts'

/**
 * Stub the media query reduced motion is read from.
 *
 * @param reduced - Whether reduced motion is asked for
 */
function stubReducedMotion(reduced: boolean) {
	vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduced })))
}

/**
 * Put a tile with a loaded preview on the page.
 *
 * @param fileId - Id of the photo of the tile
 */
function addTile(fileId: number) {
	document.body.innerHTML = `
		<div class="file-container" data-file-id="${fileId}">
			<a class="file"><img class="file__layer file__layer--large file__layer--visible" src="/preview.jpg"></a>
		</div>`
	const link = document.querySelector('.file') as HTMLElement
	link.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 100 }) as DOMRect
}

/**
 * Put the viewer showing a loaded picture on the page.
 */
function addViewer(): HTMLImageElement {
	document.body.insertAdjacentHTML('beforeend', '<div class="viewer__modal"><div class="image_container"><img class="loaded" src="/full.jpg"></div></div>')
	const box = () => ({ left: 400, top: 50, width: 600, height: 800 }) as DOMRect
	const picture = document.querySelector('.image_container img') as HTMLImageElement
	picture.getBoundingClientRect = box
	;(document.querySelector('.viewer__modal') as HTMLElement).getBoundingClientRect = box
	return picture
}

/**
 * Let the modal of the viewer start fading out, as closing it does.
 */
async function startLeaving() {
	document.querySelector('.viewer__modal')?.classList.add('fade-leave-active')
	await new Promise((resolve) => setTimeout(resolve))
}

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
	document.body.innerHTML = ''
})

describe('tileKeyframe', () => {
	const full = { left: 400, top: 50, width: 600, height: 800 }

	test('a cropped tile is covered by the picture and clips what overflows', () => {
		const keyframe = tileKeyframe({ left: 100, top: 100, width: 150, height: 150 }, full, 'cover')

		// 150 / 600 covers the tile, 150 / 800 would leave it short.
		expect(keyframe.transform).toBe('translate(-525px, -275px) scale(0.25)')
		// The tile shows 600 of the 800 pixels in height: 100 clipped on each side.
		expect(keyframe.clipPath).toBe('inset(100px 0px)')
	})

	test('an uncropped tile holds the whole picture', () => {
		const keyframe = tileKeyframe({ left: 100, top: 100, width: 150, height: 150 }, full, 'contain')

		expect(keyframe.transform).toBe('translate(-525px, -275px) scale(0.1875)')
		expect(keyframe.clipPath).toBe('inset(0px 0px)')
	})

	test('a tile in the shape of the picture needs no clipping', () => {
		const keyframe = tileKeyframe({ left: 400, top: 50, width: 300, height: 400 }, full, 'cover')

		expect(keyframe.transform).toBe('translate(-150px, -200px) scale(0.5)')
		expect(keyframe.clipPath).toBe('inset(0px 0px)')
	})
})

describe('openViewerFromTile', () => {
	test('opens the viewer and adds nothing to the page with reduced motion', async () => {
		stubReducedMotion(true)
		addTile(7)
		const session = new EventTarget() as ViewerSession
		const open = vi.fn(async () => session)

		expect(await openViewerFromTile(7, open)).toBe(session)
		expect(open).toHaveBeenCalledOnce()
		expect(document.querySelector('body > img')).toBeNull()
	})

	test('opens the viewer when the photo has no tile on the page', async () => {
		stubReducedMotion(false)
		addViewer()
		const session = new EventTarget() as ViewerSession
		const open = vi.fn(async () => session)

		expect(await openViewerFromTile(7, open)).toBe(session)
		await startLeaving()
		expect(document.querySelector('body > img')).toBeNull()
	})

	test('lets the picture of the viewer fly back to the tile of the photo shown last', async () => {
		stubReducedMotion(false)
		addTile(8)
		const picture = addViewer()
		const session = new EventTarget() as ViewerSession
		await openViewerFromTile(7, async () => session)
		const animate = vi.spyOn(Element.prototype, 'animate').mockReturnValue({ finished: new Promise(() => {}) } as Animation)

		session.dispatchEvent(new CustomEvent('update:file', { detail: [{ fileid: 8 }] }))
		await startLeaving()

		const ghost = document.querySelector('body > img') as HTMLImageElement
		expect(ghost.src).toContain('/full.jpg')
		expect(ghost.getAttribute('aria-hidden')).toBe('true')
		expect(picture.style.visibility).toBe('hidden')
		expect(animate.mock.calls[0][0]).toEqual([
			{ transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px)' },
			tileKeyframe({ left: 10, top: 20, width: 100, height: 100 }, { left: 400, top: 50, width: 600, height: 800 }, 'cover'),
		])
	})

	test('leaves the picture alone once the viewer has closed', async () => {
		stubReducedMotion(false)
		addTile(7)
		addViewer()
		const session = new EventTarget() as ViewerSession
		await openViewerFromTile(8, async () => session)

		session.dispatchEvent(new CustomEvent('close', { detail: [] }))
		await startLeaving()

		expect(document.querySelector('body > img')).toBeNull()
	})
})

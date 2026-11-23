/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ViewerSession } from '@nextcloud/viewer'

export type Box = { left: number, top: number, width: number, height: number }

/** How long a photo takes to travel between its tile and the viewer, in milliseconds. */
export const FLIGHT_DURATION = 260

// How long the viewer gets to lay out the photo before the flight is given up.
const TARGET_TIMEOUT = 400
// How long a landed photo waits for the viewer to have loaded its own picture.
const LOADED_TIMEOUT = 1000

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const VIEWER_MODAL = '.viewer__modal'
const VIEWER_PICTURE = `${VIEWER_MODAL} .image_container img`
const VIEWER_TARGET = `${VIEWER_MODAL} .viewer__placeholder, ${VIEWER_PICTURE}`
// What the modal of the viewer carries while it fades out.
const MODAL_LEAVING_CLASS = 'fade-leave-active'

/**
 * The keyframe that makes a picture laid out at `full` look like its tile.
 *
 * The picture is scaled around its center and moved onto the tile, then
 * clipped to what the tile shows of it: a cropped tile only shows the middle
 * of its photo. Only `transform` and `clip-path` are involved, so that the
 * way from there to the resting keyframe needs no layout.
 *
 * @param tile - Where the tile is on screen
 * @param full - Where the whole picture is on screen
 * @param fit - Whether the tile is filled by the picture or holds it whole
 */
export function tileKeyframe(tile: Box, full: Box, fit: 'cover' | 'contain'): Keyframe {
	const ratios = [tile.width / full.width, tile.height / full.height]
	const scale = fit === 'cover' ? Math.max(...ratios) : Math.min(...ratios)
	const x = (tile.left + tile.width / 2) - (full.left + full.width / 2)
	const y = (tile.top + tile.height / 2) - (full.top + full.height / 2)
	const clipX = Math.max(0, (full.width - tile.width / scale) / 2)
	const clipY = Math.max(0, (full.height - tile.height / scale) / 2)

	return {
		transform: `translate(${round(x)}px, ${round(y)}px) scale(${round(scale, 4)})`,
		clipPath: `inset(${round(clipY)}px ${round(clipX)}px)`,
	}
}

/** The keyframe of a picture resting where it is laid out. */
export const RESTING_KEYFRAME: Keyframe = { transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px)' }

/**
 * Open the viewer with the photo growing out of its tile, and shrinking back
 * into the tile of the photo shown when the viewer closes.
 *
 * The viewer is opened as it would be without, a copy of the picture only
 * travels above it. Nothing travels when the tile is not on screen, when
 * its preview has not loaded yet or when reduced motion is asked for.
 *
 * @param fileId - Id of the photo that was clicked
 * @param open - Opens the viewer
 */
export async function openViewerFromTile(fileId: number, open: () => Promise<ViewerSession>): Promise<ViewerSession> {
	if (!allowsMotion()) {
		return open()
	}

	const origin = findTile(fileId)
	const opening = open()
	const landed = origin !== null ? flyToViewer(origin) : undefined
	const session = await opening

	let shownFileId = fileId
	const removeLanded = () => landed?.then((ghost) => ghost?.remove())
	session.addEventListener('update:file', (event) => {
		shownFileId = event.detail[0].fileid ?? shownFileId
		removeLanded()
	})

	// The session only tells of the viewer closing once it has faded out,
	// which is too late to pick its picture up. The class its modal fades
	// out with is what tells in time.
	const modal = await waitForElement(VIEWER_MODAL, TARGET_TIMEOUT)
	const leaving = new MutationObserver(() => {
		if (modal?.classList.contains(MODAL_LEAVING_CLASS)) {
			leaving.disconnect()
			removeLanded()
			flyToTile(shownFileId)
		}
	})
	if (modal !== null) {
		leaving.observe(modal, { attributes: true, attributeFilter: ['class'] })
	}
	session.addEventListener('close', () => {
		leaving.disconnect()
		removeLanded()
	}, { once: true })

	return session
}

type Tile = { box: Box, src: string, fit: 'cover' | 'contain' }

function allowsMotion(): boolean {
	return typeof Element.prototype.animate === 'function'
		&& !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function round(value: number, digits = 2): number {
	return Number(value.toFixed(digits))
}

function toBox(element: Element): Box {
	const { left, top, width, height } = element.getBoundingClientRect()
	return { left, top, width, height }
}

/**
 * The tile of a photo, when it is on screen and shows a loaded preview.
 *
 * @param fileId - Id of the photo
 */
function findTile(fileId: number): Tile | null {
	const link = document.querySelector(`.file-container[data-file-id="${fileId}"] .file`)
	const layers = link?.querySelectorAll<HTMLImageElement>('img.file__layer--visible')
	const preview = layers?.[layers.length - 1]
	if (!link || !preview) {
		return null
	}

	const box = toBox(link)
	if (box.width === 0 || box.top + box.height < 0 || box.top > window.innerHeight) {
		return null
	}

	return {
		box,
		src: preview.currentSrc || preview.src,
		fit: getComputedStyle(preview).objectFit === 'contain' ? 'contain' : 'cover',
	}
}

/**
 * A copy of a picture, above the page and the viewer and out of reach of
 * pointer, keyboard and screen reader.
 *
 * @param src - The picture
 * @param box - Where to lay it out
 */
function createGhost(src: string, box: Box): HTMLImageElement {
	const ghost = document.createElement('img')
	ghost.src = src
	ghost.alt = ''
	ghost.setAttribute('aria-hidden', 'true')
	Object.assign(ghost.style, {
		position: 'fixed',
		left: `${box.left}px`,
		top: `${box.top}px`,
		width: `${box.width}px`,
		height: `${box.height}px`,
		margin: '0',
		zIndex: '10100',
		pointerEvents: 'none',
		willChange: 'transform, clip-path',
	})
	document.body.appendChild(ghost)
	return ghost
}

/**
 * The first element matching the selector that is laid out.
 *
 * @param selector - What to look for
 */
function findLaidOut<T extends HTMLElement>(selector: string): T | undefined {
	return [...document.querySelectorAll<T>(selector)]
		.find((candidate) => candidate.getBoundingClientRect().width > 0)
}

/**
 * Wait for an element matching the selector to be laid out.
 *
 * @param selector - What to look for
 * @param timeout - How long to look, in milliseconds
 */
function waitForElement(selector: string, timeout: number): Promise<HTMLElement | null> {
	const start = performance.now()
	return new Promise((resolve) => {
		const look = () => {
			const element = findLaidOut(selector)
			if (element !== undefined) {
				resolve(element)
			} else if (performance.now() - start > timeout) {
				resolve(null)
			} else {
				requestAnimationFrame(look)
			}
		}
		look()
	})
}

/**
 * Let the preview of a tile grow to where the viewer shows the photo.
 *
 * Resolves with the copy that made the way, kept above the viewer until that
 * has loaded its own picture, so that a sharp preview is not followed by a
 * blurred placeholder. It is gone by the time that wait is over.
 *
 * @param origin - The tile to start from
 */
async function flyToViewer(origin: Tile): Promise<HTMLImageElement | null> {
	const target = await waitForElement(VIEWER_TARGET, TARGET_TIMEOUT)
	if (target === null) {
		return null
	}

	const ghost = createGhost(origin.src, toBox(target))
	const flight = ghost.animate(
		[tileKeyframe(origin.box, toBox(target), origin.fit), RESTING_KEYFRAME],
		{ duration: FLIGHT_DURATION, easing: EASING, fill: 'backwards' },
	)
	flight.finished
		.then(() => waitForElement(`${VIEWER_PICTURE}.loaded`, LOADED_TIMEOUT))
		.catch(() => {})
		.then(() => ghost.remove())

	return ghost
}

/**
 * Let the picture the viewer shows shrink back into the tile of its photo.
 * To be called before the viewer has faded out.
 *
 * @param fileId - Id of the photo the viewer shows
 */
function flyToTile(fileId: number): void {
	const picture = findLaidOut<HTMLImageElement>(VIEWER_PICTURE)
	const destination = findTile(fileId)
	if (picture === undefined || destination === null) {
		return
	}

	const full = toBox(picture)
	const ghost = createGhost(picture.currentSrc || picture.src, full)
	// The copy stands in for the picture, which would otherwise fade out behind it.
	picture.style.visibility = 'hidden'
	ghost.animate(
		[RESTING_KEYFRAME, tileKeyframe(destination.box, full, destination.fit)],
		{ duration: FLIGHT_DURATION, easing: EASING, fill: 'forwards' },
	).finished
		.catch(() => {})
		.then(() => ghost.remove())
}

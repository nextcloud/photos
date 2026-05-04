/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Turn a burst stack into a looping WebM clip — entirely
 * client-side, no backend work. The Canvas + MediaRecorder
 * combination lets us render each photo at the same dimensions to
 * an offscreen canvas, capture the resulting `MediaStream`, and
 * download the encoded webm. Browsers all ship VP8/VP9 WebM
 * encoders by default; AV1 / H.264 in MP4 would need a polyfill,
 * which isn't worth the bundle weight for a one-shot export.
 *
 * The trade vs the (unimplemented) server-side ffmpeg path:
 *
 *   - Server-side (not implemented): produces MP4 / GIF, encodes
 *     once and caches, smaller files for the same quality, but
 *     needs the photo originals on disk and an ffmpeg subprocess
 *     per request.
 *   - Client-side (this): produces WebM only, runs in the user's
 *     browser, adds zero infrastructure but the user has to wait
 *     ~(N × frameMs) milliseconds while their device encodes.
 *
 * Use cases this is good enough for: "make a short loop of my
 * burst to share". When users want production-quality loops the
 * server-side path is the upgrade.
 */

interface BurstAnimatorOptions {
	/**
	 * ms each frame holds. Default 250 ms = 4 fps, enough to feel
	 *  animated without burning bandwidth.
	 */
	frameDurationMs?: number
	/**
	 * Output canvas longest-edge dimension. Default 1024 — a
	 *  reasonable thumbnail for sharing without breaking on small
	 *  uploads.
	 */
	maxEdge?: number
	/** Quality factor passed to MediaRecorder, 0–1. Default 0.85. */
	quality?: number
}

const DEFAULT_FRAME_MS = 250
const DEFAULT_MAX_EDGE = 1024
const DEFAULT_QUALITY = 0.85

/**
 * Render a sequence of preview URLs to a canvas at a fixed frame
 * rate, capture the canvas as a `MediaStream`, encode via
 * `MediaRecorder`, and return the resulting Blob.
 *
 * Loads each image one at a time to keep memory in check on long
 * bursts (caching all 30 frames as `<img>` elements would balloon
 * RAM on 4032×3024 source files).
 *
 * @param previewUrls - Ordered list of preview URLs, one per
 *                      frame (caller's responsibility to pick the
 *                      right `?x=…&y=…` size for the target
 *                      output).
 * @param options
 */
export async function renderBurstClip(
	previewUrls: string[],
	options: BurstAnimatorOptions = {},
): Promise<Blob> {
	const frameMs = options.frameDurationMs ?? DEFAULT_FRAME_MS
	const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE
	const quality = options.quality ?? DEFAULT_QUALITY

	if (previewUrls.length === 0) {
		throw new Error('renderBurstClip: empty previewUrls')
	}

	// Load the first frame to know what aspect ratio to size the
	// canvas at. Subsequent frames re-use the same canvas.
	const first = await loadImage(previewUrls[0])
	const ratio = first.width / first.height
	const [canvasW, canvasH] = ratio >= 1
		? [maxEdge, Math.round(maxEdge / ratio)]
		: [Math.round(maxEdge * ratio), maxEdge]

	const canvas = document.createElement('canvas')
	canvas.width = canvasW
	canvas.height = canvasH
	const ctx = canvas.getContext('2d')
	if (ctx === null) {
		throw new Error('renderBurstClip: 2D canvas context unavailable')
	}

	// MediaRecorder reads from a MediaStream. captureStream(0)
	// gives a stream with no automatic frame ticks — we drive it
	// with `requestFrame()` calls per draw, so the frame count
	// matches our drawn-frame count exactly.
	const stream = (canvas as HTMLCanvasElement & {
		captureStream(framerate?: number): MediaStream
	}).captureStream(0)
	const track = stream.getVideoTracks()[0] as MediaStreamTrack & {
		requestFrame?: () => void
	}

	const mimeType = pickSupportedMimeType()
	const recorder = new MediaRecorder(stream, {
		mimeType,
		videoBitsPerSecond: Math.round(canvasW * canvasH * 4 * quality),
	})
	const chunks: Blob[] = []
	recorder.ondataavailable = (e) => {
		if (e.data.size > 0) {
			chunks.push(e.data)
		}
	}

	const recordingDone = new Promise<Blob>((resolve, reject) => {
		recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }))
		recorder.onerror = (e) => reject(e instanceof Event ? new Error('MediaRecorder error') : e)
	})

	recorder.start()

	// Draw the first frame we already have.
	ctx.drawImage(first, 0, 0, canvasW, canvasH)
	track.requestFrame?.()
	await sleep(frameMs)

	for (let i = 1; i < previewUrls.length; i++) {
		const img = await loadImage(previewUrls[i])
		ctx.drawImage(img, 0, 0, canvasW, canvasH)
		track.requestFrame?.()
		await sleep(frameMs)
	}

	recorder.stop()
	return recordingDone
}

/**
 * Browser support for VP9 lags VP8 by a hair (and some Safari
 * versions only do VP8). Pick whatever the browser claims to
 * support; fall back to no mimetype which lets the encoder pick
 * its default (usually VP8).
 */
function pickSupportedMimeType(): string {
	const candidates = [
		'video/webm;codecs=vp9',
		'video/webm;codecs=vp8',
		'video/webm',
	]
	for (const mime of candidates) {
		if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
			return mime
		}
	}
	return 'video/webm'
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		// Same-origin previews — `crossOrigin = anonymous` keeps the
		// canvas non-tainted so we can read it from MediaRecorder.
		// Fails harmlessly if the server doesn't return CORS headers
		// (loads but the canvas would be tainted; the recorder will
		// error and surface to the caller).
		img.crossOrigin = 'anonymous'
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`renderBurstClip: failed to load ${src}`))
		img.src = src
	})
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Convenience: trigger a download of the encoded blob with a
 * filename derived from the leader fileId. Browsers without the
 * MediaRecorder API fall back to a thrown error that the caller
 * can surface as a toast.
 *
 * @param blob
 * @param leaderFileId
 */
export function downloadBurstClip(blob: Blob, leaderFileId: string | number): void {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `burst-${leaderFileId}.webm`
	document.body.appendChild(a)
	a.click()
	a.remove()
	// Revoke after the click handler has run; setTimeout 0 is the
	// minimum browsers need to start the download before we yank
	// the URL.
	setTimeout(() => URL.revokeObjectURL(url), 0)
}

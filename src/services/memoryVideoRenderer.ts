/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { SlideLayer } from './memoryVideo.ts'

import { getPreviewUrl } from '../utils/fileUtils.ts'
import { logger } from './logger.ts'
import { buildTimeline, getFrameLayers } from './memoryVideo.ts'
import { getRecordingMimeType, startRecording } from './videoRecorder.ts'

const WIDTH = 1280
const HEIGHT = 720
const FRAME_RATE = 30

/** Size of the requested previews, matching the video width. */
const PREVIEW_SIZE = 1280

export type MemoryVideoOptions = {
	/** Photos of the video, in the order they are shown. */
	photos: PhotoFile[]
	/** Text of the title card. */
	title: string
	/** Smaller text under the title. */
	subtitle: string
	/** URL of a sound track to play under the video. */
	audioUrl?: string
	/** Whether the slides pan and zoom. */
	animate: boolean
	signal?: AbortSignal
	/** Called with the step being worked on and its progress, from 0 to 1. */
	onProgress?: (step: 'loading' | 'recording', progress: number) => void
}

export type MemoryVideo = {
	blob: Blob
	mimeType: string
	/** Length of the video, in milliseconds. */
	duration: number
}

/**
 * Render photos into a video in the browser: a title card followed by the
 * photos, cross-fading into each other. The video is recorded in real time.
 *
 * @param options - What to render
 */
export async function renderMemoryVideo(options: MemoryVideoOptions): Promise<MemoryVideo> {
	const { photos, title, subtitle, audioUrl, animate, signal, onProgress } = options

	// Created before anything is awaited, while the click asking for the video
	// still allows sound to play.
	const audioContext = audioUrl !== undefined ? new AudioContext() : undefined
	const audio = audioUrl !== undefined ? new Audio(audioUrl) : undefined
	const stream = new MediaStream()

	try {
		const images = await loadImages(photos, signal, (progress) => onProgress?.('loading', progress))
		if (images.length === 0) {
			throw new Error('None of the photos could be loaded')
		}

		const canvas = document.createElement('canvas')
		canvas.width = WIDTH
		canvas.height = HEIGHT
		const context = canvas.getContext('2d')!
		canvas.captureStream(FRAME_RATE).getVideoTracks().forEach((track) => stream.addTrack(track))

		const timeline = buildTimeline(images.length + 1)
		const backgrounds = new Map<number, HTMLCanvasElement>()
		const titleImage = images[Math.floor(images.length / 2)]
		const getBackground = (slide: number) => {
			if (!backgrounds.has(slide)) {
				backgrounds.set(slide, renderBackground(slide === 0 ? titleImage : images[slide - 1]))
			}
			return backgrounds.get(slide)!
		}

		const drawFrame = (time: number) => {
			context.globalAlpha = 1
			context.fillStyle = '#000'
			context.fillRect(0, 0, WIDTH, HEIGHT)

			for (const layer of getFrameLayers(timeline, time, animate)) {
				context.globalAlpha = layer.opacity
				if (layer.slide === 0) {
					drawTitle(context, getBackground(0), layer, title, subtitle)
				} else {
					drawPhoto(context, images[layer.slide - 1], getBackground(layer.slide), layer)
				}
			}
		}

		drawFrame(0)
		if (audio !== undefined && audioContext !== undefined) {
			await addSoundTrack(audio, audioContext, stream, timeline.duration)
		}

		const mimeType = getRecordingMimeType(audio !== undefined)
		if (mimeType === undefined) {
			throw new Error('The browser cannot record this video')
		}

		const recording = startRecording(stream, mimeType)
		const start = performance.now()

		await new Promise<void>((resolve, reject) => {
			const tick = () => {
				if (signal?.aborted) {
					reject(signal.reason)
					return
				}

				const time = Math.min(performance.now() - start, timeline.duration)
				drawFrame(time)
				onProgress?.('recording', time / timeline.duration)

				if (time >= timeline.duration) {
					resolve()
				} else {
					requestAnimationFrame(tick)
				}
			}
			requestAnimationFrame(tick)
		}).catch(async (error) => {
			await recording.stop()
			throw error
		})

		const blob = await recording.stop()
		return { blob, mimeType: blob.type, duration: timeline.duration }
	} finally {
		audio?.pause()
		audioContext?.close()
		stream.getTracks().forEach((track) => track.stop())
	}
}

/**
 * Load the previews of the photos, leaving out the ones failing to load.
 *
 * @param photos - Photos to load
 * @param signal - Aborts the loading
 * @param onProgress - Called with the share of photos loaded so far
 */
async function loadImages(photos: PhotoFile[], signal: AbortSignal | undefined, onProgress: (progress: number) => void): Promise<HTMLImageElement[]> {
	let loaded = 0

	const images = await Promise.all(photos.map(async (photo) => {
		const image = new Image()
		image.src = getPreviewUrl(photo, PREVIEW_SIZE)
		try {
			await image.decode()
			return image
		} catch (error) {
			logger.warn('Could not load a photo of the memory video', { error, fileid: photo.fileid })
			return undefined
		} finally {
			onProgress(++loaded / photos.length)
		}
	}))

	signal?.throwIfAborted()
	return images.filter((image) => image !== undefined)
}

/**
 * Play a sound track into the recorded stream, fading out with the video.
 *
 * @param audio - Element playing the sound track
 * @param audioContext - Context to route the sound through
 * @param stream - Stream to add the sound track to
 * @param duration - Length of the video, in milliseconds
 */
async function addSoundTrack(audio: HTMLAudioElement, audioContext: AudioContext, stream: MediaStream, duration: number): Promise<void> {
	const destination = audioContext.createMediaStreamDestination()
	const gain = audioContext.createGain()
	audioContext.createMediaElementSource(audio).connect(gain).connect(destination)
	destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track))

	audio.loop = true
	await audioContext.resume()
	await audio.play()

	const end = audioContext.currentTime + duration / 1000
	gain.gain.setValueAtTime(1, Math.max(audioContext.currentTime, end - 2))
	gain.gain.linearRampToValueAtTime(0, end)
}

/**
 * Render the backdrop of a slide once: the photo filling the frame, blurred
 * and darkened, so photos which do not fill the frame are not shown on black.
 *
 * @param image - Photo of the slide
 */
function renderBackground(image: HTMLImageElement): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	canvas.width = WIDTH
	canvas.height = HEIGHT
	const context = canvas.getContext('2d')!
	context.filter = 'blur(24px) brightness(0.55)'
	const scale = Math.max(WIDTH / image.naturalWidth, HEIGHT / image.naturalHeight) * 1.1
	context.drawImage(image, (WIDTH - image.naturalWidth * scale) / 2, (HEIGHT - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale)
	return canvas
}

/**
 * Draw an image centred on the frame, panned and zoomed as the layer says.
 *
 * @param context - Context of the frame
 * @param image - Image to draw
 * @param baseScale - Scale of the image before the layer zoom
 * @param layer - Pan and zoom of the slide
 */
function drawCentered(context: CanvasRenderingContext2D, image: CanvasImageSource & { width: number, height: number }, baseScale: number, layer: SlideLayer): void {
	const scale = baseScale * layer.scale
	const width = image.width * scale
	const height = image.height * scale
	context.drawImage(image, WIDTH / 2 + layer.offsetX * WIDTH - width / 2, HEIGHT / 2 + layer.offsetY * HEIGHT - height / 2, width, height)
}

/**
 * Draw a photo slide: landscape photos fill the frame, the others are shown
 * whole over their backdrop.
 *
 * @param context - Context of the frame
 * @param image - Photo of the slide
 * @param background - Backdrop of the slide
 * @param layer - How the slide is shown
 */
function drawPhoto(context: CanvasRenderingContext2D, image: HTMLImageElement, background: HTMLCanvasElement, layer: SlideLayer): void {
	const coverScale = Math.max(WIDTH / image.width, HEIGHT / image.height)
	const containScale = Math.min(WIDTH / image.width, HEIGHT / image.height)
	const fillsFrame = image.width / image.height >= (WIDTH / HEIGHT) * 0.8

	if (!fillsFrame) {
		context.drawImage(background, 0, 0)
	}
	drawCentered(context, image, fillsFrame ? coverScale : containScale * 0.94, layer)
}

/**
 * Draw the title card: the title and subtitle over a darkened photo.
 *
 * @param context - Context of the frame
 * @param background - Backdrop of the title card
 * @param layer - How the title card is shown
 * @param title - Title of the video
 * @param subtitle - Smaller text under the title
 */
function drawTitle(context: CanvasRenderingContext2D, background: HTMLCanvasElement, layer: SlideLayer, title: string, subtitle: string): void {
	drawCentered(context, background, 1, layer)

	const fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif'
	context.fillStyle = '#fff'
	context.textAlign = 'center'
	context.textBaseline = 'middle'
	context.shadowColor = 'rgba(0, 0, 0, 0.6)'
	context.shadowBlur = 12

	let titleSize = 72
	do {
		context.font = `bold ${titleSize}px ${fontFamily}`
		titleSize -= 4
	} while (titleSize > 24 && context.measureText(title).width > WIDTH * 0.9)
	context.fillText(title, WIDTH / 2, HEIGHT / 2 - 24)

	context.font = `32px ${fontFamily}`
	context.fillText(subtitle, WIDTH / 2, HEIGHT / 2 + 48)
	context.shadowBlur = 0
}

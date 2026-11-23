/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { PageFormat, PageOrientation, PhotoBookLayout, Rect, Size } from '../utils/photoBook.ts'

import axios, { isAxiosError } from '@nextcloud/axios'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { encodePath } from '@nextcloud/paths'
import { formatDate } from '../utils/dateUtils.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'
import { PdfWriter } from '../utils/pdfWriter.ts'
import { fitRect, getPageSize, getPageSlots, paginate } from '../utils/photoBook.ts'
import { logger } from './logger.ts'

export type PhotoBookOptions = {
	format: PageFormat
	orientation: PageOrientation
	layout: PhotoBookLayout
	/** Print the date of every photo below it. */
	captions: boolean
	/** Title of the title page, `undefined` for a book without one. */
	title?: string
	/** Lines printed below the title. */
	subtitles: string[]
}

/** Pixels per PDF point, pages are rendered at 150 dpi. */
const SCALE = 150 / 72
const CAPTION_HEIGHT = 18
const JPEG_QUALITY = 0.9

/**
 * Number of pages a photo book has.
 *
 * @param photos - Photos of the book
 * @param options - Options of the book
 */
export function countPhotoBookPages(photos: PhotoFile[], options: PhotoBookOptions): number {
	return getPhotoPages(photos, options).length + (options.title === undefined ? 0 : 1)
}

/**
 * Render a photo book as a PDF.
 *
 * The pages are drawn one after the other on a single canvas, so that only
 * the photos of the current page are decoded at any time.
 *
 * @param photos - Photos of the book, in the order they are printed
 * @param options - Options of the book
 * @param onProgress - Called with the number of finished pages
 * @param signal - Aborts the rendering
 */
export async function createPhotoBook(photos: PhotoFile[], options: PhotoBookOptions, onProgress: (pages: number) => void, signal: AbortSignal): Promise<Blob> {
	const page = getPageSize(options.format, options.orientation)
	const writer = new PdfWriter()
	const canvas = document.createElement('canvas')
	canvas.width = Math.round(page.width * SCALE)
	canvas.height = Math.round(page.height * SCALE)
	const context = canvas.getContext('2d', { alpha: false })!
	context.scale(SCALE, SCALE)
	context.textAlign = 'center'
	const fontFamily = getComputedStyle(document.body).fontFamily

	const finishPage = async () => {
		const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
		if (jpeg === null) {
			throw new Error('Could not encode a page of the photo book')
		}
		writer.addPage(page.width, page.height, jpeg, canvas)
		onProgress(writer.pageCount)
	}
	const startPage = () => {
		signal.throwIfAborted()
		context.fillStyle = '#fff'
		context.fillRect(0, 0, page.width, page.height)
	}

	try {
		if (options.title !== undefined) {
			startPage()
			drawTitlePage(context, page, fontFamily, options.title, options.subtitles)
			await finishPage()
		}

		for (const pagePhotos of getPhotoPages(photos, options)) {
			startPage()
			const slots = getPageSlots(pagePhotos.length, page, options.captions ? CAPTION_HEIGHT : 0)
			for (const [index, photo] of pagePhotos.entries()) {
				const caption = options.captions ? formatDate(new Date(photo.attributes.timestamp * 1000)) : undefined
				await drawPhoto(context, photo, slots[index]!, `10px ${fontFamily}`, caption, signal)
			}
			await finishPage()
		}
	} finally {
		// Frees the pixel buffer without waiting for the garbage collector.
		canvas.width = canvas.height = 0
	}

	return writer.finish()
}

/**
 * Upload a photo book to the files of the user, without replacing a file
 * that has the same name.
 *
 * @param pdf - The photo book
 * @param folder - Path of the folder to save it in
 * @param name - Name of the file, without extension
 * @return Path of the created file
 */
export async function savePhotoBook(pdf: Blob, folder: string, name: string): Promise<string> {
	const base = `${folder.replace(/\/$/, '')}/${name.replaceAll('/', '-')}`
	for (let attempt = 1; ; attempt++) {
		const path = attempt === 1 ? `${base}.pdf` : `${base} (${attempt}).pdf`
		try {
			await axios.put(defaultRemoteURL + encodePath(defaultRootPath + path), pdf, {
				headers: { 'Content-Type': 'application/pdf', 'If-None-Match': '*' },
			})
			return path
		} catch (error) {
			// 412: a file with that name exists already.
			if (!isAxiosError(error) || error.response?.status !== 412 || attempt >= 50) {
				throw error
			}
		}
	}
}

/**
 * @param photos - Photos of the book
 * @param options - Options of the book
 */
function getPhotoPages(photos: PhotoFile[], options: PhotoBookOptions): PhotoFile[][] {
	const ratios = photos.map(({ attributes }) => attributes['metadata-photos-size'].width / attributes['metadata-photos-size'].height)
	return paginate(ratios, options.layout, options.orientation === 'landscape')
		.map((indexes) => indexes.map((index) => photos[index]!))
}

/**
 * @param context - Canvas of the page, scaled to points
 * @param page - Size of the page
 * @param fontFamily - Font of the texts
 * @param title - Title of the book
 * @param subtitles - Lines below the title
 */
function drawTitlePage(context: CanvasRenderingContext2D, page: Size, fontFamily: string, title: string, subtitles: string[]): void {
	const maxWidth = page.width - 144
	context.fillStyle = '#000'
	context.font = `bold 40px ${fontFamily}`
	// A title wider than the page is printed in a smaller font instead of being squeezed.
	const fontSize = Math.min(40, 40 * maxWidth / context.measureText(title).width)
	context.font = `bold ${fontSize}px ${fontFamily}`
	context.fillText(title, page.width / 2, page.height / 2, maxWidth)

	context.fillStyle = '#555'
	context.font = `16px ${fontFamily}`
	subtitles.forEach((subtitle, index) => context.fillText(subtitle, page.width / 2, page.height / 2 + 36 + index * 24, maxWidth))
}

/**
 * Draw the preview of a photo in a slot of the page, a photo without a
 * preview leaves its slot empty.
 *
 * @param context - Canvas of the page, scaled to points
 * @param photo - The photo to draw
 * @param slot - Area of the page to draw the photo in
 * @param font - Font of the caption
 * @param caption - Text printed below the photo
 * @param signal - Aborts the download of the preview
 */
async function drawPhoto(context: CanvasRenderingContext2D, photo: PhotoFile, slot: Rect, font: string, caption: string | undefined, signal: AbortSignal): Promise<void> {
	// Previews come in powers of two, pick the smallest one covering the slot.
	const previewSize = 2 ** Math.ceil(Math.log2(Math.max(slot.width, slot.height) * SCALE))
	let bitmap: ImageBitmap
	try {
		const response = await fetch(getPreviewUrl(photo, previewSize), { signal })
		if (!response.ok) {
			throw new Error(`Preview request failed with status ${response.status}`)
		}
		bitmap = await createImageBitmap(await response.blob())
	} catch (error) {
		signal.throwIfAborted()
		logger.warn('Could not load a photo of the photo book', { error, photo: photo.basename })
		return
	}

	const area = fitRect(bitmap.width / bitmap.height, slot)
	context.drawImage(bitmap, area.x, area.y, area.width, area.height)
	bitmap.close()

	if (caption !== undefined) {
		context.fillStyle = '#555'
		context.font = font
		context.fillText(caption, slot.x + slot.width / 2, area.y + area.height + 13, slot.width)
	}
}

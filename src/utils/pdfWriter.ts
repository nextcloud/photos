/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const CATALOG_ID = 1
const PAGES_ID = 2

/**
 * Writes a PDF in which every page is a single JPEG image covering it.
 *
 * The images are embedded as they are and kept as blobs, so the document is
 * never held in memory as a whole.
 */
export class PdfWriter {
	private readonly parts: BlobPart[] = []
	private readonly encoder = new TextEncoder()
	/** Byte offset of every object, indexed by object number. */
	private readonly offsets: number[] = []
	private readonly pageIds: number[] = []
	private length = 0

	constructor() {
		// The comment made of non ASCII bytes marks the file as binary.
		this.write('%PDF-1.4\n%âãÏÓ\n')
	}

	get pageCount(): number {
		return this.pageIds.length
	}

	/**
	 * @param width - Width of the page in points
	 * @param height - Height of the page in points
	 * @param jpeg - Image covering the page
	 * @param pixels - Size of the image in pixels
	 * @param pixels.width - Width of the image
	 * @param pixels.height - Height of the image
	 */
	addPage(width: number, height: number, jpeg: Blob, pixels: { width: number, height: number }): void {
		const imageId = this.offsets.length || PAGES_ID + 1
		const contentId = imageId + 1
		const pageId = imageId + 2
		const content = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`

		this.startObject(imageId, `<< /Type /XObject /Subtype /Image /Width ${pixels.width} /Height ${pixels.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.size} >>\nstream\n`)
		this.write(jpeg)
		this.write('\nendstream\nendobj\n')
		this.startObject(contentId, `<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`)
		this.startObject(pageId, `<< /Type /Page /Parent ${PAGES_ID} 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`)
		this.pageIds.push(pageId)
	}

	/**
	 * Write the page tree and the cross-reference table.
	 *
	 * @return The finished document
	 */
	finish(): Blob {
		this.startObject(CATALOG_ID, `<< /Type /Catalog /Pages ${PAGES_ID} 0 R >>\nendobj\n`)
		this.startObject(PAGES_ID, `<< /Type /Pages /Count ${this.pageIds.length} /Kids [${this.pageIds.map((id) => `${id} 0 R`).join(' ')}] >>\nendobj\n`)

		const size = Math.max(this.offsets.length, PAGES_ID + 1)
		const xrefOffset = this.length
		const entries = Array.from({ length: size - 1 }, (_, index) => `${String(this.offsets[index + 1]).padStart(10, '0')} 00000 n \n`)
		this.write(`xref\n0 ${size}\n0000000000 65535 f \n${entries.join('')}trailer\n<< /Size ${size} /Root ${CATALOG_ID} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`)

		return new Blob(this.parts, { type: 'application/pdf' })
	}

	private startObject(id: number, body: string): void {
		this.offsets[id] = this.length
		this.write(`${id} 0 obj\n${body}`)
	}

	private write(part: string | Blob): void {
		const data = typeof part === 'string' ? this.encoder.encode(part) : part
		this.parts.push(data)
		this.length += data instanceof Blob ? data.size : data.byteLength
	}
}

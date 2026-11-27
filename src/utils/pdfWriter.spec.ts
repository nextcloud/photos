/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { PdfWriter } from './pdfWriter.ts'

/**
 * @param pages - Number of pages of the document
 * @return The document, every byte as one character
 */
async function writeDocument(pages: number): Promise<string> {
	const writer = new PdfWriter()
	for (let page = 0; page < pages; page++) {
		// Not a real image, bytes above 127 make sure offsets are counted in bytes.
		const jpeg = new Blob([new Uint8Array([0xFF, 0xD8, 0xFF, page, 0xFF, 0xD9])])
		writer.addPage(595.28, 841.89, jpeg, { width: 1240, height: 1754 })
	}
	expect(writer.pageCount).toBe(pages)

	const bytes = new Uint8Array(await writer.finish().arrayBuffer())
	return Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
}

describe('PdfWriter', () => {
	it('writes one page object per page and lists them in the page tree', async () => {
		const pdf = await writeDocument(3)

		expect(pdf.startsWith('%PDF-1.4\n')).toBe(true)
		expect(pdf.endsWith('%%EOF\n')).toBe(true)
		expect(pdf.match(/\/Type \/Page\b/g)).toHaveLength(3)
		expect(pdf).toContain('/Type /Pages /Count 3 /Kids [5 0 R 8 0 R 11 0 R]')
		expect(pdf).toContain('/MediaBox [0 0 595.28 841.89]')
		expect(pdf).toContain('/Width 1240 /Height 1754')
		expect(pdf).toContain('/Filter /DCTDecode /Length 6 >>\nstream\n\xFF\xD8\xFF\x02\xFF\xD9\nendstream')
	})

	it('points the cross-reference table at every object', async () => {
		const pdf = await writeDocument(2)

		const xrefOffset = Number(pdf.match(/startxref\n(\d+)\n%%EOF\n$/)![1])
		const xref = pdf.slice(xrefOffset)
		expect(xref.startsWith('xref\n0 9\n0000000000 65535 f \n')).toBe(true)
		expect(xref).toContain('trailer\n<< /Size 9 /Root 1 0 R >>')

		const offsets = [...xref.matchAll(/^(\d{10}) 00000 n $/gm)].map((match) => Number(match[1]))
		expect(offsets).toHaveLength(8)
		offsets.forEach((offset, index) => {
			expect(pdf.slice(offset).startsWith(`${index + 1} 0 obj\n`)).toBe(true)
		})
	})

	it('writes a valid empty document', async () => {
		const pdf = await writeDocument(0)

		expect(pdf).toContain('/Type /Pages /Count 0 /Kids []')
		expect(pdf).toContain('xref\n0 3\n')
	})
})

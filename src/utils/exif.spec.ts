/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { getExifSummary, getPhotoLocation, parseCoordinate } from './exif.ts'

/**
 * @param exif - Entries of the EXIF IFD
 * @param ifd0 - Entries of the IFD0
 * @return The summary as a label to value record
 */
function summarize(exif: Record<string, unknown> = {}, ifd0: Record<string, unknown> = {}): Record<string, string> {
	return Object.fromEntries(getExifSummary({ exif, ifd0 }).map((entry) => [entry.label, entry.value]))
}

describe('getExifSummary', () => {
	test('returns nothing without metadata', () => {
		expect(getExifSummary({ exif: {}, ifd0: {} })).toEqual([])
	})

	test('leaves out the entries which cannot be read', () => {
		expect(summarize({ FNumber: 'not a number', ISOSpeedRatings: 400 })).toEqual({ ISO: '400' })
	})

	test('reads the rational numbers of the EXIF standard', () => {
		expect(summarize({ FNumber: '28/10', FocalLength: '500/10' })).toEqual({
			Aperture: 'ƒ/2.8',
			'Focal length': '50 mm',
		})
	})

	test('reads plain numbers as well', () => {
		expect(summarize({ FNumber: 1.8 })).toEqual({ Aperture: 'ƒ/1.8' })
	})

	test('writes short exposures as a fraction of a second', () => {
		expect(summarize({ ExposureTime: '1/125' })).toEqual({ Exposure: '1/125 s' })
		expect(summarize({ ExposureTime: '5/1' })).toEqual({ Exposure: '5 s' })
	})

	test('joins the camera manufacturer and model', () => {
		expect(summarize({}, { Make: 'Canon ', Model: ' EOS 5D' })).toEqual({ Camera: 'Canon EOS 5D' })
	})

	test('does not repeat a manufacturer already carried by the model', () => {
		expect(summarize({}, { Make: 'NIKON CORPORATION', Model: 'NIKON CORPORATION D750' }))
			.toEqual({ Camera: 'NIKON CORPORATION D750' })
	})

	test('takes the first sensitivity of cameras reporting several', () => {
		expect(summarize({ ISOSpeedRatings: [800, 800] })).toEqual({ ISO: '800' })
	})
})

describe('getPhotoLocation', () => {
	test('reads the coordinates written as strings over DAV', () => {
		expect(getPhotoLocation({ latitude: '43.739255555556', longitude: '5.31345', altitude: '202.33' }))
			.toEqual({ latitude: 43.739255555556, longitude: 5.31345 })
	})

	test('returns nothing for a photo without position', () => {
		expect(getPhotoLocation(undefined)).toBeNull()
		expect(getPhotoLocation({})).toBeNull()
	})

	test('returns nothing when only one coordinate can be read', () => {
		expect(getPhotoLocation({ latitude: '43.7' })).toBeNull()
		expect(getPhotoLocation({ latitude: '43.7', longitude: 'east' })).toBeNull()
	})
})

describe('parseCoordinate', () => {
	test('reads decimal degrees, spaces included', () => {
		expect(parseCoordinate(' -5.31 ', 180)).toBe(-5.31)
		expect(parseCoordinate(0, 90)).toBe(0)
	})

	test('refuses what is not a coordinate', () => {
		expect(parseCoordinate('', 90)).toBeNull()
		expect(parseCoordinate('   ', 90)).toBeNull()
		expect(parseCoordinate('north', 90)).toBeNull()
		expect(parseCoordinate(undefined, 90)).toBeNull()
	})

	test('refuses coordinates which are off world', () => {
		expect(parseCoordinate('90.1', 90)).toBeNull()
		expect(parseCoordinate('-180.1', 180)).toBeNull()
	})
})

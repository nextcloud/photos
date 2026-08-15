/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate as t } from '@nextcloud/l10n'

/**
 * Raw EXIF metadata of a photo. Entries are only sanitized server side, their
 * presence and their type depend on what the camera wrote in the file.
 */
export type PhotoExif = {
	/** The EXIF IFD, holding the shooting settings. */
	exif: Record<string, unknown>
	/** The IFD0, holding the camera description. */
	ifd0: Record<string, unknown>
	/** The GPS IFD, already converted to decimal degrees server side. */
	gps?: {
		latitude?: string
		longitude?: string
		altitude?: string
	}
	/** Name of the place the coordinates were resolved to, when enabled. */
	place?: string
}

/** Position a photo was taken at, in decimal degrees. */
export type PhotoLocation = {
	latitude: number
	longitude: number
}

/** Maximum absolute value of a coordinate, in degrees. */
export const COORDINATE_LIMITS = {
	latitude: 90,
	longitude: 180,
} as const

/**
 * Read a coordinate written as decimal degrees.
 *
 * @param value - Coordinate to read
 * @param limit - Absolute maximum of the coordinate, in degrees
 * @return The coordinate, `null` when it is empty, not a number or off world
 */
export function parseCoordinate(value: unknown, limit: number): number | null {
	if (typeof value !== 'string' && typeof value !== 'number') {
		return null
	}

	const coordinate = typeof value === 'number' ? value : Number(value.trim())
	if (String(value).trim() === '' || !Number.isFinite(coordinate) || Math.abs(coordinate) > limit) {
		return null
	}

	return coordinate
}

/**
 * Read the coordinates of a photo. They are transported as strings over DAV
 * and are absent from photos which carry no position.
 *
 * @param gps - Raw GPS metadata of the photo
 * @return The position of the photo, `null` when it has none
 */
export function getPhotoLocation(gps: PhotoExif['gps']): PhotoLocation | null {
	const latitude = parseCoordinate(gps?.latitude, COORDINATE_LIMITS.latitude)
	const longitude = parseCoordinate(gps?.longitude, COORDINATE_LIMITS.longitude)

	if (latitude === null || longitude === null) {
		return null
	}

	return { latitude, longitude }
}

export type ExifEntry = {
	/** Translated name of the entry. */
	label: string
	/** Value of the entry, ready to be displayed. */
	value: string
}

/**
 * Summarize the shooting settings of a photo. EXIF metadata is optional and
 * often partial, so entries which cannot be read are left out and the returned
 * list can be empty.
 *
 * @param metadata - Raw metadata of the photo
 * @return The entries to display, in reading order
 */
export function getExifSummary(metadata: PhotoExif): ExifEntry[] {
	const { exif, ifd0 } = metadata

	return [
		{ label: t('photos', 'Camera'), value: formatCamera(ifd0.Make, ifd0.Model) },
		{ label: t('photos', 'Aperture'), value: formatAperture(exif.FNumber) },
		{ label: t('photos', 'Focal length'), value: formatFocalLength(exif.FocalLength) },
		{ label: t('photos', 'Exposure'), value: formatExposureTime(exif.ExposureTime) },
		{ label: t('photos', 'ISO'), value: formatIsoSpeed(exif.ISOSpeedRatings) },
	].filter((entry) => entry.value !== '')
}

/**
 * Write a position as decimal degrees. Coordinates are stored with the full
 * precision of the camera, which is far below what a photo is worth showing.
 *
 * @param location - Position to display
 * @return The coordinates, rounded to about a meter
 */
export function formatCoordinates(location: PhotoLocation): string {
	const round = (coordinate: number) => Number(coordinate.toFixed(5))

	return `${round(location.latitude)}, ${round(location.longitude)}`
}

/**
 * EXIF stores most numbers as a `numerator/denominator` string.
 *
 * @param value - Raw value of an EXIF entry
 * @return The value as a number, `NaN` when it cannot be read
 */
function parseRational(value: unknown): number {
	if (typeof value === 'number') {
		return value
	}

	if (typeof value !== 'string') {
		return Number.NaN
	}

	const [numerator, denominator = '1'] = value.split('/')
	return Number(numerator) / Number(denominator)
}

/**
 * @param make - Manufacturer of the camera
 * @param model - Model of the camera
 */
function formatCamera(make: unknown, model: unknown): string {
	const parts = [make, model]
		.map((part) => (typeof part === 'string' ? part.trim() : ''))
		.filter((part) => part !== '')

	// The model often already carries the manufacturer name, repeating it would
	// give something like "NIKON CORPORATION NIKON D750".
	if (parts.length === 2 && parts[1].toLowerCase().startsWith(parts[0].toLowerCase())) {
		return parts[1]
	}

	return parts.join(' ')
}

/**
 * @param fNumber - Raw `FNumber` EXIF entry
 */
function formatAperture(fNumber: unknown): string {
	const aperture = parseRational(fNumber)
	if (!Number.isFinite(aperture) || aperture <= 0) {
		return ''
	}

	return `ƒ/${Number(aperture.toFixed(1))}`
}

/**
 * @param focalLength - Raw `FocalLength` EXIF entry
 */
function formatFocalLength(focalLength: unknown): string {
	const millimeters = parseRational(focalLength)
	if (!Number.isFinite(millimeters) || millimeters <= 0) {
		return ''
	}

	return t('photos', '{focalLength} mm', { focalLength: Math.round(millimeters) })
}

/**
 * @param exposureTime - Raw `ExposureTime` EXIF entry
 */
function formatExposureTime(exposureTime: unknown): string {
	const seconds = parseRational(exposureTime)
	if (!Number.isFinite(seconds) || seconds <= 0) {
		return ''
	}

	// Shutter speeds shorter than a second are written as a fraction.
	const duration = seconds < 1 ? `1/${Math.round(1 / seconds)}` : String(Number(seconds.toFixed(1)))
	return t('photos', '{exposureTime} s', { exposureTime: duration })
}

/**
 * @param isoSpeed - Raw `ISOSpeedRatings` EXIF entry, an array on cameras
 *   reporting several sensitivities
 */
function formatIsoSpeed(isoSpeed: unknown): string {
	const speed = parseRational(Array.isArray(isoSpeed) ? isoSpeed[0] : isoSpeed)
	if (!Number.isFinite(speed) || speed <= 0) {
		return ''
	}

	return String(Math.round(speed))
}

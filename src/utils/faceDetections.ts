/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { decode } from 'he'

/** Area of a photo covered by a face, as fractions of the photo's width and height. */
export type FaceBox = {
	x: number
	y: number
	width: number
	height: number
}

/** A face recognize detected in a photo, as exposed by its `nc:face-detections` property. */
export type FaceDetection = FaceBox & {
	id: number
	clusterId: number | null
	title: string | null
}

/** A named person shown on a photo. */
export type PersonInPhoto = {
	/** Name of the face, which is also the name of its collection. */
	name: string
	box: FaceBox
}

/** Room left around a face when cropping a photo onto it, relative to the face's size. */
const FACE_CROP_MARGIN = 1.4

/**
 * @param value - Value to check
 */
function isFraction(value: unknown): value is number {
	return typeof value === 'number' && value >= 0 && value <= 1
}

/**
 * @param value - Entry of the parsed property
 */
function isFaceDetection(value: unknown): value is FaceDetection {
	if (typeof value !== 'object' || value === null) {
		return false
	}
	const detection = value as Record<string, unknown>
	return typeof detection.id === 'number'
		&& (detection.clusterId === null || typeof detection.clusterId === 'number')
		&& (detection.title === null || typeof detection.title === 'string')
		&& isFraction(detection.x)
		&& isFraction(detection.y)
		&& isFraction(detection.width) && detection.width > 0
		&& isFraction(detection.height) && detection.height > 0
}

/**
 * Parse the `nc:face-detections` property of a file.
 *
 * @param raw - Raw property value, a JSON encoded list of detections
 * @return The well-formed detections, empty when the value cannot be read
 */
export function parseFaceDetections(raw: unknown): FaceDetection[] {
	if (typeof raw !== 'string' || raw === '') {
		return []
	}

	let parsed: unknown
	try {
		parsed = JSON.parse(decode(raw))
	} catch {
		return []
	}

	return Array.isArray(parsed) ? parsed.filter(isFaceDetection) : []
}

/**
 * List the named people among the faces detected in a photo.
 *
 * Faces which are not assigned to a cluster, or whose cluster has no name,
 * are left out. People are ordered from left to right, each listed once.
 *
 * @param detections - Faces detected in the photo
 */
export function getPeopleInPhoto(detections: FaceDetection[]): PersonInPhoto[] {
	const people = new Map<string, PersonInPhoto>()

	for (const detection of [...detections].sort((a, b) => a.x - b.x)) {
		const name = detection.title?.trim()
		if (!name || detection.clusterId === null || detection.clusterId < 0 || people.has(name)) {
			continue
		}
		const { x, y, width, height } = detection
		people.set(name, { name, box: { x, y, width, height } })
	}

	return [...people.values()]
}

/**
 * Inline style of a photo placed inside a fixed-size, overflow-hidden box
 * so that the box shows the given face, centered and without distortion.
 *
 * @param box - Area of the photo covered by the face
 */
export function getFaceCropStyle(box: FaceBox): Record<string, string> {
	const width = Math.max(100, 100 / (box.width * FACE_CROP_MARGIN))
	const centerX = (box.x + box.width / 2) * 100
	const centerY = (box.y + box.height / 2) * 100

	return {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: `${width}%`,
		maxWidth: 'none',
		transform: `translate(-${centerX}%, -${centerY}%)`,
	}
}

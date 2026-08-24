/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import he from 'he'

/**
 * A face as the recognize app lists it, carrying the photo standing for it.
 */
export type Face = Collection & {
	attributes: {
		'face-preview-image'?: string
	}
}

/**
 * Where the face sits in its cover photo, as fractions of the photo dimensions.
 */
export interface FaceCoverBox {
	x: number
	y: number
	width: number
	height: number
}

export interface FaceCover {
	fileid?: number
	detection?: FaceCoverBox
}

/**
 * The photo standing for a face, as the recognize app reports it.
 *
 * @param face - The face to read the cover of
 */
export function getFaceCover(face: Face): FaceCover {
	return JSON.parse(he.decode(face.attributes['face-preview-image'] || '{}'))
}

/**
 * Inline style zooming a cover photo toward the face detected on it.
 *
 * The image is assumed to sit inside a box of `--photos-face-width`.
 *
 * @param face - The face to zoom toward
 */
export function getFaceCoverStyle(face: Face): Record<string, never> | { transform: string, width: string, transformOrigin: string } {
	const { detection } = getFaceCover(face)
	if (!detection) {
		return {}
	}

	// Zoom into the picture so that the face fills the --photos-face-width box nicely
	// if the face is larger than the image, we don't zoom out (reason for the Math.max)
	const zoom = Math.max(1, (1 / detection.width) * 0.4)

	const horizontalCenterOfFace = (detection.x + detection.width / 2) * 100
	const verticalCenterOfFace = (detection.y + detection.height / 2) * 100

	return {
		// We assume that the image is inside a div with width: var(--photos-face-width)
		width: '100%',
		// we translate the image so that the center of the detected face is in the center of the --photos-face-width box
		// and add the zoom
		transform: `translate(calc( var(--photos-face-width)/2 - ${horizontalCenterOfFace}% ), calc( var(--photos-face-width)/2 - ${verticalCenterOfFace}% )) scale(${zoom})`,
		// this is necessary for the zoom to zoom toward the center of the face
		transformOrigin: `${horizontalCenterOfFace}% ${verticalCenterOfFace}%`,
	}
}

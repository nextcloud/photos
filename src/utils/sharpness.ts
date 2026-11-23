/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * How sharp a picture is, as the variance of its Laplacian: the Laplacian
 * answers edges, and a picture that is out of focus or shaken has few and soft
 * ones, so its answer barely varies.
 *
 * The number has no unit and depends on what the picture shows, so it only
 * ranks pictures of the same subject at the same size against each other.
 *
 * @param rgba - Pixels of the picture, four bytes each, row by row.
 * @param width - Width of the picture in pixels.
 * @param height - Height of the picture in pixels.
 * @return The variance, zero for a picture too small to have an inner pixel.
 */
export function laplacianVariance(rgba: ArrayLike<number>, width: number, height: number): number {
	if (width < 3 || height < 3) {
		return 0
	}

	const luma = new Float32Array(width * height)
	for (let pixel = 0; pixel < luma.length; pixel++) {
		const offset = pixel * 4
		luma[pixel] = 0.299 * rgba[offset] + 0.587 * rgba[offset + 1] + 0.114 * rgba[offset + 2]
	}

	let sum = 0
	let sumOfSquares = 0
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			const pixel = y * width + x
			const laplacian = luma[pixel - width] + luma[pixel + width] + luma[pixel - 1] + luma[pixel + 1] - 4 * luma[pixel]
			sum += laplacian
			sumOfSquares += laplacian * laplacian
		}
	}

	const count = (width - 2) * (height - 2)
	const mean = sum / count
	return sumOfSquares / count - mean * mean
}

/**
 * The position of the sharpest picture in a list of scores.
 *
 * @param scores - Sharpness of each picture, null where it could not be measured.
 * @return The index of the highest score, the first one on a tie, or -1 when
 * no picture was measured.
 */
export function indexOfSharpest(scores: Array<number | null>): number {
	let best = -1
	scores.forEach((score, index) => {
		if (score !== null && (best === -1 || score > (scores[best] as number))) {
			best = index
		}
	})
	return best
}

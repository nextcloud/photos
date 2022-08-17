/**
 * @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 *
 * @author Marcel Klehr <mklehr@gmx.net>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { mapGetters } from 'vuex'
import he from 'he'

export default {
	name: 'FaceCoverMixin',

	computed: {
		...mapGetters([
			'faces',
			'facesFiles',
			'files',
		]),
	},

	methods: {
		getFaceCover(faceName) {
		  return (this.facesFiles[faceName] || [])
			  .slice(0, 25)
			  .map(fileId => this.files[fileId])
			  .map(file => ({ ...file, faceDetections: JSON.parse(he.decode(file.faceDetections)) }))
			  // sort larges face first
			  .sort((a, b) =>
				  b.faceDetections.find(d => d.title === faceName).width
				  - a.faceDetections.find(d => d.title === faceName).width
			  )
			  // sort fewest face detections first
			  .sort((a, b) =>
				  a.faceDetections.length
				  - b.faceDetections.length
			  )[0]
		},

		getCoverStyle(faceName, baseWidth) {
			const cover = this.getFaceCover(faceName)
			if (!cover) {
				return {}
			}
			const detections = cover.faceDetections

			const detection = detections.find(detection => detection.title === faceName)
			const zoom = Math.max(1, (1 / detection.width) * 0.4)

			return {
				width: '100%',
				transform: `translate(calc( ${baseWidth / 2}px - ${(detection.x + detection.width / 2) * 100}% ), calc( ${baseWidth / 2}px - ${(detection.y + detection.height / 2) * 100}% )) scale(${zoom})`,
				transformOrigin: `${(detection.x + detection.width / 2) * 100}% ${(detection.y + detection.height / 2) * 100}%`,
			}
		},
	},
}

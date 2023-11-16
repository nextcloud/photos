<!--
  - @copyright Copyright (c) 2023 Louis Chemineau <louis@chmn.me>
  -
  - @author Louis Chemineau <louis@chmn.me>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<div class="photo-details-container">
		<div v-if="originalDateTime || (ifd0 && ifd0.ImageWidth && ifd0.ImageLength)" class="photo-detail photo-detail__file">
			<CalendarOutline />
			<span>
				<div v-if="originalDateTime">{{ t('photos', 'Taken on {date} at {time}', { date: takenDate, time: takenTime }) }}</div>
				<div class="photo-detail--secondary">{{ size }}<span v-if="ifd0 && (ifd0.ImageWidth && ifd0.ImageLength)"> ⸱ {{ pixelCount }} ⸱ {{ ifd0.ImageWidth }} x {{ ifd0.ImageLength }}</span></div>
			</span>
		</div>

		<div v-if="place" class="photo-detail photo-detail__gps">
			<div class="photo-detail__gps__title">
				<MapMarker /> {{ place }}
			</div>
			<LocationMap class="photo-detail__gps__map"
				:latitude="gps.latitude"
				:longitude="gps.longitude"
				:name="place" />
		</div>

		<div v-if="ifd0 && (ifd0.Make || ifd0.Model) || irisInfo.length !== 0" class="photo-detail photo-detail__camera">
			<CameraIris />
			<span>
				<div v-if="ifd0.Make || ifd0.Model">{{ ifd0.Make }} {{ ifd0.Model }}</div>
				<div v-if="irisInfo.length !== 0" class="photo-detail--secondary">{{ irisInfo }}</div>
			</span>
		</div>
	</div>
</template>

<script>
import CalendarOutline from 'vue-material-design-icons/CalendarOutline.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import CameraIris from 'vue-material-design-icons/CameraIris.vue'

import { translate as t } from '@nextcloud/l10n'
import { formatFileSize } from '@nextcloud/files'
import moment from '@nextcloud/moment'

import LocationMap from '../components/LocationMap.vue'

export default {
	name: 'PhotosTab',
	components: {
		CalendarOutline,
		MapMarker,
		CameraIris,
		LocationMap,
	},
	data() {
		return {
			fileInfo: null,
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			// The zoom level of the map in the messages list
			previewZoom: 13,
			// The zoom level of the map in the new openstreetmap tab upon
			// Opening the link
			linkZoom: 18,

			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}
	},
	computed: {
		/**
		 * @return {object}
		 */
		exif() {
			return this.fileInfo['metadata-photos-exif']
		},
		/**
		 * @return {object}
		 */
		ifd0() {
			return this.fileInfo['metadata-photos-ifd0']
		},
		/**
		 * @return {object}
		 */
		place() {
			return this.fileInfo['metadata-photos-place']
		},
		/**
		 * @return {object}
		 */
		gps() {
			const gps = this.fileInfo['metadata-photos-gps']
			if (!gps) {
				return undefined
			}

			return {
				latitude: Number.parseFloat(gps.latitude || 0),
				longitude: Number.parseFloat(gps.longitude || 0),
				altitude: Number.parseFloat(gps.altitude || 0),
			}
		},
		/**
		 * @return {object}
		 */
		originalDateTime() {
			return this.fileInfo['metadata-photos-original_date_time'] * 1000
		},
		/**
		 * @return {string}
		 */
		takenDate() {
			return moment(this.originalDateTime).format('ll')
		},
		/**
		 * @return {string}
		 */
		takenTime() {
			return moment(this.originalDateTime).format('LT')
		},
		/**
		 * @return {number}
		 */
		focal() {
			if (!this.exif) {
				return 0
			}

			const [a, b] = this.exif.FNumber.split('/')
			return a / b
		},
		/**
		 * @return {number}
		 */
		focalLength() {
			if (!this.exif) {
				return 0
			}

			const [a, b] = this.exif.FocalLength.split('/')
			return a / b
		},
		/**
		 * @return {string}
		 */
		size() {
			return formatFileSize(this.fileInfo.size)
		},
		/**
		 * @return {string}
		 */
		normalizedExposureTime() {
			if (!this.exif) {
				return 0
			}

			const [a, b] = this.exif.ExposureTime.split('/')
			return Math.round(b / a)
		},
		/**
		 * @return {string}
		 */
		irisInfo() {
			const info = []

			if (this.focal) {
				info.push(`ƒ/${this.focal}`)
			}
			if (this.normalizedExposureTime) {
				info.push(`1/${this.normalizedExposureTime}`)
			}
			if (this.focalLength) {
				info.push(`${this.focalLength}mm`)
			}
			if (this.exif && this.exif.ISOSpeedRatings) {
				info.push(`ISO${this.exif.ISOSpeedRatings}`)
			}

			return info.join(' ⸱ ')
		},
		/**
		 * @return {string}
		 */
		pixelCount() {
			let count = this.ifd0.ImageWidth * this.ifd0.ImageLength
			let round = 0

			while (count / 1000 > 1) {
				count /= 1000
				round++
			}

			const unit = ['', 'K', 'M']

			return `${Math.round(count)} ${unit[round]}P`
		},
	},
	methods: {
		/**
		 * Update current fileInfo and fetch new activities
		 *
		 * @param {object} fileInfo the current file FileInfo
		 */
		async update(fileInfo) {
			this.fileInfo = fileInfo
		},

		t,
	},
}
</script>

<style scoped lang="scss">
.photo-details-container {
	padding: 8px;

	.photo-detail {
		margin: 16px 0;
		display: flex;
		flex-direction: row;

		&--secondary {
			color: var(--color-text-lighter);
		}

		&__gps {
			flex-direction: column;

			&__title {
				display: flex;
			}

			&__map {
				display: flex;
			}
		}

		.material-design-icon {
			margin-right: 8px;
		}
	}
}
</style>

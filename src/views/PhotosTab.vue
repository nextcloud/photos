<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
			<LocationMap v-if="gps !== undefined"
				class="photo-detail__gps__map"
				:latitude="gps.latitude"
				:longitude="gps.longitude"
				:name="place" />
		</div>

		<div v-if="ifd0 && (ifd0.Make || ifd0.Model) || irisInfo.length !== 0"
			class="photo-detail photo-detail__camera">
			<CameraIris />
			<span>
				<div v-if="ifd0.Make || ifd0.Model">{{ ifd0.Make }} {{ ifd0.Model }}</div>
				<div v-if="irisInfo.length !== 0" class="photo-detail--secondary">{{ irisInfo }}
				</div>
			</span>
		</div>
	</div>
</template>

<script lang='ts'>
import CalendarOutline from 'vue-material-design-icons/CalendarOutline.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import CameraIris from 'vue-material-design-icons/CameraIris.vue'
import { defineComponent } from 'vue'

import { translate as t } from '@nextcloud/l10n'
import { formatFileSize } from '@nextcloud/files'
import moment from '@nextcloud/moment'

import LocationMap from '../components/LocationMap.vue'
import type { PhotoFile } from '../store/files'

export default defineComponent({
	name: 'PhotosTab',
	components: {
		CalendarOutline,
		MapMarker,
		CameraIris,
		LocationMap,
	},
	data() {
		return {
			fileInfo: null as PhotoFile|null,
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
		exif(): { FNumber: string, FocalLength: string, ExposureTime: string, ISOSpeedRatings: string } {
			return this.fileInfo['metadata-photos-exif']
		},
		ifd0(): { Make: string, Model: string, ImageWidth: number, ImageLength: number } {
			return this.fileInfo['metadata-photos-ifd0']
		},
		place(): string {
			return this.fileInfo['metadata-photos-place']
		},
		gps(): { latitude: number, longitude: number, altitude: number }|undefined {
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
		originalDateTime(): number {
			return this.fileInfo['metadata-photos-original_date_time'] * 1000
		},
		takenDate(): string {
			return moment(this.originalDateTime).format('ll')
		},
		takenTime(): string {
			return moment(this.originalDateTime).format('LT')
		},
		focal(): number {
			if (!this.exif?.FNumber) {
				return 0
			}

			const [a, b] = this.exif.FNumber.split('/')
			return Number.parseInt(a) / Number.parseInt(b)
		},
		focalLength(): number {
			if (!this.exif?.FocalLength) {
				return 0
			}

			const [a, b] = this.exif.FocalLength.split('/')
			return Number.parseInt(a) / Number.parseInt(b)
		},
		size(): string {
			return formatFileSize(this.fileInfo?.size as number)
		},
		normalizedExposureTime(): number {
			if (!this.exif?.ExposureTime) {
				return 0
			}

			const [a, b] = this.exif.ExposureTime.split('/')
			return Math.round(Number.parseInt(b) / Number.parseInt(a))
		},
		irisInfo(): string {
			const info = [] as string[]

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
		pixelCount(): string {
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
		 */
		async update(fileInfo: PhotoFile) {
			this.fileInfo = fileInfo
		},

		t,
	},
})
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

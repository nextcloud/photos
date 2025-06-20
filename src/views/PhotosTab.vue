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
				<MapMarkerOutline /> {{ place }}
			</div>
			<LocationMap
				v-if="gps !== undefined"
				class="photo-detail__gps__map"
				:latitude="gps.latitude"
				:longitude="gps.longitude"
				:name="place" />
		</div>

		<div
			v-if="ifd0 && (ifd0.Make || ifd0.Model) || irisInfo.length !== 0"
			class="photo-detail photo-detail__camera">
			<CameraIris />
			<span>
				<div v-if="ifd0?.Make || ifd0?.Model">{{ ifd0.Make }} {{ ifd0.Model }}</div>
				<div v-if="irisInfo.length !== 0" class="photo-detail--secondary">{{ irisInfo }}
				</div>
			</span>
		</div>
	</div>
</template>

<script lang='ts'>
import type { PhotoFile } from '../store/files.ts'

import { formatFileSize } from '@nextcloud/files'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { defineComponent } from 'vue'
import CalendarOutline from 'vue-material-design-icons/CalendarOutline.vue'
import CameraIris from 'vue-material-design-icons/CameraIris.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import LocationMap from '../components/LocationMap.vue'

type SideBarFile = PhotoFile & {
	attributes: {
		'metadata-photos-exif': { FNumber: string, FocalLength: string, ExposureTime: string, ISOSpeedRatings: string }
		'metadata-photos-ifd0': { Make: string, Model: string, ImageWidth: number, ImageLength: number }
		'metadata-photos-place': string
		'metadata-photos-gps': { latitude: string, longitude: string, altitude: string } | undefined
		'metadata-photos-original_date_time': number
	}
}

export default defineComponent({
	name: 'PhotosTab',
	components: {
		CalendarOutline,
		MapMarkerOutline,
		CameraIris,
		LocationMap,
	},

	data() {
		return {
			fileInfo: null as SideBarFile | null,
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
		exif() {
			return this.fileInfo?.attributes['metadata-photos-exif']
		},

		ifd0() {
			return this.fileInfo?.attributes['metadata-photos-ifd0']
		},

		place() {
			return this.fileInfo?.attributes['metadata-photos-place']
		},

		gps() {
			const gps = this.fileInfo?.attributes['metadata-photos-gps']
			if (!gps) {
				return undefined
			}

			return {
				latitude: Number.parseFloat(gps.latitude || '0'),
				longitude: Number.parseFloat(gps.longitude || '0'),
				altitude: Number.parseFloat(gps.altitude || '0'),
			}
		},

		originalDateTime() {
			return (this.fileInfo?.attributes['metadata-photos-original_date_time'] ?? 0) * 1000
		},

		takenDate() {
			return moment(this.originalDateTime).format('ll')
		},

		takenTime() {
			return moment(this.originalDateTime).format('LT')
		},

		focal() {
			if (!this.exif?.FNumber) {
				return 0
			}

			const [a, b] = this.exif.FNumber.split('/')
			return Number.parseInt(a) / Number.parseInt(b)
		},

		focalLength() {
			if (!this.exif?.FocalLength) {
				return 0
			}

			const [a, b] = this.exif.FocalLength.split('/')
			return Number.parseInt(a) / Number.parseInt(b)
		},

		size() {
			return formatFileSize(this.fileInfo?.size as number)
		},

		normalizedExposureTime() {
			if (!this.exif?.ExposureTime) {
				return 0
			}

			const [a, b] = this.exif.ExposureTime.split('/')
			return Math.round(Number.parseInt(b) / Number.parseInt(a))
		},

		irisInfo() {
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

		pixelCount() {
			if (this.ifd0 === undefined) {
				return undefined
			}

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
		 * @param fileInfo
		 */
		async update(fileInfo: SideBarFile) {
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
			margin-inline-end: 8px;
		}
	}
}
</style>

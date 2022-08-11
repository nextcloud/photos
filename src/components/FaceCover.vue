<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<router-link class="face-cover" :to="`/faces/${baseName}`">
		<div class="face-cover__crop-container">
			<img ref="image"
				class="face-cover__image"
				:src="coverUrl"
				:style="coverDimensions">
		</div>
		<div class="face-cover__details">
			<div class="face-cover__details__first-line">
				<h2 class="face-cover__details__name">
					{{ baseName }}
				</h2>
				<div class="album-cover__details__state" />
			</div>
			<div class="album-cover__details__second-line">
				{{ n('photos', '%n item', '%n items', facesFiles[baseName].length,) }}
			</div>
		</div>
	</router-link>
</template>

<script>
import he from 'he'
import { mapGetters } from 'vuex'

import { generateUrl } from '@nextcloud/router'
import cancelableRequest from '../utils/CancelableRequest.js'
import client from '../services/DavClient.js'
import { getCurrentUser } from '@nextcloud/auth'
import DavRequest from '../services/DavRequest.js'

export default {
	name: 'FaceCover',

	props: {
		baseName: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			cancelFacesRequest: () => { },
			cover: null,
		}
	},

	computed: {
		...mapGetters([
			'files',
			'faces',
			'facesFiles',
		]),

		/**
		 * @return {Face}
		 */
		face() {
			return this.faces[this.baseName]
		},

		/**
		 * @return {string}
		 */
		coverUrl() {
			if (!this.cover) {
				return ''
			}

			return generateUrl(`/core/preview?fileId=${this.cover.props.fileid}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		coverDimensions() {
			if (!this.cover) return {}
			const detections = JSON.parse(he.decode(this.cover.props['face-detections']))

			const detection = detections.find(detection => detection.faceName === this.face.basename)
			const zoom = Math.max(1, (1 / detection.width) * 0.4)

			return {
				width: '100%',
				transform: `translate(calc( 125px - ${(detection.x + detection.width / 2) * 100}% ), calc( 125px - ${(detection.y + detection.height / 2) * 100}% )) scale(${zoom})`,
				transformOrigin: `${(detection.x + detection.width / 2) * 100}% ${(detection.y + detection.height / 2) * 100}%`,
			}
		},
	},

	async beforeMount() {
		await this.fetchFiles()
	},

	beforeDestroy() {
		this.cancelFilesRequest('Changed view')
	},

	methods: {
		async fetchFiles() {
			const { request, cancel } = cancelableRequest(client.getDirectoryContents)
			this.cancelFilesRequest = cancel
			const { data: files } = await request(`/recognize/${getCurrentUser()?.uid}/faces/${this.face.basename}`, {
				details: true,
				data: DavRequest,
			})
			// eslint-disable-next-line
			console.log(files)
			const fileIdsToAdd = files.map(({ basename }) => basename.split('-', 2)[0])
			this.$store.commit('addFilesToFace', { faceName: this.face.basename, fileIdsToAdd })
			this.cover = files.find(file => JSON.parse(he.decode(file.props['face-detections'])).length === 1) || files[0]
		},
	},
}
</script>

<style lang="scss" scoped>
.face-cover {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: var(--border-radius);

	&__crop-container {
		overflow: hidden;
		width: 250px;
		height: 250px;
		border-radius: 250px;
		position: relative;
		background: var(--color-background-darker);
	}

	&:hover {
		background: var(--color-background-hover);
	}

	&__details {
		display: flex;
		flex-direction: column;

		&__first-line {
			display: flex;
		}

		&__second-line {
			display: flex;
			color: var(--color-text-lighter);
		}

		&__name {
			flex-grow: 1;
			margin: 0;
			font-weight: normal;
		}
	}
}
</style>

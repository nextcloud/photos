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
				<div class="album-cover__details__state">
					<Actions>
						<ActionButton :close-after-click="true"
							:title="t('photos', 'Rename this person')"
							:aria-label="t('photos', 'Rename this person')"
							@click="renameFaceCluster">
							<Pencil slot="icon" />
						</ActionButton>
						<ActionButton :close-after-click="true"
							:aria-label="t('photos', 'Remove this person')"
							:title="t('photos', 'Remove this person')"
							@click="deleteFaceCluster">
							<TrashCan slot="icon" />
						</ActionButton>
					</Actions>
				</div>
			</div>
			<div v-if="facesFiles[baseName]" class="album-cover__details__second-line">
				{{ n('photos', '%n item', '%n items', facesFiles[baseName].length,) }}
			</div>
		</div>
	</router-link>
</template>

<script>
import he from 'he'
import { mapGetters } from 'vuex'
import Pencil from 'vue-material-design-icons/Pencil'
import TrashCan from 'vue-material-design-icons/TrashCan'
import { Actions, ActionButton } from '@nextcloud/vue'
import { generateUrl } from '@nextcloud/router'
import { showError } from '@nextcloud/dialogs'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'

export default {
	name: 'FaceCover',

	components: {
		Actions,
		ActionButton,
		TrashCan,
		Pencil,
	},

	mixins: [
		FetchFacesMixin,
	],

	props: {
		baseName: {
			type: String,
			required: true,
		},
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

			return generateUrl(`/core/preview?fileId=${this.cover.fileid}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		cover() {
			return (this.facesFiles[this.face.basename] || [])
				.slice(0, 25)
				.map(fileId => this.files[fileId])
				.map(file => ({ ...file, faceDetections: JSON.parse(he.decode(file.faceDetections)) }))
			// sort larges face first
				.sort((a, b) =>
					b.faceDetections.find(d => d.faceName === this.face.basename).width
							- a.faceDetections.find(d => d.faceName === this.face.basename).width
				)
			// sort fewest face detections first
				.sort((a, b) =>
					a.faceDetections.length
							- b.faceDetections.length
				)[0]
		},

		coverDimensions() {
			if (!this.cover) return {}
			const detections = this.cover.faceDetections

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
			await this.fetchFaceContent(this.face.basename)
		},
		async deleteFaceCluster(e) {
			if (e) {
				e.preventDefault()
				e.stopImmediatePropagation()
			}
			try {
				this.$store.dispatch('deleteFace', { faceName: this.baseName })
			} catch (e) {
				showError('Failed to delete album "' + this.baseName + '"')
			}
		},
		async renameFaceCluster(e) {
			if (e) {
				e.preventDefault()
				e.stopImmediatePropagation()
			}
			try {
				this.$store.dispatch('deleteFace', { faceName: this.baseName })
			} catch (e) {
				showError('Failed to delete album "' + this.baseName + '"')
			}
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

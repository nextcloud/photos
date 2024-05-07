<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div :class="['face-cover', small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<img ref="image"
				class="face-cover__image"
				:src="coverUrl"
				:style="coverDimensions">
		</div>
		<div class="face-cover__details">
			<div v-if="!baseName.match(/^[0-9]+$/)" class="face-cover__details__first-line">
				<span class="face-cover__details__name">
					{{ baseName }}
				</span>
			</div>
			<div v-if="!small" class="face-cover__details__second-line">
				{{ n('photos', '%n photos', '%n photos', face.props['nbItems']) }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateUrl } from '@nextcloud/router'
import FetchFacesMixin from '../../mixins/FetchFacesMixin.js'
import FaceCoverMixin from '../../mixins/FaceCoverMixin.js'

export default {
	name: 'FaceCover',

	mixins: [
		FetchFacesMixin,
		FaceCoverMixin,
	],

	props: {
		baseName: {
			type: String,
			required: true,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			observer: null,
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

			return generateUrl(`/apps/photos/api/v1/preview/${this.cover.fileid}?x=${512}&y=${512}`)
		},

		cover() {
			return this.getFaceCover(this.face.basename)
		},

		coverDimensions() {
			if (!this.cover) return {}
			return this.getCoverStyle(this.face.basename)
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../mixins/FaceCover';
</style>

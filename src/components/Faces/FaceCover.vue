<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="face-cover" :class="[small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<img
				ref="image"
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
				{{ n('photos', '%n photos', '%n photos', face.attributes.nbItems) }}
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import type { Collection } from '../../services/collectionFetcher.js'

import { translatePlural as n } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { getFaceCover, getFaceCoverStyle } from '../../utils/faceCover.ts'

export default {
	name: 'FaceCover',

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

	computed: {
		faces() {
			return this.$store.state.faces.faces
		},

		face(): Collection {
			return this.faces[this.baseName]
		},

		cover() {
			return getFaceCover(this.face)
		},

		coverUrl(): string {
			if (!this.cover) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${this.cover.fileid}?x=${512}&y=${512}`)
		},

		coverDimensions() {
			if (!this.cover) {
				return {}
			}

			return getFaceCoverStyle(this.face)
		},
	},

	methods: {
		n,
	},
}
</script>

<style lang="scss" scoped>
@use '../../mixins/FaceCover';
</style>

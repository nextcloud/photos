<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div :class="['face-cover', small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<AccountOffIcon :size="128" :fill-color="colorMainBackground" />
		</div>
		<div class="face-cover__details">
			<div v-if="!small" class="face-cover__details__second-line">
				{{ n('photos', '%n unassigned photo', '%n unassigned photos', unassignedFilesCount) }}
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { translatePlural as n } from '@nextcloud/l10n'

import FetchFacesMixin from '../../mixins/FetchFacesMixin.js'
import FaceCoverMixin from '../../mixins/FaceCoverMixin.js'
import AccountOffIcon from 'vue-material-design-icons/AccountOff.vue'

export default {
	name: 'UnassignedFacesCover',

	components: { AccountOffIcon },

	mixins: [
		FetchFacesMixin,
		FaceCoverMixin,
	],

	props: {
		small: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		unassignedFilesCount() {
			return this.$store.state.faces.unassignedFilesCount
		},

		colorMainBackground() {
			return getComputedStyle(document.documentElement).getPropertyValue('--color-main-background')
		},
	},

	async mounted() {
		await this.fetchUnassignedFacesCount()
	},

	methods: {
		n,
	},
}
</script>

<style lang="scss" scoped>
@use '../../mixins/FaceCover';
</style>

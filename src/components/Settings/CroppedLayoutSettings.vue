<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcCheckboxRadioSwitch :checked="croppedLayout"
		type="switch"
		@update:checked="updateSetting">
		{{ t('photos', 'Enable squared photos view') }}
	</NcCheckboxRadioSwitch>
</template>

<script lang='ts'>
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

export default {
	name: 'CroppedLayoutSettings',

	components: {
		NcCheckboxRadioSwitch,
	},

	computed: {
		croppedLayout() {
			return this.$store.state.userConfig.croppedLayout
		},
	},

	methods: {
		updateSetting(value) {
			this.$store.dispatch('updateUserConfig', { key: 'croppedLayout', value })
		},
	},
}
</script>

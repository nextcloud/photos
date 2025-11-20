<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFormBox>
		<NcFormBoxSwitch
			:model-value="croppedLayout"
			:label="t('photos', 'Squared photos view')"
			@update:modelValue="updateSetting" />
	</NcFormBox>
</template>

<script lang='ts'>
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'

export default {
	name: 'CroppedLayoutSettings',

	components: {
		NcFormBoxSwitch,
		NcFormBox,
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

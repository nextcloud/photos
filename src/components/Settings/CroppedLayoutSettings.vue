<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcCheckboxRadioSwitch
		:model-value="croppedLayout"
		type="switch"
		@update:model-value="updateSetting">
		{{ t('photos', 'Enable squared photos view') }}
	</NcCheckboxRadioSwitch>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'

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

		t,
	},
}
</script>

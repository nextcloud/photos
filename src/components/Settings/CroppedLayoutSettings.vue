<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<NcCheckboxRadioSwitch :checked="croppedLayout"
		type="switch"
		@update:checked="updateSetting">
		{{ t('photos', 'Enable squared photos view') }}
	</NcCheckboxRadioSwitch>
</template>

<script>
import { NcCheckboxRadioSwitch } from '@nextcloud/vue'

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

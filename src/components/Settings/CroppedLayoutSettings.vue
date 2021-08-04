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
	<div class="section">
		<h2>{{ t('photos', 'View') }}</h2>
		<p>
			<input
				id="enable-cropped-layout"
				v-model="croppedLayout"
				type="checkbox"
				class="checkbox"
				@change="updateSetting('croppedLayout')">
			<label for="enable-cropped-layout">{{ t('photos', 'Enable squared photos view') }}</label>
		</p>
	</div>
</template>

<script>
import UserConfig from '../../mixins/UserConfig'

export default {
	name: 'CroppedLayoutSettings',

	mixins: [
		UserConfig,
	],
}
</script>

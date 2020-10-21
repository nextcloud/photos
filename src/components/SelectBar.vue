<!--
 - @copyright Copyright (c) 2020 Corentin Mors
 -
 - @license GNU AGPL version 3 or any later version
 -
 - @author Corentin Mors <medias@pixelswap.fr>
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
	<div class="select-bar">
		<div>{{ selectedFilesCount }} {{ t('photos', 'files are selected') }}</div>
		<div>
			<ActionButton @click="onClearFiles">
				{{ t('photos', 'Clear selection') }}
			</ActionButton>
		</div>
	</div>
</template>

<script>
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'

export default {
	name: 'SelectBar',

	components: {
		ActionButton,
	},

	props: {
		selectedFilesCount: {
			type: Number,
			required: true,
		},
	},

	methods: {
		onClearFiles() {
			this.$emit('clear-selected-files')
		},
	},

}
</script>

<style lang="scss" scoped>
.select-bar {
	width: 100%;
	background: var(--color-main-background);
	height: 40px;
	font-weight: bold;
	align-items: center;
	display: flex;
	padding-left: 44px;
	position: fixed;
	bottom: 0;
	z-index: 40;
	border-top: 1px solid #ededed;
}
</style>

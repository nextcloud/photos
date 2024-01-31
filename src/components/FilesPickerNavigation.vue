<!--
  - @copyright 2024 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
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
	<Fragment>
		<ul v-if="!isCollapsed">
			<li v-for="month in monthsList"
				:key="month"
				class="photos-picker__navigation__month"
				:class="{selected: targetMonth === month}">
				<NcButton type="tertiary"
					:aria-label="t('photos', 'Jump to {date}', { date: dateMonthAndYear(month) })"
					@click="$emit('update:target-month', month)">
					{{ dateMonthAndYear(month) }}
				</NcButton>
			</li>
		</ul>

		<NcSelect v-else
			:input-label="t('photos', 'Current month')"
			:aria-label-listbox="t('photos', 'Months')"
			:searchable="false"
			:clearable="false"
			:options="monthOptions"
			:value="targetMonthOption"
			@option:selected="option => $emit('update:target-month', option.id)" />
	</Fragment>
</template>

<script>
import { Fragment } from 'vue-frag'
import { NcButton, NcSelect } from '@nextcloud/vue'

export default {
	name: 'FilesPickerNavigation',

	components: {
		Fragment,
		NcButton,
		NcSelect,
	},

	props: {
		isCollapsed: {
			type: Boolean,
			default: false,
		},

		monthsList: {
			type: Array,
			default: () => [],
		},

		targetMonth: {
			type: String,
			default: null,
		},

		dateMonthAndYear: {
			type: Function,
			default: () => null,
		},
	},

	emits: [
		'update:target-month',
	],

	computed: {
		targetMonthOption() {
			return this.monthOptions.find(option => option.id === this.targetMonth)
		},

		monthOptions() {
			return this.monthsList.map(id => ({
				id,
				label: this.dateMonthAndYear(id),
			}))
		},
	},
}
</script>

<style lang="scss" scoped>
.photos-picker__navigation {
	&__month {
		margin: 4px 0;
	}
}
</style>

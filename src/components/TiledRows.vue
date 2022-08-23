<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
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

<template functional>
	<ul>
		<div v-for="row of props.rows"
			:key="row.key"
			class="tiled-row"
			:style="{height: `${row.height}px`}">
			<li v-for="item of row.items"
				:key="item.id"
				:style="{ width: item.ratio ? `${row.height * item.ratio}px` : '100%', height: `${row.height}px`}">
				<slot :row="row" :item="item" />
			</li>
		</div>
	</ul>
</template>
<style lang="scss" scoped>
.tiled-row {
	display: flex;
}
</style>

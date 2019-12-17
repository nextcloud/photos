<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @license GNU AGPL version 3 or any later version
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
	<!-- Folder content -->
	<transition-group
		class="photos-grid-row"
		role="grid"
		name="list"
		tag="div">
		<slot />
	</transition-group>
</template>

<script>
export default {
	name: 'GridRow',
}
</script>

<style scoped lang="scss">
.photos-grid-row {
	display: grid;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-bottom: 8px;
	grid-template-columns: repeat(10, 1fr);
	position: relative;
}

.list-move {
	transition: transform 2s;
}

// TODO: use mixins/GridSizes as soon as node-sass supports it
// needs node-sass 5.0 (with libsass 3.6)
// https://github.com/sass/node-sass/pull/2312
$previous: 0;
@each $size, $config in get('sizes') {
	$count: map-get($config, 'count');
	$marginTop: map-get($config, 'marginTop');
	$marginW: map-get($config, 'marginW');

	// if this is the last entry, only use min-width
	$rule: '(min-width: #{$previous}px) and (max-width: #{$size}px)';
	@if $size == 'max' {
		$rule: '(min-width: #{$previous}px)';
	}

	@media #{$rule} {
		.photos-grid-row {
			grid-template-columns: repeat($count, 1fr);
		}
	}
	$previous: $size;
}
</style>

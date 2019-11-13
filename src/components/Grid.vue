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
		class="photos-grid"
		role="grid"
		name="list"
		tag="div">
		<slot />
		<div key="footer" role="none" class="photos-grid__footer-spacer" />
	</transition-group>
</template>

<script>
export default {
	name: 'Grid',
}
</script>

<style scoped lang="scss">
.photos-grid {
	display: grid;
	align-items: center;
	justify-content: center;
	gap: 8px;
	grid-template-columns: repeat(10, 1fr);
	position: relative;

	// always put one more row of grid for the spacer
	&__footer-spacer {
		// always add one row, so placing it on the first
		// column will always add one more
		grid-column: 1;
		// same height as the width
		padding-bottom: 100%;
	}
}

.list-move {
	transition: transform var(--animation-quick);
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
		.photos-grid {
			padding: #{$marginTop}px #{$marginW}px #{$marginW}px #{$marginW}px;
			grid-template-columns: repeat($count, 1fr);
		}
	}
	$previous: $size;
}
</style>

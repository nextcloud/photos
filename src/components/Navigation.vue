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
	<div :class="{'photos-navigation--root': isRoot}" class="photos-navigation" role="toolbar">
		<Actions v-if="!isRoot" class="photos-navigation__back">
			<ActionButton
				icon="icon-confirm"
				@click="folderUp">
				{{ backToText }}
			</ActionButton>
		</Actions>
		<h2 class="photos-navigation__title">
			{{ name }}
		</h2>
	</div>
</template>

<script>
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
export default {
	name: 'Navigation',

	components: {
		ActionButton,
		Actions,
	},
	inheritAttrs: false,

	props: {
		basename: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
	},

	computed: {
		isRoot() {
			return this.filename === '/'
		},
		name() {
			if (this.isRoot) {
				return t('photos', 'Photos')
			}
			return this.basename
		},
		parentPath() {
			const path = this.filename.split('/')
			path.pop()
			const parent = path.join('/')
			return this.isRoot || parent.trim() === ''
				? '/'
				: path.join('/')
		},
		parentName() {
			return this.parentPath && this.parentPath.split('/').pop()
		},
		backToText() {
			if (this.parentPath === '/') {
				return t('photos', 'Back to home')
			}
			return t('photos', 'Back to {folder}', { folder: this.parentName })
		},
	},

	methods: {
		folderUp() {
			this.$router.push(this.parentPath)
		},
	},
}
</script>

<style lang="scss" scoped>
.icon-confirm {
	transform: rotate(180deg)
}

.photos-navigation {
	display: flex;
	position: absolute;
	height: 44px;
	align-items: center;
	&__title {
		margin: 0;
	}
}

// generate variants based on grid sizes
// TODO: use mixins/GridSizes as soon as node-sass supports it
// needs node-sass 5.0 (with libsass 3.6)
// https://github.com/sass/node-sass/pull/2312
$previous: 0;
@each $size, $config in get('sizes') {
	$marginTop: map-get($config, 'marginTop');
	$marginW: map-get($config, 'marginW');

	// if this is the last entry, only use min-width
	$rule: '(min-width: #{$previous}px) and (max-width: #{$size}px)';
	@if $size == 'max' {
		$rule: '(min-width: #{$previous}px)';
	}

	@media #{$rule} {
		.photos-navigation {
			// we space this with 2/3 margin top, 1/3 margin bottom
			top: ($marginTop - 44px) * 2 / 3;
			// padding-left: $marginW;
			@if $marginW >= 44px {
				&__back {
					margin: 0 (($marginW - 44px) / 2);
				}
			}
			&--root &__title {
				padding-left: #{$marginW}px;
			}
		}
	}
	$previous: $size;
}
</style>

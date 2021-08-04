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
		<Actions v-if="!isRoot && showActions" class="photos-navigation__share">
			<ActionButton
				icon="icon-shared"
				@click="showSidebar">
				{{ t('photos', 'Share this folder') }}
			</ActionButton>
		</Actions>
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
		showActions: {
			type: Boolean,
			default: false,
		},
		rootTitle: {
			type: String,
			default: t('photos', 'Photos'),
		},
	},

	computed: {
		isRoot() {
			return this.filename === '/'
		},
		name() {
			if (this.isRoot) {
				return this.rootTitle
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
				return t('photos', 'Back to {folder}', { folder: this.rootTitle })
			}
			return t('photos', 'Back to {folder}', { folder: this.parentName })
		},

		/**
		 * We do not want encoded slashes when browsing by folder
		 * so we generate a new valid route object, get the final url back
		 * decode it and use it as a direct string, which vue-router
		 * does not encode afterwards
		 *
		 * @return {string|object}
		 */
		to() {
			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.*)/i
			const path = regex.exec(this.parentPath)[1]

			// apply to current route
			const { name, params } = Object.assign({}, this.$route, {
				params: { path },
			})

			// return the full object as we don't care about
			// an empty path if this is route
			if (path === '') {
				return { name }
			}

			// returning a string prevent vue-router to encode it again
			return decodeURIComponent(this.$router.resolve({ name, params }).resolved.path)
		},
	},

	methods: {
		folderUp() {
			this.$router.push(this.to)
		},
		showSidebar() {
			OCA.Files.Sidebar.open(this.filename)

		},
	},
}
</script>

<style lang="scss" scoped>
@use 'sass:math';
@import '../mixins/GridSizes.scss';

.icon-confirm {
	transform: rotate(180deg)
}

.photos-navigation {
	display: flex;
	position: block;
	height: 44px;
	padding: 0 40px;
	align-items: center;
	max-width: 100%;
	&__title {
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__share {
		margin-left: 10px;
	}
	&__back,
	&__share {
		flex-grow: 0;
		flex-shrink: 0;
	}

	// Specific grid spacing
	@include grid-sizes using ($marginTop, $marginW) {
		// we space this with 2/3 margin top, 1/3 margin bottom
		margin-top: math.div($marginTop - 44px * 2, 3);

		@if $marginW >= 44px {
			&__back {
				margin: 0 math.div($marginW - 44px, 2);
			}
		}
		&--root &__title {
			padding-left: #{$marginW - 44}px;
		}
	}
}
</style>

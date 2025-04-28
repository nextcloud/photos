<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div :class="{'photos-navigation--root': isRoot}" class="photos-navigation" role="toolbar">
		<NcActions v-if="!isRoot" class="photos-navigation__back">
			<NcActionButton icon="icon-confirm"
				@click="folderUp">
				{{ backToText }}
			</NcActionButton>
		</NcActions>
		<h2 class="photos-navigation__title">
			{{ name }}
		</h2>
		<NcActions v-if="!isRoot && showActions" class="photos-navigation__share">
			<NcActionButton icon="icon-shared"
				@click="showSidebar">
				{{ t('photos', 'Share this folder') }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<script lang='ts'>
import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import { translate as t } from '@nextcloud/l10n'

export default {
	name: 'Navigation',

	components: {
		NcActions,
		NcActionButton,
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
		 */
		to(): string|object {
			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.*)/i
			const path = (regex.exec(this.parentPath) as string[])[1]

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
			return decodeURIComponent(this.$router.resolve({ name: name ?? undefined, params }).resolved.path)
		},
	},

	methods: {
		folderUp() {
			this.$router.push(this.to)
		},
		showSidebar() {
			window.OCA.Files.Sidebar.open(this.filename)

		},

		t,
	},
}
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '../mixins/GridSizes';

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

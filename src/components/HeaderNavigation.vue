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
		<!-- Back navigation button -->
		<NcButton v-if="!isRoot"
			class="photos-navigation__back"
			type="tertiary"
			@click="folderUp">
			<template #icon>
				<ArrowLeft :size="20" />
			</template>
		</NcButton>

		<!-- Main Navigation title -->
		<div class="photos-navigation__title">
			<h2 class="photos-navigation__title__main" @click="refresh">
				{{ name }}
			</h2>
			<div class="photos-navigation__title__sub" />
			<slot name="subtitle" />
		</div>

		<!-- Main slot -->
		<div v-if="$slots.default" class="photos-navigation__content">
			<slot />
		</div>

		<NcLoadingIcon v-show="loading" class="photos-navigation__loader" />

		<div class="photos-navigation__content-right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

import { NcButton, NcLoadingIcon } from '@nextcloud/vue'

export default {
	name: 'HeaderNavigation',

	components: {
		ArrowLeft,
		NcButton,
		NcLoadingIcon,
	},

	inheritAttrs: false,

	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		path: {
			type: String,
			default: '/',
		},
		title: {
			type: String,
			required: true,
		},
		rootTitle: {
			type: String,
			default: t('photos', 'Photos'),
		},
		// The route params
		params: {
			type: Object,
			default: null,
		},
	},

	computed: {
		isRoot() {
			const isRoot = this.path === '/'
			this.toggleNavigationButton(!isRoot)
			return isRoot
		},

		name() {
			if (this.isRoot) {
				return this.rootTitle
			}
			return this.title
		},

		parentPath() {
			const path = this.path.split('/')
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
				params: this.params || { path },
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

		refresh() {
			this.$emit('refresh')
		},

		toggleNavigationButton(hide) {
			// Hide the navigation toggle if the back button is shown
			const navigationToggle = document.querySelector('button.app-navigation-toggle')
			if (navigationToggle !== null) {
				navigationToggle.style.display = hide ? 'none' : null
			}
		},
	},
}
</script>

<style lang="scss">
:root {
	--photos-navigation-height: 64px;
	// header height - button size
	--photos-navigation-spacing: calc((var(--photos-navigation-height) - 44px) / 2);
}

// Properly position the navigation toggle button
button.app-navigation-toggle {
	// App-navigation have a 4px margin top
	top: 0 !important;
	right: calc(var(--photos-navigation-height) * -1) !important;
	margin: var(--photos-navigation-spacing) !important;
}

</style>

<style lang="scss" scoped>
.photos-navigation {
	position: sticky;
	z-index: 20;
	top: 0;
	display: flex;
	align-items: center;
	width: 100%;
	min-height: var(--photos-navigation-height);
	padding: 0 var(--photos-navigation-height);
	background: var(--color-main-background);

	&__back {
		// Above the navigation menu
		position: absolute !important;
		left: 0;
		margin: var(--photos-navigation-spacing) !important;
	}

	&__title {
		max-width: 50%;
		margin-right: calc(2 * var(--photos-navigation-spacing));
		display: flex;
		flex-direction: column;

		&__main {
			margin: 0;
			cursor: pointer;
		}

		&__main, &__sub {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}

	&__loader {
		margin-left: 32px;
	}

	&__content-right {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
	}
}

</style>

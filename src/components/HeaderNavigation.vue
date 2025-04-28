<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div :class="{'photos-navigation--root': isRoot}" class="photos-navigation" role="toolbar">
		<!-- Back navigation button -->
		<NcButton v-if="!isRoot"
			class="photos-navigation__back"
			:aria-label="t('photos', 'Go back')"
			type="tertiary"
			@click="folderUp">
			<template #icon>
				<ArrowLeft :size="20" />
			</template>
		</NcButton>

		<!-- Main Navigation title -->
		<div class="photos-navigation__title">
			<h1 class="photos-navigation__title__main" @click="refresh">
				{{ name }}
			</h1>
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

<script lang='ts'>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'
import { translate as t } from '@nextcloud/l10n'

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
		 */
		to(): string|object {
			// always remove first slash, the router
			// manage it automatically
			const regex = /^\/?(.*)/i
			const path = (regex.exec(this.parentPath) as string[])[1]

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
			return decodeURIComponent(this.$router.resolve({ name: name ?? undefined, params }).resolved.path)
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

		t,
	},
}
</script>

<style lang="scss" scoped>
.photos-navigation {
	position: sticky;
	z-index: 20;
	top: 0;
	display: flex;
	// We need to wrap on small devices for accessibility
	flex-wrap: wrap;
	gap: calc(2 * var(--app-navigation-padding));
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	// Ensure to not overlap with app navigation toggle
	padding-inline: calc(var(--default-clickable-area) + 2 * var(--app-navigation-padding)) var(--app-navigation-padding);
	// Align with app navigation toggle
	padding-block: var(--app-navigation-padding);
	background: var(--color-main-background);

	&__back {
		// Replaces the app navigation button
		position: absolute !important;
		left: var(--app-navigation-padding);
	}

	&__title {
		max-width: 45%;
		display: flex;
		flex-direction: column;

		&__main {
			cursor: pointer;
			font-weight: 700;
			font-size: 20px;
			line-height: 44px;
		}

		&__main, &__sub {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}

	&__loader {
		margin-inline-start: 32px;
	}

	&__content-right {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-inline-start: auto;
	}
}

</style>

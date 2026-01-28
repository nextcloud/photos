<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div :class="{ 'photos-navigation--root': isRoot }" class="photos-navigation" role="toolbar">
		<!-- Back navigation button -->
		<NcButton
			v-if="!isRoot"
			class="photos-navigation__back"
			:aria-label="t('photos', 'Go back')"
			variant="tertiary"
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
		<div class="photos-navigation__content">
			<div v-if="$slots.default" class="photos-navigation__content__left">
				<slot />
			</div>

			<NcLoadingIcon v-show="loading" class="photos-navigation__loader" />

			<div class="photos-navigation__content__right">
				<slot name="right" />
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

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
	},

	computed: {
		isRoot() {
			const isRoot = this.path === '/'
			return isRoot
		},

		name() {
			if (this.isRoot) {
				return this.rootTitle
			}
			return this.title
		},
	},

	methods: {
		folderUp() {
			this.$router.push(this.$route.path.split('/').slice(0, -1).join('/'))
		},

		refresh() {
			this.$emit('refresh')
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
	gap: calc(2 * var(--app-navigation-padding));
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	// Ensure to not overlap with app navigation toggle
	padding-inline: calc(var(--default-clickable-area) + 2 * var(--app-navigation-padding)) var(--app-navigation-padding);
	// Align with app navigation toggle
	padding-block: var(--app-navigation-padding);
	background: var(--color-main-background);

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

	&__content {
		display: flex;
		flex-grow: 1;
		// We need to wrap on small devices for accessibility
		flex-wrap: wrap;
		gap: 16px;

		&__left {
			display: flex;
			flex-grow: 1;
			align-items: center;
			gap: 16px;
			flex-wrap: wrap;
		}

		&__right {
			display: flex;
			flex-grow: 1;
			align-items: center;
			justify-content: flex-end;
			flex-wrap: wrap;
		}
	}
}
</style>

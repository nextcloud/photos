<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!--
		Next to a navigation header announcing the album name and its location,
		the hero is only there to be looked at. A standalone hero is the heading
		of the page instead, and is shown for an album without a cover as well.
	-->
	<header
		v-if="hasCover || standalone"
		class="album-hero"
		:class="{ 'album-hero--plain': !hasCover }"
		:aria-hidden="standalone ? undefined : 'true'">
		<!--
			The cover is a layer of its own so that the parallax moves the photo
			and the blurhash standing in for it while it loads together.
		-->
		<div v-if="hasCover" class="album-hero__cover" :style="coverStyle">
			<NcBlurHash
				v-if="blurhash !== undefined"
				class="album-hero__layer"
				:hash="blurhash" />

			<img
				v-if="!coverFailed"
				:key="coverSrc"
				class="album-hero__layer album-hero__photo"
				:class="{ 'album-hero__photo--visible': coverLoaded }"
				:src="coverSrc"
				alt=""
				decoding="async"
				fetchpriority="high"
				@load="coverLoaded = true"
				@error="coverFailed = true">
		</div>
		<div v-if="hasCover" class="album-hero__scrim" />
		<div class="album-hero__content">
			<component :is="standalone ? 'h1' : 'div'" class="album-hero__title">
				{{ title }}
			</component>
			<div v-if="subtitle !== ''" class="album-hero__subtitle">
				{{ subtitle }}
			</div>
		</div>
	</header>
</template>

<script lang="ts" setup>
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NcBlurHash from '@nextcloud/vue/components/NcBlurHash'

const props = withDefaults(defineProps<{
	/** File id of the cover photo, `-1` when the album has no photo yet. */
	coverFileId?: number
	/** Blurhash of the cover photo, shown until its preview is loaded. */
	blurhash?: string
	/** Address of the cover preview, for the pages that cannot use the default one. */
	coverUrl?: string
	/** Name of the album. */
	title: string
	/** Line shown below the title, hidden when empty. */
	subtitle?: string
	/** Whether the hero is the heading of the page rather than a decoration. */
	standalone?: boolean
}>(), {
	coverFileId: -1,
	blurhash: undefined,
	coverUrl: undefined,
	subtitle: '',
	standalone: false,
})

/** Longest distance the cover is moved by the parallax, in pixels. */
const MAX_PARALLAX_OFFSET = 60

/** Share of the scrolled distance the cover is moved by. */
const PARALLAX_RATIO = 0.35

/**
 * Width and height of the requested cover preview.
 *
 * The same size the photo grid asks for, so that the hero is painted from the
 * preview the album has already loaded rather than from one of its own.
 */
const COVER_PREVIEW_SIZE = 1024

const hasCover = computed<boolean>(() => props.coverFileId > 0)

const coverSrc = computed<string>(() => props.coverUrl ?? generateUrl(`/apps/photos/api/v1/preview/${props.coverFileId}?x=${COVER_PREVIEW_SIZE}&y=${COVER_PREVIEW_SIZE}`))

const coverLoaded = ref(false)

// Previews are generated on demand and can fail - for a file no provider
// handles, or one that cannot be read - which leaves the blurhash, or the plain
// background of the hero, as what the album is shown with.
const coverFailed = ref(false)

watch(coverSrc, () => {
	coverLoaded.value = false
	coverFailed.value = false
})

const parallaxOffset = ref(0)

// The cover is taller than the hero and sits on its bottom edge, so that moving
// it down never uncovers the top of the hero.
const coverStyle = computed(() => ({
	height: `calc(100% + ${MAX_PARALLAX_OFFSET}px)`,
	transform: `translateY(${parallaxOffset.value}px)`,
}))

// The album page scrolls inside the app content, the window itself never moves.
const scroller = document.getElementById('app-content-vue') ?? window

// The cover stays where it is for people who asked for less motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
	if (reducedMotion) {
		return
	}

	scroller.addEventListener('scroll', onScroll, { passive: true })
	onScroll()
})

onBeforeUnmount(() => scroller.removeEventListener('scroll', onScroll))

/**
 * Move the cover slower than the rest of the page, up to the extra height it
 * was given.
 */
function onScroll(): void {
	const scrollTop = scroller instanceof Window ? scroller.scrollY : scroller.scrollTop
	parallaxOffset.value = Math.min(MAX_PARALLAX_OFFSET, scrollTop * PARALLAX_RATIO)
}
</script>

<style lang="scss" scoped>
.album-hero {
	position: relative;
	height: 280px;
	margin-block-end: calc(var(--default-grid-baseline) * 4);
	overflow: hidden;
	border-end-start-radius: var(--border-radius-large);
	border-end-end-radius: var(--border-radius-large);
	background-color: var(--color-primary-element-light);
	color: #fff;

	// Without a cover there is nothing to read the text against, so the hero
	// shrinks to a plain heading in the colors of the page.
	&--plain {
		height: auto;
		padding-block: calc(var(--default-grid-baseline) * 8) calc(var(--default-grid-baseline) * 2);
		background-color: transparent;
		color: var(--color-main-text);

		.album-hero__content {
			position: static;
			margin-inline: calc(var(--default-grid-baseline) * 8);
			text-shadow: none;
		}
	}

	&__cover {
		position: absolute;
		inset-block-end: 0;
		inset-inline: 0;
	}

	&__layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__photo {
		opacity: 0;
		transition: opacity var(--animation-slow) ease-out;

		&--visible {
			opacity: 1;
		}
	}

	&__scrim {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.15) 40%, rgba(0, 0, 0, 0.65));
	}

	&__content {
		position: absolute;
		inset-block-end: calc(var(--default-grid-baseline) * 6);
		inset-inline: calc(var(--default-grid-baseline) * 8);
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	}

	&__title {
		margin: 0;
		font-size: 2rem;
		font-weight: bold;
		line-height: 1.1;
		overflow-wrap: anywhere;
	}

	&__subtitle {
		margin-block-start: 6px;
		opacity: 0.9;
	}

	@media only screen and (max-width: 512px) {
		height: 220px;

		&__content {
			inset-block-end: calc(var(--default-grid-baseline) * 4);
			inset-inline: calc(var(--default-grid-baseline) * 4);
		}

		&--plain {
			height: auto;
		}

		&--plain &__content {
			margin-inline: calc(var(--default-grid-baseline) * 4);
		}

		&__title {
			font-size: 1.6rem;
		}
	}
}
</style>

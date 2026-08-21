<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!--
		The album name and its location are already announced by the navigation
		header below, so the hero is only there to be looked at.
	-->
	<header v-if="hasCover" class="album-hero" aria-hidden="true">
		<!--
			The cover is a layer of its own so that the parallax moves the photo
			and the blurhash standing in for it while it loads together.
		-->
		<div class="album-hero__cover" :style="coverStyle">
			<NcBlurHash
				v-if="blurhash !== undefined"
				class="album-hero__layer"
				:hash="blurhash" />

			<img
				v-if="!coverFailed"
				:key="coverUrl"
				class="album-hero__layer album-hero__photo"
				:class="{ 'album-hero__photo--visible': coverLoaded }"
				:src="coverUrl"
				alt=""
				decoding="async"
				fetchpriority="high"
				@load="coverLoaded = true"
				@error="coverFailed = true">
		</div>
		<div class="album-hero__scrim" />
		<div class="album-hero__content">
			<div class="album-hero__title">
				{{ title }}
			</div>
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
	/** Name of the album. */
	title: string
	/** Line shown below the title, hidden when empty. */
	subtitle?: string
}>(), {
	coverFileId: -1,
	blurhash: undefined,
	subtitle: '',
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

const coverUrl = computed<string>(() => generateUrl(`/apps/photos/api/v1/preview/${props.coverFileId}?x=${COVER_PREVIEW_SIZE}&y=${COVER_PREVIEW_SIZE}`))

const coverLoaded = ref(false)

// Previews are generated on demand and can fail - for a file no provider
// handles, or one that cannot be read - which leaves the blurhash, or the plain
// background of the hero, as what the album is shown with.
const coverFailed = ref(false)

watch(coverUrl, () => {
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

onMounted(() => {
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
		font-size: 2rem;
		font-weight: bold;
		line-height: 1.1;
	}

	&__subtitle {
		margin-block-start: 6px;
		opacity: 0.9;
	}
}
</style>

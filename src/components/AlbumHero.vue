<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	A magazine-style hero header for the album page. Renders the album's
	cover photo (last-photo) as a full-bleed image with the album title
	and metadata overlaid on a darkening gradient. Light parallax: the
	image translates slower than the page on scroll via a passive
	scroll listener.

	Renders nothing when the album has no cover photo, so it's safe to
	drop above any album view unconditionally.
-->

<template>
	<header
		v-if="hasCover"
		ref="hero"
		class="album-hero"
		:style="{ backgroundImage: `url('${coverUrl}')` }">
		<div class="album-hero__scrim" />
		<div class="album-hero__content">
			<h1 class="album-hero__title">
				{{ title }}
			</h1>
			<div v-if="subtitle" class="album-hero__subtitle">
				{{ subtitle }}
			</div>
		</div>
	</header>
</template>

<script lang="ts">
import { generateUrl } from '@nextcloud/router'
import { defineComponent, markRaw } from 'vue'

export default defineComponent({
	name: 'AlbumHero',

	props: {
		// File ID of the cover photo. -1 / undefined means no cover.
		coverFileId: {
			type: [Number, String],
			default: -1,
		},

		title: {
			type: String,
			required: true,
		},

		subtitle: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			scrollOffset: 0,
			scrollListenerTarget: null as HTMLElement | Window | null,
			scrollListener: null as ((event: Event) => void) | null,
		}
	},

	computed: {
		hasCover(): boolean {
			const id = Number(this.coverFileId)
			return Number.isFinite(id) && id > 0
		},

		coverUrl(): string {
			return generateUrl(`/apps/photos/api/v1/preview/${this.coverFileId}?x=2048&y=1024`)
		},
	},

	watch: {
		scrollOffset(value: number) {
			const hero = this.$refs.hero as HTMLElement | undefined
			if (hero !== undefined) {
				hero.style.setProperty('--album-hero-parallax', `${value}px`)
			}
		},
	},

	mounted() {
		// Apply a tiny parallax transform on the cover image as the page
		// scrolls. We attach to the nearest #app-content-vue scroll
		// container if available (the standard NC layout), otherwise
		// fall back to the window.
		const target = (document.getElementById('app-content-vue') as HTMLElement | null) ?? window
		this.scrollListenerTarget = target
		const onScroll = () => {
			const top = target instanceof Window
				? target.scrollY
				: target.scrollTop
			// Cap the offset so the image doesn't drift too far. The
			// hero is ~280px tall; a 60px max keeps the parallax
			// subtle and avoids exposing background colour.
			this.scrollOffset = Math.min(60, top * 0.35)
		}
		this.scrollListener = markRaw(onScroll) as (event: Event) => void
		target.addEventListener('scroll', this.scrollListener, { passive: true })
		// Fire once so the initial state is correct on remount.
		onScroll()
	},

	beforeUnmount() {
		if (this.scrollListenerTarget !== null && this.scrollListener !== null) {
			this.scrollListenerTarget.removeEventListener('scroll', this.scrollListener)
		}
	},
})
</script>

<style lang="scss" scoped>
.album-hero {
	--album-hero-parallax: 0px;
	position: relative;
	height: 280px;
	margin: 0 0 16px 0;
	border-radius: 0 0 var(--border-radius-large) var(--border-radius-large);
	overflow: hidden;
	background-size: cover;
	background-position: center calc(50% + var(--album-hero-parallax));
	background-repeat: no-repeat;
	color: #fff;

	&__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.05) 0%,
			rgba(0, 0, 0, 0.15) 40%,
			rgba(0, 0, 0, 0.65) 100%
		);
	}

	&__content {
		position: absolute;
		left: 32px;
		right: 32px;
		bottom: 24px;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
	}

	&__title {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.1;
		margin: 0;
	}

	&__subtitle {
		margin-top: 6px;
		font-size: 1rem;
		opacity: 0.9;
	}
}
</style>

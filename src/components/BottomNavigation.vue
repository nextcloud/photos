<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<nav
		v-show="!modalOpen"
		class="bottom-navigation"
		:class="{ 'bottom-navigation--hidden': hidden }"
		:aria-label="t('photos', 'Quick navigation')"
		@focusin="hidden = false">
		<ul class="bottom-navigation__list">
			<li v-for="destination of destinations" :key="destination.routeName">
				<RouterLink
					v-slot="{ href, navigate }"
					:to="{ name: destination.routeName }"
					custom>
					<a
						class="bottom-navigation__entry"
						:class="{ 'bottom-navigation__entry--active': destination.routeName === activeDestination }"
						:href="href"
						:aria-current="destination.routeName === activeDestination ? 'page' : undefined"
						:data-id-bottom-nav-item="destination.routeName"
						@click="navigate">
						<component
							:is="destination.routeName === activeDestination ? destination.activeIcon : destination.icon"
							:size="20" />
						<span class="bottom-navigation__label">{{ destination.label }}</span>
					</a>
				</RouterLink>
			</li>
			<li>
				<button
					class="bottom-navigation__entry"
					type="button"
					aria-controls="app-navigation-vue"
					:aria-expanded="navigationOpen"
					data-id-bottom-nav-item="more"
					@click="toggleNavigation">
					<DotsHorizontal :size="20" />
					<span class="bottom-navigation__label">{{ t('photos', 'More') }}</span>
				</button>
			</li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { ScrollSample } from '../utils/bottomNavigation.ts'

import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'
import ImageIcon from 'vue-material-design-icons/Image.vue'
import ImageMultiple from 'vue-material-design-icons/ImageMultiple.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue'
import MapIcon from 'vue-material-design-icons/Map.vue'
import MapOutline from 'vue-material-design-icons/MapOutline.vue'
import TimelapseIcon from 'vue-material-design-icons/Timelapse.vue'
import { bottomNavigationDestinations, getActiveDestination, isHiddenAfterScroll } from '../utils/bottomNavigation.ts'

const presentation: Record<string, { label: string, icon: Component, activeIcon: Component }> = {
	all_media: { label: t('photos', 'All media'), icon: ImageOutline, activeIcon: ImageIcon },
	albums: { label: t('photos', 'Albums'), icon: ImageMultipleOutline, activeIcon: ImageMultiple },
	memories: { label: t('photos', 'Memories'), icon: TimelapseIcon, activeIcon: TimelapseIcon },
	map: { label: t('photos', 'Map'), icon: MapOutline, activeIcon: MapIcon },
}

const destinations = bottomNavigationDestinations.map((destination) => ({
	...destination,
	...presentation[destination.routeName],
}))

const route = useRoute()
const activeDestination = computed(() => getActiveDestination(route.name))

const hidden = ref(false)
const modalOpen = ref(false)
const navigationOpen = ref(false)

let lastTarget: EventTarget | null = null
let lastSample: ScrollSample | null = null

// Modals, like the viewer and the slideshow, are appended to the body.
const modalObserver = new MutationObserver(() => {
	modalOpen.value = document.querySelector('body > .modal-mask') !== null
})

watch(() => route.fullPath, () => {
	hidden.value = false
})

/**
 * Follow the scrolling of the app content. Scroll events do not bubble, so
 * they are captured on their way down to whichever element scrolls.
 *
 * @param event - The scroll event
 */
function onScroll(event: Event) {
	const target = event.target
	if (!(target instanceof Element) || target.closest('#app-content-vue') === null) {
		return
	}

	const sample = { top: target.scrollTop, time: event.timeStamp }
	if (target === lastTarget && lastSample !== null) {
		hidden.value = isHiddenAfterScroll(hidden.value, lastSample, sample)
	}
	lastTarget = target
	lastSample = sample
}

function onNavigationToggled({ open }: { open: boolean }) {
	navigationOpen.value = open
}

function toggleNavigation() {
	emit('toggle-navigation', { open: !navigationOpen.value })
}

onMounted(() => {
	window.addEventListener('scroll', onScroll, { capture: true, passive: true })
	modalObserver.observe(document.body, { childList: true })
	subscribe('navigation-toggled', onNavigationToggled)
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll, { capture: true })
	modalObserver.disconnect()
	unsubscribe('navigation-toggled', onNavigationToggled)
})
</script>

<style lang="scss" scoped>
.bottom-navigation {
	position: absolute;
	// Above the sticky headers of the content, below the app navigation.
	z-index: 1100;
	inset-inline: 0;
	bottom: 0;
	box-sizing: border-box;
	height: var(--photos-bottom-navigation-height);
	padding-bottom: env(safe-area-inset-bottom, 0px);
	border-top: 1px solid var(--color-border);
	background: var(--color-main-background);

	@media (prefers-reduced-motion: no-preference) {
		transition: transform var(--animation-quick) ease-out;
	}

	&--hidden {
		transform: translateY(100%);
	}

	&__list {
		display: flex;
		height: 100%;

		li {
			display: flex;
			flex: 1 1 0;
			min-width: 0;
		}
	}

	// Doubled to outweigh the default button styles of the server.
	& &__entry {
		display: flex;
		flex-direction: column;
		gap: 2px;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		flex: 1 1 0;
		min-width: 0;
		min-height: 44px;
		margin: 0;
		padding: 0 2px;
		border: none;
		border-radius: 0;
		background: none;
		color: var(--color-text-maxcontrast);
		font-size: var(--font-size-small, 13px);
		font-weight: normal;
		line-height: 1.2;

		&:focus-visible {
			outline: 2px solid var(--color-main-text);
			outline-offset: -2px;
			border-radius: var(--border-radius-element, var(--border-radius));
		}

		&--active {
			color: var(--color-primary-element);
			font-weight: bold;
		}
	}

	&__label {
		overflow: hidden;
		max-width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>

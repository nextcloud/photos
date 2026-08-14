<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-illustration" role="img" :aria-label="ariaLabel">
		<!-- Overlapping picture frames. -->
		<svg
			v-if="variant === 'memories'"
			class="photos-illustration__svg"
			viewBox="0 0 220 160"
			xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient
					:id="gradientId"
					x1="0"
					y1="0"
					x2="1"
					y2="1">
					<stop offset="0%" stop-color="var(--color-primary-element)" stop-opacity="0.85" />
					<stop offset="100%" stop-color="var(--color-primary-element)" stop-opacity="0.55" />
				</linearGradient>
			</defs>
			<rect
				x="20"
				y="40"
				width="80"
				height="80"
				rx="6"
				fill="var(--color-primary-element-light)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2"
				transform="rotate(-9 60 80)" />
			<rect
				x="70"
				y="32"
				width="84"
				height="84"
				rx="6"
				fill="var(--color-background-hover)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.55"
				stroke-width="2"
				transform="rotate(2 112 74)" />
			<rect
				x="120"
				y="46"
				width="80"
				height="80"
				rx="6"
				:fill="`url(#${gradientId})`"
				transform="rotate(11 160 86)" />
			<circle
				cx="160"
				cy="86"
				r="14"
				fill="var(--color-main-background)"
				opacity="0.9" />
			<circle
				cx="160"
				cy="86"
				r="6"
				fill="var(--color-primary-element)" />
		</svg>

		<!-- A stylised landmass with a marker pin. -->
		<svg
			v-else-if="variant === 'map'"
			class="photos-illustration__svg"
			viewBox="0 0 220 160"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M20 80 Q40 30 80 50 T140 60 Q180 40 200 80 T180 130 Q120 150 80 130 T20 80 Z"
				fill="var(--color-primary-element-light)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2" />
			<path
				d="M48 90 Q72 70 96 84 T148 92"
				fill="none"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.5"
				stroke-width="2"
				stroke-dasharray="4 5" />
			<g transform="translate(116 50)">
				<path
					d="M0 0 C0 -22 30 -22 30 0 C30 14 15 36 15 36 C15 36 0 14 0 0 Z"
					fill="var(--color-primary-element)" />
				<circle
					cx="15"
					cy="2"
					r="6"
					fill="var(--color-main-background)" />
			</g>
		</svg>

		<!-- Two portraits standing next to each other. -->
		<svg
			v-else-if="variant === 'faces'"
			class="photos-illustration__svg"
			viewBox="0 0 220 160"
			xmlns="http://www.w3.org/2000/svg">
			<circle
				cx="60"
				cy="86"
				r="42"
				fill="var(--color-primary-element-light)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2" />
			<circle
				cx="60"
				cy="76"
				r="14"
				fill="var(--color-primary-element)"
				opacity="0.65" />
			<path d="M30 110 Q60 138 90 110" fill="var(--color-primary-element)" opacity="0.45" />
			<circle
				cx="160"
				cy="80"
				r="48"
				fill="var(--color-background-hover)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.55"
				stroke-width="2" />
			<circle
				cx="160"
				cy="68"
				r="16"
				fill="var(--color-primary-element)"
				opacity="0.85" />
			<path d="M126 108 Q160 138 194 108" fill="var(--color-primary-element)" opacity="0.65" />
		</svg>

		<!-- Cards fanning down a timeline. -->
		<svg
			v-else
			class="photos-illustration__svg"
			viewBox="0 0 220 160"
			xmlns="http://www.w3.org/2000/svg">
			<line
				x1="44"
				y1="20"
				x2="44"
				y2="140"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2"
				stroke-dasharray="3 4" />
			<rect
				x="64"
				y="22"
				width="120"
				height="34"
				rx="6"
				fill="var(--color-primary-element-light)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2" />
			<rect
				x="76"
				y="68"
				width="120"
				height="34"
				rx="6"
				fill="var(--color-background-hover)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.55"
				stroke-width="2" />
			<rect
				x="64"
				y="114"
				width="120"
				height="34"
				rx="6"
				fill="var(--color-primary-element-light)"
				stroke="var(--color-primary-element)"
				stroke-opacity="0.35"
				stroke-width="2" />
			<circle
				cx="44"
				cy="39"
				r="6"
				fill="var(--color-primary-element)" />
			<circle
				cx="44"
				cy="85"
				r="6"
				fill="var(--color-primary-element)" />
			<circle
				cx="44"
				cy="131"
				r="6"
				fill="var(--color-primary-element)" />
		</svg>
	</div>
</template>

<script lang="ts">
export type EmptyIllustrationVariant = 'memories' | 'map' | 'faces' | 'timeline'

let gradientCount = 0

/**
 * Gradient ids have to be unique in the document, several illustrations can be
 * mounted at the same time.
 *
 * @return An id no other illustration uses
 */
function nextGradientId(): string {
	gradientCount += 1
	return `photos-illustration-gradient-${gradientCount}`
}
</script>

<script lang="ts" setup>
import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'

const props = defineProps<{
	/** Which illustration to draw. */
	variant: EmptyIllustrationVariant
}>()

const gradientId = nextGradientId()

// The illustration only repeats what the surrounding empty content already
// says, the label is a fallback for readers descending into the SVG.
const ariaLabel = computed<string>(() => ({
	memories: t('photos', 'Memories illustration'),
	map: t('photos', 'Map illustration'),
	faces: t('photos', 'Faces illustration'),
	timeline: t('photos', 'Photos illustration'),
}[props.variant]))
</script>

<style lang="scss" scoped>
.photos-illustration {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 220px;
	margin: 0 auto;

	&__svg {
		width: 100%;
		height: auto;
		transition: transform var(--animation-slow) ease-out;
	}

	&:hover &__svg {
		transform: translateY(-2px);
	}
}
</style>

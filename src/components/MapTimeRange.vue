<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<fieldset class="map-time-range">
		<legend class="hidden-visually">
			{{ t('photos', 'Time range of the photos shown on the map') }}
		</legend>
		<output class="map-time-range__label" aria-live="polite">
			{{ label }}
		</output>
		<div class="map-time-range__slider" :style="{ '--start': ratio(startValue), '--end': ratio(endValue) }">
			<div class="map-time-range__track" />
			<input
				class="map-time-range__input"
				:class="{ 'map-time-range__input--top': startOnTop }"
				type="range"
				:min="min"
				:max="max"
				:value="startValue"
				:aria-label="t('photos', 'Oldest month')"
				:aria-valuetext="formatMonthAndYear(fromMonthIndex(startValue))"
				@input="onStartInput">
			<input
				class="map-time-range__input"
				type="range"
				:min="min"
				:max="max"
				:value="endValue"
				:aria-label="t('photos', 'Newest month')"
				:aria-valuetext="formatMonthAndYear(fromMonthIndex(endValue))"
				@input="onEndInput">
		</div>
	</fieldset>
</template>

<script lang="ts" setup>
import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import { formatMonthAndYear } from '../utils/dateUtils.ts'
import { fromMonthIndex } from '../utils/mapTimeRange.ts'

/** Month index of the oldest selected month, `undefined` while it is the oldest one there is. */
const start = defineModel<number | undefined>('start')

/** Month index of the newest selected month, `undefined` while it is the newest one there is. */
const end = defineModel<number | undefined>('end')

const props = defineProps<{
	/** Month index of the oldest month that can be selected. */
	min: number
	/** Month index of the newest month that can be selected. */
	max: number
}>()

const startValue = computed(() => Math.max(props.min, Math.min(start.value ?? props.min, props.max)))
const endValue = computed(() => Math.max(startValue.value, Math.min(end.value ?? props.max, props.max)))

// Both handles can be on the same month, only the one on top can then be
// dragged, so it is the one which can still move towards the middle.
const startOnTop = computed(() => startValue.value === endValue.value && startValue.value > (props.min + props.max) / 2)

const label = computed(() => {
	const oldest = formatMonthAndYear(fromMonthIndex(startValue.value))
	if (startValue.value === endValue.value) {
		return oldest
	}

	return t('photos', '{oldest} – {newest}', { oldest, newest: formatMonthAndYear(fromMonthIndex(endValue.value)) })
})

/**
 * @param value - A month index
 * @return Its position on the slider, from 0 to 1
 */
function ratio(value: number): number {
	return props.max === props.min ? 0 : (value - props.min) / (props.max - props.min)
}

/**
 * @param event - The input event of the handle of the oldest month
 */
function onStartInput(event: Event): void {
	const input = event.target as HTMLInputElement
	const value = Math.min(Number(input.value), endValue.value)
	input.value = String(value)
	start.value = value === props.min ? undefined : value
}

/**
 * @param event - The input event of the handle of the newest month
 */
function onEndInput(event: Event): void {
	const input = event.target as HTMLInputElement
	const value = Math.max(Number(input.value), startValue.value)
	input.value = String(value)
	end.value = value === props.max ? undefined : value
}
</script>

<style lang="scss" scoped>
$thumb-size: 20px;

@mixin thumb {
	box-sizing: border-box;
	width: $thumb-size;
	height: $thumb-size;
	border: 2px solid var(--color-main-background);
	border-radius: 50%;
	background-color: var(--color-primary-element);
	box-shadow: 0 0 4px var(--color-box-shadow);
	cursor: pointer;
	pointer-events: auto;
}

.map-time-range {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 4);
	min-width: 0;
	margin: 0;
	border: none;
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 4);

	&__label {
		flex: 0 0 auto;
		min-width: 14em;
		font-variant-numeric: tabular-nums;
	}

	&__slider {
		position: relative;
		flex: 1 1 240px;
		height: var(--default-clickable-area);
		// Room for half a handle on both sides, so the handles stay within the slider.
		margin-inline: calc($thumb-size / 2);
	}

	&__track {
		position: absolute;
		top: 50%;
		inset-inline: 0;
		height: 4px;
		margin-top: -2px;
		border-radius: var(--border-radius-pill);
		background: var(--color-border-dark);

		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			inset-inline-start: calc(var(--start) * 100%);
			inset-inline-end: calc((1 - var(--end)) * 100%);
			border-radius: inherit;
			background: var(--color-primary-element);
		}
	}

	// Both handles are native range inputs laid on top of each other, only
	// their thumbs catching the pointer.
	&__input {
		position: absolute;
		inset-block: 0;
		inset-inline-start: calc($thumb-size / -2);
		width: calc(100% + $thumb-size);
		height: 100%;
		margin: 0;
		padding: 0;
		appearance: none;
		background: none;
		pointer-events: none;

		&--top {
			z-index: 1;
		}

		&::-webkit-slider-thumb {
			appearance: none;
			@include thumb;
		}

		&::-moz-range-thumb {
			@include thumb;
		}

		&::-moz-range-track {
			background: none;
		}

		&:focus-visible {
			outline: none;

			&::-webkit-slider-thumb {
				outline: 2px solid var(--color-main-text);
				outline-offset: 2px;
			}

			&::-moz-range-thumb {
				outline: 2px solid var(--color-main-text);
				outline-offset: 2px;
			}
		}
	}
}
</style>

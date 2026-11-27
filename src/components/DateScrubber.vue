<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Vertical date scrubber overlaid on the right edge of the timeline.
	Press anywhere on the track - or drag the thumb - to jump between month
	sections.

	Not an NcSlider: the thumb maps to a month, a categorical scale, rather
	than to a continuous numeric value.

	Only the months already fetched by the timeline are reachable; the track
	grows as the grid loads more content.
-->

<template>
	<div
		v-if="months.length > 1"
		class="date-scrubber"
		:class="{ 'date-scrubber--active': isActive, 'date-scrubber--dragging': isDragging }"
		@pointerenter="isHovered = true"
		@pointerleave="isHovered = false">
		<div
			ref="track"
			class="date-scrubber__track"
			@pointerdown="startDrag"
			@pointermove="onTrackHover"
			@pointerleave="hoverMonth = ''">
			<!-- One tick per month, width proportional to that month's photo
				count, so the track doubles as a histogram of where the
				library is dense. -->
			<span
				v-for="tick in monthTicks"
				:key="tick.month"
				class="date-scrubber__tick"
				:class="{ 'date-scrubber__tick--in-active-year': tick.year === activeYear }"
				:style="{
					top: `${tick.percent}%`,
					'--tick-density': tick.density,
				}" />

			<span
				v-for="label in yearLabels"
				:key="label.year"
				class="date-scrubber__year-label"
				:class="{ 'date-scrubber__year-label--active': label.year === activeYear }"
				:style="{ top: `${label.percent}%` }">
				{{ label.year }}
			</span>

			<!-- The month a press would jump to, next to the pointer. The thumb
				carries the bubble itself while it is dragged or focused. -->
			<span
				v-if="hoverMonth !== '' && !isDragging"
				class="date-scrubber__bubble"
				:style="{ top: `${percentAt(months.indexOf(hoverMonth))}%` }"
				aria-hidden="true">
				{{ formatMonthAndYear(hoverMonth) }}
			</span>

			<div
				class="date-scrubber__thumb"
				:style="{ top: `${thumbPercent}%` }"
				role="slider"
				:aria-label="t('photos', 'Jump to a month')"
				aria-orientation="vertical"
				:aria-valuemin="0"
				:aria-valuemax="100"
				:aria-valuenow="Math.round(thumbPercent)"
				:aria-valuetext="activeMonthLabel"
				tabindex="0"
				@pointerdown.stop="startDrag"
				@keydown="onThumbKey">
				<span class="date-scrubber__thumb__pill">
					<span class="date-scrubber__thumb__date" aria-hidden="true">{{ activeMonthLabel }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { formatMonthAndYear } from '../utils/dateUtils.ts'
import { monthDensities } from '../utils/monthDensity.ts'
import { yearLabels as thinnedYearLabels } from '../utils/yearLabels.ts'

interface MonthTick {
	month: string
	year: string
	percent: number
	density: number
}

const props = withDefaults(defineProps<{
	// Month sections in display order (newest first), e.g. ['202604', '202603', ...].
	months: string[]
	// The month currently scrolled into view, drives the thumb position.
	currentMonth?: string
	// Photo count per month, drives the width of the density ticks.
	// Months missing from the map render at the minimum tick width.
	monthCounts?: Record<string, number>
}>(), {
	currentMonth: '',
	monthCounts: () => ({}),
})

const emit = defineEmits<{
	jump: [month: string]
}>()

const track = useTemplateRef<HTMLDivElement>('track')

const isHovered = ref(false)
const isDragging = ref(false)
// While dragging, the thumb follows the pointer instead of
// `currentMonth`, so it does not bounce back between two jumps.
const dragMonth = ref('')
// The month under the pointer while it rests on the track.
const hoverMonth = ref('')
const trackHeight = ref(0)
// Smallest distance between two year labels, a bit more than their height.
const YEAR_LABEL_GAP = 24

const isActive = computed<boolean>(() => isHovered.value || isDragging.value)

const yearLabels = computed(() => thinnedYearLabels(props.months, trackHeight.value, YEAR_LABEL_GAP))

const activeMonth = computed<string>(() => {
	if (isDragging.value && dragMonth.value !== '') {
		return dragMonth.value
	}
	return props.currentMonth || props.months[0] || ''
})

const activeMonthLabel = computed<string>(() => {
	if (activeMonth.value === '') {
		return ''
	}
	return formatMonthAndYear(activeMonth.value)
})

const activeYear = computed<string>(() => activeMonth.value.substring(0, 4))

const thumbPercent = computed<number>(() => percentAt(props.months.indexOf(activeMonth.value)))

const monthTicks = computed<MonthTick[]>(() => {
	const densities = monthDensities(props.months, props.monthCounts)

	return props.months.map((month, index) => ({
		month,
		year: month.substring(0, 4),
		percent: percentAt(index),
		density: densities[index],
	}))
})

// Position of a month index along the track, in percent.
function percentAt(index: number): number {
	if (index <= 0 || props.months.length <= 1) {
		return 0
	}
	return (index / (props.months.length - 1)) * 100
}

// Closest month to a pointer position on the track.
function monthAtY(clientY: number): string | null {
	if (track.value === null || props.months.length === 0) {
		return null
	}
	const rect = track.value.getBoundingClientRect()
	const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
	return props.months[Math.round(ratio * (props.months.length - 1))] ?? null
}

// The track and the thumb share this handler, so press-and-drag works
// on a blank stretch of track too. Document listeners rather than
// setPointerCapture, as the capture can be dropped mid-drag.
function startDrag(event: PointerEvent) {
	isDragging.value = true
	jumpTo(monthAtY(event.clientY))

	document.addEventListener('pointermove', onPointerMove)
	document.addEventListener('pointerup', stopDrag)
	document.addEventListener('pointercancel', stopDrag)
}

function stopDrag() {
	isDragging.value = false
	dragMonth.value = ''

	document.removeEventListener('pointermove', onPointerMove)
	document.removeEventListener('pointerup', stopDrag)
	document.removeEventListener('pointercancel', stopDrag)
}

function onTrackHover(event: PointerEvent) {
	// A finger on the track drags, only a mouse or a pen hovers it.
	if (event.pointerType !== 'touch') {
		hoverMonth.value = monthAtY(event.clientY) ?? ''
	}
}

function onPointerMove(event: PointerEvent) {
	if (isDragging.value) {
		jumpTo(monthAtY(event.clientY))
	}
}

// Move the thumb and emit on every step of a drag, so the grid
// follows the pointer instead of waiting for the release.
function jumpTo(month: string | null) {
	if (month === null || month === dragMonth.value) {
		return
	}
	dragMonth.value = month
	emit('jump', month)
}

// Standard slider keyboard semantics: arrows step by one month,
// Home/End jump to the newest / oldest one.
function onThumbKey(event: KeyboardEvent) {
	const index = props.months.indexOf(activeMonth.value)
	let target: string | undefined
	switch (event.key) {
		case 'ArrowUp':
		case 'ArrowLeft':
			target = props.months[Math.max(0, index - 1)]
			break
		case 'ArrowDown':
		case 'ArrowRight':
			target = props.months[Math.min(props.months.length - 1, index + 1)]
			break
		case 'Home':
			target = props.months[0]
			break
		case 'End':
			target = props.months[props.months.length - 1]
			break
		default:
			return
	}

	event.preventDefault()
	if (target !== undefined && target !== activeMonth.value) {
		emit('jump', target)
	}
}

const trackObserver = new ResizeObserver(([entry]) => {
	trackHeight.value = entry.contentRect.height
})

// The track is only rendered once there are several months to scrub through.
watch(track, (element) => {
	trackObserver.disconnect()
	if (element !== null) {
		trackObserver.observe(element)
	}
})

onBeforeUnmount(() => {
	stopDrag()
	trackObserver.disconnect()
})
</script>

<style lang="scss" scoped>
// Idle the scrubber shows its track, the years along it and the thumb, quiet
// enough not to compete with the photos. Hovering, focusing or dragging it
// brings out the density ticks and the month bubble.
.date-scrubber {
	// Pinned to the viewport: the timeline scrolls in `#app-content-vue`, so a
	// box positioned against the grid would be as tall as the whole loaded
	// library and scroll out of view.
	position: fixed;
	inset-block: calc(var(--header-height, 50px) + var(--default-clickable-area) + 24px) 24px;
	inset-inline-end: 4px;
	width: 84px;
	z-index: 4;
	display: flex;
	align-items: stretch;
	pointer-events: none; // children opt back in

	// Hide on short viewports - too cramped to be useful.
	@media (max-height: 480px) {
		display: none;
	}

	&__track {
		position: relative;
		// Narrower than the scrubber itself: the year pills need the extra
		// width, but the grab area must not swallow clicks on the photos of
		// the rightmost column.
		width: 44px;
		margin-inline-start: auto;
		pointer-events: auto;
		cursor: pointer;
		// Without `touch-action: none` the browser swallows the vertical drag
		// as a page-scroll gesture before `pointermove` ever fires (mobile
		// and macOS trackpad two-finger scroll).
		touch-action: none;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			inset-inline-end: 12px;
			width: 4px;
			border-radius: var(--border-radius-pill);
			background: var(--color-border-maxcontrast);
			opacity: 0.6;
			transition: opacity var(--animation-slow) ease-out;
		}
	}

	// Density ticks, 4px wide for an empty month up to 22px for the densest
	// one, mapped from the `--tick-density` custom property bound per tick.
	&__tick {
		position: absolute;
		inset-inline-end: 8px;
		height: 2px;
		width: calc(4px + var(--tick-density, 0) * 18px);
		border-radius: 1px;
		background: color-mix(in srgb, var(--color-primary-element) 35%, transparent);
		transform: translateY(-50%);
		opacity: 0;
		transition: opacity var(--animation-slow) ease-out;
		pointer-events: none;

		&--in-active-year {
			background: color-mix(in srgb, var(--color-primary-element) 70%, transparent);
		}
	}

	&__year-label {
		position: absolute;
		inset-inline-end: 32px;
		transform: translateY(-50%);
		padding: 1px 7px;
		border-radius: var(--border-radius-pill);
		background: color-mix(in srgb, var(--color-main-background) 80%, transparent);
		backdrop-filter: blur(6px);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--color-text-maxcontrast);
		white-space: nowrap;
		pointer-events: none;
		transition: opacity var(--animation-slow) ease-out;

		// The timeline leaves the labels no room of their own on narrow
		// screens, where they only show while the scrubber is in use.
		@media (max-width: 1200px) {
			opacity: 0;
		}

		&--active {
			color: var(--color-primary-element);
			background: var(--color-main-background);
			font-weight: 700;
		}
	}

	&__thumb {
		position: absolute;
		inset-inline-end: 6px;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		pointer-events: auto;
		cursor: grab;
		// Same as the track: the drag must not be taken for a page scroll.
		touch-action: none;
		outline: none; // the pill carries the focus ring, it is the visible part

		&:active {
			cursor: grabbing;
		}

		&:focus-visible &__pill {
			outline: 2px solid var(--color-primary-element);
			outline-offset: 3px;
		}

		&__pill {
			display: inline-flex;
			align-items: center;
			justify-content: flex-end;
			height: 24px;
			min-width: 14px;
			border-radius: var(--border-radius-pill);
			background: var(--color-primary-element);
			color: var(--color-primary-element-text);
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
			overflow: hidden;
			transition:
				min-width var(--animation-slow) cubic-bezier(0.22, 1, 0.36, 1),
				padding var(--animation-slow) cubic-bezier(0.22, 1, 0.36, 1),
				box-shadow var(--animation-slow) ease-out;
		}

		&__date {
			display: inline-block;
			max-width: 0;
			overflow: hidden;
			white-space: nowrap;
			font-size: 12px;
			font-weight: 600;
			line-height: 1;
			opacity: 0;
			transition:
				max-width var(--animation-slow) cubic-bezier(0.22, 1, 0.36, 1),
				margin var(--animation-slow) cubic-bezier(0.22, 1, 0.36, 1),
				opacity var(--animation-quick) ease-out;
		}
	}

	// The month under the pointer, shaped like the bubble of the thumb.
	&__bubble {
		position: absolute;
		inset-inline-end: 32px;
		z-index: 1;
		transform: translateY(-50%);
		padding: 4px 12px;
		border-radius: var(--border-radius-pill);
		background: var(--color-main-background);
		box-shadow: 0 2px 8px var(--color-box-shadow);
		color: var(--color-main-text);
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		pointer-events: none;
	}

	&--active,
	&:hover,
	&:focus-within {
		.date-scrubber__track::before {
			opacity: 1;
		}

		.date-scrubber__tick,
		.date-scrubber__year-label {
			opacity: 1;
		}
	}

	&--dragging,
	&:has(.date-scrubber__thumb:focus-visible) {
		.date-scrubber__thumb__pill {
			min-width: 110px;
			padding-inline: 14px 12px;
			box-shadow:
				0 4px 14px rgba(0, 0, 0, 0.32),
				0 0 0 6px color-mix(in srgb, var(--color-primary-element) 22%, transparent);
		}

		.date-scrubber__thumb__date {
			max-width: 120px;
			margin-inline-end: 4px;
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		&__track::before,
		&__tick,
		&__year-label,
		&__thumb__pill,
		&__thumb__date {
			transition: none;
		}
	}
}
</style>

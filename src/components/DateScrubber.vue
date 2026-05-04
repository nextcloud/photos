<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Vertical date scrubber overlaid on the right edge of the timeline.
	Drag the thumb to jump between months; release lands on the
	corresponding section. iOS Photos / Google Photos / Memories all
	have a variant of this — it's the standard "navigate a 10k photo
	library in one gesture" affordance.

	Why a custom component rather than reusing NcSlider:
	- the thumb position needs to map to a month (a categorical scale),
	  not a continuous numeric value — NcSlider quantises the wrong way;
	- the year labels along the track need to be decimated based on
	  available height (one year label every ~60px) to avoid overlap;
	- the floating tooltip during drag is a Photos-specific affordance.

	Visibility: shown while hovered or actively scrubbing, otherwise
	fades out so it doesn't compete with the photos for attention.
	Hidden entirely on touch devices smaller than ~600px tall (we
	rely on browser scroll there — the scrubber needs vertical
	estate to be useful).
-->

<template>
	<div
		v-if="months.length > 1"
		class="date-scrubber"
		:class="{ 'date-scrubber--active': isActive }"
		@pointerenter="isHovered = true"
		@pointerleave="isHovered = false">
		<div
			ref="track"
			class="date-scrubber__track"
			@pointerdown="onTrackPointerDown">
			<!--
				Density tick marks — one per month. Tick width is
				proportional to the month's photo count so the
				scrubber doubles as a tiny histogram of where the
				user's library is dense. Months without any photos
				get the minimum-width tick so the spacing stays
				visually rhythmic.
			-->
			<span
				v-for="tick in monthTicks"
				:key="tick.month"
				class="date-scrubber__tick"
				:class="{ 'date-scrubber__tick--in-active-year': tick.year === activeYear }"
				:style="{
					top: `${tick.percent}%`,
					'--tick-density': tick.density,
				}" />

			<!-- Year labels: pill-shaped, frosted glass, decimated
				to fit the available height. -->
			<span
				v-for="label in yearLabels"
				:key="label.year"
				class="date-scrubber__year-label"
				:class="{ 'date-scrubber__year-label--active': label.year === activeYear }"
				:style="{ top: `${label.percent}%` }">
				{{ label.year }}
			</span>

			<!--
				Glassy capsule thumb. Inactive: a thin pill that just
				marks the position. Active (hovered or scrubbing):
				expands to show the month/year inline — the previous
				floating tooltip becomes part of the thumb so the
				user's eye doesn't have to dart between two surfaces.
			-->
			<div
				class="date-scrubber__thumb"
				:style="{ top: `${thumbPercent}%` }"
				role="slider"
				aria-orientation="vertical"
				:aria-valuemin="0"
				:aria-valuemax="100"
				:aria-valuenow="Math.round(thumbPercent)"
				:aria-valuetext="activeMonthLabel"
				tabindex="0"
				@pointerdown.stop="onThumbPointerDown"
				@keydown="onThumbKey">
				<span class="date-scrubber__thumb__pill">
					<span class="date-scrubber__thumb__date">{{ activeMonthLabel }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { translate as t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { defineComponent } from 'vue'

interface YearLabel {
	year: string
	percent: number
}

interface MonthTick {
	month: string
	year: string
	percent: number
	// 0..1 normalised photo count for this month, where 1.0 is the
	// densest month in the library. Drives the tick's width via a
	// CSS custom property so the renderer keeps everything visual
	// (no inline width calc needed).
	density: number
}

export default defineComponent({
	name: 'DateScrubber',

	props: {
		// Month sections in display order (newest first), e.g. ['202604', '202603', ...].
		months: {
			type: Array as PropType<string[]>,
			required: true,
		},

		// The month currently scrolled into view (drives thumb position).
		// Parent updates this from FilesListViewer's scroll state OR from
		// our own emitted `jump` events — we don't try to read scroll
		// directly because the viewer owns its scroll container.
		currentMonth: {
			type: String,
			default: '',
		},

		// Per-month photo counts. Optional — when present, drives the
		// density tick marks (longer tick = more photos that month).
		// When absent, every tick renders at the minimum width and
		// the scrubber falls back to a uniform-rhythm strip.
		monthCounts: {
			type: Object as PropType<Record<string, number>>,
			default: () => ({}),
		},
	},

	emits: ['jump'],

	data() {
		return {
			isHovered: false,
			isDragging: false,
			// Local override: while dragging, the thumb tracks the
			// pointer rather than `currentMonth`. We commit on release
			// (or on every move via a debounced emit) so the parent
			// doesn't bounce the thumb back.
			dragMonth: '' as string,
		}
	},

	computed: {
		isActive(): boolean {
			return this.isHovered || this.isDragging
		},

		// Year labels along the track. We decimate to roughly one
		// label per ~60px of track height so they don't overlap on
		// short windows. The decimation is computed against the months
		// list because we don't know the actual track height until
		// after mount; ~12 labels max keeps it readable.
		yearLabels(): YearLabel[] {
			const labels: YearLabel[] = []
			const seenYears = new Set<string>()
			const maxLabels = 12

			// Walk months newest-first. Whenever we hit a new year,
			// emit a label at the position of the FIRST month of that
			// year in the list — that's the visual anchor for that
			// year's photos.
			for (let i = 0; i < this.months.length; i++) {
				const month = this.months[i]
				const year = month.substring(0, 4)
				if (seenYears.has(year)) {
					continue
				}
				seenYears.add(year)
				labels.push({
					year,
					percent: this.months.length === 1 ? 0 : (i / (this.months.length - 1)) * 100,
				})
			}

			if (labels.length <= maxLabels) {
				return labels
			}
			// Decimate: keep first, last, and evenly-spaced labels in between.
			const stride = Math.ceil(labels.length / maxLabels)
			return labels.filter((_, idx) => idx === 0 || idx === labels.length - 1 || idx % stride === 0)
		},

		// Resolved month: either the drag target (while scrubbing) or
		// the parent-supplied currentMonth.
		activeMonth(): string {
			if (this.isDragging && this.dragMonth !== '') {
				return this.dragMonth
			}
			return this.currentMonth || this.months[0] || ''
		},

		activeMonthLabel(): string {
			if (this.activeMonth === '') {
				return ''
			}
			return moment(this.activeMonth, 'YYYYMM').format('MMMM YYYY')
		},

		thumbPercent(): number {
			if (this.months.length <= 1) {
				return 0
			}
			const idx = this.months.indexOf(this.activeMonth)
			if (idx < 0) {
				return 0
			}
			return (idx / (this.months.length - 1)) * 100
		},

		activeYear(): string {
			return this.activeMonth.substring(0, 4)
		},

		// One tick per month, with `density` normalised to 0..1
		// against the heaviest month. The visual maps that 0..1 to
		// a min..max tick width via a CSS custom property — small
		// for sparse months, longer for dense ones. Caps the spread
		// at the 95th percentile so a single bursty month doesn't
		// crush every other tick to the floor.
		monthTicks(): MonthTick[] {
			const total = this.months.length
			if (total === 0) {
				return []
			}

			// 95th-percentile-clamped max so heavy outliers don't
			// dominate the visual scale.
			const counts = this.months.map((m) => this.monthCounts[m] ?? 0)
			const sortedCounts = [...counts].filter((n) => n > 0).sort((a, b) => a - b)
			const p95Index = Math.floor(sortedCounts.length * 0.95)
			const cap = sortedCounts.length === 0 ? 1 : Math.max(1, sortedCounts[p95Index] ?? 1)

			return this.months.map((month, i) => {
				const raw = this.monthCounts[month] ?? 0
				const density = raw === 0 ? 0 : Math.min(1, raw / cap)
				return {
					month,
					year: month.substring(0, 4),
					percent: total === 1 ? 0 : (i / (total - 1)) * 100,
					density,
				}
			})
		},
	},

	methods: {
		t,

		// Translate a pointer Y coord on the track to the closest month
		// in `months`. Used for both initial track click and ongoing
		// drag.
		monthAtY(clientY: number): string | null {
			const track = this.$refs.track as HTMLElement | undefined
			if (track === undefined || this.months.length === 0) {
				return null
			}
			const rect = track.getBoundingClientRect()
			const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
			const idx = Math.round(ratio * (this.months.length - 1))
			return this.months[idx] ?? null
		},

		// Both track + thumb funnel into the same start. Pressing
		// anywhere on the track jumps to that point AND begins a
		// drag, so a press-and-drag works whether the user grabs the
		// thumb or any blank stretch of track. We don't bother with
		// setPointerCapture — it can drop the capture on browser
		// quirks (Safari was the original failure mode here) and the
		// document-level pointermove + pointerup are reliable.
		onTrackPointerDown(e: PointerEvent) {
			this.startDrag(e)
		},

		onThumbPointerDown(e: PointerEvent) {
			this.startDrag(e)
		},

		startDrag(e: PointerEvent) {
			// Treat the press as both an immediate jump and the
			// beginning of a drag. Pre-set dragMonth so the thumb
			// doesn't snap to a stale activeMonth on the first frame.
			const initial = this.monthAtY(e.clientY)
			if (initial !== null) {
				this.dragMonth = initial
			}
			this.isDragging = true
			if (initial !== null) {
				this.$emit('jump', initial)
			}
			document.addEventListener('pointermove', this.onPointerMove)
			document.addEventListener('pointerup', this.onPointerUp, { once: true })
			document.addEventListener('pointercancel', this.onPointerUp, { once: true })
		},

		onPointerMove(e: PointerEvent) {
			if (!this.isDragging) {
				return
			}
			const month = this.monthAtY(e.clientY)
			if (month !== null && month !== this.dragMonth) {
				this.dragMonth = month
				// Live update the timeline as the user drags — feels
				// more responsive than waiting for release.
				this.$emit('jump', month)
			}
		},

		onPointerUp() {
			this.isDragging = false
			this.dragMonth = ''
			document.removeEventListener('pointermove', this.onPointerMove)
		},

		// Keyboard navigation: ArrowUp/Down step by month, Home/End
		// jump to the newest / oldest. Standard slider semantics.
		onThumbKey(e: KeyboardEvent) {
			if (this.months.length === 0) {
				return
			}
			const idx = this.months.indexOf(this.activeMonth)
			let target: string | null
			switch (e.key) {
				case 'ArrowUp':
				case 'ArrowLeft':
					target = this.months[Math.max(0, idx - 1)] ?? null
					break
				case 'ArrowDown':
				case 'ArrowRight':
					target = this.months[Math.min(this.months.length - 1, idx + 1)] ?? null
					break
				case 'Home':
					target = this.months[0] ?? null
					break
				case 'End':
					target = this.months[this.months.length - 1] ?? null
					break
				default:
					return
			}
			if (target !== null && target !== this.activeMonth) {
				e.preventDefault()
				this.$emit('jump', target)
			}
		},
	},
})
</script>

<style lang="scss" scoped>
// Modern scrubber: a thin glassy track with density-mapped tick
// marks (a tiny histogram of where the user's library is dense),
// pill-shaped year labels, and a capsule thumb that grows to show
// the active month inline on hover/scrub. State transitions ease
// with a long ease-out cubic so the whole thing feels deliberate
// rather than UI-snappy.
//
// Idle state is intentionally minimal — a faint vertical line —
// so it doesn't compete with the photo grid for visual weight.
.date-scrubber {
	position: absolute;
	top: 0;
	bottom: 0;
	inset-inline-end: 4px;
	width: 84px;
	z-index: 4;
	display: flex;
	align-items: stretch;
	pointer-events: none; // children opt back in

	@media (max-height: 480px) {
		display: none;
	}

	&__track {
		position: relative;
		flex: 1;
		margin-block: 24px;
		// Idle: a hairline that softly hints "there's a thing here
		// you can drag". Active state below promotes it to a full
		// glassy strip.
		&::before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			inset-inline-end: 12px;
			width: 2px;
			border-radius: 1px;
			background: linear-gradient(
				to bottom,
				color-mix(in srgb, var(--color-primary-element) 25%, transparent),
				color-mix(in srgb, var(--color-primary-element) 8%, transparent)
			);
			transition: opacity 280ms ease-out, transform 280ms ease-out;
		}
		pointer-events: auto;
		cursor: pointer;
		touch-action: none;
	}

	// Density tick marks. One per month. Width comes from the
	// `--tick-density` variable bound on the element (0..1).
	// Idle: ticks are short + faint. Active: full length, full
	// opacity. The hover/scrub upgrade is the moment the histogram
	// becomes legible.
	&__tick {
		position: absolute;
		inset-inline-end: 8px;
		height: 1.5px;
		// Width range: 4px (empty month) to 22px (densest month)
		// — reads as a histogram while still leaving room for the
		// thumb at the right edge.
		width: calc(4px + var(--tick-density, 0) * 18px);
		border-radius: 1px;
		background: color-mix(in srgb, var(--color-primary-element) 35%, transparent);
		transform: translateY(-50%);
		opacity: 0;
		transition: opacity 280ms ease-out, background 200ms ease-out;
		pointer-events: none;
	}

	// Year labels. Frosted-glass pills that slide in from the
	// right edge alongside the track when the scrubber is active.
	&__year-label {
		position: absolute;
		inset-inline-end: 32px;
		transform: translateY(-50%) translateX(8px);
		padding: 1px 7px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-main-background) 70%, transparent);
		backdrop-filter: blur(6px);
		font-size: 10.5px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--color-text-maxcontrast);
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition: opacity 280ms ease-out, transform 280ms cubic-bezier(0.22, 1, 0.36, 1), color 200ms ease-out;

		// Year that contains the currently-active month gets a
		// stronger treatment so the user always knows which year
		// the thumb is sitting in.
		&--active {
			color: var(--color-primary-element);
			background: var(--color-main-background);
			font-weight: 700;
		}
	}

	// The thumb itself. A glassy capsule that hugs the right edge
	// when idle, then expands to show the active month inline
	// when hovered or scrubbing. The pill replaces the previous
	// floating tooltip so the user's eye doesn't have to dart
	// between two surfaces.
	&__thumb {
		position: absolute;
		inset-inline-end: 6px;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		pointer-events: auto;
		cursor: grab;
		touch-action: none;
		outline: none;

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
			padding: 0;
			border-radius: 999px;
			background: var(--color-primary-element);
			color: #fff;
			box-shadow:
				0 2px 6px rgba(0, 0, 0, 0.25),
				0 0 0 0 color-mix(in srgb, var(--color-primary-element) 50%, transparent);
			overflow: hidden;
			transition:
				min-width 360ms cubic-bezier(0.22, 1, 0.36, 1),
				padding 360ms cubic-bezier(0.22, 1, 0.36, 1),
				box-shadow 280ms ease-out,
				transform 200ms ease-out;
		}

		&__date {
			display: inline-block;
			max-width: 0;
			overflow: hidden;
			white-space: nowrap;
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.01em;
			line-height: 1;
			transition:
				max-width 360ms cubic-bezier(0.22, 1, 0.36, 1),
				margin 360ms cubic-bezier(0.22, 1, 0.36, 1),
				opacity 240ms ease-out 80ms;
			opacity: 0;
		}
	}

	// --- Active-state upgrades ---
	// Promotes the idle hairline + faint ticks to a full visual
	// presence: track gets a glassy fill, ticks light up, year
	// pills slide in, thumb expands to show the date.
	&--active,
	&:hover {
		.date-scrubber__track::before {
			background: linear-gradient(
				to bottom,
				color-mix(in srgb, var(--color-primary-element) 35%, transparent),
				color-mix(in srgb, var(--color-primary-element) 12%, transparent)
			);
		}

		.date-scrubber__tick {
			opacity: 1;
		}

		.date-scrubber__year-label {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}

		.date-scrubber__thumb__pill {
			min-width: 110px;
			padding: 0 12px 0 14px;
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

	// Active scrubbing — extra emphasis on the thumb (slight grow
	// + tighter shadow halo) so the user feels they have a firm
	// grip on it.
	&--active .date-scrubber__thumb__pill {
		transform: scale(1.04);
		box-shadow:
			0 6px 18px rgba(0, 0, 0, 0.4),
			0 0 0 8px color-mix(in srgb, var(--color-primary-element) 30%, transparent);
	}
}
</style>

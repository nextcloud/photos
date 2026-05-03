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
			<!-- Year labels: decimated to fit the available height. -->
			<span
				v-for="label in yearLabels"
				:key="label.year"
				class="date-scrubber__year-label"
				:style="{ top: `${label.percent}%` }">
				{{ label.year }}
			</span>

			<!-- Thumb. Position is the percent through the months list
				of whichever section is currently in view. Drag the
				thumb to scrub. -->
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
				@keydown="onThumbKey" />
		</div>

		<!-- Floating "what month am I about to land on" tooltip. Only
			visible while scrubbing (isActive); positioned next to the
			thumb so the user's eye doesn't have to dart. -->
		<Transition name="date-scrubber-tooltip">
			<div
				v-if="isActive"
				class="date-scrubber__tooltip"
				:style="{ top: `${thumbPercent}%` }">
				{{ activeMonthLabel }}
			</div>
		</Transition>
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
.date-scrubber {
	position: absolute;
	top: 0;
	bottom: 0;
	inset-inline-end: 4px;
	width: 64px;
	z-index: 4;
	display: flex;
	align-items: stretch;
	pointer-events: none; // children opt back in
	opacity: 0.4;
	transition: opacity 200ms ease-out;

	// Hide on short viewports — too cramped to be useful.
	@media (max-height: 480px) {
		display: none;
	}

	&--active,
	&:hover {
		opacity: 1;
	}

	&__track {
		position: relative;
		flex: 1;
		margin-block: 16px;
		border-radius: 2px;
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--color-primary-element) 15%, transparent) 0%,
			color-mix(in srgb, var(--color-primary-element) 4%, transparent) 100%
		);
		pointer-events: auto;
		cursor: pointer;
		// Without `touch-action: none` browsers swallow the vertical
		// drag as a page-scroll gesture before our pointermove handler
		// ever sees it (mobile + macOS trackpad two-finger scroll).
		touch-action: none;
	}

	&__year-label {
		position: absolute;
		inset-inline-end: 28px;
		transform: translateY(-50%);
		font-size: 11px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--color-text-maxcontrast);
		white-space: nowrap;
		pointer-events: none;
	}

	&__thumb {
		position: absolute;
		inset-inline-end: 8px;
		width: 14px;
		height: 14px;
		margin-top: -7px;
		border-radius: 50%;
		background: var(--color-primary-element);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		transition: transform 120ms ease-out, box-shadow 120ms ease-out;
		pointer-events: auto;
		cursor: grab;
		// Same touch-action gotcha as the track — without this, a
		// drag starting on the thumb may be eaten by the browser's
		// scroll behaviour before pointermove fires.
		touch-action: none;

		&:active {
			cursor: grabbing;
			transform: scale(1.2);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary-element);
			outline-offset: 3px;
		}
	}

	&__tooltip {
		position: absolute;
		inset-inline-end: 36px;
		transform: translateY(-50%);
		padding: 6px 12px;
		border-radius: 6px;
		background: var(--color-main-background);
		color: var(--color-main-text);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		pointer-events: none;
	}
}

// Tooltip enter/leave: tiny slide + fade, kept short so the visual
// follows the pointer rather than chasing it.
.date-scrubber-tooltip-enter-active,
.date-scrubber-tooltip-leave-active {
	transition: opacity 120ms ease-out, transform 120ms ease-out;
}
.date-scrubber-tooltip-enter-from,
.date-scrubber-tooltip-leave-to {
	opacity: 0;
	transform: translate(-4px, -50%);
}
</style>

<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Tiny tween-on-change number renderer. When `value` changes the
	displayed number animates from the previous value to the new one
	using requestAnimationFrame, with an optional `format` slot prop so
	callers can wrap the live value in their own translation
	(e.g. `n('photos', '%n photo', '%n photos', value)`).

	Uses a default ease-out so values feel like they "land". Honours
	`prefers-reduced-motion` by snapping straight to the new value.
-->

<template>
	<span class="animated-number">
		<slot :displayValue="displayValue">{{ displayValue }}</slot>
	</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AnimatedNumber',

	props: {
		value: {
			type: Number,
			required: true,
		},

		// Animation length in milliseconds. Short by default so the
		// component feels responsive when a value flips repeatedly.
		durationMs: {
			type: Number,
			default: 480,
		},
	},

	data() {
		return {
			displayValue: this.value,
			rafHandle: null as number | null,
		}
	},

	watch: {
		value(newValue: number, oldValue: number) {
			this.tween(oldValue, newValue)
		},
	},

	beforeUnmount() {
		this.cancelTween()
	},

	methods: {
		tween(from: number, to: number) {
			this.cancelTween()

			// Respect the user's motion preference — snap to the value.
			if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
				this.displayValue = to
				return
			}

			const start = performance.now()
			const delta = to - from

			const step = (now: number) => {
				const elapsed = now - start
				const progress = Math.min(1, elapsed / this.durationMs)
				// Ease-out cubic — quick start, gentle land.
				const eased = 1 - Math.pow(1 - progress, 3)
				this.displayValue = Math.round(from + delta * eased)

				if (progress < 1) {
					this.rafHandle = requestAnimationFrame(step)
				} else {
					this.rafHandle = null
				}
			}

			this.rafHandle = requestAnimationFrame(step)
		},

		cancelTween() {
			if (this.rafHandle !== null) {
				cancelAnimationFrame(this.rafHandle)
				this.rafHandle = null
			}
		},
	},
})
</script>

<style lang="scss" scoped>
.animated-number {
	font-variant-numeric: tabular-nums;
}
</style>

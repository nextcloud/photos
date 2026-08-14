<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<span class="animated-number">
		<slot :current="current">{{ current }}</slot>
	</span>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
	/** Number to count to. */
	value: number
	/** Duration of the count up, in milliseconds. */
	duration?: number
}>(), {
	duration: 480,
})

/**
 * The number as it is currently displayed, exposed as a slot property so that
 * callers can run it through their own translation.
 */
const current = ref(props.value)

let animationHandle: number | null = null

watch(() => props.value, (value, previousValue) => countTo(previousValue, value))

onBeforeUnmount(stopCounting)

/**
 * Count from one value to the other, easing out so that the number feels like
 * it lands. Users asking for reduced motion get the final value right away.
 *
 * @param from - Value to start counting from
 * @param to - Value to end on
 */
function countTo(from: number, to: number): void {
	stopCounting()

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		current.value = to
		return
	}

	const startTime = performance.now()

	/**
	 * @param time - Timestamp given by the browser for the current frame
	 */
	function step(time: number): void {
		const progress = Math.min(1, (time - startTime) / props.duration)
		const eased = 1 - (1 - progress) ** 3

		current.value = Math.round(from + (to - from) * eased)
		animationHandle = progress < 1 ? requestAnimationFrame(step) : null
	}

	animationHandle = requestAnimationFrame(step)
}

/**
 * Cancel the running count up, if any.
 */
function stopCounting(): void {
	if (animationHandle !== null) {
		cancelAnimationFrame(animationHandle)
		animationHandle = null
	}
}
</script>

<style lang="scss" scoped>
.animated-number {
	// Keep the width stable while the digits change.
	font-variant-numeric: tabular-nums;
}
</style>

<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="star-rating" role="group" :aria-label="t('photos', 'Rating')">
		<button
			v-for="star in 5"
			:key="star"
			type="button"
			class="star-rating__star"
			:class="{ 'star-rating__star--set': star <= rating }"
			:disabled="readonly"
			:aria-label="n('photos', 'Rate {star} star', 'Rate {star} stars', star, { star })"
			:aria-pressed="star <= rating"
			@click="select(star)">
			<Star v-if="star <= rating" :size="size" />
			<StarOutline v-else :size="size" />
		</button>
	</div>
</template>

<script lang="ts" setup>
import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'

const props = withDefaults(defineProps<{
	/** Current rating, 0 (none) to 5. */
	rating: number
	/** Show the stars without allowing changes. */
	readonly?: boolean
	size?: number
}>(), {
	readonly: false,
	size: 24,
})

const emit = defineEmits<{
	(event: 'change', value: number): void
}>()

/**
 * Emit the new rating, clearing it when the current rating is clicked again.
 *
 * @param star - The star that was clicked, 1 to 5
 */
function select(star: number): void {
	emit('change', star === props.rating ? 0 : star)
}
</script>

<style lang="scss" scoped>
.star-rating {
	display: inline-flex;
	gap: 2px;

	&__star {
		display: inline-flex;
		padding: 2px;
		border: none;
		border-radius: var(--border-radius);
		background: none;
		color: var(--color-text-maxcontrast);
		cursor: pointer;

		&--set {
			color: var(--color-favorite);
		}

		&:disabled {
			cursor: default;
		}

		&:not(:disabled):hover,
		&:not(:disabled):focus-visible {
			color: var(--color-favorite);
			background-color: var(--color-background-hover);
		}
	}
}
</style>

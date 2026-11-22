<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<RouterLink class="collection-cover" :to="link">
		<img
			v-if="coverUrl !== '' && coverLoadingError === false"
			class="collection-cover__image"
			:src="coverUrl"
			:alt="altImg"
			@error="coverLoadingError = true">

		<div v-else class="collection-cover__image collection-cover__image--placeholder">
			<ImageMultipleOutline :size="64" />
		</div>
		<div class="collection-cover__details">
			<div class="collection-cover__title">
				<slot name="default" />
			</div>
			<div class="collection-cover__subtitle">
				<slot name="subtitle" />
			</div>
		</div>
	</RouterLink>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'

const props = defineProps<{
	coverUrl: string
	altImg: string
	parentRoute: string
	collectionName: string
}>()

const coverLoadingError = ref(false)
const link = computed(() => `${props.parentRoute}/${encodeURIComponent(props.collectionName)}`)
</script>

<style lang="scss" scoped>
.collection-cover {
	display: flex;
	flex-direction: column;
	padding: calc(var(--default-grid-baseline) * 2);
	border-radius: var(--border-radius-large);

	&:hover, &:focus-visible {
		background: var(--color-background-hover);
	}

	&__image {
		// The cover is as wide as the list lets it be.
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--border-radius-large);

		&--placeholder {
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--color-primary-element-light);
			color: var(--color-primary-element);
		}
	}

	&__details {
		display: flex;
		flex-direction: column;
		min-width: 0;
		margin-top: calc(var(--default-grid-baseline) * 2);
	}

	&__title {
		overflow: hidden;
		font-weight: bold;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-main-text);
	}

	&__subtitle {
		color: var(--color-text-maxcontrast);
	}
}
</style>

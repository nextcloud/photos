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
			<ImageMultipleOutline :size="128" />
		</div>
		<div class="collection-cover__details">
			<div class="collection-cover__details__title">
				<slot name="default" />
			</div>
			<div class="collection-cover__details__subtitle">
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
	padding: 16px;
	border-radius: var(--border-radius-large);

	&:hover, &:focus {
		background: var(--color-background-dark);
	}

	&__image {
		width: 350px;
		height: 350px;
		object-fit: cover;
		border-radius: var(--border-radius-large);

		@media only screen and (max-width: 1200px) {
			width: 250px;
			height: 250px;
		}

		&--placeholder {
			background: var(--color-primary-element-light);

			:deep(.material-design-icon) {
				width: 100%;
				height: 100%;

				.material-design-icon__svg {
					fill: var(--color-primary-element);
				}
			}
		}
	}

	&__details {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		width: 350px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
		}

		&__title {
			display: flex;
			justify-content: space-between;
		}

		&__subtitle {
			display: flex;
			color: var(--color-text-lighter);
		}
	}

}
</style>

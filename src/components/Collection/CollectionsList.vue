<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred') ">
		<template #icon>
			<AlertCircleOutline />
		</template>
	</NcEmptyContent>

	<div v-else class="collections">
		<!-- Collection header -->
		<slot name="header" />

		<!-- No collections -->
		<slot v-if="noCollection && !loading" name="emptyCollectionsList" class="collections__empty" />

		<!-- List -->
		<ul v-else-if="!noCollection" class="collections__list">
			<li v-for="collection in collections" :key="collection.basename" :data-cy-collections-list-collection="collection.basename">
				<slot :collection="collection" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts" generic="T extends Collection">
import type { Collection } from '../../services/collectionFetcher.ts'

import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'

const props = withDefaults(defineProps<{
	collections: Record<string, T>
	loading?: boolean
	error?: Error | number | null
}>(), {
	loading: false,
	error: null,
})

defineSlots<{
	header(): unknown
	emptyCollectionsList(): unknown
	default(props: { collection: T }): unknown
}>()

const noCollection = computed(() => Object.keys(props.collections).length === 0)
</script>

<style lang="scss" scoped>
.collections {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__list {
		padding: 32px 48px;
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: flex-start;
		height: calc(100% - 60px);
		overflow-x: scroll;

		@media only screen and (max-width: 1200px) {
			padding: 32px 12px;
			justify-content: center;
		}
	}
}
</style>

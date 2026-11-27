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

		<!-- Grouped list -->
		<div v-else-if="!noCollection && groups?.length" class="collections__groups">
			<section v-for="group in groups" :key="group.key" class="collections__group">
				<h2 class="collections__group-title">
					{{ group.title }}
				</h2>
				<ul class="collections__list collections__list--grouped">
					<li v-for="collection in group.collections" :key="collection.basename" :data-cy-collections-list-collection="collection.basename">
						<slot :collection="collection" />
					</li>
				</ul>
			</section>
		</div>

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
	/** Sections to show the collections in, instead of a single list. */
	groups?: { key: string, title: string, collections: T[] }[]
	loading?: boolean
	error?: Error | number | null
}>(), {
	groups: undefined,
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

		&--grouped {
			height: auto;
			padding: 0 0 32px;
			overflow: visible;

			@media only screen and (max-width: 1200px) {
				padding: 0 0 32px;
			}
		}
	}

	&__groups {
		flex-grow: 1;
		height: calc(100% - 60px);
		padding: 0 48px;
		overflow-y: auto;

		@media only screen and (max-width: 1200px) {
			padding: 0 12px;
		}
	}

	&__group-title {
		margin: 32px 0 16px;
		font-size: 20px;
		font-weight: bold;
	}
}
</style>

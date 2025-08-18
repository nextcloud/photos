<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred') ">
		<AlertCircleOutline slot="icon" />
	</NcEmptyContent>

	<div v-else class="collections">
		<!-- Collection header -->
		<slot name="header" />

		<!-- No collections -->
		<slot v-if="noCollection && !loading" name="empty-collections-list" class="collections__empty" />

		<!-- List -->
		<ul v-else-if="!noCollection" class="collections__list">
			<li v-for="collection in collections" :key="collection.basename" :data-cy-collections-list-collection="collection.basename">
				<slot :collection="collection" />
			</li>
		</ul>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { Collection } from '../../services/collectionFetcher.ts'

import { translate } from '@nextcloud/l10n'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'

export default {
	name: 'CollectionsList',

	components: {
		AlertCircleOutline,
		NcEmptyContent,
	},

	props: {
		collections: {
			type: Object as PropType<Record<string, Collection>>,
			required: true,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		error: {
			type: Error,
			default: null,
		},
	},

	computed: {
		noCollection(): boolean {
			return Object.keys(this.collections).length === 0
		},
	},

	methods: {
		t: translate,
	},
}
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

<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			:collection="place ?? undefined"
			:collectionFileIds="placeFileIds"
			:allowSelection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<template #header>
				<HeaderNavigation
					v-if="place !== null"
					key="navigation"

					:loading="loadingCollection || loadingCollectionFiles"
					:params="{ placeName }"
					:path="'/' + placeName"
					:title="place.basename"
					@refresh="fetchPlaceFiles" />
			</template>

			<!-- No content -->
			<template #emptyContent>
				<NcEmptyContent

					:name="t('photos', 'This place does not have any photos or videos yet!')"
					class="place__empty">
					<template #icon>
						<ImagePlusOutline />
					</template>

					<template #action>
						<NcButton

							variant="primary"
							:aria-label="t('photos', 'Add photos to this place')"
							@click="showAddPhotosModal = true">
							<template #icon>
								<Plus />
							</template>
							{{ t('photos', "Add") }}
						</NcButton>
					</template>
				</NcEmptyContent>
			</template>
		</CollectionContent>
	</div>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed, onBeforeMount, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useFetchCollectionContent } from '../composables/useFetchCollectionContent.ts'
import { placesPrefix, usePlacesStore } from '../store/places.ts'

const props = withDefaults(defineProps<{
	placeName?: string
}>(), {
	placeName: '/',
})

const placesStore = usePlacesStore()
const {
	fetchCollection,
	fetchCollectionFiles,
	loadingCollection,
	loadingCollectionFiles,
	errorFetchingCollection,
	errorFetchingCollectionFiles,
} = useFetchCollectionContent()

const showAddPhotosModal = ref(false)

const place = computed(() => placesStore.getPlace(props.placeName))

const placeFileName = computed(() => `${placesPrefix}/${props.placeName}`)

const placeFileIds = computed(() => placesStore.getPlaceFiles(props.placeName))

async function fetchPlace() {
	fetchCollection(placeFileName.value, [])
}

async function fetchPlaceFiles() {
	fetchCollectionFiles(placeFileName.value)
}

onBeforeMount(async () => {
	await fetchPlace()
	await fetchPlaceFiles()
})
</script>

<style lang="scss" scoped>
.place {
	display: flex;
	flex-direction: column;

	&__title {
		width: 100%;
	}

	&__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__place {
		margin-inline-start: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>

<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<form
		v-if="available"
		class="photos-filters-ask"
		data-cy-photos-filters-ask
		@submit.prevent="ask">
		<NcTextField
			v-model="query"
			:label="t('photos', 'Ask your photos')"
			:placeholder="t('photos', 'Beach photos from last summer')"
			:showTrailingButton="query.trim().length > 0 || loading"
			:trailingButtonIcon="loading ? 'close' : 'arrowEnd'"
			:trailingButtonLabel="loading ? t('photos', 'Cancel') : t('photos', 'Ask')"
			@trailingButtonClick="loading ? cancel() : ask()">
			<template #icon>
				<NcLoadingIcon v-if="loading" :size="20" />
				<Creation v-else :size="20" />
			</template>
		</NcTextField>
		<p
			v-if="error"
			class="photos-filters-ask__message photos-filters-ask__message--error"
			role="alert">
			{{ error }}
		</p>
		<p
			v-else-if="interpretation"
			class="photos-filters-ask__message"
			aria-live="polite">
			{{ interpretation }}
		</p>
	</form>
</template>

<script lang="ts" setup>
import type { AskFilters } from '../../services/askPhotos.ts'

import { t } from '@nextcloud/l10n'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref, watch } from 'vue'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Creation from 'vue-material-design-icons/Creation.vue'
import { askPhotos, AskPhotosError, isAskPhotosAvailable } from '../../services/askPhotos.ts'
import { logger } from '../../services/logger.ts'
import { dateRangeFilterId } from '../../services/PhotosFilters/dateRangeFilter.ts'
import { nameFilterId } from '../../services/PhotosFilters/nameFilter.ts'
import { placesFilterId } from '../../services/PhotosFilters/placesFilter.ts'
import { tagsFilterId } from '../../services/PhotosFilters/tagsFilter.ts'
import { useFilterStore } from '../../store/filters.ts'
import { formatDateRange } from '../../utils/dateUtils.ts'

const { selectedFilters } = storeToRefs(useFilterStore())

const available = ref(false)
const query = ref('')
const loading = ref(false)
const error = ref('')
const interpretation = ref('')

let controller: AbortController | null = null
// Filters set from the last answer, the interpretation is hidden once they are changed.
let appliedFilters = ''

isAskPhotosAvailable().then((value) => {
	available.value = value
})

watch(selectedFilters, (value) => {
	if (JSON.stringify(value) !== appliedFilters) {
		interpretation.value = ''
	}
}, { deep: true })

onBeforeUnmount(cancel)

/**
 * Send the question to the assistant and replace the filters with its answer.
 */
async function ask(): Promise<void> {
	const question = query.value.trim()
	if (question === '') {
		return
	}

	controller?.abort()
	const currentController = new AbortController()
	controller = currentController
	loading.value = true
	error.value = ''
	interpretation.value = ''

	try {
		const filters = await askPhotos(question, { signal: currentController.signal })
		applyFilters(filters)
		interpretation.value = t('photos', 'Interpreted as: {filters}', { filters: describeFilters(filters) }, undefined, { escape: false, sanitize: false })
	} catch (askError) {
		if (!currentController.signal.aborted) {
			logger.error('Could not turn the question into filters', { error: askError })
			error.value = errorMessage(askError)
		}
	} finally {
		if (controller === currentController) {
			controller = null
			loading.value = false
		}
	}
}

/**
 * Stop waiting for the answer and cancel the task.
 */
function cancel(): void {
	controller?.abort()
	controller = null
	loading.value = false
}

/**
 * @param filters - Filters understood from the question
 */
function applyFilters(filters: AskFilters): void {
	selectedFilters.value[dateRangeFilterId] = filters.dateRange ? [filters.dateRange] : []
	selectedFilters.value[placesFilterId] = filters.places
	selectedFilters.value[tagsFilterId] = filters.tags
	selectedFilters.value[nameFilterId] = filters.name ? [filters.name] : []
	appliedFilters = JSON.stringify(selectedFilters.value)
}

/**
 * @param filters - Filters understood from the question
 */
function describeFilters(filters: AskFilters): string {
	const parts: string[] = []

	if (filters.dateRange) {
		parts.push(formatDateRange(new Date(filters.dateRange.start), new Date(filters.dateRange.end)))
	}

	parts.push(...filters.places, ...filters.tags.map((tag) => t('recognize', tag)))

	if (filters.name) {
		parts.push(t('photos', 'name contains "{name}"', { name: filters.name }, undefined, { escape: false, sanitize: false }))
	}

	return parts.join(' · ')
}

/**
 * @param askError - Error thrown while asking
 */
function errorMessage(askError: unknown): string {
	if (!(askError instanceof AskPhotosError)) {
		return t('photos', 'Could not reach the assistant.')
	}

	switch (askError.reason) {
		case 'timeout':
			return t('photos', 'The assistant took too long to answer, please try again later.')
		case 'unparsable':
			return t('photos', 'The assistant could not turn this into filters, try rephrasing it.')
		default:
			return askError.userFacingMessage ?? t('photos', 'The assistant could not answer.')
	}
}
</script>

<style lang="scss" scoped>
.photos-filters-ask {
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 2) 0;

	&__message {
		margin-top: var(--default-grid-baseline);
		color: var(--color-text-maxcontrast);
		font-size: var(--font-size-small, 13px);

		&--error {
			color: var(--color-error-text);
		}
	}
}
</style>

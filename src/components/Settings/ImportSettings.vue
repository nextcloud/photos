<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="import-settings">
		<p class="import-settings__intro">
			{{ t('photos', 'Bring the dates, locations, albums and favorites of another photo service to the photos you copied from it into your files. Copy or upload the photos first, then choose their folder. Preview shows what would change without changing anything.') }}
		</p>

		<NcLoadingIcon v-if="loading" />
		<ImportProviderForm
			v-for="provider in providers"
			:key="provider.id"
			:provider="provider"
			:status="status?.provider === provider.id ? status : null"
			:error="startError?.provider === provider.id ? startError.message : null"
			:disabled="starting || isImportActive(status)"
			@start="start(provider, $event)" />
	</div>
</template>

<script setup lang="ts">
import type { ImportOptions, ImportProvider, ImportStatus } from '../../services/ImportService.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ImportProviderForm from './ImportProviderForm.vue'
import { getImports, isImportActive, startImport, waitForImport } from '../../services/ImportService.ts'
import { logger } from '../../services/logger.ts'

const providers = ref<ImportProvider[]>([])
const status = ref<ImportStatus | null>(null)
const loading = ref(true)
const starting = ref(false)
const startError = ref<{ provider: string, message: string } | null>(null)

let polling: AbortController | null = null

onMounted(async () => {
	try {
		const imports = await getImports()
		providers.value = imports.providers
		status.value = imports.status
		if (imports.status && isImportActive(imports.status)) {
			follow(imports.status.id)
		}
	} catch (error) {
		logger.error('Could not load the imports', { error })
		showError(t('photos', 'Could not load the imports'))
	} finally {
		loading.value = false
	}
})

onBeforeUnmount(() => polling?.abort())

/**
 * @param provider - Importer to run
 * @param request - What to import
 * @param request.path - Folder to import from
 * @param request.dryRun - Only count what would be changed
 * @param request.options - Values of the fields of the importer
 */
async function start(provider: ImportProvider, request: { path: string, dryRun: boolean, options: ImportOptions }): Promise<void> {
	starting.value = true
	startError.value = null
	try {
		status.value = await startImport(provider.id, request.path, request.dryRun, request.options)
		follow(status.value.id)
	} catch (error) {
		startError.value = { provider: provider.id, message: (error as Error).message }
	} finally {
		starting.value = false
	}
}

/**
 * Keep the status up to date until the import finished.
 *
 * @param id - Id of the import
 */
async function follow(id: string): Promise<void> {
	polling?.abort()
	polling = new AbortController()
	try {
		await waitForImport(id, (update) => {
			status.value = update
		}, polling.signal)
	} catch (error) {
		logger.error('Could not load the status of the import', { error })
	}
}
</script>

<style lang="scss" scoped>
.import-settings__intro {
	margin-block-end: calc(var(--default-grid-baseline) * 3);
	color: var(--color-text-maxcontrast);
}
</style>

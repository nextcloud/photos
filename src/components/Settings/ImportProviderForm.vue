<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<details class="import-provider" :open="status !== null">
		<summary class="import-provider__name">
			{{ provider.name }}
		</summary>

		<p class="import-provider__text">
			{{ provider.description }}
		</p>

		<NcFormBox>
			<NcFormBoxButton
				:description="path || provider.folderHint"
				:invertedAccent="true"
				:disabled="disabled"
				@click="pickFolder">
				<template #icon>
					<FolderOpenOutline :size="20" />
				</template>
				{{ path ? t('photos', 'Folder') : t('photos', 'Choose a folder') }}
			</NcFormBoxButton>
			<template v-for="field in provider.fields" :key="field.id">
				<NcFormBoxSwitch
					v-if="field.type === 'checkbox'"
					:modelValue="switches[field.id]"
					:label="field.label"
					:disabled="disabled"
					@update:modelValue="switches[field.id] = $event" />
			</template>
		</NcFormBox>

		<template v-for="field in provider.fields" :key="field.id">
			<NcPasswordField
				v-if="field.type === 'password'"
				v-model="texts[field.id]"
				class="import-provider__field"
				:label="field.label"
				:disabled="disabled"
				autocomplete="off" />
			<NcTextField
				v-else-if="field.type === 'url'"
				v-model="texts[field.id]"
				class="import-provider__field"
				type="url"
				:label="field.label"
				:disabled="disabled"
				placeholder="https://" />
		</template>

		<div class="import-provider__actions">
			<NcButton :disabled="!canStart" @click="start(true)">
				{{ t('photos', 'Preview') }}
			</NcButton>
			<NcButton variant="primary" :disabled="!canStart" @click="start(false)">
				{{ t('photos', 'Import') }}
			</NcButton>
		</div>

		<NcNoteCard v-if="error" type="error">
			{{ error }}
		</NcNoteCard>

		<div v-if="status" class="import-provider__status" aria-live="polite">
			<p v-if="isImportActive(status)" class="import-provider__progress">
				<NcLoadingIcon :size="20" />
				<span v-if="status.state === 'queued'">
					{{ t('photos', 'Waiting for the server to start. The import runs in the background, you can close the settings.') }}
				</span>
				<span v-else>
					{{ n('photos', 'Working, %n item checked …', 'Working, %n items checked …', status.processed) }}
				</span>
			</p>

			<template v-else>
				<NcNoteCard v-if="status.state === 'failed'" type="error" :heading="t('photos', 'The import failed')">
					{{ status.error }}
				</NcNoteCard>
				<NcNoteCard
					v-else
					type="success"
					:heading="status.dryRun ? t('photos', 'Preview finished, nothing was changed yet') : t('photos', 'Import finished')">
					{{ t('photos', 'Folder: {folder}', { folder: status.folder }) }}
				</NcNoteCard>

				<h5 v-if="status.found.length > 0" class="import-provider__heading">
					{{ t('photos', 'Found') }}
				</h5>
				<ul class="import-provider__counts">
					<li v-for="count in status.found" :key="count.label">
						{{ count.label }}: <strong>{{ count.count }}</strong>
					</li>
				</ul>

				<h5 v-if="status.state === 'done' || status.changed.length > 0" class="import-provider__heading">
					{{ status.dryRun ? t('photos', 'What the import would change') : t('photos', 'What was changed') }}
				</h5>
				<ul v-if="status.state === 'done' || status.changed.length > 0" class="import-provider__counts">
					<li v-for="count in status.changed" :key="count.label">
						{{ count.label }}: <strong>{{ count.count }}</strong>
					</li>
					<li v-if="status.changed.length === 0">
						{{ t('photos', 'Nothing') }}
					</li>
				</ul>

				<template v-if="status.skipped.length > 0">
					<h5 class="import-provider__heading">
						{{ t('photos', 'Left unchanged') }}
					</h5>
					<ul class="import-provider__counts">
						<li v-for="count in status.skipped" :key="count.label">
							{{ count.label }}: <strong>{{ count.count }}</strong>
						</li>
					</ul>
				</template>

				<details v-if="status.examples.length > 0" class="import-provider__examples">
					<summary>{{ t('photos', 'Examples of items left unchanged') }}</summary>
					<ul>
						<li v-for="example in status.examples" :key="example.path">
							{{ example.path }} – {{ example.reason }}
						</li>
					</ul>
				</details>
			</template>
		</div>
	</details>
</template>

<script setup lang="ts">
import type { ImportOptions, ImportProvider, ImportStatus } from '../../services/ImportService.ts'

import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { n, t } from '@nextcloud/l10n'
import { computed, reactive, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcPasswordField from '@nextcloud/vue/components/NcPasswordField'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import FolderOpenOutline from 'vue-material-design-icons/FolderOpenOutline.vue'
import { isImportActive } from '../../services/ImportService.ts'

const props = defineProps<{
	provider: ImportProvider
	/** Last import of the user with this provider */
	status: ImportStatus | null
	/** Whether an import is starting or active */
	disabled: boolean
	/** Why the last import with this provider could not start */
	error: string | null
}>()

const emit = defineEmits<{
	start: [request: { path: string, dryRun: boolean, options: ImportOptions }]
}>()

const path = ref(props.status?.folder ?? '')
const switches = reactive<Record<string, boolean>>({})
const texts = reactive<Record<string, string>>({})
for (const field of props.provider.fields) {
	if (field.type === 'checkbox') {
		switches[field.id] = false
	} else {
		texts[field.id] = ''
	}
}

const canStart = computed(() => !props.disabled
	&& path.value !== ''
	&& Object.values(texts).every((value) => value.trim() !== ''))

/**
 * Let the user choose the folder to import from.
 */
async function pickFolder(): Promise<void> {
	const picker = getFilePickerBuilder(t('photos', 'Choose the folder to import from'))
		.setMultiSelect(false)
		.addMimeTypeFilter('httpd/unix-directory')
		.allowDirectories()
		.startAt(path.value || '/')
		.addButton({ label: t('photos', 'Choose'), callback: () => {} })
		.build()

	try {
		path.value = await picker.pick()
	} catch {
		// The picker was closed without choosing.
	}
}

/**
 * @param dryRun - Only count what would be changed
 */
function start(dryRun: boolean): void {
	emit('start', { path: path.value, dryRun, options: { ...switches, ...texts } })
}
</script>

<style lang="scss" scoped>
.import-provider {
	margin-block-end: calc(var(--default-grid-baseline) * 4);
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3);
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius-large);

	&__name {
		cursor: pointer;
		font-weight: bold;
		padding-block: var(--default-grid-baseline);
	}

	&__text {
		margin-block: calc(var(--default-grid-baseline) * 2);
		color: var(--color-text-maxcontrast);
	}

	&__field {
		margin-block-start: calc(var(--default-grid-baseline) * 3);
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--default-grid-baseline) * 2);
		margin-block: calc(var(--default-grid-baseline) * 3);
	}

	&__progress {
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
	}

	&__heading {
		margin-block: calc(var(--default-grid-baseline) * 3) var(--default-grid-baseline);
		font-size: inherit;
		font-weight: bold;
	}

	&__counts {
		list-style: disc;
		padding-inline-start: calc(var(--default-grid-baseline) * 5);
	}

	&__examples {
		margin-block-start: calc(var(--default-grid-baseline) * 2);

		summary {
			cursor: pointer;
		}

		ul {
			padding-inline-start: calc(var(--default-grid-baseline) * 5);
			color: var(--color-text-maxcontrast);
			overflow-wrap: anywhere;
		}
	}
}
</style>

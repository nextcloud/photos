<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDialog
		:name="t('photos', 'Save as smart album')"
		size="small"
		isForm
		:buttons="buttons"
		@closing="onClosing">
		<p class="smart-album-name-dialog__description">
			{{ t('photos', 'A smart album always shows the photos matching the current filters.') }}
		</p>
		<NcTextField
			v-model="name"
			:label="t('photos', 'Name of the smart album')"
			:maxlength="255"
			required
			data-cy-smart-album-name-input />
	</NcDialog>
</template>

<script lang="ts" setup>
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcTextField from '@nextcloud/vue/components/NcTextField'

const emit = defineEmits<{
	(event: 'close', name: string | undefined): void
}>()

const name = ref('')

/**
 * @param result - Value returned by the callback of the clicked button
 */
function onClosing(result: unknown) {
	emit('close', typeof result === 'string' ? result : undefined)
}

const buttons = [
	{
		label: t('photos', 'Cancel'),
		callback: () => undefined,
	},
	{
		label: t('photos', 'Save'),
		type: 'submit' as const,
		variant: 'primary' as const,
		callback: () => name.value.trim() || undefined,
	},
]
</script>

<style lang="scss" scoped>
.smart-album-name-dialog__description {
	margin-bottom: calc(var(--default-grid-baseline) * 2);
}
</style>

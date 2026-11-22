<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcChip
		data-cy-photos-filters-option="tag"
		:text="t('recognize', value)"
		@close="emit('deselect')" />
</template>

<script lang="ts" setup>
import type { TagsValueType } from '../../services/PhotosFilters/tagsFilter.ts'

import { t } from '@nextcloud/l10n'
import NcChip from '@nextcloud/vue/components/NcChip'

defineProps<{
	value: TagsValueType
}>()

const emit = defineEmits(['deselect'])
</script>

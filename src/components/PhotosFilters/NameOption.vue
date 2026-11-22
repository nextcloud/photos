<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcChip
		data-cy-photos-filters-option="name"
		:text="value"
		@close="emit('deselect')" />
</template>

<script lang="ts" setup>
import type { NameValueType } from '../../services/PhotosFilters/nameFilter.ts'

import NcChip from '@nextcloud/vue/components/NcChip'

defineProps<{
	value: NameValueType
}>()

const emit = defineEmits(['deselect'])
</script>

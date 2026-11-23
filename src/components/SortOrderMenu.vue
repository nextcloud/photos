<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcActions :aria-label="label" :title="label">
		<template #icon>
			<SortVariant :size="20" />
		</template>
		<NcActionRadio
			v-for="option in options"
			:key="option.value"
			:name="name"
			:value="option.value"
			:modelValue="modelValue"
			@update:modelValue="emit('update:modelValue', $event as T)">
			{{ option.label }}
		</NcActionRadio>
	</NcActions>
</template>

<script setup lang="ts" generic="T extends string">
import NcActionRadio from '@nextcloud/vue/components/NcActionRadio'
import NcActions from '@nextcloud/vue/components/NcActions'
import SortVariant from 'vue-material-design-icons/SortVariant.vue'

defineProps<{
	/** The selected order. */
	modelValue: T
	/** Orders to choose from. */
	options: { value: T, label: string }[]
	/** Name of the radio group, unique on the page. */
	name: string
	/** Accessible name of the menu. */
	label: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: T]
}>()
</script>

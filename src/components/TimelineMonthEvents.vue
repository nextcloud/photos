<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="month-events">
		<span class="month-events__label">{{ t('photos', 'Events:') }}</span>
		<ul class="month-events__list">
			<li v-for="(event, index) in shownEvents" :key="index">
				<NcButton
					size="small"
					variant="tertiary"
					:title="t('photos', 'Show the photos of this event')"
					@click="emit('select', event)">
					{{ formatEvent(event) }}
				</NcButton>
			</li>
		</ul>
		<NcActions
			v-if="moreEvents.length > 0"
			size="small"
			variant="tertiary"
			:menuName="n('photos', '%n more', '%n more', moreEvents.length)">
			<NcActionButton
				v-for="(event, index) in moreEvents"
				:key="index"
				:closeAfterClick="true"
				@click="emit('select', event)">
				<template #icon>
					<CalendarBlankOutline :size="20" />
				</template>
				{{ formatEvent(event) }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<script setup lang="ts">
import type { MonthEvent } from '../utils/calendarEvents.ts'

import { n, t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import CalendarBlankOutline from 'vue-material-design-icons/CalendarBlankOutline.vue'

const props = defineProps<{
	events: MonthEvent[]
}>()

const emit = defineEmits<{
	select: [event: MonthEvent]
}>()

const isMobile = useIsMobile()

// A narrow screen only has room for one title next to the menu of the others.
const maxShownEvents = computed(() => isMobile.value ? 1 : 3)
const shownEvents = computed(() => props.events.slice(0, maxShownEvents.value))
const moreEvents = computed(() => props.events.slice(maxShownEvents.value))

function formatEvent(event: MonthEvent): string {
	return t('photos', '{event} ({days})', { event: event.summary, days: event.days }, { escape: false })
}
</script>

<style lang="scss" scoped>
.month-events {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
	height: var(--clickable-area-small);
	margin-bottom: var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);

	&__label {
		flex-shrink: 0;
	}

	&__list {
		display: flex;
		min-width: 0;

		li {
			min-width: 0;
		}

		// Long titles are cut off rather than pushed out of the header.
		:deep(.button-vue) {
			max-width: 100%;
		}
	}

	:deep(.action-item) {
		flex-shrink: 0;
	}
}
</style>

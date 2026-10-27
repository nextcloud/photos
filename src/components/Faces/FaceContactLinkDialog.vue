<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Link to contact')"
		size="normal"
		@update:open="emit('close')">
		<div class="contact-link">
			<p class="contact-link__hint">
				{{ t('photos', 'Which contact is {name}?', { name: faceName }) }}
			</p>

			<NcTextField
				v-model="search"
				:label="t('photos', 'Search contacts')"
				:placeholder="t('photos', 'Name or email address')"
				autofocus
				@update:modelValue="onSearch">
				<template #icon>
					<Magnify :size="20" />
				</template>
			</NcTextField>

			<NcLoadingIcon v-if="loading" :size="32" class="contact-link__loading" />

			<NcEmptyContent
				v-else-if="contacts.length === 0"
				:name="t('photos', 'No contacts found')"
				class="contact-link__empty">
				<template #icon>
					<CardAccountDetailsOutline />
				</template>
			</NcEmptyContent>

			<ul v-else class="contact-link__list">
				<NcListItem
					v-for="contact in contacts"
					:key="`${contact.addressBook}/${contact.uid}`"
					:name="contact.displayName"
					:details="contact.addressBookName"
					:disabled="linking"
					@click="select(contact)">
					<template #icon>
						<NcAvatar
							:url="contact.photoUrl ?? undefined"
							:displayName="contact.displayName"
							:isNoUser="true"
							:disableMenu="true"
							:disableTooltip="true"
							:size="44" />
					</template>
				</NcListItem>
			</ul>
		</div>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { RecognizeContact } from '../../services/recognizeContacts.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcAvatar from '@nextcloud/vue/components/NcAvatar'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import CardAccountDetailsOutline from 'vue-material-design-icons/CardAccountDetailsOutline.vue'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import { logger } from '../../services/logger.ts'
import { searchContacts } from '../../services/recognizeContacts.ts'

defineProps<{
	/** Name of the person being linked. */
	faceName: string
	/** Whether the link is being stored, which keeps the contacts from being picked twice. */
	linking: boolean
}>()

const emit = defineEmits<{
	(event: 'select', contact: RecognizeContact): void
	(event: 'close'): void
}>()

/** Time to wait after the last keystroke before searching. */
const SEARCH_DELAY = 300

const search = ref('')
const loading = ref(true)
const contacts = ref<RecognizeContact[]>([])

let searchTimeout: ReturnType<typeof setTimeout> | undefined
// A reply of an older search must not overwrite the result of a newer one.
let searchSequence = 0

onMounted(() => load(''))

function onSearch(value: string | number): void {
	clearTimeout(searchTimeout)
	searchTimeout = setTimeout(() => load(String(value)), SEARCH_DELAY)
}

/**
 * @param query - Part of the name or email address to search for
 */
async function load(query: string): Promise<void> {
	const sequence = ++searchSequence
	loading.value = true

	try {
		const result = await searchContacts(query.trim())
		if (sequence !== searchSequence) {
			return
		}
		contacts.value = result
	} catch (error) {
		if (sequence !== searchSequence) {
			return
		}
		logger.error('Failed to search contacts', { error })
		showError(t('photos', 'Failed to search contacts'))
	} finally {
		if (sequence === searchSequence) {
			loading.value = false
		}
	}
}

function select(contact: RecognizeContact): void {
	emit('select', contact)
}
</script>

<style lang="scss" scoped>
.contact-link {
	display: flex;
	flex-direction: column;
	gap: 12px;
	min-height: 300px;
	padding: 0 12px 12px;

	&__hint {
		color: var(--color-text-maxcontrast);
	}

	&__loading {
		margin: 32px auto;
	}

	&__list {
		max-height: 50vh;
		overflow-y: auto;
	}
}
</style>

<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		v-if="open || hasNews"
		:name="t('photos', 'What\'s new in Photos')"
		size="normal"
		@update:open="close">
		<section
			v-for="entry in entries"
			:key="entry.version"
			class="whats-new">
			<h3 class="whats-new__version">
				{{ t('photos', 'Version {version}', { version: entry.version }) }}
			</h3>
			<ul class="whats-new__highlights">
				<li v-for="highlight in entry.highlights" :key="highlight.title">
					<strong>{{ highlight.title }}</strong>
					<p>{{ highlight.description }}</p>
				</li>
			</ul>
		</section>

		<template #actions>
			<NcButton variant="primary" @click="close">
				{{ t('photos', 'Got it') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import { logger } from '../services/logger.ts'
import { getInstalledVersion, getUnseenEntries, getWhatsNewEntries } from '../services/whatsNew.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

/** Whether the user asked to see the dialog, it shows itself after an update. */
const open = defineModel<boolean>('open', { default: false })

const userConfigStore = useUserConfigStore()
const installedVersion = getInstalledVersion()
const allEntries = getWhatsNewEntries()
const unseenEntries = getUnseenEntries(allEntries, installedVersion, userConfigStore.lastSeenVersion)

const hasNews = ref(unseenEntries.length > 0)
const entries = computed(() => hasNews.value ? unseenEntries : allEntries)

/**
 * Remember the installed version as the one the user has seen the news of.
 */
async function markSeen() {
	if (installedVersion === '' || userConfigStore.lastSeenVersion === installedVersion) {
		return
	}

	try {
		await userConfigStore.updateUserConfig('lastSeenVersion', installedVersion)
	} catch (error) {
		logger.error('Could not store the last seen version', { error })
	}
}

function close() {
	hasNews.value = false
	open.value = false
	markSeen()
}

if (!hasNews.value) {
	markSeen()
}
</script>

<style lang="scss" scoped>
.whats-new {
	padding-block-end: calc(var(--default-grid-baseline) * 2);

	&__version {
		margin: 0 0 calc(var(--default-grid-baseline) * 2);
		color: var(--color-text-maxcontrast);
		font-size: var(--default-font-size);
		font-weight: normal;
	}

	&__highlights {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 3);
		padding-inline-start: calc(var(--default-grid-baseline) * 5);
		list-style: disc;
	}
}
</style>

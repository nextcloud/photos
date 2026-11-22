<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="library-status" aria-live="polite">
		<NcLoadingIcon v-if="loading" :name="t('photos', 'Loading library status')" />
		<p v-else-if="status === null">
			{{ t('photos', 'Could not load the number of photos on this server') }}
		</p>
		<template v-else>
			<p class="library-status__summary">
				<CloudCheckOutline :size="20" class="library-status__icon" />
				{{ formatLibraryStatus(status) }}
			</p>
			<template v-if="status.cameraFolders.length > 0">
				<div class="library-status__heading">
					{{ t('photos', 'Camera uploads') }}
				</div>
				<ul class="library-status__folders">
					<li v-for="folder in status.cameraFolders" :key="folder.path">
						<strong>{{ folder.path.slice(1) }}</strong>
						· {{ formatMediaCount(folder) }}
						<template v-if="folder.lastUpload !== null">
							· {{ formatLastUpload(folder.lastUpload) }}
						</template>
					</li>
				</ul>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { LibraryStatus } from '../../services/libraryStatus.ts'

import { t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import CloudCheckOutline from 'vue-material-design-icons/CloudCheckOutline.vue'
import { fetchLibraryStatus, formatLastUpload, formatLibraryStatus, formatMediaCount } from '../../services/libraryStatus.ts'
import { logger } from '../../services/logger.ts'

const loading = ref(true)
const status = ref<LibraryStatus | null>(null)

onMounted(async () => {
	try {
		status.value = await fetchLibraryStatus()
	} catch (error) {
		logger.error('Could not load the library status', { error })
	} finally {
		loading.value = false
	}
})
</script>

<style lang="scss" scoped>
.library-status {
	padding-inline-start: calc(var(--default-grid-baseline) * 3);

	&__summary {
		display: flex;
		align-items: flex-start;
		gap: calc(var(--default-grid-baseline) * 2);
	}

	&__icon {
		flex-shrink: 0;
		color: var(--color-success-text);
	}

	&__heading {
		margin-top: calc(var(--default-grid-baseline) * 3);
		font-weight: bold;
	}

	&__folders {
		color: var(--color-text-maxcontrast);
	}
}
</style>

<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Migration progress banner shown while the per-user backfill of
	`oc_photos_index` is still running. Hidden once the backend
	reports `ready`. Uses NcNoteCard for visual consistency with the
	other banners in photos (PhotosPicker's "owned by another user"
	note, settings warnings).

	The banner is intentionally non-dismissible — if a user dismisses
	it, they wouldn't see it again until reload, but the underlying
	slowness would still be there. Better to leave it as ambient
	context until it disappears on its own.
-->

<template>
	<NcNoteCard v-if="indexStatus.inProgress" type="info" class="index-progress-banner">
		<template #icon>
			<DatabaseSyncOutline :size="20" />
		</template>
		<div class="index-progress-banner__content">
			<p class="index-progress-banner__text">
				{{ message }}
			</p>
			<NcProgressBar
				:value="indexStatus.progressPercent"
				size="medium"
				class="index-progress-banner__bar" />
		</div>
	</NcNoteCard>
</template>

<script lang="ts">
import { translate as t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import DatabaseSyncOutline from 'vue-material-design-icons/DatabaseSyncOutline.vue'
import indexStatusStore from '../store/indexStatus.ts'

export default defineComponent({
	name: 'IndexProgressBanner',

	components: {
		DatabaseSyncOutline,
		NcNoteCard,
		NcProgressBar,
	},

	setup() {
		const indexStatus = indexStatusStore()
		return { indexStatus }
	},

	computed: {
		message(): string {
			const { indexed, total, progressPercent } = this.indexStatus
			if (total <= 0) {
				return t('photos', 'Speeding up your library — preparing the index…')
			}
			return t(
				'photos',
				'Speeding up your library — indexed {indexed} of {total} photos ({percent}%). The timeline will load faster once this finishes.',
				{ indexed, total, percent: progressPercent },
			)
		},
	},

	mounted() {
		this.indexStatus.start()
	},

	beforeUnmount() {
		this.indexStatus.stop()
	},
})
</script>

<style lang="scss" scoped>
.index-progress-banner {
	margin: 8px 12px 0;

	&__content {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	&__text {
		margin: 0;
	}

	&__bar {
		max-width: 320px;
	}
}
</style>

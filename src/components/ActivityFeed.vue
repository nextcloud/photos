<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Album activity feed. Shows the most recent ~50 events on the
	album in reverse chronological order — file additions, removals,
	reactions. Designed to live in an album-page sidebar / popover.

	Empty-state copy is intentionally cheerful: the feed only fills
	up when there's collaboration happening, so an empty list isn't
	an error, it's a normal state for a freshly-shared album.

	Refresh-on-mount only. Live updates (web-push / event-bus) are
	a follow-up — for now the user pulls down on the album view to
	refresh, same pattern as the rest of the photos app.
-->

<template>
	<aside class="activity-feed" :aria-label="t('photos', 'Album activity')">
		<header class="activity-feed__header">
			<h3 class="activity-feed__title">
				{{ t('photos', 'Activity') }}
			</h3>
			<NcButton
				variant="tertiary"
				:aria-label="t('photos', 'Refresh activity feed')"
				:disabled="loading"
				@click="refresh">
				<template #icon>
					<NcLoadingIcon v-if="loading" :size="18" />
					<RefreshIcon v-else :size="18" />
				</template>
			</NcButton>
		</header>

		<NcEmptyContent
			v-if="!loading && items.length === 0"
			:name="t('photos', 'Quiet here for now')"
			:description="t('photos', 'Activity from your collaborators will show up here as they add photos and react.')">
			<template #icon>
				<MessageOutline :size="48" />
			</template>
		</NcEmptyContent>

		<ul v-else class="activity-feed__list">
			<li
				v-for="item in items"
				:key="item.id"
				class="activity-feed__item">
				<div class="activity-feed__item__icon" aria-hidden="true">
					<component :is="iconFor(item.action)" :size="18" />
				</div>
				<div class="activity-feed__item__body">
					<p class="activity-feed__item__line">
						<strong>{{ item.actorId }}</strong>
						<span>{{ verbFor(item) }}</span>
					</p>
					<p class="activity-feed__item__when">
						{{ relativeTime(item.createdAt) }}
					</p>
				</div>
			</li>
		</ul>
	</aside>
</template>

<script lang="ts">
import type { ActivityItem } from '../services/PhotoActivityService.ts'

import { translate as t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { defineComponent } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import EmoticonOutline from 'vue-material-design-icons/EmoticonOutline.vue'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import ImageRemove from 'vue-material-design-icons/ImageRemove.vue'
import MessageOutline from 'vue-material-design-icons/MessageOutline.vue'
import RefreshIcon from 'vue-material-design-icons/Refresh.vue'
import logger from '../services/logger.ts'
import { fetchActivity } from '../services/PhotoActivityService.ts'

export default defineComponent({
	name: 'ActivityFeed',

	components: {
		EmoticonOutline,
		ImagePlusOutline,
		ImageRemove,
		MessageOutline,
		NcButton,
		NcEmptyContent,
		NcLoadingIcon,
		RefreshIcon,
	},

	props: {
		albumId: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			items: [] as ActivityItem[],
			loading: false,
		}
	},

	watch: {
		albumId: {
			immediate: true,
			handler() {
				this.refresh().catch(() => {})
			},
		},
	},

	methods: {
		t,

		async refresh(): Promise<void> {
			this.loading = true
			try {
				this.items = await fetchActivity(this.albumId)
			} catch (e) {
				// 404 = no access. Don't toast — the album view
				// itself surfaces the access state.
				this.items = []
				logger.debug('photos: activity fetch failed', { error: e })
			} finally {
				this.loading = false
			}
		},

		iconFor(action: string) {
			switch (action) {
				case 'add_file':
					return ImagePlusOutline
				case 'remove_file':
					return ImageRemove
				case 'react_add':
				case 'react_remove':
					return EmoticonOutline
				default:
					return MessageOutline
			}
		},

		// Human-readable verb phrase for each action. The frontend
		// owns this rather than the backend so we can localise
		// without round-tripping translation strings through the
		// activity payload.
		verbFor(item: ActivityItem): string {
			switch (item.action) {
				case 'add_file':
					return t('photos', 'added a photo')
				case 'remove_file':
					return t('photos', 'removed a photo')
				case 'react_add': {
					const emoji = (item.payload?.emoji ?? '') as string
					return t('photos', 'reacted {emoji}', { emoji })
				}
				case 'react_remove': {
					const emoji = (item.payload?.emoji ?? '') as string
					return t('photos', 'removed reaction {emoji}', { emoji })
				}
				default:
					return item.action
			}
		},

		relativeTime(unix: number): string {
			return moment.unix(unix).fromNow()
		},
	},
})
</script>

<style lang="scss" scoped>
.activity-feed {
	display: flex;
	flex-direction: column;
	width: 320px;
	max-width: 100%;
	padding: 16px;
	background: var(--color-main-background);
	border-radius: var(--border-radius-large);

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	&__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	&__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	&__item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 8px 0;
		border-block-start: 1px solid var(--color-border);

		&:first-child {
			border-block-start: 0;
		}

		&__icon {
			flex-shrink: 0;
			width: 28px;
			height: 28px;
			border-radius: 50%;
			background: var(--color-background-hover);
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		&__body {
			flex: 1;
			min-width: 0;
		}

		&__line {
			margin: 0;
			font-size: 0.9rem;
			line-height: 1.35;

			strong {
				font-weight: 600;
				margin-inline-end: 4px;
			}
		}

		&__when {
			margin: 2px 0 0;
			font-size: 0.78rem;
			color: var(--color-text-maxcontrast);
		}
	}
}
</style>

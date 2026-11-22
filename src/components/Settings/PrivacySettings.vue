<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsSection id="privacy-settings" :name="t('photos', 'Privacy')">
		<p class="privacy__intro">
			{{ t('photos', 'Where your photos and their metadata are processed.') }}
		</p>
		<NcLoadingIcon v-if="loading" />
		<ul v-else class="privacy__list">
			<li v-for="item in items" :key="item.id" class="privacy__item">
				<component :is="ICONS[item.id]" class="privacy__icon" :size="20" />
				<div class="privacy__text">
					<div class="privacy__header">
						<span class="privacy__title">{{ item.title }}</span>
						<span class="privacy__state" :class="`privacy__state--${item.state}`">
							{{ privacyStateLabel(item.state) }}
						</span>
					</div>
					<p class="privacy__description">
						{{ item.description }}
					</p>
					<ul v-if="item.details.length > 0" class="privacy__details">
						<li v-for="detail in item.details" :key="detail">
							{{ detail }}
						</li>
					</ul>
					<a
						v-if="item.id === 'publicLinks' && item.state === 'on'"
						class="privacy__link"
						:href="albumsUrl">
						{{ t('photos', 'Manage your albums') }}
					</a>
				</div>
			</li>
		</ul>
	</NcAppSettingsSection>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { PrivacyItem, PrivacyOverview } from '../../utils/privacyOverview.ts'

import axios from '@nextcloud/axios'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref } from 'vue'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import Creation from 'vue-material-design-icons/Creation.vue'
import FaceRecognition from 'vue-material-design-icons/FaceRecognition.vue'
import LinkVariant from 'vue-material-design-icons/LinkVariant.vue'
import MapIcon from 'vue-material-design-icons/Map.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import Server from 'vue-material-design-icons/Server.vue'
import { logger } from '../../services/logger.ts'
import { TILE_SERVER_URL } from '../../utils/mapTiles.ts'
import { buildPrivacyItems, privacyStateLabel } from '../../utils/privacyOverview.ts'

const ICONS: Record<PrivacyItem['id'], Component> = {
	storage: Server,
	places: MapMarker,
	map: MapIcon,
	recognize: FaceRecognition,
	ai: Creation,
	publicLinks: LinkVariant,
}

const albumsUrl = generateUrl('/apps/photos/albums')

const loading = ref(true)
const overview = ref<PrivacyOverview | null>(null)
const items = computed(() => buildPrivacyItems(overview.value, TILE_SERVER_URL))

onMounted(async () => {
	try {
		const { data } = await axios.get<PrivacyOverview>(generateUrl('/apps/photos/api/v1/privacy'))
		overview.value = data
	} catch (error) {
		logger.error('Failed to load the privacy overview', { error })
	} finally {
		loading.value = false
	}
})
</script>

<style scoped lang="scss">
.privacy {
	&__intro {
		color: var(--color-text-maxcontrast);
		margin-bottom: calc(2 * var(--default-grid-baseline));
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: calc(3 * var(--default-grid-baseline));
	}

	&__item {
		display: flex;
		gap: calc(3 * var(--default-grid-baseline));
		align-items: flex-start;
	}

	&__icon {
		flex-shrink: 0;
		align-self: flex-start;
		color: var(--color-text-maxcontrast);
	}

	&__text {
		flex: 1;
		min-width: 0;
	}

	&__header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--default-grid-baseline) calc(2 * var(--default-grid-baseline));
	}

	&__title {
		font-weight: bold;
	}

	&__state {
		padding: 0 calc(2 * var(--default-grid-baseline));
		border: 1px solid var(--color-border-maxcontrast);
		border-radius: var(--border-radius-pill);
		font-size: var(--font-size-small, 13px);
		color: var(--color-text-maxcontrast);
		white-space: nowrap;

		&--local {
			border-color: var(--color-success);
			color: var(--color-success-text);
		}

		&--external,
		&--on {
			border-color: var(--color-warning);
			color: var(--color-warning-text);
		}
	}

	&__description {
		color: var(--color-text-maxcontrast);
	}

	&__details {
		margin-top: var(--default-grid-baseline);
		padding-inline-start: calc(5 * var(--default-grid-baseline));
		list-style: disc;
		color: var(--color-text-maxcontrast);
	}

	&__link {
		display: inline-block;
		margin-top: var(--default-grid-baseline);
		color: var(--color-primary-element);
		text-decoration: underline;
	}
}
</style>

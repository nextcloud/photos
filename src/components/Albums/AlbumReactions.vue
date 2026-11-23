<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="album-reactions" role="group" :aria-label="t('photos', 'Reactions to this album')">
		<NcButton
			v-for="reaction in reactions"
			:key="reaction.emoji"
			size="small"
			:pressed="reaction.ownIds.length > 0"
			:disabled="disabled"
			:title="reaction.actors.join(', ')"
			:aria-label="t('photos', '{emoji} reaction from {names}', { emoji: reaction.emoji, names: reaction.actors.join(', ') })"
			@update:pressed="emit('toggle', reaction.emoji)">
			{{ reaction.emoji }} {{ reaction.actors.length }}
		</NcButton>

		<NcPopover v-model:shown="pickerShown" popupRole="dialog">
			<template #trigger>
				<NcButton
					size="small"
					variant="tertiary"
					:disabled="disabled"
					:aria-label="t('photos', 'Add reaction')"
					:title="t('photos', 'Add reaction')">
					<template #icon>
						<EmoticonPlusOutline :size="20" />
					</template>
				</NcButton>
			</template>
			<div class="album-reactions__picker" role="group" :aria-label="t('photos', 'Add reaction')">
				<NcButton
					v-for="emoji in REACTION_EMOJIS"
					:key="emoji"
					variant="tertiary"
					:pressed="ownEmojis.has(emoji)"
					:aria-label="t('photos', 'React with {emoji}', { emoji })"
					@update:pressed="pick(emoji)">
					{{ emoji }}
				</NcButton>
			</div>
		</NcPopover>
	</div>
</template>

<script setup lang="ts">
import type { AlbumReaction } from '../../composables/useAlbumComments.ts'

import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcPopover from '@nextcloud/vue/components/NcPopover'
import EmoticonPlusOutline from 'vue-material-design-icons/EmoticonPlusOutline.vue'

const props = defineProps<{
	reactions: AlbumReaction[]
	disabled?: boolean
}>()

const emit = defineEmits<{
	toggle: [emoji: string]
}>()

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉']

const pickerShown = ref(false)

const ownEmojis = computed(() => new Set(props.reactions
	.filter((reaction) => reaction.ownIds.length > 0)
	.map((reaction) => reaction.emoji)))

function pick(emoji: string) {
	pickerShown.value = false
	emit('toggle', emoji)
}
</script>

<style lang="scss" scoped>
.album-reactions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--default-grid-baseline);

	&__picker {
		display: flex;
		padding: var(--default-grid-baseline);
	}
}
</style>

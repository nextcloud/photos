<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Post to Social')"
		size="normal"
		@update:open="emit('close')">
		<NcLoadingIcon v-if="loading" :size="32" />

		<NcNoteCard v-else-if="result !== null" type="success">
			<p v-if="result.heldForReview">
				{{ t('photos', 'Your post is waiting for a moderator to approve it.') }}
			</p>
			<template v-else>
				<p>{{ t('photos', 'Your post is published.') }}</p>
				<a
					v-if="result.url !== null"
					class="social-post__link"
					:href="result.url"
					target="_blank"
					rel="noopener noreferrer">{{ t('photos', 'Open the post') }}</a>
			</template>
		</NcNoteCard>

		<form v-else class="social-post" @submit.prevent="submit">
			<NcTextArea
				v-model="text"
				:label="t('photos', 'Text')"
				:disabled="posting"
				resize="vertical" />

			<div v-for="item in items" :key="item.photo.fileid" class="social-post__photo">
				<img
					class="social-post__thumbnail"
					:src="thumbnailUrl(item.photo)"
					alt="">
				<NcTextArea
					v-model="item.description"
					:label="t('photos', 'Alt text for {name}', { name: item.photo.basename })"
					:helperText="item.description.trim() === '' ? t('photos', 'Describe the photo for people who cannot see it.') : ''"
					:maxlength="1500"
					:disabled="posting"
					resize="vertical" />
			</div>

			<fieldset class="social-post__visibility">
				<legend>{{ t('photos', 'Visible to') }}</legend>
				<NcCheckboxRadioSwitch
					v-for="option in visibilityOptions"
					:key="option.value"
					v-model="visibility"
					type="radio"
					name="social-post-visibility"
					:value="option.value"
					:disabled="posting">
					{{ option.label }}
				</NcCheckboxRadioSwitch>
			</fieldset>

			<p class="social-post__hint">
				{{ t('photos', 'Photos are sent at most {size} pixels long, without their location and camera details.', { size: MAX_SOCIAL_EDGE }) }}
			</p>

			<NcNoteCard v-if="error !== null" type="error">
				<p>{{ error.message }}</p>
				<a v-if="error.setupUrl" class="social-post__link" :href="error.setupUrl">{{ t('photos', 'Open Social') }}</a>
			</NcNoteCard>
		</form>

		<template #actions>
			<NcButton v-if="result !== null" variant="primary" @click="emit('close')">
				{{ t('photos', 'Close') }}
			</NcButton>
			<template v-else>
				<NcButton variant="tertiary" :disabled="posting" @click="emit('close')">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="primary" :disabled="loading || posting" @click="submit">
					<template #icon>
						<NcLoadingIcon v-if="posting" :size="20" />
						<SendOutline v-else :size="20" />
					</template>
					{{ t('photos', 'Post') }}
				</NcButton>
			</template>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { SocialError, SocialPhoto, SocialPostResult, SocialVisibility } from '../services/socialPost.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import { logger } from '../services/logger.ts'
import { fetchPhotoCaption, getSocialError, MAX_SOCIAL_EDGE, postToSocial } from '../services/socialPost.ts'

const props = defineProps<{
	/** Photos to post, at most `MAX_SOCIAL_PHOTOS`. */
	photos: PhotoTarget[]
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

const visibilityOptions: { value: SocialVisibility, label: string }[] = [
	{ value: 'public', label: t('photos', 'Everyone') },
	{ value: 'unlisted', label: t('photos', 'Everyone, but not in public timelines') },
	{ value: 'private', label: t('photos', 'Followers only') },
]

const loading = ref(true)
const posting = ref(false)
const text = ref('')
const visibility = ref<SocialVisibility>('public')
const items = ref<SocialPhoto[]>([])
const result = ref<SocialPostResult | null>(null)
const error = ref<SocialError | null>(null)

// `crypto.randomUUID()` needs a secure context, which a server reached over
// plain HTTP is not.
const idempotencyKey = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')

// The generated descriptions are not part of the listings, so they are fetched
// to start the alt texts from.
onMounted(async () => {
	const captions = await Promise.all(props.photos.map(fetchPhotoCaption))
	items.value = props.photos.map((photo, index) => ({ photo, description: captions[index]! }))
	loading.value = false
})

/**
 * @param photo - Photo to show
 */
function thumbnailUrl(photo: PhotoTarget): string {
	return generateUrl('/apps/photos/api/v1/preview/{fileId}?x=256&y=256', { fileId: photo.fileid })
}

async function submit(): Promise<void> {
	if (loading.value || posting.value) {
		return
	}

	posting.value = true
	error.value = null

	try {
		result.value = await postToSocial({
			text: text.value,
			visibility: visibility.value,
			photos: items.value,
			idempotencyKey,
		})
	} catch (error_) {
		logger.error('Error posting photos to Social', { error: error_ })
		error.value = getSocialError(error_)
	} finally {
		posting.value = false
	}
}
</script>

<style lang="scss" scoped>
.social-post {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);

	&__photo {
		display: flex;
		align-items: flex-start;
		gap: calc(var(--default-grid-baseline) * 3);
	}

	&__thumbnail {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);
	}

	&__link {
		text-decoration: underline;
	}

	&__visibility legend {
		font-weight: bold;
	}

	&__hint {
		color: var(--color-text-maxcontrast);
	}
}
</style>

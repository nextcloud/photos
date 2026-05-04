<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Emoji reaction bar for a photo in a shared album. Shows six
	picker emoji at all times, with a count badge + filled state
	for any emoji the user has already reacted with. Tap toggles.

	Renders nothing when there's no album context (i.e. browsing
	the timeline outside an album) — reactions are an album-only
	feature so they have a recipient list.

	Optimistic update: tapping an emoji flips the local state
	immediately; the server is the source of truth on the next
	`fetchReactions` call. Failures revert via showError +
	reload.
-->

<template>
	<div class="reaction-bar" @click.stop>
		<button
			v-for="emoji in EMOJI_PICKER"
			:key="emoji"
			type="button"
			class="reaction-bar__btn"
			:class="{ 'reaction-bar__btn--mine': mine.has(emoji) }"
			:aria-pressed="mine.has(emoji)"
			:aria-label="ariaLabel(emoji)"
			:disabled="busy.has(emoji)"
			@click="onToggle(emoji)">
			<span class="reaction-bar__emoji">{{ emoji }}</span>
			<span v-if="counts[emoji] > 0" class="reaction-bar__count">{{ counts[emoji] }}</span>
		</button>
	</div>
</template>

<script lang="ts">
import type { ReactionSummary } from '../services/PhotoReactionService.ts'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import logger from '../services/logger.ts'
import { fetchReactions, toggleReaction } from '../services/PhotoReactionService.ts'

// Same set the controller whitelist accepts. Keep them in sync —
// the backend rejects anything else.
const EMOJI_PICKER = ['❤️', '👍', '🔥', '😂', '😮', '😢'] as const

export default defineComponent({
	name: 'ReactionBar',

	props: {
		albumId: {
			type: Number,
			required: true,
		},

		fileId: {
			type: Number,
			required: true,
		},
	},

	emits: ['changed'],

	data() {
		return {
			counts: {} as Record<string, number>,
			mine: new Set<string>() as Set<string>,
			busy: new Set<string>() as Set<string>,
			EMOJI_PICKER: EMOJI_PICKER as readonly string[],
		}
	},

	watch: {
		// Re-fetch when the slideshow steps to a different photo;
		// the bar is re-mounted via v-if in the parent so this also
		// covers the initial load.
		fileId: {
			immediate: true,
			handler() {
				this.refresh().catch(() => {})
			},
		},
	},

	methods: {
		t,

		ariaLabel(emoji: string): string {
			const count = this.counts[emoji] ?? 0
			return this.mine.has(emoji)
				? t('photos', 'Remove your {emoji} reaction ({count} total)', { emoji, count })
				: t('photos', 'React with {emoji} ({count} so far)', { emoji, count })
		},

		async refresh(): Promise<void> {
			try {
				const res = await fetchReactions(this.albumId, this.fileId)
				const counts: Record<string, number> = {}
				const mine = new Set<string>()
				for (const r of res.reactions as ReactionSummary[]) {
					counts[r.emoji] = r.count
					if (r.reactedByMe) {
						mine.add(r.emoji)
					}
				}
				this.counts = counts
				this.mine = mine
			} catch (e) {
				// 404 is the "you can't see this album" case — bail
				// silently rather than nag the user with a toast.
				logger.debug('photos: reactions fetch failed', { error: e })
			}
		},

		async onToggle(emoji: string): Promise<void> {
			if (this.busy.has(emoji)) {
				return
			}
			// Optimistic flip. Snapshot the previous values so we
			// can revert cleanly on failure.
			const prevMine = this.mine.has(emoji)
			const prevCount = this.counts[emoji] ?? 0
			const nextMine = !prevMine
			const nextCount = nextMine ? prevCount + 1 : Math.max(0, prevCount - 1)

			const newMine = new Set(this.mine)
			if (nextMine) {
				newMine.add(emoji)
			} else {
				newMine.delete(emoji)
			}
			this.mine = newMine
			this.counts = { ...this.counts, [emoji]: nextCount }

			const newBusy = new Set(this.busy)
			newBusy.add(emoji)
			this.busy = newBusy

			try {
				await toggleReaction(this.albumId, this.fileId, emoji)
				this.$emit('changed')
			} catch (e) {
				// Revert.
				const revertedMine = new Set(this.mine)
				if (prevMine) {
					revertedMine.add(emoji)
				} else {
					revertedMine.delete(emoji)
				}
				this.mine = revertedMine
				this.counts = { ...this.counts, [emoji]: prevCount }
				showError(t('photos', 'Failed to update reaction'))
				logger.error('photos: toggle reaction failed', { error: e })
			} finally {
				const cleared = new Set(this.busy)
				cleared.delete(emoji)
				this.busy = cleared
			}
		},
	},
})
</script>

<style lang="scss" scoped>
.reaction-bar {
	display: inline-flex;
	gap: 4px;
	padding: 6px 8px;
	border-radius: 24px;
	background: rgba(0, 0, 0, 0.55);
	backdrop-filter: blur(8px);

	&__btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border: 1px solid transparent;
		border-radius: 16px;
		background: transparent;
		color: #fff;
		font: inherit;
		cursor: pointer;
		transition: background 160ms ease-out, border-color 160ms ease-out, transform 120ms ease-out;

		&:hover:not(:disabled) {
			background: rgba(255, 255, 255, 0.1);
			transform: scale(1.05);
		}

		&:active:not(:disabled) {
			transform: scale(0.96);
		}

		&:disabled {
			cursor: progress;
			opacity: 0.6;
		}

		&--mine {
			background: rgba(255, 255, 255, 0.18);
			border-color: rgba(255, 255, 255, 0.4);
		}
	}

	&__emoji {
		font-size: 1.1rem;
		line-height: 1;
	}

	&__count {
		font-size: 0.78rem;
		font-variant-numeric: tabular-nums;
		min-width: 10px;
		text-align: center;
		opacity: 0.9;
	}
}
</style>

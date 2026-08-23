<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="shortcuts">
		<section v-for="group in groups" :key="group.title" class="shortcuts__group">
			<h3 class="shortcuts__group-title">
				{{ group.title }}
			</h3>
			<dl class="shortcuts__list">
				<div v-for="shortcut in group.shortcuts" :key="shortcut.description" class="shortcuts__row">
					<dt class="shortcuts__keys">
						<span v-for="(key, index) in shortcut.keys" :key="key" class="shortcuts__key-group">
							<kbd class="shortcuts__key">{{ key }}</kbd>
							<span v-if="index < shortcut.keys.length - 1" class="shortcuts__separator"> / </span>
						</span>
					</dt>
					<dd class="shortcuts__description">
						{{ shortcut.description }}
					</dd>
				</div>
			</dl>
		</section>
	</div>
</template>

<script setup lang="ts">
import { translate as t } from '@nextcloud/l10n'

type Shortcut = { keys: string[], description: string }
type ShortcutGroup = { title: string, shortcuts: Shortcut[] }

// Only shortcuts the app actually implements are listed, so nothing here promises
// a binding that does nothing. Today that is the photo slideshow (PhotoSlideshow.vue).
const groups: ShortcutGroup[] = [
	{
		title: t('photos', 'Slideshow'),
		shortcuts: [
			{ keys: ['←', '→'], description: t('photos', 'Previous / next photo') },
			{ keys: ['Space'], description: t('photos', 'Play or pause the slideshow') },
			{ keys: ['i'], description: t('photos', 'Show or hide photo information') },
			{ keys: ['Esc'], description: t('photos', 'Close the slideshow') },
		],
	},
]
</script>

<style lang="scss" scoped>
.shortcuts {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 4);
}

.shortcuts__group-title {
	margin: 0 0 calc(var(--default-grid-baseline) * 2);
	font-weight: bold;
}

.shortcuts__list {
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 1);
}

.shortcuts__row {
	display: flex;
	align-items: baseline;
	gap: calc(var(--default-grid-baseline) * 3);
}

.shortcuts__keys {
	flex: 0 0 auto;
	min-width: 96px;
	text-align: end;
}

.shortcuts__key {
	display: inline-block;
	min-width: calc(var(--default-clickable-area) - var(--default-grid-baseline) * 2);
	padding: 2px 8px;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius);
	background-color: var(--color-background-hover);
	color: var(--color-main-text);
	font-family: var(--font-face, monospace);
	font-size: 13px;
	text-align: center;
	box-shadow: 0 1px 1px rgba(var(--color-box-shadow-rgb), 0.3);
}

.shortcuts__separator {
	color: var(--color-text-maxcontrast);
}

.shortcuts__description {
	margin: 0;
	color: var(--color-main-text);
}
</style>

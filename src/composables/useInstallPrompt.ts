/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Ref } from 'vue'

import { computed, shallowRef } from 'vue'

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<unknown>
}

// The browser offers the installation once, early after the page is loaded,
// so the offer is kept until the user asks for it.
const installPrompt = shallowRef<BeforeInstallPromptEvent | null>(null)

window.addEventListener('beforeinstallprompt', (event) => {
	event.preventDefault()
	installPrompt.value = event as BeforeInstallPromptEvent
})

window.addEventListener('appinstalled', () => {
	installPrompt.value = null
})

/**
 * The offer of the browser to install Photos as an app, where it makes one.
 */
export function useInstallPrompt(): {
	canInstall: Readonly<Ref<boolean>>
	install: () => Promise<void>
} {
	const canInstall = computed(() => installPrompt.value !== null)

	/**
	 * Show the installation dialog of the browser. An offer can only be used once.
	 */
	async function install(): Promise<void> {
		const prompt = installPrompt.value
		installPrompt.value = null
		await prompt?.prompt()
	}

	return { canInstall, install }
}

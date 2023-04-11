<template>
	<NcAppSettingsDialog :open="open"
		:show-navigation="true"
		:title="t('photos', 'Photos settings')"
		:additional-trap-elements="[filePicker]"
		@update:open="onClose">
		<NcAppSettingsSection id="layout-settings" :title="t('photos', 'View')">
			<CroppedLayoutSettings />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="directory-settings" :title="t('photos', 'Photos directory')">
			<PhotosLocationSettings />
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script>
import { NcAppSettingsDialog, NcAppSettingsSection } from '@nextcloud/vue'

import CroppedLayoutSettings from './CroppedLayoutSettings.vue'
import PhotosLocationSettings from './PhotosLocationSettings.vue'

export default {
	name: 'SettingsDialog',

	components: {
		NcAppSettingsDialog,
		NcAppSettingsSection,
		CroppedLayoutSettings,
		PhotosLocationSettings,
	},

	props: {
		open: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			filePicker: null,
			observer: null,
		}
	},

	mounted() {
		// get reference to the file picker dialog if it is opened
		 this.observer = new MutationObserver((mutationList, observer) => {
			mutationList.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					if (node?.classList?.contains('oc-dialog')) {
						this.filePicker = node
					}
				})
			})
		})
		this.observer.observe(document.body, {
			subtree: true,
			childList: true,
		})
	},

	unmounted() {
		this.observer.disconnect()
	},

	methods: {
		// This can only be called if the AppSettingsDialog
		// is shown. So closing only
		onClose() {
			this.$emit('update:open', false)
		},
	},
}
</script>

<style lang="scss">
.app-settings {
	.app-settings-section__desc {
		margin-top: -0.2em;
		margin-bottom: 1em;
		opacity: .7;
	}
	.app-settings-section__input {
		width: 100%;
		max-width: 300px;
	}
}
</style>

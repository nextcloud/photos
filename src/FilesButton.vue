<!--
 - @copyright Copyright (c) 2020 cnmicha <cnmicha@bhb-networks.com>
 -
 - @author cnmicha <cnmicha@bhb-networks.com>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<span class="btn-open-in-photos">
		<Actions v-if="!photosAppOpening">
			<ActionLink
				icon="icon-picture"
				:href="photosAppUrl"
				@click="notifyPhotosAppOpening">
				{{ t('photos', 'Show in photos') }}
			</ActionLink>
		</Actions>
		<span v-else class="btn-open-in-photos__loading icon-loading-small" />
	</span>
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionLink from '@nextcloud/vue/dist/Components/ActionLink'

export default {
	name: 'FilesButton',

	components: {
		Actions,
		ActionLink,
	},

	data() {
		return {
			photosAppUrl: '#',
			photosAppOpening: false,
		}
	},

	created() {
		/**
		 * The getCurrentDirectory() function called in this.updateButtonURL is undefined when called inside a computed property (e.g. for setting the href attribute).
		 * Therefore, we need to use an event-based approach to listen for directory changes in the files app and update the photos button URL every time.
		 */
		document.querySelector('#controls').addEventListener('DOMSubtreeModified', this.updateButtonURL)
	},

	methods: {
		updateButtonURL() {
			/**
			 * As we are hooking into the files app and the event we're listening on is executed very early as well,
			 * we need to check if the getCurrentDirectory function has already been made available by the files app.
			 */
			if (typeof FileList.getCurrentDirectory === 'function') {
				const dir = FileList.getCurrentDirectory().replace(/^\//, '')
				this.photosAppUrl = generateUrl(`apps/photos/albums/${dir}`)
			}
		},

		notifyPhotosAppOpening() {
			this.photosAppOpening = true
		},
	},
}
</script>

<style lang="scss" scoped>
.btn-open-in-photos {
	float: right;
	margin-right: 44px;
}

.btn-open-in-photos__loading {
	margin: 22px;
	padding-bottom: 20px;
}
</style>

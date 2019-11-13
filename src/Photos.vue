<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<Content app-name="photos">
		<AppNavigation>
			<AppNavigationItem :to="{name: 'root'}"
				class="app-navigation__photos"
				:title="t('photos', 'Your photos')"
				icon="icon-photos" />
			<AppNavigationItem to="/favorites" :title="t('photos', 'Favorites')" icon="icon-favorite" />
			<AppNavigationItem :to="{name: 'albums'}" :title="t('photos', 'Your albums')" icon="icon-files-dark" />
			<AppNavigationItem :to="{name: 'shared'}" :title="t('photos', 'Shared albums')" icon="icon-share" />
			<AppNavigationItem :to="{name: 'tags'}" :title="t('photos', 'Tagged photos')" icon="icon-tag" />
			<AppNavigationItem :to="{name: 'maps'}" :title="t('photos', 'Locations')" icon="icon-address" />
		</AppNavigation>
		<AppContent :class="{ 'icon-loading': loading }">
			<router-view v-show="!loading" :loading.sync="loading" />

			<!-- svg img loading placeholder (linked to the File component) -->
			<span class="hidden-visually" role="none" v-html="svgplaceholder" />
		</AppContent>
	</Content>
</template>

<script>
import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import svgplaceholder from './assets/img-placeholder.svg'

export default {
	name: 'Photos',
	components: {
		Content,
		AppContent,
		AppNavigation,
		AppNavigationItem,
	},
	data: function() {
		return {
			loading: true,
			svgplaceholder,
		}
	},
}
</script>
<style lang="scss" scoped>
.app-navigation__photos::v-deep .app-navigation-entry-icon.icon-photos {
	background-size: 20px;
}
</style>

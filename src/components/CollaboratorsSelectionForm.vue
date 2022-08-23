<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 -
 - @license AGPL-3.0-or-later
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
	<form class="add-collaborators-form" @submit.prevent>
		<h2 class="form-title">
			{{ t('photos', 'Add collaborators') }}
		</h2>
		<div class="form-subtitle">
			{{ t('photos', 'Add users who can edit your album') }}
		</div>
		<div class="form-subtitle">
			{{ t('photos', 'Share this album via link') }}
		</div>
		<div class="form-inputs">
			<Magnify /><input type="text" name="search" :placeholder="t('photos', 'Search users, email or federated cloud ID')">
		</div>
		<div class="form-buttons">
			<slot collaborators="collaborators" />
		</div>
	</form>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	name: 'CollaboratorsSelectionForm',

	components: {
		Magnify,
	},

	data() {
		return {
			loading: false,
		}
	},
}
</script>
<style lang="scss" scoped>
.add-collaborators-form {
	display: flex;
	flex-direction: column;
	height: 500px;
	padding: 16px;

	.form-title {
		font-weight: bold;
	}

	.form-subtitle {
		color: var(--color-text-lighter);
	}

	.form-inputs {
		flex-grow: 1;
		justify-items: flex-end;

		input {
			width: 100%;
		}

		label {
			display: flex;
			margin-top: 16px;

			::v-deep svg {
				margin-right: 12px;
			}
		}
	}

	.form-buttons {
		display: flex;
		justify-content: space-between;
	}

}
</style>

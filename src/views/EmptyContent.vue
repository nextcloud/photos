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
	<div v-if="isReady" class="emptycontent">
		<div v-if="haveIllustration" class="illustration" v-html="illustration" />
		<div v-else class="icon-error" />
		<h2><slot /></h2>
	</div>
</template>

<script>
export default {
	name: 'EmptyContent',
	props: {
		illustrationName: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			illustration: '',
		}
	},
	computed: {
		/**
		 * Does this component have an illustration
		 *
		 * @returns {boolean}
		 */
		haveIllustration() {
			return this.illustrationName !== ''
		},

		/**
		 * Is the illustration loaded
		 *
		 * @returns {boolean}
		 */
		isLoaded() {
			if (!this.haveIllustration) {
				return true
			}
			return this.illustration !== ''
		},

		/**
		 * The component is ready if the illustration
		 * is done loading or if there is none
		 *
		 * @returns {boolean}
		 */
		isReady() {
			return !this.haveIllustration || (this.haveIllustration && this.isLoaded)
		},
	},

	/**
	 * Fetch the new illustration as soon as it changes
	 */
	watch: {
		illustrationName() {
			this.getIllustration()
		},
	},
	beforeMount() {
		this.getIllustration()
	},

	methods: {
		/**
		 * Fetch the illustration as webpack chunk
		 */
		async getIllustration() {
			this.illustration = ''
			if (this.illustrationName !== '') {
				try {
					const illustration = await import(`../assets/Illustrations/${this.illustrationName}.svg`)
					this.illustration = illustration.default
				} catch (error) {
					console.error('Could not get the error illustration', error)
				}
			}
		},
	},

}
</script>

<style lang="scss">
.illustration {
	min-width: 200px;
	max-width: 15%;
	width: 300px;
	margin: auto;
	margin-bottom: 20px;
	position: relative;

	svg {
		width: 100%;
		height: 100%;
		max-height: 40vh;
	}

	// change colour of illustration
	[fill*='6c63ff'] {
		fill: var(--color-primary-element);
	}
}
</style>

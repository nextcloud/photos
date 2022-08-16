<template>
	<div class="merge-form face-list">
		<template v-if="loading">
			<Loader class="loader" />
		</template>
		<template v-else>
			<div v-for="face in filteredFaces"
				:key="face.basename"
				class="face-list__item"
				@click="handleSelect(face.basename)">
				<div class="face-list__item__crop-container">
					<img class="face-list__item__image"
						:src="getCoverUrl(face.basename)"
						:style="getCoverStyle(face.basename, 50)">
				</div>
				<div class="face-list__item__details">
					{{ face.basename }}
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import FaceCoverMixin from '../mixins/FaceCoverMixin.js'
import { generateUrl } from '@nextcloud/router'
import { mapGetters } from 'vuex'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import Loader from './Loader'

export default {
	name: 'FaceMergeForm',
	components: { Loader },
	mixins: [
		FaceCoverMixin,
		FetchFacesMixin,
	],
	props: {
		firstFace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
		}
	},
	computed: {
		...mapGetters([
			'files',
			'faces',
			'facesFiles',
		]),

		filteredFaces() {
			return Object.values(this.faces).filter(face => face.basename !== this.firstFace)
		},
	},
	methods: {
		getCoverUrl(faceName) {
			const cover = this.getFaceCover(faceName)
			if (!cover) {
				this.fetchFaceContent(faceName)
				return ''
			}
			return generateUrl(`/core/preview?fileId=${cover.fileid}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		handleSelect(faceName) {
			this.$emit('select', faceName)
			this.loading = true
		},
	},
}
</script>

<style scoped lang="scss">
.face-list {
	display: flex;
	flex-direction: column;
	height: 350px;

	&__item {
		display: flex;
		flex-direction: row;
		padding: 10px;
		border-radius: var(--border-radius);
		align-items: center;
		cursor: pointer;

		* {
			cursor: pointer;
		}

		&__crop-container {
			overflow: hidden;
			width: 50px;
			height: 50px;
			border-radius: 50px;
			position: relative;
			background: var(--color-background-darker);
		}

		&:hover {
			background: var(--color-background-hover);
		}

		&__details {
			padding: 10px;
		}
	}
}

.loader {
	margin-top: 25%;
}
</style>

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
						:style="getCoverStyle(face.basename)">
				</div>
				<div class="face-list__item__details">
					<span :class="{'hidden-visually': face.basename.match(/^[0-9]+$/)}">{{ face.basename }}</span>
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
			return Object.values(this.faces).filter(face => face.basename !== this.firstFace).sort((a, b) => {
				if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
					return 0
				}
				return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length
			})
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
	flex-direction: row;
	height: 350px;
	flex-wrap: wrap;
	padding: 12px;

	&__item {
		display: flex;
		flex-direction: column;
		padding: 10px;
		border-radius: var(--border-radius);
		align-items: center;
		cursor: pointer;
		width: 120px;

		* {
			cursor: pointer;
		}

		&__crop-container {
			overflow: hidden;
			width: 60px;
			height: 60px;
			border-radius: 60px;
			position: relative;
			background: var(--color-background-darker);
			--photos-face-width: 60px;
		}

		&:hover, &:focus {
			background: var(--color-background-hover);
		}

		&__details {
			padding: 10px;
			height: 1em;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;
			text-align: center;
		}
	}
}

.loader {
	margin-top: 25%;
}
</style>

<template>
	<h2 class="grid-title" :style="{height: item.height + 'px'}">
		{{ item.injected.month }}
		<span>{{ item.injected.year }}</span>
	</h2>
</template>

<script>
export default {
	name: 'SeparatorVirtualGrid',

	inheritAttrs: false,

	props: {
		item: {
			type: Object,
			required: true,
			injected: {
				type: Object,
				required: true,
				month: {
					type: String,
					required: true,
				},
				year: {
					type: String,
					required: true,
				},
			},
			height: {
				type: Number,
				required: true,
			},
		},
	},
}
</script>

<style lang="scss" scoped>
.grid-title {
	grid-column: 1/8;
	padding: 48px 0 12px 0;
	background:#fff;
	margin: 0;
	span {
		font-weight: normal;
	}
	&.first-title {
		padding: 0 0 12px 0;
	}
}
</style>

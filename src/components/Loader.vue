
<template>
	<div class="loader" icon="loading">
		<slot name="icon">
			<span :class="['loading']" />
		</slot>
	</div>
</template>

<script>
export default {
	name: 'Loader',
}
</script>

<style lang="scss">
.loader {
	display: grid;
	height: 60px;
}
</style>

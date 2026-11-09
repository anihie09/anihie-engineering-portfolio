<script lang="ts">
	import ArchiveLoader from '$lib/ArchiveLoader.svelte';
</script>

<svelte:head>
	<title>ANI — Archive</title>
	<meta
		name="description"
		content="ANI — archive"
	/>
</svelte:head>

<ArchiveLoader />

<!-- archive content goes here (blank for now) -->
<main class="archive">
	<h1 class="sr-only">Archive</h1>
</main>

<style>
	.archive {
		min-height: 100vh;
		background: #000;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>

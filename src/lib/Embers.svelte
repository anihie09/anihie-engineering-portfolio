<script lang="ts">
	/*
	 * Rising fire embers (FIRESTARTER style): small glowing streaks that
	 * drift up and sideways, fading in and out. Purely decorative.
	 */
	let { count = 26 }: { count?: number } = $props();

	// fixed pseudo-random layout so server and browser render the same thing
	function rand(i: number, k: number) {
		const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
		return x - Math.floor(x);
	}

	const colors = ['var(--ember, #ff5a2a)', 'var(--strawberry, #e8132f)', 'var(--petal-rouge, #ff2a7f)', '#ffb38a'];

	const embers = $derived(Array.from({ length: count }, (_, i) => ({
		left: rand(i, 1) * 100,
		size: 2 + rand(i, 2) * 3,
		len: 6 + rand(i, 3) * 14,
		dur: 4 + rand(i, 4) * 5,
		delay: -rand(i, 5) * 9,
		drift: (rand(i, 6) - 0.3) * 160,
		color: colors[Math.floor(rand(i, 7) * colors.length)]
	})));
</script>

<div
	class="embers"
	aria-hidden="true"
>
	{#each embers as e}
		<span
			style="
				left: {e.left}%;
				width: {e.size}px;
				height: {e.len}px;
				--c: {e.color};
				--drift: {e.drift}px;
				animation-duration: {e.dur}s;
				animation-delay: {e.delay}s;
			"
		></span>
	{/each}
</div>

<style>
	.embers {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	span {
		position: absolute;
		bottom: -30px;

		border-radius: 2px;
		background: var(--c);
		box-shadow:
			0 0 6px var(--c),
			0 0 14px var(--c);

		opacity: 0;
		animation-name: rise;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes rise {
		0% {
			transform: translate3d(0, 0, 0) rotate(28deg);
			opacity: 0;
		}

		12% {
			opacity: 0.95;
		}

		70% {
			opacity: 0.7;
		}

		100% {
			transform: translate3d(var(--drift), -115vh, 0) rotate(28deg);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation: none;
			opacity: 0;
		}
	}
</style>

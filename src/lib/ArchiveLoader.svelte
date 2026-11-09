<script lang="ts">
	import { onMount } from 'svelte';
	import Orb from '$lib/Orb.svelte';
	import Embers from '$lib/Embers.svelte';

	/*
	 * Loading screen for the archive.
	 * A large orb spins up inside a progress ring while the percentage
	 * counts up. At 100% the orb flares, then the screen opens outward
	 * from the centre as an expanding circle, revealing the page.
	 */
	const LOAD_MS = 2600;
	const EXIT_MS = 1100;

	let progress = $state(0);
	let leaving = $state(false);
	let gone = $state(false);

	const R = 120;
	const C = 2 * Math.PI * R;

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const start = performance.now();
		let raf = 0;

		const tick = (now: number) => {
			const p = Math.min((now - start) / LOAD_MS, 1);
			const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
			progress = Math.round(e * 100);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		const t1 = setTimeout(() => (leaving = true), reduced ? 600 : LOAD_MS + 250);
		const t2 = setTimeout(() => (gone = true), (reduced ? 600 : LOAD_MS + 250) + EXIT_MS);

		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(t1);
			clearTimeout(t2);
		};
	});
</script>

{#if !gone}
	<div
		class="archive-loader"
		class:leaving
		aria-hidden="true"
	>
		<div class="haze-img"></div>
		<div class="haze"></div>
		<Embers count={30} />

		<div class="center">
			<svg
				class="progress"
				viewBox="0 0 280 280"
			>
				<circle class="track" cx="140" cy="140" r={R} />
				<circle
					class="bar"
					cx="140"
					cy="140"
					r={R}
					style="stroke-dasharray: {C}; stroke-dashoffset: {C * (1 - progress / 100)};"
				/>
			</svg>

			<div class="orb-wrap">
				<Orb
					size={180}
					speed={3}
					bright={progress >= 100}
				/>
			</div>
		</div>

		<div class="readout">
			<span class="title">ACCESSING ARCHIVE</span>
			<span class="pct">{String(progress).padStart(3, '0')}%</span>
		</div>

		<div class="ring-out"></div>
	</div>
	<span class="sr-only" role="status">Loading archive</span>
{/if}

<style>
	.archive-loader {
		position: fixed;
		inset: 0;
		z-index: 10000;

		display: grid;
		place-items: center;

		background: #070205;

		font-family: var(--font-mono);
		color: #fbeff3;

		/* the screen opens outward from the centre when leaving */
		clip-path: circle(150% at 50% 50%);
	}

	.archive-loader.leaving {
		animation: open-out 1.1s cubic-bezier(0.76, 0, 0.24, 1) 0.15s forwards;
	}

	.haze {
		position: absolute;
		inset: 0;

		background:
			radial-gradient(circle at 50% 50%, rgba(255, 42, 127, 0.16), transparent 45%),
			radial-gradient(circle at 50% 50%, rgba(194, 24, 122, 0.1), transparent 70%);
	}

	.haze-img {
		position: absolute;
		inset: -4%;

		background: url('/textures/firestarter-haze.jpg') center / cover no-repeat;
		opacity: 0.45;

		animation: haze-drift 14s ease-in-out infinite alternate;
	}

	@keyframes haze-drift {
		from { transform: scale(1.05) translate3d(0, 0, 0); }
		to { transform: scale(1.12) translate3d(1.5%, -1%, 0); }
	}

	.center {
		position: relative;

		width: 280px;
		height: 280px;

		display: grid;
		place-items: center;
	}

	.progress {
		position: absolute;
		inset: 0;

		transform: rotate(-90deg);
	}

	.track {
		fill: none;
		stroke: rgba(255, 255, 255, 0.1);
		stroke-width: 1;
	}

	.bar {
		fill: none;
		stroke: var(--petal-rouge, #ff2a7f);
		stroke-width: 2;
		stroke-linecap: round;

		filter: drop-shadow(0 0 6px rgba(255, 42, 127, 0.8));
		transition: stroke-dashoffset 120ms linear;
	}

	.orb-wrap {
		animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.leaving .orb-wrap {
		animation: flare 0.5s ease-out forwards;
	}

	.readout {
		position: absolute;
		left: 50%;
		top: calc(50% + 170px);

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;

		transform: translateX(-50%);
	}

	.title {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.32em;
	}

	.pct {
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		color: var(--hot-red, #ff3d8a);
		font-variant-numeric: tabular-nums;
	}

	/* bright ring that rides the edge of the opening circle */
	.ring-out {
		position: absolute;
		left: 50%;
		top: 50%;

		width: 10px;
		height: 10px;

		border: 2px solid var(--petal-rouge, #ff2a7f);
		border-radius: 50%;

		box-shadow:
			0 0 18px rgba(255, 42, 127, 0.9),
			inset 0 0 18px rgba(194, 24, 122, 0.6);

		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}

	.leaving .ring-out {
		animation: ring-out 1.1s cubic-bezier(0.76, 0, 0.24, 1) 0.15s forwards;
	}

	.sr-only {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: scale(0.6);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes flare {
		to {
			transform: scale(1.25);
			opacity: 0;
		}
	}

	@keyframes open-out {
		from { clip-path: circle(150% at 50% 50%); }
		to { clip-path: circle(0% at 50% 50%); }
	}

	@keyframes ring-out {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0);
		}

		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(260);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.archive-loader.leaving {
			animation: fade 0.4s ease forwards;
		}

		.leaving .ring-out {
			animation: none;
		}

		@keyframes fade {
			to { opacity: 0; }
		}
	}
</style>

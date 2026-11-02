<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Loading screen inspired by a "magnetic tape" caution readout:
	 * a tag, two lines of status text, and a bar of diagonal stripes
	 * that fill one by one. When it's done (leaving = true) the stripes
	 * flash, the readout lifts away, and the black background opens up
	 * in diagonal slats to reveal the page.
	 * - instant: start fully visible (first boot)
	 * Timing must match +layout.svelte (exit takes ~1.5s).
	 */
	let {
		leaving = false,
		instant = false
	}: { leaving?: boolean; instant?: boolean } = $props();

	const STRIPES = 8;
	const SLATS = 9;

	let progress = $state(0);
	const filled = $derived(Math.floor((progress / 100) * STRIPES + 0.0001));
	const done = $derived(progress >= 100);

	const pad = (n: number, l = 3) => String(n).padStart(l, '0');

	onMount(() => {
		const start = performance.now();
		const duration = 2500;
		let raf = 0;

		const tick = (now: number) => {
			const p = Math.min((now - start) / duration, 1);
			// ease in-out so the bar starts and lands gently
			const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
			progress = Math.round(e * 100);
			if (p < 1) raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<div
	class="loading-screen"
	class:instant
	class:leaving
	aria-hidden="true"
>
	<!-- the black background, built from diagonal slats so it can open up -->
	<div class="slats">
		{#each Array(SLATS) as _, i}
			<span style="--i: {i}; --n: {SLATS};"></span>
		{/each}
	</div>

	<div class="texture"></div>

	<div class="readout">
		<div class="head">
			<span class="tag">AN.LE</span>

			<div class="head-text">
				<span>PORTFOLIO</span>
				<span class="dim">MECHANICAL ENGINEERING ARCHIVE</span>
			</div>

			<span class="pct">{pad(progress)}%</span>
		</div>

		<div
			class="tape"
			class:done
		>
			{#each Array(STRIPES) as _, i}
				<span
					class="stripe"
					class:on={i < filled}
					class:head={i === filled - 1 && !done}
				></span>
			{/each}
		</div>

		<div class="foot">
			<span class="code">0x{pad(progress * 7 + 101, 4)}</span>

			<div class="foot-text">
				<span>STATUS</span>
				<span class="dim">{done ? 'TRANSFER COMPLETE' : 'TRANSFERRING DATA'}</span>
			</div>

			<span class="rec">
				<span class="rec-dot"></span>
				LIVE
			</span>
		</div>
	</div>
</div>

<span class="sr-only" role="status">Loading</span>

<style>
	.loading-screen {
		position: fixed;
		inset: 0;
		z-index: 10000;

		overflow: hidden;
		pointer-events: none;

		font-family: var(--font-mono);
		color: #eef3f6;

		animation: fade-in 0.45s ease both;
	}

	.loading-screen.instant {
		animation: none;
	}

	/* ---------- slats (the background) ---------- */

	.slats {
		position: absolute;
		inset: 0 -25%;
	}

	.slats span {
		position: absolute;
		top: -5%;
		bottom: -5%;

		left: calc(var(--i) * (100% / var(--n)) - 1px);
		width: calc(100% / var(--n) + 2px);

		background: #060406;

		transform: skewX(-28deg) scaleX(1);
		transform-origin: right center;
	}

	/* bright edge on each slat, only seen while it opens */
	.slats span::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;

		width: 2px;

		background: var(--edge, #f2f7fa);
		box-shadow: 0 0 14px var(--edge, rgba(220, 238, 250, 0.9));

		opacity: 0;
	}

	/* slat edges cycle through the palette */
	.slats span:nth-child(4n + 1) { --edge: #f2f7fa; }
	.slats span:nth-child(4n + 2) { --edge: var(--petal-rouge); }
	.slats span:nth-child(4n + 3) { --edge: var(--strawberry); }
	.slats span:nth-child(4n + 4) { --edge: var(--rose-punch); }

	.leaving .slats span {
		animation: slat-open 0.7s cubic-bezier(0.76, 0, 0.24, 1) calc(0.38s + var(--i) * 0.06s) forwards;
	}

	.leaving .slats span::after {
		animation: edge 0.7s ease calc(0.38s + var(--i) * 0.06s) forwards;
	}

	/* ---------- texture ---------- */

	.texture {
		position: absolute;
		inset: 0;

		background:
			repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px),
			radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05), transparent 55%),
			radial-gradient(ellipse 60% 45% at 18% 85%, rgba(136, 57, 85, 0.22), transparent 70%),
			radial-gradient(ellipse 55% 40% at 85% 12%, rgba(76, 53, 73, 0.35), transparent 70%),
			url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>");

		transition: opacity 0.4s ease;
	}

	.leaving .texture {
		opacity: 0;
	}

	/* ---------- readout ---------- */

	.readout {
		position: absolute;
		left: 50%;
		top: 50%;

		width: min(560px, 82vw);

		transform: translate(-50%, -50%);

		/* soft bloom like an old monitor */
		filter: drop-shadow(0 0 6px rgba(220, 238, 250, 0.35));

		transition:
			transform 0.5s cubic-bezier(0.65, 0, 0.35, 1) 0.15s,
			opacity 0.4s ease 0.2s,
			filter 0.5s ease 0.15s;
	}

	.leaving .readout {
		transform: translate(-50%, -50%) scale(1.08);
		opacity: 0;
		filter: drop-shadow(0 0 14px rgba(220, 238, 250, 0.8)) blur(4px);
	}

	.head,
	.foot {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.tag {
		padding: 3px 9px;

		border: 1.5px solid #eef3f6;
		background: rgba(238, 243, 246, 0.9);
		color: #050607;

		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.head-text,
	.foot-text {
		display: flex;
		flex-direction: column;
		gap: 3px;

		font-size: 0.62rem;
		letter-spacing: 0.2em;
	}

	.dim {
		color: rgba(238, 243, 246, 0.55);
	}

	.pct {
		margin-left: auto;

		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		font-variant-numeric: tabular-nums;

		color: var(--petal-rouge);
	}

	/* ---------- the tape ---------- */

	.tape {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: clamp(10px, 2vw, 18px);

		height: clamp(30px, 6vw, 44px);
		margin: 16px 0 18px;
		padding: 0 14px;
	}

	.stripe {
		position: relative;

		border: 1px solid rgba(238, 243, 246, 0.16);
		transform: skewX(-38deg);

		overflow: hidden;
	}

	/* the fill slides in from the left, then a sheen keeps travelling across */
	.stripe::before {
		content: '';
		position: absolute;
		inset: 0;

		background: linear-gradient(90deg, #dfe8ee, #ffffff 55%, #cfd9df);

		transform: scaleX(0);
		transform-origin: left center;

		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.stripe.on::before {
		transform: scaleX(1);
	}

	/* the stripe that just filled glows in the palette */
	.stripe.head::before {
		background: linear-gradient(90deg, var(--petal-rouge), #ffffff 60%, var(--rose-punch));
	}

	.stripe.head {
		box-shadow: 0 0 14px rgba(255, 112, 153, 0.6);
		border-color: var(--petal-rouge);
	}

	.stripe::after {
		content: '';
		position: absolute;
		inset: 0;

		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
		mix-blend-mode: overlay;

		transform: translateX(-120%);
		opacity: 0;
	}

	.stripe.on::after {
		opacity: 1;
		animation: sheen 2.2s ease-in-out infinite;
	}

	/* everything flashes once when the transfer completes */
	.tape.done .stripe {
		animation: flash 0.6s ease-out;
	}

	.leaving .stripe::before {
		background: #ffffff;
	}

	.code {
		font-size: 0.55rem;
		letter-spacing: 0.14em;
		color: rgba(238, 243, 246, 0.45);
		font-variant-numeric: tabular-nums;
	}

	.rec {
		display: flex;
		align-items: center;
		gap: 6px;

		margin-left: auto;

		font-size: 0.55rem;
		letter-spacing: 0.2em;
		color: rgba(238, 243, 246, 0.6);
	}

	.rec-dot {
		width: 6px;
		height: 6px;

		border-radius: 50%;
		background: var(--signal);
		box-shadow: 0 0 6px var(--signal);

		animation: rec 1.6s ease-in-out infinite;
	}

	.sr-only {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* ---------- keyframes ---------- */

	@keyframes slat-open {
		to { transform: skewX(-28deg) scaleX(0); }
	}

	@keyframes edge {
		0% { opacity: 0; }
		15% { opacity: 1; }
		100% { opacity: 1; }
	}

	@keyframes sheen {
		0% { transform: translateX(-120%); }
		60%,
		100% { transform: translateX(120%); }
	}

	@keyframes flash {
		0% { box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
		30% { box-shadow: 0 0 22px rgba(255, 112, 153, 0.95), 0 0 40px rgba(223, 54, 124, 0.5); }
		100% { box-shadow: 0 0 0 rgba(255, 255, 255, 0); }
	}

	@keyframes rec {
		0%,
		100% { opacity: 1; }
		50% { opacity: 0.25; }
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.stripe.on::after,
		.rec-dot {
			animation: none;
		}

		.leaving .slats span {
			animation: none;
			opacity: 0;
		}
	}
</style>

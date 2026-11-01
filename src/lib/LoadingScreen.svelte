<script lang="ts">
	import { onMount, untrack } from 'svelte';

	/*
	 * Glitch loading screen, styled to match the home page HUD.
	 * - instant: start fully covered (first boot, so the page never flashes)
	 * - leaving: flip to true to glitch the screen away and reveal the page
	 * Timings must match +layout.svelte: IN 700ms, OUT 900ms.
	 */
	let {
		leaving = false,
		instant = false
	}: { leaving?: boolean; instant?: boolean } = $props();

	const IN_MS = 700;
	const OUT_MS = 900;
	const TICK_MS = 40; // glitch refresh rate (~25fps, like real datamosh)

	type Phase = 'in' | 'hold' | 'out' | 'done';

	let hud: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let slices: HTMLDivElement[] = $state([]);

	let phase: Phase = untrack(() => instant) ? 'hold' : 'in';
	let phaseStart = 0;
	let mountTime = 0;
	let burstUntil = 0;
	let burstLevel = 0;
	let nextBurst = 0;

	let ctx: CanvasRenderingContext2D | null = null;
	let w = 0;
	let h = 0;
	let reduced = false;

	const palette = [
		'rgba(0, 0, 0, 0.94)',
		'rgba(0, 0, 0, 0.94)',
		'rgba(0, 0, 0, 0.94)',
		'#ff0000',
		'#ff0000',
		'rgba(255, 110, 110, 0.9)',
		'rgba(245, 245, 245, 0.9)',
		'rgba(140, 140, 140, 0.8)'
	];

	const SLICE_COUNT = 6;

	$effect(() => {
		if (leaving && phase !== 'out' && phase !== 'done') {
			phase = 'out';
			phaseStart = performance.now();
		}
	});

	function smoothstep(a: number, b: number, x: number) {
		const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
		return t * t * (3 - 2 * t);
	}

	function pick<T>(arr: T[]) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/* how much of the screen the HUD covers, and how hard it's glitching */
	function levels(now: number) {
		const t = now - phaseStart;

		if (phase === 'in') {
			const p = Math.min(t / IN_MS, 1);
			if (p >= 1) {
				phase = 'hold';
				phaseStart = now;
			}
			return {
				cover: smoothstep(0.1, 0.85, p),
				glitch: Math.sin(p * Math.PI)
			};
		}

		if (phase === 'out') {
			const p = Math.min(t / OUT_MS, 1);
			if (p >= 1) phase = 'done';
			return {
				cover: 1 - smoothstep(0.3, 0.95, p),
				glitch: Math.sin(Math.min(p * 1.15, 1) * Math.PI)
			};
		}

		if (phase === 'done') {
			return { cover: 0, glitch: 0 };
		}

		// hold: constant low hum of interference plus regular bursts
		let glitch = 0.1;
		const sinceMount = now - mountTime;

		if (instant && sinceMount < 500) {
			glitch = Math.max(glitch, 0.6 * (1 - sinceMount / 500));
		}

		if (now > nextBurst) {
			burstUntil = now + 120 + Math.random() * 180;
			burstLevel = 0.35 + Math.random() * 0.35;
			nextBurst = now + 450 + Math.random() * 650;
		}

		if (now < burstUntil) {
			glitch = Math.max(glitch, burstLevel);
		}

		return { cover: 1, glitch };
	}

	/* clip the HUD into random horizontal bands -> "breaking in/out" look */
	function bandClip(cover: number) {
		if (cover >= 0.999) return 'none';
		if (cover <= 0.001) return 'inset(50% 0 50% 0)';

		const pts: string[] = [];
		let y = 0;

		while (y < 100) {
			const y2 = Math.min(100, y + 1.2 + Math.random() * 7);

			if (Math.random() < cover) {
				pts.push(`0 ${y}%`, `100% ${y}%`, `100% ${y2}%`, `0 ${y2}%`);
			}

			y = y2;
		}

		return pts.length
			? `polygon(${pts.join(', ')})`
			: 'inset(50% 0 50% 0)';
	}

	/* displaced horizontal strips of the scene, some flashed pink or white */
	function renderSlices(glitch: number) {
		for (const s of slices) {
			if (!s) continue;

			if (Math.random() < glitch * 0.95) {
				const y = Math.random() * 96;
				const sh = 0.4 + Math.random() * 6;
				const dx = (Math.random() - 0.5) * 220 * glitch;
				const roll = Math.random();

				s.style.clipPath = `inset(${y}% 0 ${Math.max(0, 100 - y - sh)}% 0)`;
				s.style.transform = `translate3d(${dx}px, 0, 0)`;
				s.style.filter =
					roll < 0.2
						? 'brightness(2.4) saturate(0.3)'
						: roll < 0.45
							? 'sepia(1) saturate(8) hue-rotate(320deg) brightness(1.2)'
							: 'none';
				s.style.opacity = '1';
			} else {
				s.style.opacity = '0';
			}
		}
	}

	function renderBlocks(glitch: number) {
		if (!ctx) return;

		ctx.clearRect(0, 0, w, h);

		if (glitch < 0.03) return;

		// clustered rows of blocks, like corrupted scanlines
		const rows = 1 + Math.floor(glitch * 8);

		for (let r = 0; r < rows; r++) {
			const cy = Math.random() * h;
			let x = Math.random() * w * 0.8;
			const n = 2 + Math.floor(Math.random() * 9 * glitch);

			for (let i = 0; i < n; i++) {
				const bw = 6 + Math.random() * Math.random() * w * 0.16;
				const bh = 2 + Math.random() * Math.random() * 20;

				ctx.fillStyle = pick(palette);
				ctx.fillRect(
					x,
					cy + (Math.random() - 0.5) * 28,
					bw,
					bh
				);

				x += bw + Math.random() * 70 - 20;
			}
		}

		// scattered specks
		const specks = Math.floor(glitch * 90);

		for (let i = 0; i < specks; i++) {
			ctx.fillStyle =
				Math.random() < 0.7 ? 'rgba(0, 0, 0, 0.9)' : '#ff0000';
			ctx.fillRect(
				Math.random() * w,
				Math.random() * h,
				2 + Math.random() * 10,
				1 + Math.random() * 3
			);
		}
	}

	function resize() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		w = window.innerWidth;
		h = window.innerHeight;

		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);

		ctx = canvas.getContext('2d');
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		mountTime = performance.now();
		phaseStart = mountTime;
		nextBurst = mountTime + 600;

		resize();
		window.addEventListener('resize', resize);

		let raf = 0;
		let lastTick = 0;

		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);

			if (now - lastTick < TICK_MS) return;
			lastTick = now;

			const { cover, glitch } = levels(now);

			if (reduced) {
				hud.style.clipPath = 'none';
				hud.style.opacity = String(cover);
				return;
			}

			hud.style.clipPath = bandClip(cover);
			renderSlices(glitch);
			renderBlocks(glitch);

			if (phase === 'done') {
				cancelAnimationFrame(raf);
			}
		};

		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	});
</script>

{#snippet scene()}
	<div class="bg"></div>
	<div class="tint"></div>
	<div class="dots"></div>
	<div class="scanlines"></div>

	<!-- frame lines, matching the home page border -->
	<div class="edge top"></div>
	<div class="edge bottom"></div>
	<span class="diamond" style="left: 43%; top: 16px;"></span>
	<span class="diamond" style="left: 51%; top: 16px;"></span>
	<span class="diamond" style="left: 59%; top: 16px;"></span>
	<span class="diamond" style="left: 40%; bottom: 16px;"></span>
	<span class="diamond" style="left: 51%; bottom: 16px;"></span>
	<span class="diamond" style="left: 62%; bottom: 16px;"></span>

	<span class="bracket tl"></span>
	<span class="bracket tr"></span>
	<span class="bracket bl"></span>
	<span class="bracket br"></span>

	<!-- center target -->
	<svg class="radar" viewBox="0 0 200 200" aria-hidden="true">
		<circle cx="100" cy="100" r="70" />
		<circle cx="100" cy="100" r="44" />
		<circle cx="100" cy="100" r="4" class="core" />
		<line x1="100" y1="10" x2="100" y2="190" />
		<line x1="10" y1="100" x2="190" y2="100" />
		<path class="sweep" d="M100 100 L100 30 A70 70 0 0 1 160.6 65 Z" />
	</svg>

	<!-- side radars, like the home page -->
	<svg class="radar side left" viewBox="0 0 200 200" aria-hidden="true">
		<circle cx="100" cy="100" r="70" />
		<circle cx="100" cy="100" r="44" />
		<line x1="100" y1="10" x2="100" y2="190" />
		<line x1="10" y1="100" x2="190" y2="100" />
		<path class="sweep" d="M100 100 L100 30 A70 70 0 0 1 160.6 65 Z" />
	</svg>

	<svg class="radar side right" viewBox="0 0 200 200" aria-hidden="true">
		<circle cx="100" cy="100" r="70" />
		<circle cx="100" cy="100" r="44" />
		<line x1="100" y1="10" x2="100" y2="190" />
		<line x1="10" y1="100" x2="190" y2="100" />
		<path class="sweep" d="M100 100 L100 30 A70 70 0 0 1 160.6 65 Z" />
	</svg>

	<!-- small status text -->
	<div class="label tl-label">
		<span>SYS</span>
		<span class="dim">02 / ACTIVE</span>
	</div>

	<div class="label bl-label">
		<span>CORE / 02</span>
		<span class="dim">SIGNAL / SYNC</span>
	</div>

	<div class="label br-label">
		<span>STATUS</span>
		<span class="dim">01-09 / ACTIVE</span>
	</div>

	<div class="bars">
		{#each Array(12) as _, i}
			<span style="animation-delay: {i * 0.07}s;"></span>
		{/each}
	</div>
{/snippet}

<div class="loading-screen" aria-hidden="true">
	<div
		class="hud"
		bind:this={hud}
		style="clip-path: {instant ? 'none' : 'inset(50% 0 50% 0)'};"
	>
		{@render scene()}
	</div>

	{#each Array(SLICE_COUNT) as _, i}
		<div class="hud slice" bind:this={slices[i]}>
			{@render scene()}
		</div>
	{/each}

	<canvas class="blocks" bind:this={canvas}></canvas>
</div>

<span class="sr-only" role="status">Loading</span>

<style>
	.loading-screen {
		--pink: #ff0000;
		--pink-soft: rgba(255, 0, 0, 0.55);
		--pink-faint: rgba(255, 0, 0, 0.2);

		position: fixed;
		inset: 0;
		z-index: 10000;

		overflow: hidden;
		pointer-events: none;

		font-family: var(--font-mono);
	}

	.hud {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: #000;
		will-change: clip-path;
	}

	.slice {
		opacity: 0;
		will-change: transform, clip-path, opacity;
	}

	.blocks {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* ---------- background ---------- */

	.bg {
		position: absolute;
		inset: -4%;

		background:
			url('/home-background.png')
			center center / cover no-repeat;

		filter:
			blur(6px)
			brightness(0.26)
			saturate(0.7);

		transform: scale(1.04);
	}

	.tint {
		position: absolute;
		inset: 0;

		background:
			radial-gradient(
				ellipse at center,
				rgba(255, 0, 0, 0.07),
				rgba(0, 0, 0, 0.75) 85%
			);
	}

	.dots {
		position: absolute;
		inset: 0;

		background-image:
			radial-gradient(
				circle,
				rgba(255, 0, 0, 0.16) 1px,
				transparent 1.5px
			);

		background-size: 6px 6px;
	}

	.scanlines {
		position: absolute;
		inset: -12px 0 0 0;

		background:
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 4px,
				rgba(255, 0, 0, 0.045) 5px
			);

		animation: scan-roll 0.9s linear infinite;
	}

	@keyframes scan-roll {
		from { transform: translate3d(0, 0, 0); }
		to { transform: translate3d(0, 5px, 0); }
	}

	/* ---------- frame ---------- */

	.edge {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--pink-soft);
	}

	.edge.top {
		top: 20px;
	}

	.edge.bottom {
		bottom: 20px;
	}

	.diamond {
		position: absolute;

		width: 9px;
		height: 9px;

		border: 1px solid var(--pink);
		background: #000;

		transform: translate(-50%, 0) rotate(45deg);
	}

	.bracket {
		position: absolute;

		width: 46px;
		height: 46px;

		border-color: var(--pink);
		border-style: solid;
		border-width: 0;
	}

	.bracket.tl {
		left: 22px;
		top: 50px;
		border-left-width: 1px;
		border-top-width: 1px;
	}

	.bracket.tr {
		right: 22px;
		top: 50px;
		border-right-width: 1px;
		border-top-width: 1px;
	}

	.bracket.bl {
		left: 22px;
		bottom: 50px;
		border-left-width: 1px;
		border-bottom-width: 1px;
	}

	.bracket.br {
		right: 22px;
		bottom: 50px;
		border-right-width: 1px;
		border-bottom-width: 1px;
	}

	/* ---------- radars ---------- */

	.radar {
		position: absolute;
		left: 50%;
		top: 50%;

		width: min(180px, 32vw);
		height: auto;

		transform: translate(-50%, -50%);
		overflow: visible;
	}

	.radar circle,
	.radar line {
		fill: none;
		stroke: var(--pink-soft);
		stroke-width: 0.8;
	}

	.radar .core {
		fill: var(--pink);
		stroke: none;
		animation: core-pulse 1.2s ease-in-out infinite;
	}

	.radar .sweep {
		fill: rgba(255, 0, 0, 0.12);
		stroke: none;

		transform-origin: 100px 100px;
		animation: sweep 2.4s linear infinite;
	}

	.radar.side {
		width: min(220px, 18vw);
		opacity: 0.45;
	}

	.radar.side.left {
		left: 8%;
	}

	.radar.side.right {
		left: 92%;
	}

	.radar.side .sweep {
		animation-duration: 3.6s;
	}

	@keyframes sweep {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes core-pulse {
		0%,
		100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	/* ---------- labels ---------- */

	.label {
		position: absolute;

		display: flex;
		flex-direction: column;
		gap: 6px;

		font-size: 0.6rem;
		letter-spacing: 0.2em;

		color: var(--pink);
	}

	.label .dim {
		color: rgba(255, 0, 0, 0.45);
	}

	.tl-label {
		left: 90px;
		top: 62px;
	}

	.bl-label {
		left: 90px;
		bottom: 62px;
	}

	.br-label {
		right: 90px;
		bottom: 62px;
		text-align: right;
	}

	.bars {
		position: absolute;
		left: 50%;
		bottom: 44px;

		display: flex;
		gap: 5px;

		transform: translateX(-50%);
	}

	.bars span {
		width: 22px;
		height: 4px;

		background: var(--pink);
		opacity: 0.15;

		animation: bar-wave 1.4s ease-in-out infinite;
	}

	@keyframes bar-wave {
		0%,
		100% { opacity: 0.15; }
		40% { opacity: 0.95; }
	}

	.sr-only {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 650px) {
		.radar.side,
		.br-label {
			display: none;
		}

		.tl-label,
		.bl-label {
			left: 34px;
		}

		.bars span {
			width: 14px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scanlines,
		.radar .sweep,
		.radar .core,
		.bars span {
			animation: none;
		}

		.slice,
		.blocks {
			display: none;
		}
	}
</style>

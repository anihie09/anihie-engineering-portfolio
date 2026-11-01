<script lang="ts">
	/*
	 * Site-wide cyber border.
	 * Lives in +layout.svelte, so it stays on every page and only
	 * draws in once. The middle is fully transparent so each page
	 * (and the home background photo) shows through.
	 */

	let w = $state(0);
	let h = $state(0);

	// sizes scale down on small screens
	const compact = $derived(w < 700);
	const o = $derived(compact ? 6 : 10); // outer rounded frame inset
	const r = $derived(compact ? 12 : 18); // outer corner radius
	const b = $derived(o + (compact ? 10 : 14)); // corner bracket inset
	const arm = $derived(Math.max(20, Math.min(48, w * 0.03))); // bracket arm length
	const i = $derived(o + (compact ? 20 : 30)); // inner frame inset
	const cx = $derived(w / 2);
	const cy = $derived(h / 2);

	/* dark area outside the rounded frame (even-odd cut-out) */
	const outside = $derived(
		`M0 0 H${w} V${h} H0 Z ` +
			`M${o + r} ${o} H${w - o - r} Q${w - o} ${o} ${w - o} ${o + r} ` +
			`V${h - o - r} Q${w - o} ${h - o} ${w - o - r} ${h - o} ` +
			`H${o + r} Q${o} ${h - o} ${o} ${h - o - r} ` +
			`V${o + r} Q${o} ${o} ${o + r} ${o} Z`
	);

	/* thick light corner brackets with a rounded elbow */
	const corners = $derived([
		`M${b} ${b + arm} V${b + 10} Q${b} ${b} ${b + 10} ${b} H${b + arm}`,
		`M${w - b - arm} ${b} H${w - b - 10} Q${w - b} ${b} ${w - b} ${b + 10} V${b + arm}`,
		`M${b} ${h - b - arm} V${h - b - 10} Q${b} ${h - b} ${b + 10} ${h - b} H${b + arm}`,
		`M${w - b - arm} ${h - b} H${w - b - 10} Q${w - b} ${h - b} ${w - b} ${h - b - 10} V${h - b - arm}`
	]);

	/* top + bottom inner circuit lines (mirrored left/right and top/bottom) */
	function edgePiece(side: 'l' | 'r', edge: 't' | 'b') {
		const x1 = Math.min(w * 0.22, cx - 230);
		const pts: [number, number][] = [
			[i + 46, i],
			[x1, i],
			[x1 + 16, i + 14],
			[cx - 120, i + 14],
			[cx - 106, i]
		];

		return (
			'M' +
			pts
				.map(([x, y]) => {
					const px = side === 'l' ? x : w - x;
					const py = edge === 't' ? y : h - y;
					return `${px} ${py}`;
				})
				.join(' L')
		);
	}

	function seg(x1: number, x2: number, y: number, side: 'l' | 'r', edge: 't' | 'b') {
		const a = side === 'l' ? x1 : w - x1;
		const c = side === 'l' ? x2 : w - x2;
		const yy = edge === 't' ? y : h - y;
		return `M${a} ${yy} H${c}`;
	}

	const pieces = $derived(
		(['t', 'b'] as const).flatMap((edge) =>
			(['l', 'r'] as const).map((side) => ({
				line: edgePiece(side, edge),
				accent: seg(cx - 220, cx - 136, i + 14, side, edge),
				dashA: seg(cx - 160, cx - 146, i + 24, side, edge),
				dashB: seg(cx - 140, cx - 132, i + 24, side, edge)
			}))
		)
	);

	/* left + right side brackets with // ticks */
	function sidePieces(side: 'l' | 'r') {
		const X = (x: number) => (side === 'l' ? x : w - x);
		const len = Math.min(110, h * 0.14);

		return {
			bar: `M${X(i + 22)} ${cy - len} L${X(i + 10)} ${cy - len + 12} V${cy + len - 12} L${X(i + 22)} ${cy + len}`,
			guideTop: `M${X(i)} ${i + 60} V${cy - len - 40}`,
			guideBottom: `M${X(i)} ${cy + len + 40} V${h - i - 60}`,
			ticks: [
				`M${X(i + 6)} ${cy - len - 14} L${X(i + 14)} ${cy - len - 22}`,
				`M${X(i + 6)} ${cy - len - 8} L${X(i + 14)} ${cy - len - 16}`,
				`M${X(i + 6)} ${cy + len + 22} L${X(i + 14)} ${cy + len + 14}`,
				`M${X(i + 6)} ${cy + len + 16} L${X(i + 14)} ${cy + len + 8}`
			]
		};
	}

	const sides = $derived([sidePieces('l'), sidePieces('r')]);
</script>

<div
	class="cyber-frame"
	aria-hidden="true"
	bind:clientWidth={w}
	bind:clientHeight={h}
>
	{#if w > 0 && h > 0}
		<svg
			width={w}
			height={h}
			viewBox="0 0 {w} {h}"
		>
			<defs>
				<linearGradient id="cf-bottom-glow" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#ff0000" stop-opacity="0" />
					<stop offset="1" stop-color="#ff0000" stop-opacity="0.16" />
				</linearGradient>

				<filter id="cf-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2.5" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<!-- dark surround outside the frame -->
			<path class="outside" d={outside} fill-rule="evenodd" />

			<!-- soft pink glow rising from the bottom edge -->
			<rect
				class="bottom-glow"
				x={o}
				y={h - o - h * 0.18}
				width={w - o * 2}
				height={h * 0.18}
				rx={r}
				fill="url(#cf-bottom-glow)"
			/>

			<!-- outer rounded frame -->
			<rect
				class="outer draw"
				x={o}
				y={o}
				width={w - o * 2}
				height={h - o * 2}
				rx={r}
				pathLength="1000"
			/>

			<!-- two light pulses circling the outer frame -->
			<rect
				class="comet"
				x={o}
				y={o}
				width={w - o * 2}
				height={h - o * 2}
				rx={r}
				pathLength="1000"
				filter="url(#cf-glow)"
			/>
			<rect
				class="comet comet-2"
				x={o}
				y={o}
				width={w - o * 2}
				height={h - o * 2}
				rx={r}
				pathLength="1000"
				filter="url(#cf-glow)"
			/>

			<!-- inner circuit lines -->
			{#if !compact}
				{#each pieces as p, n}
					<path class="inner draw" d={p.line} pathLength="100" style="animation-delay: {0.3 + n * 0.08}s, {0.3 + n * 0.08}s;" />
					<path class="inner-run" d={p.line} pathLength="100" filter="url(#cf-glow)" style="animation-delay: {n * 1.1}s;" />
					<path class="accent draw" d={p.accent} pathLength="100" filter="url(#cf-glow)" style="animation-delay: {0.6 + n * 0.08}s, {1.6 + n * 0.4}s;" />
					<path class="dash" d={p.dashA} />
					<path class="dash" d={p.dashB} />
				{/each}

				<!-- center notches with diamonds -->
				<path class="notch" d="M{cx} {o} V{o + 12}" />
				<path class="notch" d="M{cx} {h - o} V{h - o - 12}" />
				<rect class="diamond" x={cx - 4} y={i + 2} width="8" height="8" transform="rotate(45 {cx} {i + 6})" filter="url(#cf-glow)" />
				<rect class="diamond" x={cx - 4} y={h - i - 10} width="8" height="8" transform="rotate(45 {cx} {h - i - 6})" filter="url(#cf-glow)" />
			{/if}

			<!-- side brackets -->
			{#each sides as s, n}
				<path class="guide draw" d={s.guideTop} pathLength="100" />
				<path class="guide draw" d={s.guideBottom} pathLength="100" />
				<path class="side-bar draw" d={s.bar} pathLength="100" filter="url(#cf-glow)" style="animation-delay: {0.5 + n * 0.1}s, {n * 1.5}s;" />
				{#each s.ticks as t, k}
					<path class="tick" d={t} style="animation-delay: {k * 0.35 + n * 0.2}s;" />
				{/each}
			{/each}

			<!-- light corner brackets -->
			{#each corners as c, n}
				<path class="corner draw" d={c} pathLength="100" filter="url(#cf-glow)" style="animation-delay: {n * 0.1}s, {n * 0.9}s;" />
			{/each}
		</svg>
	{/if}
</div>

<style>
	.cyber-frame {
		position: fixed;
		inset: 0;
		z-index: 70;
		pointer-events: none;
	}

	svg {
		display: block;
		overflow: visible;
	}

	path,
	rect {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.outside {
		fill: rgba(0, 0, 0, 0.88);
		stroke: none;
	}

	.bottom-glow {
		stroke: none;
		animation: breathe 5s ease-in-out infinite;
	}

	/* one-time draw-in when the site first loads */
	.draw {
		stroke-dasharray: 100;
		animation: draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) both;
	}

	.outer {
		stroke: rgba(255, 0, 0, 0.6);
		stroke-width: 1.2;
		stroke-dasharray: 1000;
		animation: draw-long 1.8s cubic-bezier(0.65, 0, 0.35, 1) both;
	}

	.comet {
		stroke: #ff5a5a;
		stroke-width: 2;
		stroke-dasharray: 60 940;
		animation: orbit 14s linear infinite;
	}

	.comet-2 {
		stroke: #ffd6d6;
		stroke-width: 1.5;
		stroke-dasharray: 30 970;
		animation-duration: 14s;
		animation-delay: -7s;
	}

	.inner {
		stroke: rgba(255, 0, 0, 0.42);
		stroke-width: 1;
	}

	.inner-run {
		stroke: #ff6f6f;
		stroke-width: 1.4;
		stroke-dasharray: 14 86;
		opacity: 0;
		animation: run 4.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}

	.accent {
		stroke: #ff2f2f;
		stroke-width: 2.5;
		animation:
			draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) both,
			pulse 3.6s ease-in-out infinite;
	}

	.dash {
		stroke: rgba(255, 230, 230, 0.7);
		stroke-width: 1.5;
	}

	.notch {
		stroke: rgba(255, 0, 0, 0.7);
		stroke-width: 1;
	}

	.diamond {
		fill: #ff0000;
		stroke: none;
		animation: pulse 2.4s ease-in-out infinite;
	}

	.guide {
		stroke: rgba(255, 0, 0, 0.22);
		stroke-width: 1;
	}

	.side-bar {
		stroke: #ff2f2f;
		stroke-width: 2;
		animation:
			draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) both,
			pulse 4.2s ease-in-out infinite;
	}

	.tick {
		stroke: rgba(255, 235, 235, 0.85);
		stroke-width: 1.6;
		animation: tick 2.8s ease-in-out infinite;
	}

	.corner {
		stroke: #ffe1e1;
		stroke-width: 2.5;
		animation:
			draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) both,
			corner-glow 3.6s ease-in-out infinite;
	}

	@keyframes draw {
		from { stroke-dashoffset: 100; }
		to { stroke-dashoffset: 0; }
	}

	@keyframes draw-long {
		from { stroke-dashoffset: 1000; }
		to { stroke-dashoffset: 0; }
	}

	@keyframes orbit {
		from { stroke-dashoffset: 1000; }
		to { stroke-dashoffset: 0; }
	}

	@keyframes run {
		0% {
			stroke-dashoffset: 100;
			opacity: 0;
		}

		15% { opacity: 1; }
		75% { opacity: 1; }

		100% {
			stroke-dashoffset: 0;
			opacity: 0;
		}
	}

	@keyframes pulse {
		0%,
		100% { opacity: 0.55; }
		50% { opacity: 1; }
	}

	@keyframes breathe {
		0%,
		100% { opacity: 0.7; }
		50% { opacity: 1; }
	}

	@keyframes tick {
		0%,
		100% { opacity: 0.35; }
		50% { opacity: 1; }
	}

	@keyframes corner-glow {
		0%,
		100% { opacity: 0.75; }
		50% { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		path,
		rect {
			animation: none !important;
		}

		.comet,
		.inner-run {
			display: none;
		}
	}
</style>

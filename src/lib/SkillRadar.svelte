<script lang="ts">
	/*
	 * Skills radar chart. One corner per skill (6 skills -> hexagon).
	 * Levels are out of 10. The shape grows out from the centre the first
	 * time `active` turns true (when the chart scrolls into view).
	 */
	let {
		skills,
		active = false
	}: {
		skills: { label: string; level: number }[];
		active?: boolean;
	} = $props();

	const W = 360;
	const H = 236;
	const cx = W / 2;
	const cy = 122;
	const R = 86;

	const n = $derived(skills.length);

	// point on axis i at a given fraction of the radius
	function pt(i: number, f: number) {
		const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
		return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
	}

	const ring = (f: number) =>
		Array.from({ length: n }, (_, i) => pt(i, f).map((v) => v.toFixed(1)).join(',')).join(' ');

	const shape = $derived(
		skills.map((s, i) => pt(i, Math.max(0, Math.min(10, s.level)) / 10).map((v) => v.toFixed(1)).join(',')).join(' ')
	);

	// label position + alignment, pushed just outside the chart
	function labelAt(i: number) {
		const [x, y] = pt(i, 1.2);
		const dx = x - cx;
		const anchor = Math.abs(dx) < 8 ? 'middle' : dx > 0 ? 'start' : 'end';
		return { x, y: y + (y < cy - R * 0.9 ? -4 : y > cy + R * 0.5 ? 8 : 3), anchor };
	}

	const pad = (v: number) => String(v).padStart(2, '0');
</script>

<svg
	class="radar"
	class:active
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label={`Skills: ${skills.map((s) => `${s.label.toLowerCase()} ${s.level} of 10`).join(', ')}`}
>
	<defs>
		<linearGradient id="radar-grad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" style="stop-color: var(--strawberry, #ff2a3d)" />
			<stop offset="0.5" style="stop-color: var(--petal-rouge, #ff2d95)" />
			<stop offset="1" style="stop-color: var(--rose-punch, #a43dff)" />
		</linearGradient>
	</defs>

	<!-- grid: rings at 2, 4, 6, 8, 10 -->
	{#each [0.2, 0.4, 0.6, 0.8, 1] as f, k}
		<polygon
			class="ring"
			class:outer={f === 1}
			points={ring(f)}
		/>
		{#if f < 1}
			<text
				class="scale"
				x={cx + 4}
				y={cy - R * f + 3}>{pad((k + 1) * 2)}</text
			>
		{/if}
	{/each}

	<!-- axes -->
	{#each skills as _, i}
		{@const [x, y] = pt(i, 1)}
		<line
			class="axis"
			x1={cx}
			y1={cy}
			x2={x}
			y2={y}
		/>
	{/each}

	<!-- the shape -->
	<g class="shape">
		<polygon
			class="area"
			points={shape}
		/>
		<polygon
			class="edge"
			points={shape}
		/>

		{#each skills as s, i}
			{@const [x, y] = pt(i, Math.max(0, Math.min(10, s.level)) / 10)}
			<circle
				class="dot"
				cx={x}
				cy={y}
				r="3.2"
				style="--i: {i};"
			/>
		{/each}
	</g>

	<!-- labels -->
	{#each skills as s, i}
		{@const l = labelAt(i)}
		<text
			class="label"
			x={l.x}
			y={l.y}
			text-anchor={l.anchor}
		>
			{s.label}
			<tspan class="value"> {pad(s.level)}</tspan>
		</text>
	{/each}
</svg>

<style>
	.radar {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.ring {
		fill: none;
		stroke: rgba(255, 255, 255, 0.14);
		stroke-width: 1;
	}

	.ring.outer {
		stroke: rgba(255, 255, 255, 0.35);
	}

	.axis {
		stroke: rgba(255, 255, 255, 0.14);
		stroke-width: 1;
	}

	.scale {
		font-family: var(--font-mono);
		font-size: 6px;
		letter-spacing: 0.1em;
		fill: rgba(255, 255, 255, 0.35);
	}

	/* shape grows out from the centre */
	.shape {
		transform-box: view-box;
		transform-origin: 180px 122px;
		transform: scale(0);
		opacity: 0;

		transition:
			transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s,
			opacity 0.6s ease 0.2s;
	}

	.active .shape {
		transform: scale(1);
		opacity: 1;
	}

	.area {
		fill: url(#radar-grad);
		fill-opacity: 0.28;
	}

	.edge {
		fill: none;
		stroke: url(#radar-grad);
		stroke-width: 2;
		stroke-linejoin: round;

		filter: drop-shadow(0 0 6px rgba(255, 45, 149, 0.6));
	}

	.dot {
		fill: #ffffff;
		stroke: var(--hot-red, #ff1a94);
		stroke-width: 2;

		filter: drop-shadow(0 0 4px var(--hot-red-glow, rgba(255, 26, 148, 0.6)));

		transform-box: fill-box;
		transform-origin: center;
	}

	.active .dot {
		animation: dot-pulse 2.6s ease-in-out calc(1.2s + var(--i) * 0.25s) infinite;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 7.5px;
		letter-spacing: 0.12em;
		fill: rgba(255, 255, 255, 0.85);
	}

	.value {
		font-weight: 700;
		fill: var(--hot-red, #ff1a94);
	}

	@keyframes dot-pulse {
		0%,
		100% { transform: scale(1); }
		50% { transform: scale(1.35); }
	}

	@media (prefers-reduced-motion: reduce) {
		.shape {
			transition: none;
			transform: none;
			opacity: 1;
		}

		.active .dot {
			animation: none;
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	/*
	 * Frame in the same style as the site border (CyberFrame):
	 * chamfered pink outline, light rounded corner brackets,
	 * // ticks, and a light pulse travelling around the edge.
	 * Content is clipped to the chamfered shape.
	 */
	let {
		label = '',
		code = '',
		cut = 16,
		children
	}: {
		label?: string;
		code?: string;
		cut?: number;
		children?: Snippet;
	} = $props();

	let w = $state(0);
	let h = $state(0);

	const pad = 6; // gap between outline and content
	const arm = $derived(Math.max(14, Math.min(28, Math.min(w, h) * 0.08)));

	const outline = $derived(
		`M${cut} 0.5 H${w - 0.5} V${h - cut} L${w - cut} ${h - 0.5} H0.5 V${cut} Z`
	);

	const corners = $derived([
		// top-right
		`M${w - arm} -5 H${w - 1} Q${w + 5} -5 ${w + 5} 1 V${arm}`,
		// bottom-left
		`M-5 ${h - arm} V${h - 1} Q-5 ${h + 5} 1 ${h + 5} H${arm}`
	]);

	const chamfers = $derived([
		// top-left chamfer bracket
		`M-5 ${cut + arm * 0.6} V${cut + 2} L${cut + 2} -5 H${cut + arm * 0.6}`,
		// bottom-right chamfer bracket
		`M${w + 5} ${h - cut - arm * 0.6} V${h - cut - 2} L${w - cut - 2} ${h + 5} H${w - cut - arm * 0.6}`
	]);
</script>

<div
	class="hud-frame"
	style="--cut: {cut}px; --pad: {pad}px;"
	bind:clientWidth={w}
	bind:clientHeight={h}
>
	<div class="content">
		{@render children?.()}
	</div>

	{#if w > 0}
		<svg
			class="lines"
			width={w}
			height={h}
			viewBox="0 0 {w} {h}"
			aria-hidden="true"
		>
			<path
				class="outline"
				d={outline}
			/>
			<path
				class="pulse"
				d={outline}
				pathLength="1000"
			/>

			{#each corners as d}
				<path
					class="corner"
					{d}
				/>
			{/each}

			{#each chamfers as d}
				<path
					class="chamfer"
					{d}
				/>
			{/each}

			<!-- // ticks on the left edge -->
			<path
				class="tick"
				d="M-10 {h / 2 - 10} L-4 {h / 2 - 16}"
			/>
			<path
				class="tick"
				d="M-10 {h / 2 - 4} L-4 {h / 2 - 10}"
			/>
		</svg>
	{/if}

	{#if label}
		<span class="label">{label}</span>
	{/if}

	{#if code}
		<span class="code">{code}</span>
	{/if}
</div>

<style>
	.hud-frame {
		position: relative;

		width: 100%;
		height: 100%;
		box-sizing: border-box;

		padding: var(--pad);

		font-family: var(--font-mono);
	}

	.content {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;

		background: #050202;

		clip-path: polygon(
			calc(var(--cut) - var(--pad) * 0.6) 0,
			100% 0,
			100% calc(100% - var(--cut) + var(--pad) * 0.6),
			calc(100% - var(--cut) + var(--pad) * 0.6) 100%,
			0 100%,
			0 calc(var(--cut) - var(--pad) * 0.6)
		);
	}

	.lines {
		position: absolute;
		inset: 0;

		overflow: visible;
		pointer-events: none;
	}

	path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.outline {
		stroke: rgba(255, 0, 0, 0.6);
		stroke-width: 1;
	}

	.pulse {
		stroke: #ff6f6f;
		stroke-width: 1.6;
		stroke-dasharray: 70 930;

		filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.9));

		animation: orbit 9s linear infinite;
	}

	.corner {
		stroke: #ffe1e1;
		stroke-width: 2;

		filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.7));
		animation: glow 3.6s ease-in-out infinite;
	}

	.chamfer {
		stroke: #ff2f2f;
		stroke-width: 2;

		filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.8));
		animation: glow 3.6s ease-in-out 1.8s infinite;
	}

	.tick {
		stroke: rgba(255, 235, 235, 0.85);
		stroke-width: 1.4;
	}

	.label,
	.code {
		position: absolute;
		top: -9px;

		padding: 2px 8px;

		background: #000;

		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		white-space: nowrap;

		pointer-events: none;
	}

	.label {
		left: calc(var(--cut) + 14px);
		color: #ffe1e1;
	}

	.code {
		right: 34px;
		color: #ff4f4f;
	}

	@keyframes orbit {
		from { stroke-dashoffset: 1000; }
		to { stroke-dashoffset: 0; }
	}

	@keyframes glow {
		0%,
		100% { opacity: 0.75; }
		50% { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			display: none;
		}

		.corner,
		.chamfer {
			animation: none;
		}
	}
</style>

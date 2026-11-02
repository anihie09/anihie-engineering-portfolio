<script lang="ts">
	/*
	 * "ANIHIE" logotype, layered like a title card:
	 * - bold italic high-contrast serif capitals (Bodoni Moda) in the
	 *   strawberry -> petal rouge palette
	 * - a glowing script "Anihie" (Ballet) written across them
	 * - small caption with a red bar
	 * The parent link triggers the glitch on hover / keyboard focus.
	 *
	 * The artwork is drawn three times (base + red copy + white copy);
	 * the copies stay hidden until the glitch runs.
	 */

	// slim four-point sparkle centred on (x, y)
	function star(x: number, y: number, r: number, w = 0.14) {
		const t = r * w;
		return `M${x} ${y - r} Q${x + t} ${y - t} ${x + r} ${y} Q${x + t} ${y + t} ${x} ${y + r} Q${x - t} ${y + t} ${x - r} ${y} Q${x - t} ${y - t} ${x} ${y - r} Z`;
	}
</script>

{#snippet art(id: string)}
	<svg
		viewBox="0 0 340 150"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id="sig-caps-{id}" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" style="stop-color: var(--strawberry, #ff3e41)" />
				<stop offset="0.55" style="stop-color: var(--rose-punch, #df367c)" />
				<stop offset="1" style="stop-color: var(--petal-rouge, #ff7099)" />
			</linearGradient>
		</defs>

		<!-- bold italic capitals -->
		<g class="caps-wrap">
			<text
				class="caps"
				x="170"
				y="88"
				text-anchor="middle"
				fill="url(#sig-caps-{id})">ANIHIE</text
			>
		</g>

		<!-- glowing script across them -->
		<text
			class="script"
			x="182"
			y="112"
			text-anchor="middle">Anihie</text
		>

		<!-- sparkles -->
		<path class="star spin" d={star(300, 30, 10)} />
		<path class="star small accent-fill" d={star(36, 106, 5, 0.2)} />

		<!-- caption with a red bar -->
		<text
			class="caption"
			x="116"
			y="144">AN LE · PORTFOLIO</text
		>
		<rect class="bar" x="214" y="139" width="18" height="3" />
	</svg>
{/snippet}

<span class="signature">
	<span class="layer base">{@render art('base')}</span>
	<span class="layer copy red">{@render art('red')}</span>
	<span class="layer copy ghost">{@render art('ghost')}</span>
</span>

<style>
	.signature {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
	}

	.layer {
		position: absolute;
		inset: 0;
		display: block;

		color: #f6f2f8;
		--accent-ink: var(--signal, #ff3e41);
	}

	.layer :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.copy {
		opacity: 0;
		pointer-events: none;
	}

	.red {
		color: var(--signal, #ff3e41);
		--accent-ink: var(--signal, #ff3e41);
		mix-blend-mode: screen;
	}

	.ghost {
		color: #ffffff;
		--accent-ink: #ffffff;
	}

	/* ---------- artwork ---------- */

	.caps-wrap {
		transform-box: fill-box;
		transform-origin: center;
		transform: scaleX(0.86); /* narrower, like condensed title type */
	}

	.caps {
		font-family: 'Bodoni Moda', 'Bodoni Moda 11pt', 'Didot', serif;
		font-size: 70px;
		font-style: italic;
		font-weight: 800;
		letter-spacing: -1px;
	}

	/* the glitch copies draw everything in their own single colour */
	.copy .caps {
		fill: currentColor;
	}

	.base .caps {
		filter:
			drop-shadow(0 0 6px rgba(255, 62, 65, 0.55))
			drop-shadow(0 0 16px rgba(223, 54, 124, 0.35));
	}

	.script {
		font-family: 'Ballet', 'Ballet 16pt', 'Snell Roundhand', cursive;
		font-size: 58px;

		fill: currentColor;
	}

	/* neon glow on the script */
	.base .script {
		fill: #fff6fb;
		filter:
			drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))
			drop-shadow(0 0 7px rgba(255, 112, 153, 0.85))
			drop-shadow(0 0 16px rgba(223, 54, 124, 0.55));
	}

	.caption {
		font-family: var(--font-mono);
		font-size: 7px;
		letter-spacing: 1.6px;

		fill: currentColor;
		opacity: 0.75;
	}

	.star {
		fill: currentColor;
		transform-box: fill-box;
		transform-origin: center;
	}

	.star.small {
		opacity: 0.9;
	}

	.accent-fill,
	.bar {
		fill: var(--accent-ink);
	}

	.base {
		transition: filter 300ms ease;
	}

	/* ---------- hover: glitch ---------- */

	:global(a:hover) > .signature .base,
	:global(a:focus-visible) > .signature .base {
		filter: brightness(1.15);
		animation: base-jolt 2.4s steps(1, end) infinite;
	}

	:global(a:hover) > .signature .red,
	:global(a:focus-visible) > .signature .red {
		animation: slice-red 2.4s steps(1, end) infinite;
	}

	:global(a:hover) > .signature .ghost,
	:global(a:focus-visible) > .signature .ghost {
		animation: slice-ghost 2.4s steps(1, end) infinite;
	}

	:global(a:hover) > .signature .spin,
	:global(a:focus-visible) > .signature .spin {
		animation: star-twist 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
	}

	@keyframes base-jolt {
		0% { transform: translate(0, 0) skewX(0); }
		4% { transform: translate(-2px, 0) skewX(-6deg); }
		7% { transform: translate(3px, 0) skewX(4deg); }
		10% { transform: translate(0, 0) skewX(0); }
		52% { transform: translate(2px, 0) skewX(5deg); }
		55% { transform: translate(-1px, 0) skewX(0); }
		58%,
		100% { transform: translate(0, 0) skewX(0); }
	}

	@keyframes slice-red {
		0% { opacity: 0.95; transform: translate(-8px, 1px); clip-path: inset(18% 0 58% 0); }
		3% { clip-path: inset(62% 0 14% 0); transform: translate(-12px, 0); }
		6% { clip-path: inset(36% 0 40% 0); transform: translate(-3px, -1px); }
		9% { clip-path: inset(8% 0 80% 0); transform: translate(-6px, 0); }
		12% { opacity: 0; clip-path: inset(0 0 100% 0); }
		50% { opacity: 0.95; clip-path: inset(44% 0 30% 0); transform: translate(-7px, 0); }
		54% { clip-path: inset(70% 0 8% 0); transform: translate(-11px, 1px); }
		58%,
		100% { opacity: 0; clip-path: inset(0 0 100% 0); }
	}

	@keyframes slice-ghost {
		0% { opacity: 0; }
		2% { opacity: 1; transform: translate(6px, 0); clip-path: inset(48% 0 34% 0); }
		5% { clip-path: inset(22% 0 66% 0); transform: translate(9px, 0); }
		8% { clip-path: inset(74% 0 6% 0); transform: translate(4px, 0); }
		11% { opacity: 0; clip-path: inset(0 0 100% 0); }
		52% { opacity: 1; clip-path: inset(10% 0 72% 0); transform: translate(5px, 0); }
		56% { opacity: 0; }
		100% { opacity: 0; }
	}

	@keyframes star-twist {
		0% { transform: rotate(0deg) scale(1); }
		12% { transform: rotate(45deg) scale(1.35); }
		30% { transform: rotate(90deg) scale(1); }
		100% { transform: rotate(90deg) scale(1); }
	}

	@media (prefers-reduced-motion: reduce) {
		:global(a:hover) > .signature .base,
		:global(a:hover) > .signature .red,
		:global(a:hover) > .signature .ghost,
		:global(a:hover) > .signature .spin {
			animation: none;
		}
	}
</style>

<script lang="ts">
	/*
	 * Glowing pink orb: tilted rings that spin in 3D around a wireframe
	 * globe and an eight-point star core.
	 * - size:   width/height in px
	 * - speed:  multiplies how fast everything turns (1 = idle)
	 * - bright: extra glow (used on hover and in the archive loader)
	 */
	let {
		size = 120,
		speed = 1,
		bright = false
	}: {
		size?: number;
		speed?: number;
		bright?: boolean;
	} = $props();

	// eight-point star for the core
	const star = (() => {
		const pts: string[] = [];
		for (let i = 0; i < 16; i++) {
			const a = (i * Math.PI) / 8 - Math.PI / 2;
			const r = i % 2 === 0 ? 30 : 13;
			pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
		}
		return pts.join(' ');
	})();
</script>

<div
	class="orb"
	class:bright
	style="--size: {size}px; --speed: {speed};"
	aria-hidden="true"
>
	<div class="glow"></div>

	<div class="stage">
		<!-- wireframe globe: meridians turning around the vertical axis -->
		<div class="layer globe">
			<svg viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="30" />
				<ellipse cx="50" cy="50" rx="30" ry="9" />
				<ellipse cx="50" cy="50" rx="20" ry="30" />
				<ellipse cx="50" cy="50" rx="8" ry="30" />
			</svg>
		</div>

		<!-- star core -->
		<div class="layer core">
			<svg viewBox="0 0 100 100">
				<polygon points={star} />
				<circle cx="50" cy="50" r="9" />
			</svg>
		</div>

		<!-- flat orbit ring with tick marks (seen almost edge-on) -->
		<div class="layer ring flat">
			<svg viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="46" />
				<circle class="ticks" cx="50" cy="50" r="42" />
				<circle cx="50" cy="50" r="38" />
			</svg>
		</div>

		<!-- tilted orbits -->
		<div class="layer ring tilt-a">
			<svg viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="44" />
			</svg>
		</div>

		<div class="layer ring tilt-b">
			<svg viewBox="0 0 100 100">
				<circle class="dash" cx="50" cy="50" r="47" />
			</svg>
		</div>

		<!-- outer dashed shell, facing the viewer -->
		<div class="layer ring front">
			<svg viewBox="0 0 100 100">
				<circle class="dash-long" cx="50" cy="50" r="40" />
			</svg>
		</div>
	</div>

	<!-- sparks -->
	<span class="spark s1"></span>
	<span class="spark s2"></span>
</div>

<style>
	.orb {
		--pink: #ff4d8f;
		--pink-hot: var(--hot-red, #ff3d8a);

		position: relative;

		width: var(--size);
		height: var(--size);

		filter:
			drop-shadow(0 0 4px rgba(255, 77, 143, 0.8))
			drop-shadow(0 0 12px rgba(255, 42, 127, 0.45));

		transition: filter 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.orb.bright {
		filter:
			drop-shadow(0 0 6px rgba(255, 150, 185, 1))
			drop-shadow(0 0 18px rgba(255, 42, 127, 0.85))
			drop-shadow(0 0 40px rgba(194, 24, 122, 0.45));
		transform: scale(1.08);
	}

	.glow {
		position: absolute;
		inset: 18%;

		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 77, 143, 0.35), rgba(255, 42, 127, 0.08) 55%, transparent 72%);

		transition: opacity 400ms ease;
		opacity: 0.7;
	}

	.bright .glow {
		opacity: 1;
	}

	.stage {
		position: absolute;
		inset: 0;

		perspective: calc(var(--size) * 4);
		transform-style: preserve-3d;
	}

	.layer {
		position: absolute;
		inset: 0;

		transform-style: preserve-3d;
	}

	.layer svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	circle,
	ellipse,
	polygon {
		fill: none;
		stroke: var(--pink);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	/* ---------- the pieces ---------- */

	.globe {
		animation: spin-y calc(9s / var(--speed)) linear infinite;
	}

	.globe circle,
	.globe ellipse {
		stroke-opacity: 0.55;
	}

	.core {
		inset: 18%;
		animation: spin-z calc(14s / var(--speed)) linear infinite reverse;
	}

	.core polygon {
		fill: rgba(255, 77, 143, 0.55);
		stroke: #ffc6da;
	}

	.core circle {
		fill: rgba(255, 61, 138, 0.6);
		stroke: #ffd9e6;
	}

	.flat {
		animation: orbit-flat calc(12s / var(--speed)) linear infinite;
	}

	.ticks {
		stroke-width: 3;
		stroke-dasharray: 0.6 2.2;
		stroke-opacity: 0.8;
	}

	.tilt-a {
		animation: orbit-a calc(7s / var(--speed)) linear infinite;
	}

	.tilt-b {
		animation: orbit-b calc(10s / var(--speed)) linear infinite;
	}

	.dash {
		stroke-width: 1.4;
		stroke-dasharray: 18 6 3 6;
	}

	.front {
		animation: spin-z calc(16s / var(--speed)) linear infinite;
	}

	.dash-long {
		stroke-width: 2.2;
		stroke-dasharray: 22 9;
		stroke: #ff7aa8;
	}

	.spark {
		position: absolute;

		width: 3px;
		height: 7px;

		background: var(--pink);
		transform: rotate(35deg);

		animation: spark calc(3s / var(--speed)) ease-in-out infinite;
	}

	.s1 {
		left: 18%;
		top: 10%;
	}

	.s2 {
		right: 22%;
		bottom: 8%;
		animation-delay: -1.5s;
	}

	/* ---------- motion ---------- */

	@keyframes spin-z {
		to { transform: rotate(360deg); }
	}

	@keyframes spin-y {
		to { transform: rotateY(360deg); }
	}

	@keyframes orbit-flat {
		from { transform: rotateX(76deg) rotateZ(0deg); }
		to { transform: rotateX(76deg) rotateZ(360deg); }
	}

	@keyframes orbit-a {
		from { transform: rotateY(62deg) rotateX(18deg) rotateZ(0deg); }
		to { transform: rotateY(62deg) rotateX(18deg) rotateZ(360deg); }
	}

	@keyframes orbit-b {
		from { transform: rotateX(58deg) rotateY(-28deg) rotateZ(360deg); }
		to { transform: rotateX(58deg) rotateY(-28deg) rotateZ(0deg); }
	}

	@keyframes spark {
		0%,
		100% { opacity: 0.2; }
		50% { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.globe,
		.core,
		.flat,
		.tilt-a,
		.tilt-b,
		.front,
		.spark {
			animation: none;
		}

		.flat { transform: rotateX(76deg); }
		.tilt-a { transform: rotateY(62deg) rotateX(18deg); }
		.tilt-b { transform: rotateX(58deg) rotateY(-28deg); }
	}
</style>

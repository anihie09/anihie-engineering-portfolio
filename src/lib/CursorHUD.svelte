<script lang="ts">
	import { onMount } from 'svelte';

	let hud: HTMLDivElement | null = null;

	onMount(() => {
		const root = document.documentElement;

		let targetX = window.innerWidth * 0.5;
		let targetY = window.innerHeight * 0.5;

		let currentX = targetX;
		let currentY = targetY;

		let previousX = currentX;
		let previousY = currentY;

		let velocity = 0;

		/*
		 * Persistent cursor offset.
		 *
		 * Unlike velocity, this does not go back to zero
		 * when the mouse stops. That is what keeps the
		 * halftone / lens effect alive at rest.
		 */
		let persistentX = 0;
		let persistentY = 0;

		let idleTime = 0;

		let frame = 0;

		const reducedMotion =
			window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			);

		const handlePointerMove = (
			event: PointerEvent
		) => {
			targetX = event.clientX;
			targetY = event.clientY;
			idleTime = 0;
		};

		const animate = () => {
			/* ============================================
			   SMOOTH CURSOR
			   ============================================ */

			currentX +=
				(targetX - currentX) * 0.13;

			currentY +=
				(targetY - currentY) * 0.13;

			/* ============================================
			   VELOCITY
			   ============================================ */

			const dx =
				currentX - previousX;

			const dy =
				currentY - previousY;

			const rawVelocity =
				Math.min(
					Math.sqrt(
						dx * dx +
							dy * dy
					) / 19,
					1
				);

			velocity +=
				(rawVelocity - velocity) *
				0.16;

			/* ============================================
			   PERSISTENT CURSOR FIELD

			   This is the important difference.

			   The cursor's current position influences a
			   low-frequency moving field even after movement
			   stops.
			   ============================================ */

			const normalizedX =
				(
					currentX /
					window.innerWidth -
					0.5
				) * 2;

			const normalizedY =
				(
					currentY /
					window.innerHeight -
					0.5
				) * 2;

			persistentX +=
				(
					normalizedX * 18 -
					persistentX
				) * 0.025;

			persistentY +=
				(
					normalizedY * 18 -
					persistentY
				) * 0.025;

			/* ============================================
			   IDLE PULSE
			   ============================================ */

			idleTime += 0.018;

			const idlePulse =
				0.5 +
				Math.sin(idleTime) * 0.5;

			/* ============================================
			   SHARED INTENSITY

			   NEVER reaches zero while active.
			   ============================================ */

			const intensity =
				reducedMotion.matches
					? 0
					: Math.min(
							0.44 +
								velocity * 0.44 +
								idlePulse * 0.08,
							1
						);

			/* ============================================
			   GLOBAL VARIABLES
			   ============================================ */

			const percentX =
				`${(currentX / window.innerWidth) * 100}%`;

			const percentY =
				`${(currentY / window.innerHeight) * 100}%`;

			root.style.setProperty(
				'--cursor-x',
				percentX
			);

			root.style.setProperty(
				'--cursor-y',
				percentY
			);

			root.style.setProperty(
				'--cursor-px',
				`${currentX}px`
			);

			root.style.setProperty(
				'--cursor-py',
				`${currentY}px`
			);

			root.style.setProperty(
				'--cursor-vx',
				`${dx}px`
			);

			root.style.setProperty(
				'--cursor-vy',
				`${dy}px`
			);

			root.style.setProperty(
				'--cursor-field-x',
				`${persistentX}px`
			);

			root.style.setProperty(
				'--cursor-field-y',
				`${persistentY}px`
			);

			root.style.setProperty(
				'--cursor-intensity',
				String(intensity)
			);

			root.style.setProperty(
				'--cursor-velocity',
				String(velocity)
			);

			root.style.setProperty(
				'--cursor-idle',
				String(idlePulse)
			);

			/* ============================================
			   HUD INTERNAL VARIABLES
			   ============================================ */

			if (hud) {
				hud.style.setProperty(
					'--x',
					`${currentX}px`
				);

				hud.style.setProperty(
					'--y',
					`${currentY}px`
				);

				hud.style.setProperty(
					'--dx',
					`${dx}px`
				);

				hud.style.setProperty(
					'--dy',
					`${dy}px`
				);

				hud.style.setProperty(
					'--field-x',
					`${persistentX}px`
				);

				hud.style.setProperty(
					'--field-y',
					`${persistentY}px`
				);

				hud.style.setProperty(
					'--strength',
					String(intensity)
				);

				hud.style.setProperty(
					'--velocity',
					String(velocity)
				);

				hud.style.setProperty(
					'--idle',
					String(idlePulse)
				);
			}

			previousX = currentX;
			previousY = currentY;

			frame =
				requestAnimationFrame(
					animate
				);
		};

		window.addEventListener(
			'pointermove',
			handlePointerMove,
			{
				passive: true
			}
		);

		frame =
			requestAnimationFrame(
				animate
			);

		return () => {
			window.removeEventListener(
				'pointermove',
				handlePointerMove
			);

			cancelAnimationFrame(
				frame
			);
		};
	});
</script>

<div
	bind:this={hud}
	class="cursor-hud"
	aria-hidden="true"
>
	<!-- =============================================
	     SOFT BLOOM
	     ============================================= -->

	<div class="cursor-bloom"></div>


	<!-- =============================================
	     GLOBAL HALFTONE LENS
	     ============================================= -->

	<div class="cursor-halftone"></div>


	<!-- =============================================
	     CYBER SCOPE
	     ============================================= -->

	<div class="cursor-scope">

		<div class="scope-ring outer"></div>
		<div class="scope-ring middle"></div>
		<div class="scope-ring inner"></div>

		<div class="scope-axis horizontal"></div>
		<div class="scope-axis vertical"></div>

		<div class="scope-node top"></div>
		<div class="scope-node right"></div>
		<div class="scope-node bottom"></div>
		<div class="scope-node left"></div>

	</div>


	<!-- =============================================
	     GLITCH FRAGMENTS
	     ============================================= -->

	<div class="cursor-fragments">
		<span class="fragment f1"></span>
		<span class="fragment f2"></span>
		<span class="fragment f3"></span>
		<span class="fragment f4"></span>
		<span class="fragment f5"></span>
		<span class="fragment f6"></span>
	</div>
</div>

<style>
	:global(:root) {
		--cursor-x: 50%;
		--cursor-y: 50%;

		--cursor-px: 50vw;
		--cursor-py: 50vh;

		--cursor-vx: 0px;
		--cursor-vy: 0px;

		--cursor-field-x: 0px;
		--cursor-field-y: 0px;

		--cursor-intensity: 0.5;
		--cursor-velocity: 0;
		--cursor-idle: 0.5;
	}

	.cursor-hud {
		position: fixed;

		inset: 0;

		z-index: 900;

		pointer-events: none;

		overflow: hidden;

		--x: 50vw;
		--y: 50vh;

		--dx: 0px;
		--dy: 0px;

		--field-x: 0px;
		--field-y: 0px;

		--strength: 0.5;
		--velocity: 0;
		--idle: 0.5;
	}

	/* =====================================================
	   BLOOM
	   ===================================================== */

	.cursor-bloom {
		position: absolute;

		left: var(--x);
		top: var(--y);

		width: 220px;
		height: 220px;

		transform:
			translate(-50%, -50%)
			scale(
				calc(
					0.92 +
					var(--strength) * 0.1
				)
			);

		border-radius: 50%;

		background:
			radial-gradient(
				circle,
				rgba(
					255,
					0,
					128,
					0.11
				),
				rgba(
					255,
					0,
					128,
					0.025
				) 38%,
				transparent 72%
			);

		filter:
			blur(10px);

		mix-blend-mode:
			screen;

		opacity:
			calc(
				0.6 +
				var(--idle) * 0.12
			);
	}


	/* =====================================================
	   MOVING HALFTONE

	   The field is deliberately translated using BOTH
	   persistent cursor position and instantaneous
	   velocity. Therefore it keeps moving when the mouse
	   stops instead of freezing.
	   ===================================================== */

	.cursor-halftone {
		position: absolute;

		left: var(--x);
		top: var(--y);

		width: 310px;
		height: 310px;

		transform:
			translate(-50%, -50%)
			translate(
				calc(
					var(--field-x) * 1.8 +
					var(--dx) * 5
				),
				calc(
					var(--field-y) * 1.8 +
					var(--dy) * 5
				)
			);

		background-image:
			radial-gradient(
				circle,
				rgba(
					255,
					0,
					128,
					0.32
				)
				1px,
				transparent 1.55px
			);

		background-size:
			6px 6px;

		background-position:
			calc(
				var(--field-x) * 2 +
				var(--dx) * 8
			)
			calc(
				var(--field-y) * 2 +
				var(--dy) * 8
			);

		mask-image:
			radial-gradient(
				circle,
				black 0%,
				rgba(
					0,
					0,
					0,
					0.85
				) 25%,
				rgba(
					0,
					0,
					0,
					0.46
				) 52%,
				transparent 76%
			);

		-webkit-mask-image:
			radial-gradient(
				circle,
				black 0%,
				rgba(
					0,
					0,
					0,
					0.85
				) 25%,
				rgba(
					0,
					0,
					0,
					0.46
				) 52%,
				transparent 76%
			);

		opacity:
			calc(
				0.2 +
				var(--strength) * 0.22
			);

		mix-blend-mode:
			screen;

		transition:
			background-position
			35ms linear;
	}


	/* =====================================================
	   SCOPE
	   ===================================================== */

	.cursor-scope {
		position: absolute;

		left: var(--x);
		top: var(--y);

		width:
			calc(
				54px +
				var(--strength) * 8px
			);

		height:
			calc(
				54px +
				var(--strength) * 8px
			);

		transform:
			translate(-50%, -50%)
			translate(
				calc(var(--dx) * 0.65),
				calc(var(--dy) * 0.65)
			)
			scale(
				calc(
					0.96 +
					var(--strength) * 0.08
				)
			);

		opacity:
			calc(
				0.25 +
				var(--strength) * 0.32
			);
	}

	.scope-ring {
		position: absolute;

		left: 50%;
		top: 50%;

		border:
			1px solid
			rgba(
				255,
				0,
				128,
				0.65
			);

		border-radius: 50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.scope-ring.outer {
		width: 100%;
		height: 100%;
	}

	.scope-ring.middle {
		width: 65%;
		height: 65%;

		opacity: 0.5;
	}

	.scope-ring.inner {
		width: 30%;
		height: 30%;
	}

	.scope-axis {
		position: absolute;

		background:
			rgba(
				255,
				0,
				128,
				0.62
			);
	}

	.scope-axis.horizontal {
		left: -9px;
		right: -9px;

		top: 50%;

		height: 1px;
	}

	.scope-axis.vertical {
		top: -9px;
		bottom: -9px;

		left: 50%;

		width: 1px;
	}

	.scope-node {
		position: absolute;

		width: 4px;
		height: 4px;

		border-radius: 50%;

		background:
			#ff0080;
	}

	.scope-node.top {
		left: 50%;
		top: -2px;

		transform:
			translateX(-50%);
	}

	.scope-node.right {
		right: -2px;
		top: 50%;

		transform:
			translateY(-50%);
	}

	.scope-node.bottom {
		left: 50%;
		bottom: -2px;

		transform:
			translateX(-50%);
	}

	.scope-node.left {
		left: -2px;
		top: 50%;

		transform:
			translateY(-50%);
	}


	/* =====================================================
	   GLITCH FRAGMENTS
	   ===================================================== */

	.cursor-fragments {
		position: absolute;

		left: var(--x);
		top: var(--y);

		width: 108px;
		height: 74px;

		transform:
			translate(-50%, -50%)
			translate(
				calc(
					var(--dx) * 1.2
				),
				calc(
					var(--dy) * 1.2
				)
			);

		opacity:
			calc(
				0.18 +
				var(--velocity) * 0.58 +
				var(--idle) * 0.05
			);
	}

	.fragment {
		position: absolute;

		display: block;

		height: 1px;

		background:
			#ff0080;

		box-shadow:
			0 0 5px
			rgba(
				255,
				0,
				128,
				0.5
			);

		animation:
			fragment-glitch
			1.2s
			steps(5, end)
			infinite;
	}

	.f1 {
		left: 3px;
		top: 8px;

		width: 26px;
	}

	.f2 {
		right: 1px;
		top: 19px;

		width: 15px;

		animation-delay:
			0.1s;
	}

	.f3 {
		left: 12px;
		top: 32px;

		width: 18px;

		animation-delay:
			0.2s;
	}

	.f4 {
		right: 8px;
		top: 44px;

		width: 28px;

		animation-delay:
			0.3s;
	}

	.f5 {
		left: 5px;
		bottom: 8px;

		width: 21px;

		animation-delay:
			0.4s;
	}

	.f6 {
		right: 5px;
		bottom: 3px;

		width: 14px;

		animation-delay:
			0.5s;
	}

	@keyframes fragment-glitch {
		0%,
		100% {
			opacity: 0.3;

			transform:
				translateX(0);
		}

		16% {
			opacity: 0.95;

			transform:
				translateX(3px);
		}

		31% {
			opacity: 0.18;

			transform:
				translateX(-3px);
		}

		48% {
			opacity: 0.8;

			transform:
				translateX(4px);
		}

		65% {
			opacity: 0.25;

			transform:
				translateX(-2px);
		}

		82% {
			opacity: 0.9;

			transform:
				translateX(2px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor-hud {
			display: none;
		}
	}
</style>

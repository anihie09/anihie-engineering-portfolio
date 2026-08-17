<script lang="ts">
	import { onMount } from 'svelte';
	import {
		onNavigate,
		afterNavigate
	} from '$app/navigation';
	import type { Snippet } from 'svelte';

	import CursorHUD from '$lib/CursorHUD.svelte';

	let { children }: { children: Snippet } = $props();

	let booting = $state(true);
	let bootExiting = $state(false);

	let transitioning = $state(false);
	let transitionLeaving = $state(false);

	let pendingPageTransition = false;

	/* =====================================================
	   INITIAL BOOT
	   ===================================================== */

	onMount(() => {
		const timer = window.setTimeout(() => {
			bootExiting = true;

			window.setTimeout(() => {
				booting = false;
				bootExiting = false;
			}, 1050);
		}, 2500);

		return () => {
			window.clearTimeout(timer);
		};
	});

	/* =====================================================
	   PAGE TRANSITION
	   ===================================================== */

	onNavigate((navigation) => {
		if (!navigation.from) {
			return;
		}

		pendingPageTransition = true;
		transitioning = true;
		transitionLeaving = false;

		return new Promise<void>((resolve) => {
			window.setTimeout(resolve, 500);
		});
	});

	afterNavigate(() => {
		if (!pendingPageTransition) {
			return;
		}

		pendingPageTransition = false;

		window.setTimeout(() => {
			transitionLeaving = true;

			window.setTimeout(() => {
				transitioning = false;
				transitionLeaving = false;
			}, 820);
		}, 70);
	});
</script>

<svelte:head>
	<meta
		name="theme-color"
		content="#000000"
	/>
</svelte:head>

<div class="site">

	<!-- =================================================
	     GLOBAL CURSOR
	     ================================================= -->

	<CursorHUD />

	<!-- =================================================
	     GLOBAL HOME BUTTON
	     ================================================= -->

	<a
		class="home-button"
		href="/"
		aria-label="Home"
		title="Home"
	>
		<!-- Base signature -->
		<span class="signature-layer signature-base">
			<img
				src="/signature.png"
				alt="Anihie"
			/>
		</span>

		<!-- Pink glitch duplicate -->
		<span
			class="signature-layer signature-pink"
			aria-hidden="true"
		>
			<img
				src="/signature.png"
				alt=""
			/>
		</span>

		<!-- White glitch duplicate -->
		<span
			class="signature-layer signature-white"
			aria-hidden="true"
		>
			<img
				src="/signature.png"
				alt=""
			/>
		</span>

		<!-- Scan line -->
		<span
			class="signature-scan"
			aria-hidden="true"
		></span>

		<!-- Noise -->
		<span
			class="signature-noise"
			aria-hidden="true"
		></span>
	</a>

	<!-- =================================================
	     PAGE CONTENT
	     ================================================= -->

	{@render children()}

	<!-- =================================================
	     GLOBAL HUD
	     ================================================= -->

	<div
		class="global-hud"
		aria-hidden="true"
	>
		<!-- BORDER -->

		<div class="hud-border top"></div>
		<div class="hud-border right"></div>
		<div class="hud-border bottom"></div>
		<div class="hud-border left"></div>

		<!-- TOP SIGNAL -->

		<div class="top-signal">
			<div class="top-signal-line"></div>

			<div class="top-signal-node n1"></div>
			<div class="top-signal-node n2"></div>
			<div class="top-signal-node n3"></div>

			<div class="top-signal-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- TOP RIGHT SYSTEM -->

		<div class="edge-system top-right-system">
			<div class="system-box-title">
				SYS
			</div>

			<div class="system-box-data">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<div class="system-box-status">
				01 / ONLINE
			</div>
		</div>

		<!-- LEFT RADAR -->

		<div class="edge-radar left-radar">
			<div class="radar-circle outer"></div>
			<div class="radar-circle middle"></div>
			<div class="radar-circle inner"></div>

			<div class="radar-cross horizontal"></div>
			<div class="radar-cross vertical"></div>

			<div class="radar-sweep"></div>
			<div class="radar-point"></div>
		</div>

		<!-- RIGHT RADAR -->

		<div class="edge-radar right-radar">
			<div class="radar-circle outer"></div>
			<div class="radar-circle middle"></div>
			<div class="radar-circle inner"></div>

			<div class="radar-cross horizontal"></div>
			<div class="radar-cross vertical"></div>

			<div class="radar-sweep"></div>
			<div class="radar-point"></div>
		</div>

		<!-- LEFT RAIL -->

		<div class="data-rail left-rail">
			<div class="rail-number">03</div>

			<div class="rail-track"></div>

			<div class="rail-point"></div>
			<div class="rail-point"></div>
			<div class="rail-point"></div>
			<div class="rail-point"></div>

			<div class="rail-data">
				<span>021</span>
				<span>442</span>
				<span>009</span>
			</div>
		</div>

		<!-- RIGHT RAIL -->

		<div class="data-rail right-rail">
			<div class="rail-number">08</div>

			<div class="rail-track"></div>

			<div class="rail-point"></div>
			<div class="rail-point"></div>
			<div class="rail-point"></div>
			<div class="rail-point"></div>

			<div class="rail-data">
				<span>042</span>
				<span>117</span>
				<span>903</span>
			</div>
		</div>

		<!-- BOTTOM LEFT -->

		<div class="bottom-module bottom-left-module">
			<div class="module-heading">
				CORE / 02
			</div>

			<div class="module-bar-grid">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<div class="module-rule"></div>

			<div class="module-small-text">
				SYSTEM READY
			</div>
		</div>

		<!-- BOTTOM STREAM -->

		<div class="bottom-stream">
			<div class="stream-rule"></div>

			<div class="stream-node start"></div>
			<div class="stream-node middle"></div>
			<div class="stream-node end"></div>

			<div class="stream-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<div class="stream-label">
				LINK ESTABLISHED
			</div>
		</div>

		<!-- BOTTOM RIGHT -->

		<div class="bottom-module bottom-right-module">
			<div class="module-heading">
				STATUS
			</div>

			<div class="module-status-code">
				01-09 / ACTIVE
			</div>

			<div class="module-bar-grid compact">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- BOTTOM CIRCUIT -->

		<div class="bottom-circuit">
			<div class="bottom-circuit-main"></div>

			<div class="bottom-circuit-branch branch-a"></div>
			<div class="bottom-circuit-branch branch-b"></div>
			<div class="bottom-circuit-branch branch-c"></div>

			<div class="bottom-circuit-point point-a"></div>
			<div class="bottom-circuit-point point-b"></div>
			<div class="bottom-circuit-point point-c"></div>
		</div>

		<!-- CORNER DATA -->

		<div class="corner-cluster corner-cluster-tl">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<div class="corner-cluster corner-cluster-tr">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<div class="corner-cluster corner-cluster-bl">
			<span></span>
			<span></span>
			<span></span>
		</div>

		<div class="corner-cluster corner-cluster-br">
			<span></span>
			<span></span>
			<span></span>
		</div>

		<!-- CORNER BRACKETS -->

		<div class="corner-bracket bracket-tl">
			<div class="bracket-line main"></div>
			<div class="bracket-line short"></div>
			<div class="bracket-node"></div>
		</div>

		<div class="corner-bracket bracket-tr">
			<div class="bracket-line main"></div>
			<div class="bracket-line short"></div>
			<div class="bracket-node"></div>
		</div>

		<div class="corner-bracket bracket-bl">
			<div class="bracket-line main"></div>
			<div class="bracket-line short"></div>
			<div class="bracket-node"></div>
		</div>

		<div class="corner-bracket bracket-br">
			<div class="bracket-line main"></div>
			<div class="bracket-line short"></div>
			<div class="bracket-node"></div>
		</div>
	</div>

	<!-- =================================================
	     BOOT
	     ================================================= -->

	{#if booting}
		<div
			class:boot-exiting={bootExiting}
			class="boot-transition"
			aria-hidden="true"
		>
			<div class="boot-scene"></div>
			<div class="boot-scene-blur"></div>
			<div class="boot-dark"></div>

			<div class="boot-glitch-field">
				<div class="boot-glitch g1"></div>
				<div class="boot-glitch g2"></div>
				<div class="boot-glitch g3"></div>
				<div class="boot-glitch g4"></div>
				<div class="boot-glitch g5"></div>
				<div class="boot-glitch g6"></div>
				<div class="boot-glitch g7"></div>
				<div class="boot-glitch g8"></div>
				<div class="boot-glitch g9"></div>
				<div class="boot-glitch g10"></div>
			</div>

			<div class="boot-scanlines"></div>

			<div class="loading-state">
				<div class="loading-frame">
					<div class="loading-corner tl"></div>
					<div class="loading-corner tr"></div>
					<div class="loading-corner bl"></div>
					<div class="loading-corner br"></div>

					<div class="loading-ring large"></div>
					<div class="loading-ring small"></div>

					<div class="loading-cross vertical"></div>
					<div class="loading-cross horizontal"></div>

					<div class="loading-title">
						LOADING
					</div>

					<div class="loading-status">
						<span>SYSTEM LINK</span>
						<span class="pink">///</span>
						<span>01</span>
					</div>

					<div class="loading-blocks">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>

			<div class="loading-tears">
				<div class="loading-tear lt1"></div>
				<div class="loading-tear lt2"></div>
				<div class="loading-tear lt3"></div>
				<div class="loading-tear lt4"></div>
				<div class="loading-tear lt5"></div>
			</div>

			<div class="boot-release"></div>
		</div>
	{/if}

	<!-- =================================================
	     PAGE TRANSITION
	     ================================================= -->

	{#if transitioning}
		<div
			class:transition-leaving={transitionLeaving}
			class="page-transition"
			aria-hidden="true"
		>
			<div class="transition-scene"></div>
			<div class="transition-scene-distortion"></div>
			<div class="transition-dark"></div>

			<div class="transition-strips">
				<div class="transition-strip ts1"></div>
				<div class="transition-strip ts2"></div>
				<div class="transition-strip ts3"></div>
				<div class="transition-strip ts4"></div>
				<div class="transition-strip ts5"></div>
				<div class="transition-strip ts6"></div>
				<div class="transition-strip ts7"></div>
				<div class="transition-strip ts8"></div>
				<div class="transition-strip ts9"></div>
				<div class="transition-strip ts10"></div>
				<div class="transition-strip ts11"></div>
				<div class="transition-strip ts12"></div>
			</div>

			<div class="transition-loading">
				<div class="transition-frame">
					<div class="transition-corner tl"></div>
					<div class="transition-corner tr"></div>
					<div class="transition-corner bl"></div>
					<div class="transition-corner br"></div>

					<div class="transition-circle circle-large"></div>
					<div class="transition-circle circle-small"></div>

					<div class="transition-title">
						LOADING
					</div>

					<div class="transition-code">
						SYSTEM RECONFIGURE
						<span class="pink">///</span>
					</div>

					<div class="transition-bars">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>

			<div class="release-strips">
				<div class="release-strip r1"></div>
				<div class="release-strip r2"></div>
				<div class="release-strip r3"></div>
				<div class="release-strip r4"></div>
				<div class="release-strip r5"></div>
				<div class="release-strip r6"></div>
			</div>

			<div class="release-scan"></div>
			<div class="page-release"></div>
		</div>
	{/if}
</div>

<style>
	/* =====================================================
	   COLORS / RESET
	   ===================================================== */

	:global(:root) {
		--hud-pink: #ff0080;
		--hud-pink-soft: rgba(255, 0, 128, 0.55);
		--hud-pink-faint: rgba(255, 0, 128, 0.2);
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		min-width: 100%;
		min-height: 100%;
		background: #000;
		color: #fff;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.site {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: #000;
	}

	/* =====================================================
	   HOME BUTTON
	   ===================================================== */

	.home-button {
		position: fixed;

		left: 4%;
		top: 2.2%;

		z-index: 1000;

		/*
		 * Explicit dimensions are important.
		 * The previous version used only absolutely-
		 * positioned children, causing the anchor to
		 * collapse to zero height.
		 */
		width: 275px;
		height: 105px;

		display: block;

		cursor: pointer;
		text-decoration: none;

		pointer-events: auto;

		transform-origin: left top;

		transition:
			transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 180ms ease;
	}

	.signature-layer {
		position: absolute;

		left: 0;
		top: 0;

		width: 100%;
		height: 100%;

		display: block;

		pointer-events: none;

		overflow: visible;

		opacity: 0;
	}

	.signature-layer img {
		display: block;

		width: 100%;
		height: 100%;

		object-fit: contain;
		object-position: left top;
	}

	/* Base signature is ALWAYS visible */
	.signature-base {
		position: absolute;

		inset: 0;

		opacity: 1;

		z-index: 1;
	}

	.signature-base img {
		filter:
			drop-shadow(
				0 0 5px
				rgba(255, 0, 128, 0.18)
			);
	}

	.signature-pink {
		z-index: 2;

		filter:
			sepia(1)
			saturate(100)
			hue-rotate(285deg)
			brightness(1.35)
			contrast(1.2);

		mix-blend-mode: screen;
	}

	.signature-white {
		z-index: 3;

		filter:
			grayscale(1)
			brightness(2.3)
			contrast(1.25);

		mix-blend-mode: screen;
	}

	.signature-scan {
		position: absolute;

		left: -5%;
		right: -5%;

		top: 45%;

		height: 2px;

		z-index: 4;

		background:
			linear-gradient(
				90deg,
				transparent,
				rgba(255, 0, 128, 0.9),
				transparent
			);

		opacity: 0;

		pointer-events: none;
	}

	.signature-noise {
		position: absolute;

		left: -2%;
		top: 0;

		width: 104%;
		height: 100%;

		z-index: 5;

		pointer-events: none;

		opacity: 0;

		background:
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 4px,
				rgba(255, 0, 128, 0.16) 5px,
				transparent 6px
			);

		mix-blend-mode: screen;
	}

	/* =====================================================
	   HOME HOVER
	   ===================================================== */

	.home-button:hover,
	.home-button:focus-visible {
		transform:
			translateX(3px)
			scale(1.035);

		filter:
			drop-shadow(
				0 0 6px
				rgba(255, 0, 128, 0.55)
			)
			drop-shadow(
				0 0 18px
				rgba(255, 0, 128, 0.23)
			);

		outline: none;
	}

	.home-button:hover .signature-pink,
	.home-button:focus-visible .signature-pink {
		opacity: 0.8;

		animation:
			signature-glitch-pink
			480ms
			steps(7, end)
			infinite;
	}

	.home-button:hover .signature-white,
	.home-button:focus-visible .signature-white {
		opacity: 0.38;

		animation:
			signature-glitch-white
			430ms
			steps(6, end)
			infinite;
	}

	.home-button:hover .signature-scan,
	.home-button:focus-visible .signature-scan {
		opacity: 1;

		animation:
			signature-scan
			850ms
			steps(5, end)
			infinite;
	}

	.home-button:hover .signature-noise,
	.home-button:focus-visible .signature-noise {
		opacity: 0.78;

		animation:
			signature-noise-glitch
			300ms
			steps(4, end)
			infinite;
	}

	/* =====================================================
	   SIGNATURE ANIMATIONS
	   ===================================================== */

	@keyframes signature-glitch-pink {
		0%,
		100% {
			transform: translate(0, 0);
			clip-path: inset(0 0 0 0);
		}

		8% {
			transform: translate(5px, -1px);
			clip-path: inset(4% 0 82% 0);
		}

		16% {
			transform: translate(-7px, 1px);
			clip-path: inset(28% 0 46% 0);
		}

		26% {
			transform: translate(4px, 0);
			clip-path: inset(63% 0 25% 0);
		}

		38% {
			transform: translate(-5px, -1px);
			clip-path: inset(79% 0 7% 0);
		}

		52% {
			transform: translate(8px, 1px);
			clip-path: inset(14% 0 69% 0);
		}

		66% {
			transform: translate(-4px, 0);
			clip-path: inset(42% 0 37% 0);
		}

		80% {
			transform: translate(6px, -1px);
			clip-path: inset(73% 0 12% 0);
		}

		92% {
			transform: translate(-3px, 0);
			clip-path: inset(9% 0 77% 0);
		}
	}

	@keyframes signature-glitch-white {
		0%,
		100% {
			transform: translate(0, 0);
			clip-path: inset(0 0 0 0);
		}

		12% {
			transform: translate(-4px, 0);
			clip-path: inset(17% 0 70% 0);
		}

		29% {
			transform: translate(6px, 1px);
			clip-path: inset(51% 0 27% 0);
		}

		46% {
			transform: translate(-6px, -1px);
			clip-path: inset(76% 0 9% 0);
		}

		63% {
			transform: translate(5px, 0);
			clip-path: inset(34% 0 53% 0);
		}

		81% {
			transform: translate(-3px, 1px);
			clip-path: inset(7% 0 84% 0);
		}
	}

	@keyframes signature-scan {
		0% {
			top: 3%;
			opacity: 0;
		}

		15% {
			opacity: 0.8;
		}

		50% {
			top: 54%;
			opacity: 1;
		}

		85% {
			top: 92%;
			opacity: 0.55;
		}

		100% {
			top: 100%;
			opacity: 0;
		}
	}

	@keyframes signature-noise-glitch {
		0%,
		100% {
			transform: translate(0, 0);
		}

		20% {
			transform: translate(2px, -1px);
		}

		40% {
			transform: translate(-3px, 1px);
		}

		60% {
			transform: translate(1px, 0);
		}

		80% {
			transform: translate(-2px, -1px);
		}
	}

	/* =====================================================
	   GLOBAL HUD
	   ===================================================== */

	.global-hud {
		position: fixed;

		inset: 0;

		z-index: 70;

		pointer-events: none;

		overflow: hidden;

		color: var(--hud-pink);
	}

	/* =====================================================
	   BORDER
	   ===================================================== */

	.hud-border {
		position: absolute;

		background:
			var(--hud-pink);

		opacity: 0.78;

		height: 1px;

		box-shadow:
			0 0 3px
			rgba(255, 0, 128, 0.08);

		animation:
			border-glitch
			4.8s
			steps(3, end)
			infinite;
	}

	.hud-border.top {
		left: 6.5%;
		right: 7%;
		top: 19px;
	}

	.hud-border.right {
		right: 14px;
		top: 9%;
		bottom: 18%;
		width: 1px;
		height: auto;
	}

	.hud-border.bottom {
		left: 7%;
		right: 6.5%;
		bottom: 19px;
		animation-delay: 0.55s;
	}

	.hud-border.left {
		left: 14px;
		top: 9%;
		bottom: 18%;
		width: 1px;
		height: auto;
	}

	/* =====================================================
	   TOP SIGNAL
	   ===================================================== */

	.top-signal {
		position: absolute;
		left: 38%;
		top: 4px;
		width: 24%;
		height: 34px;
	}

	.top-signal-line {
		position: absolute;
		top: 12px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--hud-pink-soft);
	}

	.top-signal-node {
		position: absolute;
		top: 8px;
		width: 7px;
		height: 7px;
		border: 1px solid var(--hud-pink);
		background: #000;
		transform: rotate(45deg);
	}

	.top-signal-node.n1 {
		left: 18%;
	}

	.top-signal-node.n2 {
		left: 50%;
	}

	.top-signal-node.n3 {
		right: 12%;
	}

	.top-signal-bars {
		position: absolute;
		top: 23px;
		left: 35%;
		display: flex;
		gap: 3px;
	}

	.top-signal-bars span {
		width: 6px;
		height: 4px;
		background: var(--hud-pink-soft);
		animation:
			bar-glitch
			1.65s
			steps(4, end)
			infinite;
	}

	/* =====================================================
	   TOP RIGHT SYSTEM
	   ===================================================== */

	.edge-system {
		position: absolute;

		font-family:
			'Courier New',
			Courier,
			monospace;

		animation:
			module-glitch
			4.6s
			steps(3, end)
			infinite;
	}

	.top-right-system {
		right: 4%;
		top: 28px;
		width: 120px;
		height: 28px;
		border: 1px solid var(--hud-pink-soft);
		padding: 6px;
	}

	.system-box-title {
		position: absolute;
		left: 6px;
		top: 7px;
		font-size: 6px;
		font-weight: 700;
	}

	.system-box-data {
		position: absolute;
		left: 27px;
		top: 7px;
		display: flex;
		gap: 2px;
	}

	.system-box-data span {
		width: 5px;
		height: 5px;
		background: var(--hud-pink-soft);
		animation:
			bar-glitch
			1.6s
			steps(4, end)
			infinite;
	}

	.system-box-status {
		position: absolute;
		left: 27px;
		bottom: 4px;
		font-size: 4px;
		color: var(--hud-pink-soft);
	}

	/* =====================================================
	   RADARS
	   ===================================================== */

	.edge-radar {
		position: absolute;

		width: 95px;
		height: 95px;

		opacity: 0.32;

		animation:
			radar-glitch
			5.2s
			steps(3, end)
			infinite;
	}

	.left-radar {
		left: 30px;
		top: 40%;
	}

	.right-radar {
		right: 30px;
		top: 40%;
	}

	.radar-circle {
		position: absolute;
		left: 50%;
		top: 50%;

		border:
			1px solid
			rgba(255, 0, 128, 0.64);

		border-radius: 50%;

		transform:
			translate(-50%, -50%);
	}

	.radar-circle.outer {
		width: 90px;
		height: 90px;
	}

	.radar-circle.middle {
		width: 58px;
		height: 58px;
	}

	.radar-circle.inner {
		width: 25px;
		height: 25px;
	}

	.radar-cross {
		position: absolute;
		background: var(--hud-pink-soft);
	}

	.radar-cross.horizontal {
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
	}

	.radar-cross.vertical {
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
	}

	.radar-sweep {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 39px;
		height: 1px;

		transform-origin: left center;

		background:
			linear-gradient(
				90deg,
				var(--hud-pink),
				transparent
			);

		animation:
			radar-sweep
			3.4s
			linear
			infinite;
	}

	.radar-point {
		position: absolute;
		left: 67%;
		top: 30%;
		width: 4px;
		height: 4px;
		background: var(--hud-pink);
		border-radius: 50%;
	}

	/* =====================================================
	   DATA RAILS
	   ===================================================== */

	.data-rail {
		position: absolute;

		top: 27%;
		width: 30px;

		font-family:
			'Courier New',
			Courier,
			monospace;

		opacity: 0.4;

		animation:
			rail-glitch
			5.4s
			steps(3, end)
			infinite;
	}

	.left-rail {
		left: 8px;
	}

	.right-rail {
		right: 8px;
	}

	.rail-number {
		font-size: 6px;
		margin-bottom: 8px;
	}

	.rail-track {
		width: 1px;
		height: 210px;
		margin-left: 5px;
		background: rgba(255, 0, 128, 0.35);
	}

	.rail-point {
		position: relative;

		width: 6px;
		height: 6px;

		margin:
			12px 0 0 2px;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;
		background: #000;

		animation:
			node-pulse
			2.6s
			ease-in-out
			infinite;
	}

	.rail-data {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-top: 10px;
		font-size: 5px;
		color: var(--hud-pink-soft);
	}

	/* =====================================================
	   BOTTOM MODULES
	   ===================================================== */

	.bottom-module {
		position: absolute;
		bottom: 42px;
		width: 180px;

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size: 6px;
		opacity: 0.5;

		animation:
			module-glitch
			5s
			steps(3, end)
			infinite;
	}

	.bottom-left-module {
		left: 4%;
	}

	.bottom-right-module {
		right: 4%;
	}

	.module-heading {
		letter-spacing: 0.14em;
	}

	.module-bar-grid {
		display: flex;
		gap: 4px;
		margin-top: 7px;
	}

	.module-bar-grid span {
		width: 16px;
		height: 4px;
		background: var(--hud-pink-soft);

		animation:
			bar-glitch
			1.8s
			steps(4, end)
			infinite;
	}

	.module-bar-grid.compact span {
		width: 13px;
	}

	.module-rule {
		width: 100%;
		height: 1px;
		margin-top: 7px;
		background: var(--hud-pink-soft);
	}

	.module-small-text,
	.module-status-code {
		margin-top: 5px;
		color: var(--hud-pink-soft);
	}

	/* =====================================================
	   BOTTOM STREAM
	   ===================================================== */

	.bottom-stream {
		position: absolute;

		left: 50%;
		bottom: 26px;

		width: 380px;
		height: 29px;

		transform:
			translateX(-50%);

		font-family:
			'Courier New',
			Courier,
			monospace;

		opacity: 0.48;

		animation:
			stream-glitch
			4.8s
			steps(3, end)
			infinite;
	}

	.stream-rule {
		position: absolute;
		top: 4px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--hud-pink-soft);
	}

	.stream-node {
		position: absolute;

		top: 1px;

		width: 7px;
		height: 7px;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;
		background: #000;
	}

	.stream-node.start {
		left: 0;
	}

	.stream-node.middle {
		left: 50%;

		transform:
			translateX(-50%);
	}

	.stream-node.end {
		right: 0;
	}

	.stream-bars {
		position: absolute;
		left: 45px;
		right: 45px;
		top: 12px;

		display: flex;
		gap: 4px;
	}

	.stream-bars span {
		flex: 1;

		height: 3px;

		background:
			var(--hud-pink-soft);

		animation:
			bar-glitch
			1.8s
			steps(4, end)
			infinite;
	}

	.stream-label {
		position: absolute;

		left: 50%;
		bottom: -1px;

		transform:
			translateX(-50%);

		font-size: 5px;
		letter-spacing: 0.15em;
	}

	/* =====================================================
	   BOTTOM CIRCUIT
	   ===================================================== */

	.bottom-circuit {
		position: absolute;

		left: 18%;
		right: 18%;
		bottom: 8px;

		height: 24px;

		opacity: 0.46;
	}

	.bottom-circuit-main {
		position: absolute;

		left: 0;
		right: 0;
		top: 10px;

		height: 1px;
		background: var(--hud-pink-soft);
	}

	.bottom-circuit-branch {
		position: absolute;

		top: 5px;
		height: 11px;

		border-left:
			1px solid
			var(--hud-pink-soft);
	}

	.branch-a {
		left: 18%;
	}

	.branch-b {
		left: 52%;
	}

	.branch-c {
		right: 15%;
	}

	.bottom-circuit-point {
		position: absolute;

		top: 6px;

		width: 8px;
		height: 8px;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;
		background: #000;
	}

	.point-a {
		left: 18%;
	}

	.point-b {
		left: 52%;
	}

	.point-c {
		right: 15%;
	}

	/* =====================================================
	   CORNER DATA
	   ===================================================== */

	.corner-cluster {
		position: absolute;
		display: flex;
		gap: 4px;
	}

	.corner-cluster span {
		width: 4px;
		height: 4px;
		background: var(--hud-pink-soft);

		animation:
			bar-glitch
			1.65s
			steps(4, end)
			infinite;
	}

	.corner-cluster-tl {
		left: 54px;
		top: 24px;
	}

	.corner-cluster-tr {
		right: 62px;
		top: 58px;
	}

	.corner-cluster-bl {
		left: 62px;
		bottom: 36px;
	}

	.corner-cluster-br {
		right: 60px;
		bottom: 40px;
	}

	/* =====================================================
	   CORNER BRACKETS
	   ===================================================== */

	.corner-bracket {
		position: absolute;

		width: 76px;
		height: 55px;

		animation:
			module-glitch
			5.2s
			steps(3, end)
			infinite;
	}

	.bracket-tl {
		left: 13px;
		top: 17px;
	}

	.bracket-tr {
		right: 13px;
		top: 17px;
		transform: scaleX(-1);
	}

	.bracket-bl {
		left: 13px;
		bottom: 17px;
		transform: scaleY(-1);
	}

	.bracket-br {
		right: 13px;
		bottom: 17px;
		transform: scale(-1);
	}

	.bracket-line {
		position: absolute;
		left: 0;
		height: 1px;
		background: var(--hud-pink);
	}

	.bracket-line.main {
		top: 14px;
		width: 58px;
	}

	.bracket-line.main::after {
		content: '';

		position: absolute;

		right: 0;
		top: 0;

		width: 1px;
		height: 17px;

		background:
			var(--hud-pink);
	}

	.bracket-line.short {
		top: 29px;
		width: 38px;
		opacity: 0.62;
	}

	.bracket-node {
		position: absolute;

		left: 56px;
		top: 12px;

		width: 6px;
		height: 6px;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;
		background: #000;

		animation:
			node-pulse
			2.4s
			ease-in-out
			infinite;
	}

	/* =====================================================
	   HUD ANIMATIONS
	   ===================================================== */

	@keyframes border-glitch {
		0%,
		86%,
		100% {
			opacity: 0.78;
			transform: translate(0, 0);
		}

		88% {
			opacity: 0.48;
			transform: translate(-1px, 0);
		}

		90% {
			opacity: 0.96;
			transform: translate(2px, 0);
		}

		92% {
			opacity: 0.55;
			transform: translate(-1px, 1px);
		}

		94% {
			opacity: 0.82;
			transform: translate(0, 0);
		}
	}

	@keyframes module-glitch {
		0%,
		84%,
		100% {
			opacity: 0.78;
			transform: translate(0, 0);
		}

		86% {
			opacity: 0.44;
			transform: translate(-2px, 0);
		}

		88% {
			opacity: 0.94;
			transform: translate(3px, -1px);
		}

		90% {
			opacity: 0.4;
			transform: translate(-1px, 1px);
		}

		92% {
			opacity: 0.78;
			transform: translate(1px, 0);
		}

		94% {
			opacity: 0.82;
			transform: translate(0, 0);
		}
	}

	@keyframes rail-glitch {
		0%,
		87%,
		100% {
			opacity: 0.4;
			transform: translateX(0);
		}

		89% {
			opacity: 0.24;
			transform: translateX(-1px);
		}

		91% {
			opacity: 0.64;
			transform: translateX(2px);
		}

		93% {
			opacity: 0.34;
			transform: translateX(-1px);
		}
	}

	@keyframes stream-glitch {
		0%,
		87%,
		100% {
			opacity: 0.48;
			transform: translateX(-50%);
		}

		89% {
			opacity: 0.25;
			transform:
				translateX(
					calc(-50% - 2px)
				);
		}

		91% {
			opacity: 0.72;
			transform:
				translateX(
					calc(-50% + 2px)
				);
		}

		93% {
			opacity: 0.4;
			transform: translateX(-50%);
		}
	}

	@keyframes bar-glitch {
		0%,
		70%,
		100% {
			opacity: 0.52;
			transform: scaleX(1);
		}

		74% {
			opacity: 0.18;
			transform: scaleX(0.62);
		}

		78% {
			opacity: 0.84;
			transform: scaleX(1.12);
		}

		82% {
			opacity: 0.34;
			transform: scaleX(0.82);
		}

		86% {
			opacity: 0.66;
			transform: scaleX(1);
		}
	}

	@keyframes node-pulse {
		0%,
		100% {
			opacity: 0.42;
			transform: scale(0.9);
		}

		50% {
			opacity: 0.95;
			transform: scale(1.14);
		}
	}

	@keyframes radar-sweep {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@keyframes radar-glitch {
		0%,
		88%,
		100% {
			opacity: 0.32;
			transform: translate(0, 0);
		}

		90% {
			opacity: 0.18;
			transform: translate(-1px, 0);
		}

		92% {
			opacity: 0.56;
			transform: translate(2px, -1px);
		}

		94% {
			opacity: 0.3;
			transform: translate(-1px, 1px);
		}
	}

	/* =====================================================
	   BOOT
	   ===================================================== */

	.boot-transition {
		position: fixed;
		inset: 0;

		z-index: 10000;

		overflow: hidden;

		background: #000;
		pointer-events: none;

		animation:
			boot-in
			0.5s
			ease-out
			forwards;
	}

	.boot-transition.boot-exiting {
		animation:
			boot-out
			1.05s
			cubic-bezier(0.76, 0, 0.24, 1)
			forwards;
	}

	.boot-scene {
		position: absolute;
		inset: -5%;

		background:
			url('/home-background.png')
			center center / cover no-repeat;

		filter:
			blur(15px)
			brightness(0.37)
			saturate(0.72);

		transform: scale(1.08);
	}

	.boot-scene-blur {
		position: absolute;
		inset: 0;

		background:
			radial-gradient(
				ellipse at center,
				rgba(255, 0, 128, 0.075),
				rgba(0, 0, 0, 0.85) 100%
			);

		backdrop-filter: blur(3px);
	}

	.boot-dark {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.48);
	}

	.boot-glitch-field {
		position: absolute;
		inset: 0;
		z-index: 4;
	}

	.boot-glitch {
		position: absolute;

		height: 2px;

		background:
			linear-gradient(
				90deg,
				transparent,
				rgba(255, 0, 128, 0.35),
				var(--hud-pink),
				transparent
			);

		opacity: 0;
	}

	.g1 { top: 19%; left: 0; width: 47%; }
	.g2 { top: 27%; right: 4%; width: 40%; }
	.g3 { top: 35%; left: 17%; width: 62%; }
	.g4 { top: 43%; left: 3%; width: 50%; }
	.g5 { top: 51%; right: 9%; width: 61%; }
	.g6 { top: 60%; left: 25%; width: 66%; }
	.g7 { top: 69%; right: 0; width: 45%; }
	.g8 { top: 77%; left: 8%; width: 49%; }
	.g9 { top: 85%; right: 14%; width: 57%; }
	.g10 { top: 91%; left: 21%; width: 53%; }

	.boot-transition:not(.boot-exiting) .boot-glitch {
		animation:
			boot-glitch
			1.5s
			steps(7, end)
			infinite;
	}

	.boot-scanlines {
		position: absolute;
		inset: 0;

		background:
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 4px,
				rgba(255, 0, 128, 0.04) 5px
			);
	}

	.loading-state {
		position: absolute;
		inset: 0;

		z-index: 20;

		display: grid;
		place-items: center;

		animation:
			loading-state-in
			1s
			cubic-bezier(0.22, 1, 0.36, 1)
			forwards;
	}

	.boot-exiting .loading-state {
		animation:
			loading-state-out
			1.05s
			cubic-bezier(0.65, 0, 0.35, 1)
			forwards;
	}

	.loading-frame {
		position: relative;

		width: min(620px, 55vw);
		height: min(345px, 42vh);

		border:
			1px solid
			var(--hud-pink-soft);

		background:
			linear-gradient(
				180deg,
				rgba(255, 0, 128, 0.02),
				rgba(0, 0, 0, 0.52)
			);
	}

	.loading-corner {
		position: absolute;

		width: 28px;
		height: 28px;

		border-color:
			var(--hud-pink);
	}

	.loading-corner.tl {
		left: -1px;
		top: -1px;
		border-left: 1px solid;
		border-top: 1px solid;
	}

	.loading-corner.tr {
		right: -1px;
		top: -1px;
		border-right: 1px solid;
		border-top: 1px solid;
	}

	.loading-corner.bl {
		left: -1px;
		bottom: -1px;
		border-left: 1px solid;
		border-bottom: 1px solid;
	}

	.loading-corner.br {
		right: -1px;
		bottom: -1px;
		border-right: 1px solid;
		border-bottom: 1px solid;
	}

	.loading-ring {
		position: absolute;

		left: 50%;
		top: 50%;

		border:
			1px solid
			var(--hud-pink-soft);

		border-radius: 50%;

		transform:
			translate(-50%, -50%);

		animation:
			loading-ring
			2.3s
			ease-out
			infinite;
	}

	.loading-ring.large {
		width: 110px;
		height: 110px;
	}

	.loading-ring.small {
		width: 58px;
		height: 58px;
		animation-delay: 0.25s;
	}

	.loading-cross {
		position: absolute;

		left: 50%;
		top: 50%;

		background:
			var(--hud-pink-soft);

		transform:
			translate(-50%, -50%);
	}

	.loading-cross.vertical {
		width: 1px;
		height: 150px;
	}

	.loading-cross.horizontal {
		width: 150px;
		height: 1px;
	}

	.loading-title {
		position: absolute;

		left: 50%;
		top: 48%;

		transform:
			translateX(-50%);

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size:
			clamp(0.7rem, 1vw, 0.92rem);

		letter-spacing: 0.18em;

		color:
			rgba(255, 255, 255, 0.74);
	}

	.loading-status {
		position: absolute;

		left: 50%;
		top: 58%;

		transform:
			translateX(-50%);

		display: flex;
		gap: 10px;

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size: 0.5rem;

		letter-spacing: 0.13em;

		color:
			rgba(255, 255, 255, 0.36);
	}

	.pink {
		color: var(--hud-pink);
	}

	.loading-blocks {
		position: absolute;

		left: 50%;
		bottom: 22px;

		transform:
			translateX(-50%);

		display: flex;
		gap: 4px;
	}

	.loading-blocks span {
		width: 7px;
		height: 3px;

		background:
			var(--hud-pink-soft);

		animation:
			bar-glitch
			1.8s
			steps(4, end)
			infinite;
	}

	.loading-tears {
		position: absolute;
		inset: 0;

		z-index: 25;
	}

	.loading-tear {
		position: absolute;

		height: 2px;

		background:
			linear-gradient(
				90deg,
				transparent,
				var(--hud-pink),
				transparent
			);

		opacity: 0;

		animation:
			loading-tear
			1.8s
			steps(7, end)
			infinite;
	}

	.lt1 { top: 28%; left: 5%; width: 40%; }
	.lt2 { top: 40%; right: 5%; width: 32%; animation-delay: 0.1s; }
	.lt3 { top: 52%; left: 12%; width: 64%; animation-delay: 0.2s; }
	.lt4 { top: 66%; right: 11%; width: 44%; animation-delay: 0.3s; }
	.lt5 { top: 78%; left: 20%; width: 52%; animation-delay: 0.4s; }

	.boot-release {
		position: absolute;
		inset: 0;

		z-index: 40;

		background:
			var(--hud-pink);

		opacity: 0;
	}

	.boot-exiting .boot-release {
		animation:
			boot-release
			1.05s
			ease
			forwards;
	}

	/* =====================================================
	   PAGE TRANSITION
	   ===================================================== */

	.page-transition {
		position: fixed;
		inset: 0;

		z-index: 9999;

		overflow: hidden;

		background: #000;

		pointer-events: none;

		animation:
			transition-in
			0.42s
			ease-out
			forwards;
	}

	.transition-scene {
		position: absolute;
		inset: -6%;

		background:
			rgba(0, 0, 0, 0.2);

		animation:
			transition-blur
			1.8s
			cubic-bezier(0.65, 0, 0.35, 1)
			forwards;
	}

	.transition-scene-distortion {
		position: absolute;
		inset: 0;

		background:
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 5px,
				rgba(255, 0, 128, 0.025) 6px
			);

		opacity: 0;

		animation:
			scene-distortion
			1.72s
			ease
			forwards;
	}

	.transition-dark {
		position: absolute;
		inset: 0;

		background:
			radial-gradient(
				ellipse at center,
				rgba(255, 0, 128, 0.025),
				rgba(0, 0, 0, 0.86) 92%
			);

		opacity: 0;

		animation:
			transition-dark
			1.74s
			ease
			forwards;
	}

	.transition-strips {
		position: absolute;
		inset: 0;
		z-index: 8;
	}

	.transition-strip {
		position: absolute;

		height: 3px;

		background:
			linear-gradient(
				90deg,
				transparent,
				var(--hud-pink-soft) 20%,
				var(--hud-pink) 50%,
				var(--hud-pink-soft) 80%,
				transparent
			);

		box-shadow:
			0 0 13px
			rgba(255, 0, 128, 0.3);

		opacity: 0;

		transform:
			translateX(-10%)
			scaleX(0.7);

		animation:
			transition-strip
			1.08s
			cubic-bezier(0.65, 0, 0.35, 1)
			forwards;
	}

	.ts1 { top: 14%; left: 0; width: 55%; }
	.ts2 { top: 21%; left: 32%; width: 63%; animation-delay: 0.03s; }
	.ts3 { top: 28%; left: -4%; width: 46%; animation-delay: 0.06s; }
	.ts4 { top: 35%; left: 15%; width: 72%; animation-delay: 0.09s; }
	.ts5 { top: 42%; left: 40%; width: 57%; animation-delay: 0.12s; }
	.ts6 { top: 50%; left: -4%; width: 54%; animation-delay: 0.15s; }
	.ts7 { top: 57%; left: 17%; width: 68%; animation-delay: 0.18s; }
	.ts8 { top: 64%; left: 44%; width: 59%; animation-delay: 0.21s; }
	.ts9 { top: 71%; left: 3%; width: 56%; animation-delay: 0.24s; }
	.ts10 { top: 78%; left: 28%; width: 68%; animation-delay: 0.27s; }
	.ts11 { top: 85%; left: 8%; width: 42%; animation-delay: 0.3s; }
	.ts12 { top: 91%; left: 51%; width: 45%; animation-delay: 0.33s; }

	.transition-loading {
		position: absolute;
		inset: 0;

		z-index: 20;

		display: grid;
		place-items: center;

		opacity: 0;

		animation:
			transition-loading
			1.7s
			cubic-bezier(0.22, 1, 0.36, 1)
			forwards;
	}

	.transition-leaving .transition-loading {
		animation:
			transition-loading-leave
			0.82s
			ease
			forwards;
	}

	.transition-frame {
		position: relative;

		width: min(620px, 56vw);
		height: min(345px, 42vh);

		border:
			1px solid
			var(--hud-pink-soft);

		background:
			linear-gradient(
				180deg,
				rgba(255, 0, 128, 0.018),
				rgba(0, 0, 0, 0.55)
			);
	}

	.transition-corner {
		position: absolute;

		width: 27px;
		height: 27px;

		border-color:
			var(--hud-pink);
	}

	.transition-corner.tl {
		left: -1px;
		top: -1px;
		border-left: 1px solid;
		border-top: 1px solid;
	}

	.transition-corner.tr {
		right: -1px;
		top: -1px;
		border-right: 1px solid;
		border-top: 1px solid;
	}

	.transition-corner.bl {
		left: -1px;
		bottom: -1px;
		border-left: 1px solid;
		border-bottom: 1px solid;
	}

	.transition-corner.br {
		right: -1px;
		bottom: -1px;
		border-right: 1px solid;
		border-bottom: 1px solid;
	}

	.transition-circle {
		position: absolute;

		left: 50%;
		top: 48%;

		border:
			1px solid
			var(--hud-pink-soft);

		border-radius: 50%;

		transform:
			translate(-50%, -50%);

		animation:
			hud-ring
			2s
			ease-out
			infinite;
	}

	.circle-large {
		width: 150px;
		height: 150px;
	}

	.circle-small {
		width: 48px;
		height: 48px;
		animation-delay: 0.25s;
	}

	.transition-title {
		position: absolute;

		left: 50%;
		top: 40%;

		transform:
			translateX(-50%);

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size:
			clamp(0.66rem, 0.95vw, 0.86rem);

		letter-spacing: 0.18em;

		color:
			rgba(255, 255, 255, 0.68);
	}

	.transition-code {
		position: absolute;

		left: 50%;
		top: 59%;

		transform:
			translateX(-50%);

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size: 0.5rem;

		letter-spacing: 0.12em;

		color:
			rgba(255, 255, 255, 0.36);

		white-space: nowrap;
	}

	.transition-bars {
		position: absolute;

		left: 50%;
		bottom: 23px;

		transform:
			translateX(-50%);

		display: flex;
		gap: 4px;
	}

	.transition-bars span {
		width: 6px;
		height: 3px;

		background:
			var(--hud-pink-soft);

		animation:
			bar-glitch
			1.8s
			steps(4, end)
			infinite;
	}

	.release-strips {
		position: absolute;
		inset: 0;
		z-index: 30;
	}

	.release-strip {
		position: absolute;

		height: 3px;

		background:
			linear-gradient(
				90deg,
				transparent,
				var(--hud-pink),
				transparent
			);

		opacity: 0;

		animation:
			release-strip
			0.86s
			cubic-bezier(0.22, 1, 0.36, 1)
			forwards;
	}

	.r1 { top: 18%; left: 7%; width: 52%; }
	.r2 { top: 29%; right: 5%; width: 47%; animation-delay: 0.05s; }
	.r3 { top: 42%; left: -3%; width: 63%; animation-delay: 0.1s; }
	.r4 { top: 54%; left: 28%; width: 58%; animation-delay: 0.15s; }
	.r5 { top: 66%; right: 8%; width: 51%; animation-delay: 0.2s; }
	.r6 { top: 80%; left: 12%; width: 60%; animation-delay: 0.25s; }

	.release-scan {
		position: absolute;
		inset: 0;

		z-index: 31;

		background:
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 5px,
				rgba(255, 0, 128, 0.04) 6px
			);

		opacity: 0;

		animation:
			release-scan
			0.94s
			ease-out
			forwards;
	}

	.page-release {
		position: absolute;
		inset: 0;

		z-index: 40;

		background:
			radial-gradient(
				ellipse at center,
				rgba(255, 0, 128, 0.03),
				transparent 65%
			);

		opacity: 0;

		animation:
			page-release
			0.86s
			ease-out
			forwards;
	}

	/* =====================================================
	   KEYFRAMES
	   ===================================================== */

	@keyframes boot-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes boot-out {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		15% {
			opacity: 1;
			transform: scale(1.002) translateX(-1px);
		}

		30% {
			opacity: 0.98;
			transform: scale(1.005) translateX(1px);
		}

		45% {
			opacity: 0.9;
			transform: scale(1.009) translateX(-2px);
		}

		60% {
			opacity: 0.72;
			transform: scale(1.014) translateX(2px);
		}

		75% {
			opacity: 0.5;
			transform: scale(1.021) translateX(-3px);
		}

		88% {
			opacity: 0.22;
			transform: scale(1.032) translateX(4px);
		}

		100% {
			opacity: 0;
			transform: scale(1.04) translateX(6px);
		}
	}

	@keyframes loading-state-in {
		0% {
			opacity: 0;
			transform: scale(1.08);
		}

		15% { opacity: 0.03; }

		30% {
			opacity: 0.12;
			transform: scale(1.05);
		}

		45% {
			opacity: 0.28;
			transform: scale(1.03);
		}

		60% {
			opacity: 0.52;
			transform: scale(1.016);
		}

		75% {
			opacity: 0.78;
			transform: scale(1.006);
		}

		90% {
			opacity: 0.96;
			transform: scale(1.001);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes loading-state-out {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		20% { opacity: 0.96; }

		40% {
			opacity: 0.82;
			transform: scale(1.018) translateX(-1px);
		}

		60% {
			opacity: 0.58;
			transform: scale(1.04) translateX(2px);
		}

		80% {
			opacity: 0.3;
			transform: scale(1.065) translateX(-3px);
		}

		100% {
			opacity: 0;
			transform: scale(1.09) translateX(6px);
		}
	}

	@keyframes boot-glitch {
		0% {
			opacity: 0;
			transform: translateX(-15%) scaleX(0.65);
		}

		10% { opacity: 0.12; }

		20% {
			opacity: 0.45;
			transform: translateX(-1%) scaleX(0.92);
		}

		30% {
			opacity: 0.82;
			transform: translateX(4%) scaleX(1.05);
		}

		40% {
			opacity: 0.48;
			transform: translateX(-2%) scaleX(0.94);
		}

		52% {
			opacity: 0.88;
			transform: translateX(5%) scaleX(1.07);
		}

		64% {
			opacity: 0.44;
			transform: translateX(-3%) scaleX(0.9);
		}

		76% {
			opacity: 0.28;
			transform: translateX(8%) scaleX(0.78);
		}

		90% {
			opacity: 0.1;
			transform: translateX(13%) scaleX(0.7);
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes loading-ring {
		0% {
			opacity: 0.14;
			transform: translate(-50%, -50%) scale(0.82);
		}

		20% { opacity: 0.24; }

		40% {
			opacity: 0.43;
			transform: translate(-50%, -50%) scale(1);
		}

		60% { opacity: 0.28; }
		80% { opacity: 0.1; }

		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.22);
		}
	}

	@keyframes loading-tear {
		0% {
			opacity: 0;
			transform: translateX(-8px);
		}

		15% { opacity: 0.1; }

		30% {
			opacity: 0.32;
			transform: translateX(2px);
		}

		45% {
			opacity: 0.78;
			transform: translateX(-2px);
		}

		60% {
			opacity: 0.48;
			transform: translateX(3px);
		}

		75% {
			opacity: 0.3;
			transform: translateX(-1px);
		}

		88% {
			opacity: 0.12;
			transform: translateX(7px);
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes boot-release {
		0%,
		68% { opacity: 0; }

		78% { opacity: 0.012; }
		86% { opacity: 0.045; }
		93% { opacity: 0.015; }
		100% { opacity: 0; }
	}

	@keyframes transition-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes transition-blur {
		0% {
			opacity: 0;
			transform: scale(1);
			backdrop-filter: blur(0);
		}

		10% { opacity: 0.04; }

		20% {
			opacity: 0.12;
			transform: scale(1.001);
			backdrop-filter: blur(1px);
		}

		30% {
			opacity: 0.25;
			transform: scale(1.004);
			backdrop-filter: blur(3px);
		}

		40% {
			opacity: 0.42;
			transform: scale(1.008);
			backdrop-filter: blur(5px);
		}

		50% {
			opacity: 0.59;
			transform: scale(1.012);
			backdrop-filter: blur(8px);
		}

		60% {
			opacity: 0.74;
			transform: scale(1.017);
			backdrop-filter: blur(11px);
		}

		70% {
			opacity: 0.86;
			transform: scale(1.021);
			backdrop-filter: blur(14px);
		}

		80% {
			opacity: 0.92;
			transform: scale(1.026);
			backdrop-filter: blur(17px);
		}

		90% {
			opacity: 0.62;
			transform: scale(1.034);
			backdrop-filter: blur(11px);
		}

		100% {
			opacity: 0;
			transform: scale(1.042);
			backdrop-filter: blur(0);
		}
	}

	@keyframes scene-distortion {
		0% {
			opacity: 0;
			transform: translateY(0);
		}

		15% { opacity: 0.05; }

		30% {
			opacity: 0.16;
			transform: translateY(-1px);
		}

		45% { opacity: 0.31; }

		60% {
			opacity: 0.52;
			transform: translateY(2px);
		}

		75% {
			opacity: 0.68;
			transform: translateY(-2px);
		}

		90% {
			opacity: 0.28;
			transform: translateY(1px);
		}

		100% {
			opacity: 0;
			transform: translateY(0);
		}
	}

	@keyframes transition-dark {
		0% { opacity: 0; }
		15% { opacity: 0.04; }
		30% { opacity: 0.12; }
		45% { opacity: 0.25; }
		60% { opacity: 0.46; }
		75% { opacity: 0.7; }
		90% { opacity: 0.4; }
		100% { opacity: 0; }
	}

	@keyframes transition-strip {
		0% {
			opacity: 0;
			transform: translateX(-12%) scaleX(0.66);
		}

		8% { opacity: 0.08; }
		16% { opacity: 0.22; }

		24% {
			opacity: 0.49;
			transform: translateX(-1%) scaleX(0.9);
		}

		32% {
			opacity: 0.78;
			transform: translateX(3%) scaleX(1.04);
		}

		40% {
			opacity: 0.96;
			transform: translateX(5%) scaleX(1.08);
		}

		48% {
			opacity: 0.72;
			transform: translateX(-2%) scaleX(0.96);
		}

		56% {
			opacity: 0.88;
			transform: translateX(4%) scaleX(1.04);
		}

		64% {
			opacity: 0.64;
			transform: translateX(-3%) scaleX(0.92);
		}

		72% {
			opacity: 0.46;
			transform: translateX(5%) scaleX(0.87);
		}

		80% {
			opacity: 0.29;
			transform: translateX(8%) scaleX(0.79);
		}

		88% {
			opacity: 0.15;
			transform: translateX(12%) scaleX(0.71);
		}

		96% {
			opacity: 0.04;
			transform: translateX(16%) scaleX(0.64);
		}

		100% {
			opacity: 0;
			transform: translateX(20%) scaleX(0.6);
		}
	}

	@keyframes transition-loading {
		0% {
			opacity: 0;
			transform: scale(1.08);
		}

		15% { opacity: 0.03; }

		30% {
			opacity: 0.12;
			transform: scale(1.05);
		}

		45% {
			opacity: 0.29;
			transform: scale(1.03);
		}

		60% {
			opacity: 0.52;
			transform: scale(1.016);
		}

		75% {
			opacity: 0.78;
			transform: scale(1.006);
		}

		90% {
			opacity: 0.96;
			transform: scale(1.001);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.transition-leaving .transition-loading {
		animation:
			transition-loading-leave
			0.82s
			ease
			forwards;
	}

	@keyframes transition-loading-leave {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		20% { opacity: 0.94; }

		40% {
			opacity: 0.8;
			transform: scale(1.02) translateX(-1px);
		}

		60% {
			opacity: 0.58;
			transform: scale(1.045) translateX(2px);
		}

		80% {
			opacity: 0.27;
			transform: scale(1.07) translateX(-3px);
		}

		100% {
			opacity: 0;
			transform: scale(1.09) translateX(6px);
		}
	}

	@keyframes hud-ring {
		0% {
			opacity: 0.14;
			transform: translate(-50%, -50%) scale(0.82);
		}

		20% { opacity: 0.24; }

		40% {
			opacity: 0.43;
			transform: translate(-50%, -50%) scale(1);
		}

		60% { opacity: 0.28; }
		80% { opacity: 0.1; }

		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.22);
		}
	}

	@keyframes release-strip {
		0% {
			opacity: 0;
			transform: translateX(-15%) scaleX(0.66);
		}

		15% { opacity: 0.08; }

		30% {
			opacity: 0.32;
			transform: translateX(-1%) scaleX(0.9);
		}

		45% {
			opacity: 0.76;
			transform: translateX(3%) scaleX(1.04);
		}

		60% {
			opacity: 0.58;
			transform: translateX(-2%) scaleX(0.94);
		}

		75% {
			opacity: 0.34;
			transform: translateX(5%) scaleX(0.82);
		}

		90% {
			opacity: 0.12;
			transform: translateX(12%) scaleX(0.7);
		}

		100% {
			opacity: 0;
			transform: translateX(21%) scaleX(0.6);
		}
	}

	@keyframes release-scan {
		0% { opacity: 0; }
		30% { opacity: 0.04; }
		55% { opacity: 0.15; }
		75% { opacity: 0.08; }
		100% { opacity: 0; }
	}

	@keyframes page-release {
		0% { opacity: 0; }
		35% { opacity: 0; }
		55% { opacity: 0.008; }
		72% { opacity: 0.028; }
		88% { opacity: 0.012; }
		100% { opacity: 0; }
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 900px) {
		.home-button {
			left: 3%;
			top: 2.5%;
			width: 215px;
			height: 90px;
		}

		.edge-radar,
		.data-rail {
			opacity: 0.18;
		}

		.bottom-module {
			opacity: 0.25;
		}

		.bottom-stream {
			width: 310px;
		}
	}

	@media (max-width: 650px) {
		.home-button {
			left: 4%;
			top: 2.5%;
			width: 175px;
			height: 75px;
		}

		.edge-radar,
		.data-rail,
		.bottom-module,
		.corner-cluster {
			opacity: 0.1;
		}

		.bottom-stream {
			width: 250px;
		}

		.loading-frame,
		.transition-frame {
			width: 76vw;
			height: 31vh;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.global-hud * {
			animation: none !important;
		}

		.home-button:hover,
		.home-button:focus-visible {
			transform: none;
			filter: none;
		}

		.signature-pink,
		.signature-white,
		.signature-scan,
		.signature-noise {
			display: none;
		}

		.boot-transition,
		.page-transition {
			animation: none;
		}
	}
</style>

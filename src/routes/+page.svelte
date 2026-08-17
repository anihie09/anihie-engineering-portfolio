<script lang="ts">
	import InteractiveAscii from '$lib/InteractiveAscii.svelte';
</script>

<svelte:head>
	<title>ANIHIE — Mechanical Engineering</title>

	<meta
		name="description"
		content="ANIHIE — Mechanical Engineering Portfolio"
	/>
</svelte:head>

<div class="home">
	<div class="background"></div>

	<div class="background-shade"></div>

	<InteractiveAscii />

	<div class="interface">
		<!-- RIGHT-SIDE NAVIGATION -->

		<nav
			class="navigation"
			aria-label="Main navigation"
		>
			<a href="/about">
				<span class="nav-index">
					01
				</span>

				<span class="arrow">
					&gt;
				</span>

				<span class="label">
					ABOUT
				</span>

				<span class="nav-line"></span>
			</a>

			<a href="/projects">
				<span class="nav-index">
					02
				</span>

				<span class="arrow">
					&gt;
				</span>

				<span class="label">
					PROJECTS
				</span>

				<span class="nav-line"></span>
			</a>

			<a href="/contact">
				<span class="nav-index">
					03
				</span>

				<span class="arrow">
					&gt;
				</span>

				<span class="label">
					CONTACT
				</span>

				<span class="nav-line"></span>
			</a>
		</nav>

		<!-- RIGHT-SIDE DATA -->

		<div class="navigation-data">
			<div class="data-title">
				DIRECTORY
			</div>

			<div class="data-rule"></div>

			<div class="data-row">
				<span>SYS</span>
				<span>ACTIVE</span>
			</div>

			<div class="data-row">
				<span>MODE</span>
				<span>01</span>
			</div>

			<div class="data-row">
				<span>LINK</span>
				<span>ONLINE</span>
			</div>
		</div>

		<!-- CENTER TECHNICAL MARK -->

		<div class="center-marker">
			<div class="marker-horizontal"></div>
			<div class="marker-vertical"></div>

			<div class="marker-ring outer"></div>
			<div class="marker-ring inner"></div>

			<div class="marker-dot"></div>
		</div>
	</div>
</div>

<style>
	/* =====================================================
	   SHARED HUD COLOR
	   ===================================================== */

	:global(:root) {
		--hud-pink: #ff0080;

		--hud-pink-soft:
			rgba(
				255,
				0,
				128,
				0.55
			);

		--hud-pink-faint:
			rgba(
				255,
				0,
				128,
				0.2
			);
	}

	/* =====================================================
	   GLOBAL
	   ===================================================== */

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;

		width: 100%;
		min-height: 100%;

		background: #000;
	}

	:global(body) {
		overflow: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}

	/* =====================================================
	   HOME
	   ===================================================== */

	.home {
		position: relative;

		width: 100vw;
		height: 100vh;

		min-height: 650px;

		overflow: hidden;

		background: #000;
	}

	/* =====================================================
	   BACKGROUND
	   ===================================================== */

	.background {
		position: absolute;

		inset: 0;

		z-index: 0;

		background-image:
			url('/home-background.png');

		background-repeat:
			no-repeat;

		background-position:
			center center;

		background-size:
			cover;

		background-color:
			#000;
	}

	.background-shade {
		position: absolute;

		inset: 0;

		z-index: 1;

		pointer-events: none;

		background:
			linear-gradient(
				90deg,
				rgba(
					0,
					0,
					0,
					0.04
				)
				0%,
				transparent
				38%,
				rgba(
					0,
					0,
					0,
					0.08
				)
				65%,
				rgba(
					0,
					0,
					0,
					0.45
				)
				100%
			),
			linear-gradient(
				180deg,
				rgba(
					0,
					0,
					0,
					0.06
				),
				transparent 58%,
				rgba(
					0,
					0,
					0,
					0.14
				)
				100%
			);
	}

	/* =====================================================
	   INTERFACE
	   ===================================================== */

	.interface {
		position: relative;

		z-index: 10;

		width: 100%;
		height: 100%;

		pointer-events: none;
	}

	/* =====================================================
	   RIGHT NAVIGATION
	   ===================================================== */

	.navigation {
		position: absolute;

		right: 8.7%;
		top: 43%;

		display: flex;
		flex-direction: column;
		align-items: flex-start;

		gap: 18px;

		width: 210px;

		pointer-events: auto;
	}

	.navigation a {
		position: relative;

		display: grid;

		grid-template-columns:
			28px
			20px
			auto;

		align-items: center;

		width: 100%;

		min-height: 26px;

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size:
			clamp(
				11px,
				0.82vw,
				15px
			);

		font-weight: 600;

		letter-spacing: 0.08em;

		text-decoration: none;

		text-shadow:
			0 2px 5px
			rgba(
				0,
				0,
				0,
				0.95
			);

		cursor: pointer;

		transition:
			color
			120ms
			ease;
	}

	.nav-index {
		color:
			var(--hud-pink-soft);

		font-size: 7px;

		letter-spacing: 0.12em;
	}

	.arrow {
		color: #fff;

		width: 0;

		overflow: hidden;

		opacity: 0;

		transform:
			translateX(-7px);

		transition:
			width
			140ms
			ease,
			opacity
			100ms
			linear,
			transform
			140ms
			ease;
	}

	.label {
		white-space: nowrap;
	}

	.nav-line {
		position: absolute;

		left: 0;
		bottom: -7px;

		width: 0;
		height: 1px;

		background:
			var(--hud-pink);

		opacity: 0.36;

		transition:
			width
			180ms
			ease;
	}

	.navigation a:hover,
	.navigation a:focus-visible {
		color:
			var(--hud-pink);

		outline: none;

		animation:
			nav-glitch
			270ms
			steps(2, end)
			1;
	}

	.navigation a:hover .arrow,
	.navigation a:focus-visible .arrow {
		width: 17px;

		opacity: 1;

		transform:
			translateX(0);
	}

	.navigation a:hover .nav-line,
	.navigation a:focus-visible .nav-line {
		width: 100%;
	}

	.navigation a:hover .nav-index,
	.navigation a:focus-visible .nav-index {
		color:
			var(--hud-pink);
	}

	/* =====================================================
	   RIGHT-SIDE DATA
	   ===================================================== */

	.navigation-data {
		position: absolute;

		right: 8.7%;
		top: 30%;

		width: 210px;

		padding:
			10px 12px;

		border-left:
			1px solid
			var(--hud-pink-soft);

		border-top:
			1px solid
			rgba(
				255,
				0,
				128,
				0.2
			);

		color:
			var(--hud-pink-soft);

		font-family:
			'Courier New',
			Courier,
			monospace;

		pointer-events: none;

		animation:
			data-idle
			5.4s
			steps(3, end)
			infinite;
	}

	.data-title {
		font-size: 7px;

		letter-spacing:
			0.18em;
	}

	.data-rule {
		width: 100%;
		height: 1px;

		margin:
			7px 0;

		background:
			var(--hud-pink-soft);
	}

	.data-row {
		display: flex;

		justify-content:
			space-between;

		margin-top: 4px;

		font-size: 6px;

		letter-spacing:
			0.08em;
	}

	/* =====================================================
	   CENTER MARKER
	   ===================================================== */

	.center-marker {
		position: absolute;

		left: 52%;
		top: 47%;

		width: 52px;
		height: 52px;

		transform:
			translate(
				-50%,
				-50%
			);

		opacity: 0.16;

		animation:
			center-idle
			4.8s
			ease-in-out
			infinite;
	}

	.marker-horizontal {
		position: absolute;

		left: 0;
		right: 0;

		top: 50%;

		height: 1px;

		background:
			var(--hud-pink);
	}

	.marker-vertical {
		position: absolute;

		top: 0;
		bottom: 0;

		left: 50%;

		width: 1px;

		background:
			var(--hud-pink);
	}

	.marker-ring {
		position: absolute;

		left: 50%;
		top: 50%;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.marker-ring.outer {
		width: 42px;
		height: 42px;
	}

	.marker-ring.inner {
		width: 17px;
		height: 17px;
	}

	.marker-dot {
		position: absolute;

		left: 50%;
		top: 50%;

		width: 3px;
		height: 3px;

		background:
			var(--hud-pink);

		border-radius: 50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	/* =====================================================
	   NAVIGATION GLITCH
	   ===================================================== */

	@keyframes nav-glitch {
		0% {
			transform:
				translate(
					0,
					0
				);
		}

		20% {
			transform:
				translate(
					-2px,
					0
				);

			text-shadow:
				2px 0
				rgba(
					255,
					0,
					128,
					0.72
				);
		}

		40% {
			transform:
				translate(
					2px,
					-1px
				);

			text-shadow:
				-2px 0
				rgba(
					255,
					255,
					255,
					0.35
				);
		}

		60% {
			transform:
				translate(
					-1px,
					1px
				);
		}

		80% {
			transform:
				translate(
					1px,
					0
				);
		}

		100% {
			transform:
				translate(
					0,
					0
				);
		}
	}

	@keyframes data-idle {
		0%,
		84%,
		100% {
			opacity: 0.72;

			transform:
				translate(
					0,
					0
				);
		}

		86% {
			opacity: 0.38;

			transform:
				translateX(-2px);
		}

		88% {
			opacity: 0.94;

			transform:
				translateX(2px);
		}

		90% {
			opacity: 0.55;

			transform:
				translateX(-1px);
		}

		92% {
			opacity: 0.72;

			transform:
				translate(
					0,
					0
				);
		}
	}

	@keyframes center-idle {
		0%,
		100% {
			opacity: 0.12;

			transform:
				translate(
					-50%,
					-50%
				)
				scale(0.96);
		}

		50% {
			opacity: 0.25;

			transform:
				translate(
					-50%,
					-50%
				)
				scale(1.04);
		}
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 1100px) {
		.navigation,
		.navigation-data {
			right: 6%;
		}
	}

	@media (max-width: 800px) {
		.navigation {
			right: 8%;
			top: 46%;

			width: 175px;
		}

		.navigation-data {
			right: 8%;
			top: 32%;

			width: 175px;
		}

		.center-marker {
			left: 50%;
		}
	}

	@media (max-width: 600px) {
		.home {
			min-height: 600px;
		}

		.navigation {
			right: 9%;
			top: 43%;

			width: 150px;

			gap: 14px;
		}

		.navigation-data {
			right: 9%;
			top: 29%;

			width: 150px;
		}

		.navigation a {
			font-size: 10px;
		}

		.navigation-data {
			padding: 8px;
		}
	}
</style>

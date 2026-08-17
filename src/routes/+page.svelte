<script lang="ts">
	import InteractiveBackground from '$lib/InteractiveBackground.svelte';
</script>

<svelte:head>
	<title>ANIHIE — Mechanical Engineering</title>
	<meta
		name="description"
		content="ANIHIE — Mechanical Engineering Portfolio"
	/>
</svelte:head>

<div class="home">
	<!-- =====================================================
	     INTERACTIVE BACKGROUND
	     ===================================================== -->

	<InteractiveBackground
		src="/home-background.png"
		cellSize={6}
		dotScale={0.42}
		dotOpacity={0.55}
		cursorRadius={250}
		warpStrength={0.018}
		smoothing={0.62}
		velocityStrength={1.05}
		darkFloor={0.12}
		swirlStrength={0.75}
		stretchStrength={1.0}
		radialStrength={0.55}
		zoomStrength={0.045}
		zoomRadius={0.9}
	/>

	<!-- =====================================================
	     HUD
	     ===================================================== -->

	<div class="interface">
		<!-- OUTER FRAME -->

		<div
			class="hud-frame"
			aria-hidden="true"
		>
			<div class="frame-top"></div>
			<div class="frame-bottom"></div>
			<div class="frame-left"></div>
			<div class="frame-right"></div>

			<div class="corner top-left"></div>
			<div class="corner top-right"></div>
			<div class="corner bottom-left"></div>
			<div class="corner bottom-right"></div>

			<div class="top-marker marker-one"></div>
			<div class="top-marker marker-two"></div>
			<div class="top-marker marker-three"></div>

			<div class="bottom-marker marker-four"></div>
			<div class="bottom-marker marker-five"></div>
			<div class="bottom-marker marker-six"></div>
		</div>

		<!-- SYSTEM STATUS -->

		<div
			class="system-status"
			aria-hidden="true"
		>
			<div class="status-label">
				SYS
			</div>

			<div class="status-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<div class="status-text">
				02 / ACTIVE
			</div>
		</div>

		<!-- LEFT TARGET -->

		<div
			class="target left-target"
			aria-hidden="true"
		>
			<div class="target-cross horizontal"></div>
			<div class="target-cross vertical"></div>

			<div class="target-ring ring-large"></div>
			<div class="target-ring ring-small"></div>

			<div class="target-center"></div>
			<div class="target-dot"></div>
		</div>

		<!-- RIGHT TARGET -->

		<div
			class="target right-target"
			aria-hidden="true"
		>
			<div class="target-cross horizontal"></div>
			<div class="target-cross vertical"></div>

			<div class="target-ring ring-large"></div>
			<div class="target-ring ring-small"></div>

			<div class="target-center"></div>
			<div class="target-dot"></div>
		</div>

		<!-- NAVIGATION -->

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

		<!-- DIRECTORY -->

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

		<!-- CENTER MARKER -->

		<div
			class="center-marker"
			aria-hidden="true"
		>
			<div class="marker-horizontal"></div>
			<div class="marker-vertical"></div>

			<div class="marker-ring outer"></div>
			<div class="marker-ring inner"></div>

			<div class="marker-dot"></div>
		</div>

		<!-- BOTTOM LEFT -->

		<div class="bottom-left-data">
			<div class="bottom-data-title">
				CORE / 02
			</div>

			<div class="bottom-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<div class="bottom-data-status">
				SYS READY
			</div>
		</div>

		<!-- BOTTOM CENTER -->

		<div class="bottom-center-data">
			<div class="bottom-center-line"></div>

			<div class="bottom-center-label">
				LINK ESTABLISHED
			</div>
		</div>

		<!-- BOTTOM RIGHT -->

		<div class="bottom-right-data">
			<div class="bottom-status-title">
				STATUS
			</div>

			<div class="bottom-status-value">
				01-09 / ACTIVE
			</div>

			<div class="bottom-status-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- SIDE DOTS -->

		<div
			class="side-dots left-dots"
			aria-hidden="true"
		>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<div
			class="side-dots right-dots"
			aria-hidden="true"
		>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</div>

<style>
	/* =====================================================
	   COLORS
	   ===================================================== */

	:global(:root) {
		--hud-pink: #ff0080;
		--hud-pink-bright: #ff1493;
		--hud-pink-soft: rgba(255, 0, 128, 0.68);
		--hud-pink-muted: rgba(255, 0, 128, 0.42);
		--hud-pink-faint: rgba(255, 0, 128, 0.2);
	}

	/* =====================================================
	   GLOBAL
	   ===================================================== */

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;

		width: 100%;
		height: 100%;

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

		min-height: 600px;

		overflow: hidden;

		background: #000;
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

		color:
			var(--hud-pink);
	}

	/* =====================================================
	   FRAME
	   ===================================================== */

	.hud-frame {
		position: absolute;

		inset: 0;

		z-index: 1;

		pointer-events: none;
	}

	.frame-top,
	.frame-bottom {
		position: absolute;

		left: 0;
		right: 0;

		height: 1px;

		background:
			linear-gradient(
				90deg,
				transparent 0%,
				var(--hud-pink) 6%,
				var(--hud-pink) 94%,
				transparent 100%
			);

		box-shadow:
			0 0 8px
			rgba(255, 0, 128, 0.25);
	}

	.frame-top {
		top: 10px;
	}

	.frame-bottom {
		bottom: 10px;
	}

	.frame-left,
	.frame-right {
		position: absolute;

		top: 26px;
		bottom: 26px;

		width: 1px;

		background:
			linear-gradient(
				180deg,
				transparent 0%,
				var(--hud-pink) 5%,
				var(--hud-pink) 95%,
				transparent 100%
			);

		box-shadow:
			0 0 8px
			rgba(255, 0, 128, 0.2);
	}

	.frame-left {
		left: 2px;
	}

	.frame-right {
		right: 2px;
	}

	/* =====================================================
	   CORNERS
	   ===================================================== */

	.corner {
		position: absolute;

		width: 54px;
		height: 25px;

		opacity: 0.8;
	}

	.corner::before,
	.corner::after {
		content: '';

		position: absolute;

		display: block;

		background:
			var(--hud-pink);

		box-shadow:
			0 0 6px
			rgba(255, 0, 128, 0.25);
	}

	.corner::before {
		width: 45px;
		height: 1px;
	}

	.corner::after {
		width: 1px;
		height: 24px;
	}

	.top-left {
		top: 19px;
		left: 2px;
	}

	.top-left::before,
	.top-left::after {
		top: 0;
		left: 0;
	}

	.top-right {
		top: 19px;
		right: 2px;
	}

	.top-right::before,
	.top-right::after {
		top: 0;
		right: 0;
	}

	.bottom-left {
		bottom: 19px;
		left: 2px;
	}

	.bottom-left::before,
	.bottom-left::after {
		bottom: 0;
		left: 0;
	}

	.bottom-right {
		bottom: 19px;
		right: 2px;
	}

	.bottom-right::before,
	.bottom-right::after {
		bottom: 0;
		right: 0;
	}

	/* =====================================================
	   FRAME MARKERS
	   ===================================================== */

	.top-marker,
	.bottom-marker {
		position: absolute;

		width: 7px;
		height: 7px;

		border:
			1px solid
			var(--hud-pink);

		transform:
			rotate(45deg);

		background:
			rgba(0, 0, 0, 0.1);
	}

	.marker-one {
		top: 4px;
		left: 43%;
	}

	.marker-two {
		top: 4px;
		left: 51%;
	}

	.marker-three {
		top: 4px;
		left: 59%;
	}

	.marker-four {
		bottom: 4px;
		left: 40%;
	}

	.marker-five {
		bottom: 4px;
		left: 51%;
	}

	.marker-six {
		bottom: 4px;
		left: 62%;
	}

	/* =====================================================
	   SYSTEM STATUS
	   ===================================================== */

	.system-status {
		position: absolute;

		z-index: 20;

		top: 21px;
		right: 6.1%;

		display: grid;

		grid-template-columns:
			auto 1fr;

		grid-template-rows:
			auto auto;

		column-gap: 10px;

		min-width: 145px;

		padding:
			7px 10px;

		border:
			1px solid
			var(--hud-pink-muted);

		background:
			rgba(0, 0, 0, 0.08);

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;
	}

	.status-label {
		grid-row:
			1 / 3;

		align-self: center;

		font-size: 7px;

		letter-spacing:
			0.16em;
	}

	.status-bars {
		display: flex;

		align-items: center;

		gap: 4px;
	}

	.status-bars span {
		display: block;

		width: 7px;
		height: 5px;

		background:
			var(--hud-pink);
	}

	.status-text {
		margin-top: 4px;

		font-size: 6px;

		letter-spacing:
			0.08em;

		color:
			var(--hud-pink-soft);
	}

	/* =====================================================
	   TARGETS
	   ===================================================== */

	.target {
		position: absolute;

		z-index: 15;

		width: 108px;
		height: 108px;

		opacity: 0.7;
	}

	.left-target {
		left: 4.5%;
		top: 41%;

		transform:
			translateY(-50%);
	}

	.right-target {
		right: 4.5%;
		top: 41%;

		transform:
			translateY(-50%);
	}

	.target-cross {
		position: absolute;

		background:
			var(--hud-pink-muted);
	}

	.target-cross.horizontal {
		left: 0;
		right: 0;

		top: 50%;

		height: 1px;
	}

	.target-cross.vertical {
		top: 0;
		bottom: 0;

		left: 50%;

		width: 1px;
	}

	.target-ring {
		position: absolute;

		left: 50%;
		top: 50%;

		border:
			1px solid
			var(--hud-pink-muted);

		border-radius: 50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.ring-large {
		width: 82px;
		height: 82px;
	}

	.ring-small {
		width: 42px;
		height: 42px;
	}

	.target-center {
		position: absolute;

		left: 50%;
		top: 50%;

		width: 8px;
		height: 8px;

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

	.target-dot {
		position: absolute;

		left: 50%;
		top: 50%;

		width: 2px;
		height: 2px;

		border-radius: 50%;

		background:
			var(--hud-pink);

		transform:
			translate(
				-50%,
				-50%
			);
	}

	/* =====================================================
	   NAVIGATION
	   ===================================================== */

	.navigation {
		position: absolute;

		z-index: 20;

		right: 8.7%;
		top: 41%;

		display: flex;

		flex-direction: column;

		align-items: flex-start;

		gap: 18px;

		width: 220px;

		pointer-events: none;
	}

	.navigation a {
		position: relative;

		display: grid;

		grid-template-columns:
			30px 22px auto;

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

		letter-spacing:
			0.09em;

		text-decoration: none;

		text-shadow:
			0 0 6px
			rgba(255, 0, 128, 0.22),
			0 2px 5px
			rgba(0, 0, 0, 0.85);

		cursor: pointer;

		pointer-events: auto;

		transition:
			color 120ms ease,
			text-shadow 120ms ease;
	}

	.nav-index {
		color:
			var(--hud-pink-soft);

		font-size: 7px;

		letter-spacing:
			0.12em;
	}

	.arrow {
		color:
			var(--hud-pink);

		width: 0;

		overflow: hidden;

		opacity: 0;

		transform:
			translateX(-7px);

		transition:
			width 140ms ease,
			opacity 100ms linear,
			transform 140ms ease;
	}

	.label {
		color:
			var(--hud-pink);

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

		opacity: 0.65;

		transition:
			width 180ms ease;
	}

	.navigation a:hover,
	.navigation a:focus-visible {
		color:
			var(--hud-pink-bright);

		outline: none;

		text-shadow:
			0 0 8px
			rgba(255, 0, 128, 0.75),
			0 0 16px
			rgba(255, 0, 128, 0.25);

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
			var(--hud-pink-bright);
	}

	/* =====================================================
	   DIRECTORY
	   ===================================================== */

	.navigation-data {
		position: absolute;

		z-index: 20;

		right: 8.7%;
		top: 27%;

		width: 220px;

		padding:
			10px 12px;

		border-left:
			1px solid
			var(--hud-pink-soft);

		border-top:
			1px solid
			var(--hud-pink-faint);

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;

		text-shadow:
			0 0 5px
			rgba(255, 0, 128, 0.25);

		pointer-events: none;

		animation:
			data-idle
			5.4s
			steps(3, end)
			infinite;
	}

	.data-title {
		color:
			var(--hud-pink);

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
			var(--hud-pink);

		opacity: 0.55;
	}

	.data-row {
		display: flex;

		justify-content:
			space-between;

		margin-top: 4px;

		color:
			var(--hud-pink);

		font-size: 6px;

		letter-spacing:
			0.08em;
	}

	/* =====================================================
	   CENTER MARKER
	   ===================================================== */

	.center-marker {
		position: absolute;

		z-index: 15;

		left: 49%;
		top: 55%;

		width: 58px;
		height: 58px;

		transform:
			translate(
				-50%,
				-50%
			);

		opacity: 0.3;

		filter:
			drop-shadow(
				0 0 4px
				rgba(255, 0, 128, 0.2)
			);

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
		width: 45px;
		height: 45px;
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
	   BOTTOM LEFT
	   ===================================================== */

	.bottom-left-data {
		position: absolute;

		z-index: 20;

		left: 3.3%;
		bottom: 22px;

		width: 230px;

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;
	}

	.bottom-data-title {
		margin-bottom: 6px;

		font-size: 6px;

		letter-spacing:
			0.18em;
	}

	.bottom-bars {
		display: flex;

		gap: 5px;

		margin-bottom: 5px;
	}

	.bottom-bars span {
		display: block;

		width: 16px;
		height: 5px;

		background:
			var(--hud-pink-muted);
	}

	.bottom-bars span:nth-child(2),
	.bottom-bars span:nth-child(3),
	.bottom-bars span:nth-child(4) {
		background:
			var(--hud-pink);
	}

	.bottom-data-status {
		font-size: 5px;

		letter-spacing:
			0.15em;

		color:
			var(--hud-pink-soft);
	}

	/* =====================================================
	   BOTTOM CENTER
	   ===================================================== */

	.bottom-center-data {
		position: absolute;

		z-index: 20;

		left: 50%;
		bottom: 20px;

		width: 430px;

		transform:
			translateX(-50%);

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;

		text-align: center;
	}

	.bottom-center-line {
		position: relative;

		width: 100%;
		height: 1px;

		background:
			var(--hud-pink-soft);
	}

	.bottom-center-line::before,
	.bottom-center-line::after {
		content: '';

		position: absolute;

		top: -3px;

		width: 7px;
		height: 7px;

		border:
			1px solid
			var(--hud-pink);

		border-radius: 50%;

		background:
			#000;
	}

	.bottom-center-line::before {
		left: 0;
	}

	.bottom-center-line::after {
		right: 0;
	}

	.bottom-center-label {
		margin-top: 7px;

		font-size: 5px;

		letter-spacing:
			0.2em;

		color:
			var(--hud-pink-soft);
	}

	/* =====================================================
	   BOTTOM RIGHT
	   ===================================================== */

	.bottom-right-data {
		position: absolute;

		z-index: 20;

		right: 7.5%;
		bottom: 22px;

		width: 210px;

		color:
			var(--hud-pink);

		font-family:
			'Courier New',
			Courier,
			monospace;
	}

	.bottom-status-title {
		font-size: 6px;

		letter-spacing:
			0.18em;
	}

	.bottom-status-value {
		margin-top: 4px;

		font-size: 5px;

		letter-spacing:
			0.12em;

		color:
			var(--hud-pink-soft);
	}

	.bottom-status-bars {
		display: flex;

		gap: 5px;

		margin-top: 6px;
	}

	.bottom-status-bars span {
		width: 17px;
		height: 4px;

		background:
			var(--hud-pink-muted);
	}

	.bottom-status-bars span:nth-child(1),
	.bottom-status-bars span:nth-child(2),
	.bottom-status-bars span:nth-child(3) {
		background:
			var(--hud-pink);
	}

	/* =====================================================
	   SIDE DOTS
	   ===================================================== */

	.side-dots {
		position: absolute;

		z-index: 20;

		display: flex;

		flex-direction: column;

		gap: 8px;
	}

	.left-dots {
		left: 1px;
		top: 59%;
	}

	.right-dots {
		right: 1px;
		top: 59%;
	}

	.side-dots span {
		display: block;

		width: 7px;
		height: 7px;

		border:
			1px solid
			var(--hud-pink-muted);

		border-radius: 50%;
	}

	/* =====================================================
	   ANIMATIONS
	   ===================================================== */

	@keyframes nav-glitch {
		0% {
			transform:
				translate(0, 0);
		}

		20% {
			transform:
				translate(-2px, 0);

			text-shadow:
				2px 0
				rgba(255, 0, 128, 0.72);
		}

		40% {
			transform:
				translate(2px, -1px);

			text-shadow:
				-2px 0
				rgba(255, 0, 128, 0.5);
		}

		60% {
			transform:
				translate(-1px, 1px);
		}

		80% {
			transform:
				translate(1px, 0);
		}

		100% {
			transform:
				translate(0, 0);
		}
	}

	@keyframes data-idle {
		0%,
		84%,
		100% {
			opacity: 0.72;

			transform:
				translate(0, 0);
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
				translate(0, 0);
		}
	}

	@keyframes center-idle {
		0%,
		100% {
			opacity: 0.16;

			transform:
				translate(
					-50%,
					-50%
				)
				scale(0.96);
		}

		50% {
			opacity: 0.34;

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

		.bottom-right-data {
			right: 6%;
		}

		.right-target {
			right: 3%;
		}

		.left-target {
			left: 3%;
		}
	}

	@media (max-width: 800px) {
		.navigation {
			right: 8%;
			top: 45%;

			width: 190px;
		}

		.navigation-data {
			right: 8%;
			top: 31%;

			width: 190px;
		}

		.center-marker {
			left: 50%;
		}

		.target {
			width: 76px;
			height: 76px;
		}

		.ring-large {
			width: 58px;
			height: 58px;
		}

		.ring-small {
			width: 30px;
			height: 30px;
		}

		.system-status {
			right: 7%;
		}

		.bottom-center-data {
			width: 300px;
		}
	}

	@media (max-width: 600px) {
		.home {
			min-height: 580px;
		}

		.navigation {
			right: 9%;
			top: 44%;

			width: 155px;

			gap: 14px;
		}

		.navigation-data {
			right: 9%;
			top: 29%;

			width: 155px;

			padding: 8px;
		}

		.navigation a {
			font-size: 10px;
		}

		.target {
			opacity: 0.5;
		}

		.left-target {
			left: 0.5%;
		}

		.right-target {
			right: 0.5%;
		}

		.system-status {
			right: 8%;

			min-width: 115px;
		}

		.bottom-left-data {
			left: 7%;

			width: 160px;
		}

		.bottom-center-data {
			width: 200px;
		}

		.bottom-right-data {
			right: 8%;

			width: 130px;
		}

		.side-dots {
			display: none;
		}
	}

	/* =====================================================
	   REDUCED MOTION
	   ===================================================== */

	@media (prefers-reduced-motion: reduce) {
		.navigation-data,
		.center-marker {
			animation: none;
		}

		.navigation a {
			transition: none;
		}
	}
</style>

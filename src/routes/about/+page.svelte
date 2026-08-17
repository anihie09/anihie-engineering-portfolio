<script lang="ts">
	import InteractiveAscii from '$lib/InteractiveAscii.svelte';

	const attributes = [
		{ label: '808', fill: 9 },
		{ label: 'BOUNCE', fill: 8 },
		{ label: 'CREATIVITY', fill: 8 },
		{ label: 'BASS', fill: 7 },
		{ label: 'MELODY', fill: 5 }
	];
</script>

<svelte:head>
	<title>ANI — About</title>

	<meta
		name="description"
		content="ANI — Mechanical Engineering portfolio profile"
	/>
</svelte:head>

<div class="about-page">

	<main class="namecard">

		<!-- =================================================
		     HEADER
		     ================================================= -->

		<header class="card-header">

			<div class="header-left">
				<span class="prefix">&gt;</span>
				<span>ANIHIE_PROFILE</span>
			</div>

			<div class="system-status">

				<span>
					SYS / ACTIVE
				</span>

				<div
					class="battery"
					aria-hidden="true"
				>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>

			</div>

		</header>


		<!-- =================================================
		     PROFILE CONTENT
		     ================================================= -->

		<section class="profile">

			<!-- =============================================
			     PORTRAIT / INTERACTIVE ASCII
			     ============================================= -->

			<div class="portrait-column">

				<div class="micro-heading">
					SUBJECT / 01
				</div>

				<div class="portrait-frame">

					<InteractiveAscii
						src="/about-photo.png"
						alt="ANI profile"
						characters=" .:-=+*#%@"
						color="#ff0080"
						background="#000000"
						cellSize={6}
						cursorRadius={145}
						zoom={1.12}
						noiseInterval={100}
						opacity={0.92}
					/>

					<div
						class="portrait-corner tl"
						aria-hidden="true"
					></div>

					<div
						class="portrait-corner tr"
						aria-hidden="true"
					></div>

					<div
						class="portrait-corner bl"
						aria-hidden="true"
					></div>

					<div
						class="portrait-corner br"
						aria-hidden="true"
					></div>

					<div
						class="portrait-data"
						aria-hidden="true"
					>
						<span>01</span>
						<span>08</span>
						<span>17</span>
						<span>24</span>
						<span>33</span>
						<span>42</span>
					</div>

				</div>

				<div class="portrait-footer">
					<span>
						PROFILE / VERIFIED
					</span>

					<span>
						01 / ACTIVE
					</span>
				</div>

			</div>


			<!-- =============================================
			     INFORMATION
			     ============================================= -->

			<div class="data-column">

				<section class="identity reactive">

					<div class="micro-heading">
						MECHANICAL ENGINEERING
					</div>

					<h1>
						LE, ANI
					</h1>

					<div class="student-tag">
						STUDENT
					</div>

					<div class="access">
						<span>
							ACCESS
						</span>

						<strong>
							*****
						</strong>
					</div>

				</section>


				<!-- =========================================
				     BASIC INFORMATION
				     ========================================= -->

				<section class="information">

					<div class="info-card reactive">
						<span>ID</span>

						<strong>
							STD.1442
						</strong>
					</div>

					<div class="info-card reactive">
						<span>STATUS</span>

						<strong>
							ACTIVE
						</strong>
					</div>

					<div class="info-card reactive">
						<span>UNIVERSITY</span>

						<strong>
							USC
						</strong>
					</div>

					<div class="info-card reactive">
						<span>SCHOOL</span>

						<strong>
							VITERBI
						</strong>
					</div>

					<div class="info-card reactive">
						<span>MAJOR</span>

						<strong>
							MECHANICAL ENGINEERING
						</strong>
					</div>

					<div class="info-card reactive">
						<span>LOCATION</span>

						<strong>
							LOS ANGELES / CA
						</strong>
					</div>

				</section>


				<!-- =========================================
				     ATTRIBUTES
				     ========================================= -->

				<section class="attributes">

					<div class="section-title reactive">
						ATTRIBUTES
					</div>

					{#each attributes as attribute}
						<div class="attribute-row reactive">

							<div class="attribute-name">
								{attribute.label}
							</div>

							<div class="meter">

								{#each Array(10) as _, index}
									<span
										class:filled={
											index <
											attribute.fill
										}
									></span>
								{/each}

							</div>

						</div>
					{/each}

				</section>

			</div>

		</section>


		<!-- =================================================
		     BIO
		     ================================================= -->

		<section class="bio reactive">

			<div class="section-title">
				&gt; BIO
			</div>

			<div class="bio-content">

				<p>
					Mechanical engineering student interested
					in design, prototyping, manufacturing, and
					the intersection between engineering and
					visual creativity.
				</p>

				<div class="bio-data">

					<div>
						<span>PROGRAM</span>

						<strong>
							MECHANICAL ENGINEERING
						</strong>
					</div>

					<div>
						<span>INSTITUTION</span>

						<strong>
							UNIVERSITY OF SOUTHERN CALIFORNIA
						</strong>
					</div>

					<div>
						<span>MODE</span>

						<strong>
							01 / ONLINE
						</strong>
					</div>

				</div>

			</div>

		</section>


		<!-- =================================================
		     FOOTER
		     ================================================= -->

		<footer class="card-footer reactive">

			<span>
				VITERBI / SCHOOL OF ENGINEERING
			</span>

			<div class="stream">
				<i></i>
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>

			<span>
				PROFILE / VERIFIED
			</span>

		</footer>

	</main>

</div>

<style>
	/* =====================================================
	   PAGE
	   ===================================================== */

	.about-page {
		--pink: #ff0080;

		--soft:
			rgba(
				255,
				0,
				128,
				0.52
			);

		--faint:
			rgba(
				255,
				0,
				128,
				0.15
			);

		position: fixed;

		inset: 0;

		z-index: 2;

		width: 100%;
		height: 100dvh;

		overflow-x: hidden;
		overflow-y: auto;

		-webkit-overflow-scrolling:
			touch;

		overscroll-behavior-y:
			contain;

		background: #000;

		padding:
			105px
			7vw
			130px;

		box-sizing:
			border-box;

		font-family:
			'Courier New',
			Courier,
			monospace;

		color:
			rgba(
				255,
				255,
				255,
				0.86
			);

		scrollbar-width:
			thin;

		scrollbar-color:
			var(--soft)
			#000;
	}

	.about-page::-webkit-scrollbar {
		width: 5px;
	}

	.about-page::-webkit-scrollbar-track {
		background: #000;
	}

	.about-page::-webkit-scrollbar-thumb {
		background:
			var(--soft);
	}

	/* =====================================================
	   MAIN CARD
	   ===================================================== */

	.namecard {
		position: relative;

		width:
			min(
				1120px,
				80vw
			);

		margin:
			0 auto;

		background:
			rgba(
				0,
				0,
				0,
				0.9
			);

		border:
			1px solid
			var(--soft);

		transform:
			translate3d(
				calc(
					var(--cursor-vx, 0px) *
					-0.012
				),
				calc(
					var(--cursor-vy, 0px) *
					-0.012
				),
				0
			);

		will-change:
			transform;
	}

	.namecard::before {
		content: '';

		position: absolute;

		inset: 7px;

		z-index: 30;

		border:
			1px solid
			var(--faint);

		opacity:
			calc(
				0.45 +
				var(--cursor-intensity, 0.5)
				* 0.3
			);

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* -0.3
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.3
				)
			);

		pointer-events:
			none;

		animation:
			frame-glitch
			5.2s
			steps(4, end)
			infinite;
	}


	/* =====================================================
	   SHARED UI REACTION
	   ===================================================== */

	.reactive {
		transform:
			translate3d(
				calc(
					var(--cursor-vx, 0px)
					* -0.22
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.22
				),
				0
			);

		filter:
			brightness(
				calc(
					1 +
					var(--cursor-intensity, 0.5)
					* 0.07
				)
			);

		will-change:
			transform,
			filter;
	}


	/* =====================================================
	   HEADER
	   ===================================================== */

	.card-header {
		min-height: 50px;

		padding:
			0 22px;

		display: flex;

		align-items:
			center;

		justify-content:
			space-between;

		border-bottom:
			1px solid
			var(--soft);

		font-size: 9px;

		letter-spacing:
			0.08em;
	}

	.header-left {
		display: flex;

		align-items:
			center;

		gap: 7px;
	}

	.prefix {
		color:
			var(--pink);
	}

	.system-status {
		display: flex;

		align-items:
			center;

		gap: 10px;

		color:
			rgba(
				255,
				255,
				255,
				0.5
			);

		font-size: 7px;
	}

	.battery {
		display: flex;

		gap: 2px;

		padding: 3px;

		border:
			1px solid
			var(--soft);
	}

	.battery span {
		width: 7px;
		height: 6px;

		background:
			var(--pink);

		animation:
			battery-idle
			1.8s
			steps(4, end)
			infinite;
	}

	.battery span:nth-child(2) {
		animation-delay:
			0.15s;
	}

	.battery span:nth-child(3) {
		animation-delay:
			0.3s;
	}

	.battery span:nth-child(4) {
		animation-delay:
			0.45s;
	}


	/* =====================================================
	   PROFILE GRID
	   ===================================================== */

	.profile {
		display: grid;

		grid-template-columns:
			37%
			63%;
	}


	/* =====================================================
	   PORTRAIT
	   ===================================================== */

	.portrait-column {
		padding:
			22px;

		border-right:
			1px solid
			var(--soft);
	}

	.micro-heading {
		margin-bottom:
			11px;

		color:
			var(--pink);

		font-size: 6px;

		letter-spacing:
			0.18em;
	}

	.portrait-frame {
		position: relative;

		width: 86%;

		aspect-ratio:
			4 / 5;

		margin:
			0 auto;

		overflow: hidden;

		background:
			#000;

		border:
			1px solid
			var(--soft);

		transform:
			translate3d(
				calc(
					var(--cursor-field-x, 0px)
					* -0.045
				),
				calc(
					var(--cursor-field-y, 0px)
					* -0.045
				),
				0
			);

		will-change:
			transform;
	}

	.portrait-frame::before {
		content: '';

		position: absolute;

		inset: 0;

		z-index: 5;

		pointer-events:
			none;

		border:
			1px solid
			rgba(
				255,
				0,
				128,
				0.35
			);

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* -0.25
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.25
				)
			);
	}

	.portrait-corner {
		position: absolute;

		z-index: 10;

		width: 16px;
		height: 16px;

		border-color:
			var(--pink);

		filter:
			drop-shadow(
				0 0
				calc(
					var(--cursor-intensity, 0.5)
					* 2px
				)
				rgba(
					255,
					0,
					128,
					0.5
				)
			);
	}

	.portrait-corner.tl {
		left: 7px;
		top: 7px;

		border-left:
			1px solid;

		border-top:
			1px solid;
	}

	.portrait-corner.tr {
		right: 7px;
		top: 7px;

		border-right:
			1px solid;

		border-top:
			1px solid;
	}

	.portrait-corner.bl {
		left: 7px;
		bottom: 7px;

		border-left:
			1px solid;

		border-bottom:
			1px solid;
	}

	.portrait-corner.br {
		right: 7px;
		bottom: 7px;

		border-right:
			1px solid;

		border-bottom:
			1px solid;
	}

	.portrait-data {
		position: absolute;

		left: 7px;
		top: 50%;

		z-index: 10;

		transform:
			translateY(-50%);

		display: flex;

		flex-direction:
			column;

		gap: 20px;

		color:
			rgba(
				255,
				0,
				128,
				0.28
			);

		font-size: 4px;

		pointer-events:
			none;
	}

	.portrait-footer {
		width: 86%;

		margin:
			9px auto 0;

		display: flex;

		justify-content:
			space-between;

		color:
			var(--soft);

		font-size: 5px;
	}


	/* =====================================================
	   INFORMATION
	   ===================================================== */

	.data-column {
		padding:
			34px 36px;
	}

	.identity {
		position: relative;

		padding-bottom:
			23px;

		border-bottom:
			1px solid
			var(--soft);
	}

	.identity h1 {
		margin:
			0 0 12px;

		font-size:
			clamp(
				2rem,
				3vw,
				3.3rem
			);

		font-weight:
			400;

		letter-spacing:
			0.08em;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* -0.16
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.16
				)
			);
	}

	.student-tag {
		display:
			inline-block;

		padding:
			5px 11px;

		background:
			var(--pink);

		color:
			#000;

		font-size: 7px;

		font-weight:
			700;

		letter-spacing:
			0.17em;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* 0.2
				),
				calc(
					var(--cursor-vy, 0px)
					* 0.2
				)
			)
			scale(
				calc(
					1 +
					var(--cursor-intensity, 0.5)
					* 0.01
				)
			);
	}

	.access {
		position: absolute;

		right: 0;
		top: 0;

		display: flex;

		flex-direction:
			column;

		align-items:
			flex-end;

		gap: 4px;

		color:
			var(--pink);

		font-size: 7px;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* 0.28
				),
				calc(
					var(--cursor-vy, 0px)
					* 0.28
				)
			);
	}

	.access strong {
		font-size: 11px;

		letter-spacing:
			0.16em;
	}


	/* =====================================================
	   INFO GRID
	   ===================================================== */

	.information {
		display: grid;

		grid-template-columns:
			1fr
			1fr;

		margin-top:
			20px;
	}

	.info-card {
		min-height:
			42px;

		display: flex;

		align-items:
			center;

		justify-content:
			space-between;

		gap: 12px;

		padding:
			0 6px;

		border-bottom:
			1px solid
			var(--faint);
	}

	.info-card:nth-child(odd) {
		margin-right:
			17px;
	}

	.info-card span {
		color:
			rgba(
				255,
				255,
				255,
				0.46
			);

		font-size: 7px;
	}

	.info-card strong {
		font-size: 7px;

		font-weight:
			400;

		text-align:
			right;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* 0.3
				),
				calc(
					var(--cursor-vy, 0px)
					* 0.3
				)
			);
	}


	/* =====================================================
	   ATTRIBUTES
	   ===================================================== */

	.attributes {
		margin-top:
			26px;
	}

	.section-title {
		margin-bottom:
			16px;

		color:
			var(--pink);

		font-size: 7px;

		letter-spacing:
			0.2em;
	}

	.attribute-row {
		display: grid;

		grid-template-columns:
			105px 1fr;

		align-items:
			center;

		gap:
			14px;

		margin-bottom:
			11px;
	}

	.attribute-name {
		font-size: 7px;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* 0.22
				),
				calc(
					var(--cursor-vy, 0px)
					* 0.22
				)
			);
	}

	.meter {
		display: grid;

		grid-template-columns:
			repeat(
				10,
				1fr
			);

		gap: 3px;

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* -0.24
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.24
				)
			);
	}

	.meter span {
		height: 9px;

		border:
			1px solid
			var(--soft);

		background:
			transparent;

		transition:
			background
			80ms linear,
			box-shadow
			80ms linear;
	}

	.meter span.filled {
		background:
			var(--pink);

		border-color:
			var(--pink);

		box-shadow:
			0 0
			calc(
				var(--cursor-intensity, 0.5)
				* 3px
			)
			rgba(
				255,
				0,
				128,
				0.22
			);
	}


	/* =====================================================
	   BIO
	   ===================================================== */

	.bio {
		padding:
			28px 35px;

		border-top:
			1px solid
			var(--soft);
	}

	.bio-content {
		display:
			grid;

		grid-template-columns:
			1.1fr
			0.9fr;

		gap:
			45px;
	}

	.bio p {
		margin: 0;

		font-size: 8px;

		line-height:
			1.85;

		color:
			rgba(
				255,
				255,
				255,
				0.68
			);

		transform:
			translate(
				calc(
					var(--cursor-vx, 0px)
					* -0.15
				),
				calc(
					var(--cursor-vy, 0px)
					* -0.15
				)
			);
	}

	.bio-data {
		display:
			flex;

		flex-direction:
			column;

		gap: 9px;
	}

	.bio-data > div {
		display:
			flex;

		justify-content:
			space-between;

		gap: 12px;

		padding-bottom:
			7px;

		border-bottom:
			1px solid
			var(--faint);
	}

	.bio-data span {
		color:
			var(--soft);
	}

	.bio-data strong {
		font-weight:
			400;

		text-align:
			right;
	}


	/* =====================================================
	   FOOTER
	   ===================================================== */

	.card-footer {
		min-height:
			48px;

		padding:
			0 28px;

		display:
			flex;

		align-items:
			center;

		justify-content:
			space-between;

		border-top:
			1px solid
			var(--soft);

		font-size: 5px;

		color:
			var(--soft);
	}

	.stream {
		width:
			140px;

		display:
			flex;

		gap: 4px;
	}

	.stream i {
		flex: 1;

		height: 3px;

		background:
			var(--soft);

		animation:
			stream-idle
			1.8s
			steps(4, end)
			infinite;
	}


	/* =====================================================
	   IDLE ANIMATIONS
	   ===================================================== */

	@keyframes frame-glitch {
		0%,
		86%,
		100% {
			opacity: 1;

			transform:
				translate(
					0,
					0
				);
		}

		89% {
			opacity: 0.45;

			transform:
				translateX(
					-1px
				);
		}

		92% {
			opacity: 0.9;

			transform:
				translateX(
					1px
				);
		}

		95% {
			opacity: 0.65;

			transform:
				translateY(
					1px
				);
		}
	}

	@keyframes battery-idle {
		0%,
		70%,
		100% {
			opacity: 0.7;
		}

		76% {
			opacity: 0.15;
		}

		82% {
			opacity: 1;
		}
	}

	@keyframes stream-idle {
		0%,
		70%,
		100% {
			opacity: 0.4;
		}

		76% {
			opacity: 0.15;
		}

		82% {
			opacity: 0.9;
		}
	}


	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 900px) {
		.namecard {
			width:
				88vw;
		}

		.profile {
			grid-template-columns:
				40%
				60%;
		}
	}

	@media (max-width: 700px) {
		.about-page {
			padding:
				90px
				4vw
				110px;
		}

		.namecard {
			width:
				92vw;
		}

		.profile {
			display:
				block;
		}

		.portrait-column {
			border-right:
				0;

			border-bottom:
				1px solid
				var(--soft);
		}

		.portrait-frame {
			width:
				min(
					360px,
					82%
				);
		}

		.bio-content {
			grid-template-columns:
				1fr;

			gap:
				24px;
		}
	}

	@media (max-width: 500px) {
		.data-column {
			padding:
				25px
				20px;
		}

		.information {
			grid-template-columns:
				1fr;
		}

		.info-card:nth-child(odd) {
			margin-right: 0;
		}

		.attribute-row {
			grid-template-columns:
				80px
				1fr;
		}

		.access {
			position:
				static;

			margin-top:
				14px;

			align-items:
				flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.namecard,
		.reactive,
		.portrait-frame {
			transform:
				none !important;
		}

		.namecard::before,
		.battery span,
		.stream i {
			animation:
				none;
		}
	}
</style>

<script lang="ts">
	import InteractiveAscii from '$lib/InteractiveAscii.svelte';

	const attributes = [
		{ label: 'COLLABORATION', fill: 9 },
		{ label: 'FOCUS', fill: 8 },
		{ label: 'CREATIVITY', fill: 8 },
		{ label: 'PROJECT MANAGEMENT', fill: 7 },
		{ label: 'OVERTHINKING', fill: 5 }
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
				<span>SYS / ACTIVE</span>

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
		     PROFILE
		     ================================================= -->

		<section class="profile">
			<!-- =============================================
			     PORTRAIT
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
						cellSize={5}
						cursorRadius={125}
						zoom={1.045}
						noiseInterval={140}
						opacity={0.78}
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
				<section class="identity">
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
						<span>ACCESS</span>

						<strong>
							*****
						</strong>
					</div>
				</section>

				<!-- =========================================
				     BASIC INFORMATION
				     ========================================= -->

				<section class="information">
					<div class="info-card">
						<span>ID</span>

						<strong>
							STD.1442
						</strong>
					</div>

					<div class="info-card">
						<span>STATUS</span>

						<strong>
							ACTIVE
						</strong>
					</div>

					<div class="info-card">
						<span>UNIVERSITY</span>

						<strong>
							USC
						</strong>
					</div>

					<div class="info-card">
						<span>SCHOOL</span>

						<strong>
							VITERBI
						</strong>
					</div>

					<div class="info-card">
						<span>MAJOR</span>

						<strong>
							MECHANICAL ENGINEERING
						</strong>
					</div>

					<div class="info-card">
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
					<div class="section-title">
						ATTRIBUTES
					</div>

					{#each attributes as attribute}
						<div class="attribute-row">
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

		<section class="bio">
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

		<footer class="card-footer">
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
	   COLORS
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

		-webkit-overflow-scrolling: touch;

		overscroll-behavior-y: contain;

		background: #000;

		padding:
			100px
			6vw
			115px;

		box-sizing: border-box;

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

		scrollbar-width: thin;

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
	   NAMECARD
	   ===================================================== */

	.namecard {
		position: relative;

		width:
			min(
				980px,
				72vw
			);

		margin:
			0 auto;

		background:
			rgba(
				0,
				0,
				0,
				0.88
			);

		border:
			1px solid
			var(--soft);

		transform: none;

		will-change: auto;
	}

	.namecard::before {
		content: '';

		position: absolute;

		inset: 7px;

		z-index: 30;

		border:
			1px solid
			var(--faint);

		opacity: 0.72;

		pointer-events: none;
	}

	/* =====================================================
	   HEADER
	   ===================================================== */

	.card-header {
		min-height: 46px;

		padding:
			0 18px;

		display: flex;

		align-items: center;

		justify-content:
			space-between;

		border-bottom:
			1px solid
			var(--soft);

		font-size: 10px;

		letter-spacing:
			0.08em;
	}

	.header-left {
		display: flex;

		align-items: center;

		gap: 7px;
	}

	.prefix {
		color:
			var(--pink);

		font-size: 11px;
	}

	.system-status {
		display: flex;

		align-items: center;

		gap: 9px;

		color:
			rgba(
				255,
				255,
				255,
				0.68
			);

		font-size: 9px;

		font-weight: 500;

		letter-spacing:
			0.05em;
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
		width: 6px;

		height: 5px;

		background:
			var(--pink);

		animation:
			battery-idle
			2.2s
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
	   PROFILE
	   ===================================================== */

	.profile {
		display:
			grid;

		grid-template-columns:
			35%
			65%;
	}

	/* =====================================================
	   PORTRAIT
	   ===================================================== */

	.portrait-column {
		padding:
			18px;

		border-right:
			1px solid
			var(--soft);
	}

	.micro-heading {
		margin-bottom:
			8px;

		color:
			var(--pink);

		font-size:
			8px;

		font-weight:
			600;

		letter-spacing:
			0.16em;
	}

	.portrait-frame {
		position:
			relative;

		width:
			84%;

		aspect-ratio:
			4 / 5;

		margin:
			0 auto;

		overflow:
			hidden;

		background:
			#000;

		border:
			1px solid
			var(--soft);

		transform:
			none;

		will-change:
			auto;
	}

	.portrait-frame::before {
		content: '';

		position:
			absolute;

		inset:
			0;

		z-index:
			5;

		pointer-events:
			none;

		border:
			1px solid
			rgba(
				255,
				0,
				128,
				0.34
			);
	}

	.portrait-corner {
		position:
			absolute;

		z-index:
			10;

		width:
			14px;

		height:
			14px;

		border-color:
			var(--pink);

		filter:
			drop-shadow(
				0 0 3px
				rgba(
					255,
					0,
					128,
					0.45
				)
			);
	}

	.portrait-corner.tl {
		left:
			6px;

		top:
			6px;

		border-left:
			1px solid;

		border-top:
			1px solid;
	}

	.portrait-corner.tr {
		right:
			6px;

		top:
			6px;

		border-right:
			1px solid;

		border-top:
			1px solid;
	}

	.portrait-corner.bl {
		left:
			6px;

		bottom:
			6px;

		border-left:
			1px solid;

		border-bottom:
			1px solid;
	}

	.portrait-corner.br {
		right:
			6px;

		bottom:
			6px;

		border-right:
			1px solid;

		border-bottom:
			1px solid;
	}

	.portrait-data {
		position:
			absolute;

		left:
			6px;

		top:
			50%;

		z-index:
			10;

		transform:
			translateY(-50%);

		display:
			flex;

		flex-direction:
			column;

		gap:
			14px;

		color:
			rgba(
				255,
				0,
				128,
				0.46
			);

		font-size:
			6px;

		pointer-events:
			none;
	}

	.portrait-footer {
		width:
			84%;

		margin:
			7px auto 0;

		display:
			flex;

		justify-content:
			space-between;

		color:
			var(--soft);

		font-size:
			7px;

		letter-spacing:
			0.04em;
	}

	/* =====================================================
	   DATA COLUMN
	   ===================================================== */

	.data-column {
		padding:
			25px 28px;
	}

	/* =====================================================
	   IDENTITY
	   ===================================================== */

	.identity {
		position:
			relative;

		padding-bottom:
			17px;

		border-bottom:
			1px solid
			var(--soft);
	}

	.identity h1 {
		margin:
			0 0 9px;

		/*
		 * Keep LE, ANI smaller.
		 */
		font-size:
			clamp(
				1.4rem,
				1.8vw,
				2rem
			);

		font-weight:
			400;

		letter-spacing:
			0.08em;

		transform:
			none;
	}

	.student-tag {
		display:
			inline-block;

		padding:
			5px 10px;

		background:
			var(--pink);

		color:
			#000;

		font-size:
			8px;

		font-weight:
			700;

		letter-spacing:
			0.15em;
	}

	.access {
		position:
			absolute;

		right:
			0;

		top:
			0;

		display:
			flex;

		flex-direction:
			column;

		align-items:
			flex-end;

		gap:
			4px;

		color:
			var(--pink);

		font-size:
			9px;

		font-weight:
			600;

		letter-spacing:
			0.08em;
	}

	.access strong {
		font-size:
			11px;

		letter-spacing:
			0.16em;
	}

	/* =====================================================
	   INFORMATION
	   ===================================================== */

	.information {
		display:
			grid;

		grid-template-columns:
			1fr 1fr;

		margin-top:
			13px;
	}

	.info-card {
		min-height:
			32px;

		display:
			flex;

		align-items:
			center;

		justify-content:
			space-between;

		gap:
			10px;

		padding:
			0 4px;

		border-bottom:
			1px solid
			var(--faint);
	}

	.info-card:nth-child(odd) {
		margin-right:
			12px;
	}

	.info-card span {
		color:
			rgba(
				255,
				255,
				255,
				0.72
			);

		/*
		 * Larger labels.
		 */
		font-size:
			10px;

		font-weight:
			500;

		letter-spacing:
			0.05em;

		white-space:
			nowrap;
	}

	.info-card strong {
		color:
			rgba(
				255,
				255,
				255,
				0.92
			);

		/*
		 * Larger values.
		 */
		font-size:
			9px;

		font-weight:
			400;

		letter-spacing:
			0.02em;

		text-align:
			right;

		white-space:
			nowrap;

		overflow:
			hidden;

		text-overflow:
			ellipsis;
	}

	/* =====================================================
	   ATTRIBUTES
	   ===================================================== */

	.attributes {
		margin-top:
			18px;
	}

	.section-title {
		margin-bottom:
			12px;

		color:
			var(--pink);

		font-size:
			10px;

		font-weight:
			700;

		letter-spacing:
			0.18em;
	}

	.attribute-row {
		display:
			grid;

		grid-template-columns:
			165px 1fr;

		align-items:
			center;

		gap:
			12px;

		margin-bottom:
			8px;
	}

	.attribute-name {
		/*
		 * Larger attribute text.
		 */
		font-size:
			10px;

		font-weight:
			500;

		letter-spacing:
			0.035em;

		color:
			rgba(
				255,
				255,
				255,
				0.86
			);
	}

	.meter {
		display:
			grid;

		grid-template-columns:
			repeat(
				10,
				1fr
			);

		gap:
			3px;
	}

	.meter span {
		height:
			8px;

		border:
			1px solid
			var(--soft);

		background:
			transparent;

		transition:
			background
			100ms linear,
			box-shadow
			100ms linear;
	}

	.meter span.filled {
		background:
			var(--pink);

		border-color:
			var(--pink);

		box-shadow:
			0 0 3px
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
			20px 28px;

		border-top:
			1px solid
			var(--soft);
	}

	.bio-content {
		display:
			grid;

		grid-template-columns:
			1.1fr 0.9fr;

		gap:
			30px;
	}

	.bio p {
		margin:
			0;

		/*
		 * Larger readable paragraph.
		 */
		font-size:
			10px;

		line-height:
			1.7;

		letter-spacing:
			0.01em;

		color:
			rgba(
				255,
				255,
				255,
				0.78
			);
	}

	.bio-data {
		display:
			flex;

		flex-direction:
			column;

		gap:
			7px;
	}

	.bio-data > div {
		display:
			flex;

		justify-content:
			space-between;

		align-items:
			center;

		gap:
			10px;

		padding-bottom:
			6px;

		border-bottom:
			1px solid
			var(--faint);
	}

	.bio-data span {
		color:
			var(--soft);

		/*
		 * Larger PROGRAM / INSTITUTION / MODE.
		 */
		font-size:
			8px;

		font-weight:
			600;

		letter-spacing:
			0.05em;
	}

	.bio-data strong {
		color:
			rgba(
				255,
				255,
				255,
				0.9
			);

		font-size:
			9px;

		font-weight:
			400;

		letter-spacing:
			0.015em;

		text-align:
			right;
	}

	/* =====================================================
	   FOOTER
	   ===================================================== */

	.card-footer {
		min-height:
			40px;

		padding:
			0 22px;

		display:
			flex;

		align-items:
			center;

		justify-content:
			space-between;

		border-top:
			1px solid
			var(--soft);

		font-size:
			8px;

		letter-spacing:
			0.04em;

		color:
			var(--soft);
	}

	.stream {
		width:
			120px;

		display:
			flex;

		gap:
			3px;
	}

	.stream i {
		flex:
			1;

		height:
			3px;

		background:
			var(--soft);

		animation:
			stream-idle
			2s
			steps(4, end)
			infinite;
	}

	/* =====================================================
	   ANIMATIONS
	   ===================================================== */

	@keyframes battery-idle {
		0%,
		70%,
		100% {
			opacity:
				0.7;
		}

		76% {
			opacity:
				0.15;
		}

		82% {
			opacity:
				1;
		}
	}

	@keyframes stream-idle {
		0%,
		70%,
		100% {
			opacity:
				0.4;
		}

		76% {
			opacity:
				0.15;
		}

		82% {
			opacity:
				0.9;
		}
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 1000px) {
		.namecard {
			width:
				82vw;
		}

		.profile {
			grid-template-columns:
				38%
				62%;
		}

		.attribute-row {
			grid-template-columns:
				140px 1fr;
		}
	}

	@media (max-width: 760px) {
		.about-page {
			padding:
				90px
				4vw
				100px;
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
					300px,
					76%
				);
		}

		.bio-content {
			grid-template-columns:
				1fr;

			gap:
				18px;
		}

		.attribute-row {
			grid-template-columns:
				160px 1fr;
		}
	}

	@media (max-width: 560px) {
		.data-column {
			padding:
				20px;
		}

		.information {
			grid-template-columns:
				1fr;
		}

		.info-card:nth-child(odd) {
			margin-right:
				0;
		}

		.info-card {
			min-height:
				32px;
		}

		.info-card span {
			font-size:
				9px;
		}

		.info-card strong {
			font-size:
				8px;
		}

		.attribute-row {
			grid-template-columns:
				145px 1fr;
		}

		.attribute-name {
			font-size:
				9px;
		}

		.section-title {
			font-size:
				9px;
		}

		.bio p {
			font-size:
				9px;
		}

		.bio-data span {
			font-size:
				7px;
		}

		.bio-data strong {
			font-size:
				8px;
		}

		.card-footer {
			padding:
				0 16px;

			font-size:
				7px;
		}

		.stream {
			width:
				80px;
		}

		.access {
			position:
				static;

			margin-top:
				11px;

			align-items:
				flex-start;
		}
	}

	/* =====================================================
	   REDUCED MOTION
	   ===================================================== */

	@media (prefers-reduced-motion: reduce) {
		.battery span,
		.stream i {
			animation:
				none;
		}
	}
</style>

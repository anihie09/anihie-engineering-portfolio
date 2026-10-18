<script lang="ts">
	const contacts = [
		{
			type: 'LINKEDIN',
			value: 'linkedin.com/in/ani-le-9612731b6',
			href: 'https://www.linkedin.com/in/ani-le-9612731b6/',
			code: '0101 — 0110'
		},
		{
			type: 'EMAIL',
			value: 'ale95199@usc.edu',
			href: 'mailto:ale95199@usc.edu',
			code: '0110 — 1001'
		},
		{
			type: 'EMAIL',
			value: 'an.hoai.le01gmail.com',
			href: '#',
			code: '1001 — 0011'
		},
		{
			type: 'GITHUB',
			value: 'github.com/anihie09',
			href: 'https://github.com/anihie09',
			code: '0011 — 1010'
		}
	];
</script>

<svelte:head>
	<title>ANIHIE — Contacts</title>

	<meta
		name="description"
		content="Contact ANI Le — LinkedIn, email, and GitHub"
	/>
</svelte:head>

<div class="contact-page">
	<!-- =====================================================
	     BACKGROUND / HUD
	     ===================================================== -->

	<div
		class="hud-background"
		aria-hidden="true"
	>
		<div class="hud-top-line"></div>
		<div class="hud-bottom-line"></div>

		<!-- TOP CENTER MARKER -->
		<div class="hud-top-marker">
			<div class="hud-top-marker-ring"></div>
			<div class="hud-top-marker-center"></div>
			<div class="hud-top-marker-line"></div>
		</div>

		<!-- LEFT TARGET -->
		<div class="hud-target left">
			<div class="target-cross-horizontal"></div>
			<div class="target-cross-vertical"></div>
			<div class="target-ring target-ring-large"></div>
			<div class="target-ring target-ring-small"></div>
			<div class="target-dot"></div>
		</div>

		<!-- RIGHT TARGET -->
		<div class="hud-target right">
			<div class="target-cross-horizontal"></div>
			<div class="target-cross-vertical"></div>
			<div class="target-ring target-ring-large"></div>
			<div class="target-ring target-ring-small"></div>
			<div class="target-dot"></div>
		</div>

		<!-- TOP ANGLES -->
		<div class="hud-diagonal diagonal-left"></div>
		<div class="hud-diagonal diagonal-right"></div>

		<!-- TOP DIAMONDS -->
		<div class="hud-diamond diamond-left"></div>
		<div class="hud-diamond diamond-right"></div>

		<!-- SIDE SYSTEM BARS -->
		<div class="side-system side-system-left">
			<div class="side-system-title">
				SYS / 02
			</div>

			<div class="side-system-rule"></div>

			<div class="side-system-row">
				<span>CORE</span>
				<strong>ACTIVE</strong>
			</div>

			<div class="side-system-row">
				<span>LINK</span>
				<strong>ONLINE</strong>
			</div>

			<div class="side-system-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<div class="side-system side-system-right">
			<div class="side-system-title">
				DIRECTORY
			</div>

			<div class="side-system-rule"></div>

			<div class="side-system-row">
				<span>MODE</span>
				<strong>01</strong>
			</div>

			<div class="side-system-row">
				<span>STATUS</span>
				<strong>READY</strong>
			</div>

			<div class="side-system-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- CORNER CODES -->
		<div class="hud-code code-top-left">
			0011 — 0002
		</div>

		<div class="hud-code code-top-right">
			0289 — 0202
		</div>

		<div class="hud-code code-bottom-left">
			5679 — 0222
		</div>

		<div class="hud-code code-bottom-right">
			8361 — 2222
		</div>

		<!-- TECH SEGMENTS -->
		<div class="hud-segment segment-one"></div>
		<div class="hud-segment segment-two"></div>
		<div class="hud-segment segment-three"></div>
		<div class="hud-segment segment-four"></div>

		<!-- SIDE DOTS -->
		<div class="vertical-dots dots-left">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<div class="vertical-dots dots-right">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<!-- BOTTOM CENTER SYSTEM LINE -->
		<div class="bottom-system-line">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>

	<!-- =====================================================
	     MAIN INTERFACE
	     ===================================================== -->

	<main class="contact-interface">
		<!-- TOP LABEL -->

		<div class="top-label">
			<span>02</span>
			<span>CONTACT_SECTION</span>
		</div>

		<!-- =================================================
		     HERO
		     ================================================= -->

		<section class="hero">
			<div class="hero-small">
				DIVISION 02
			</div>

			<div class="hero-subtitle">
				SECTION_CONTACT
			</div>

			<h1>ANIHIE</h1>

			<div class="hero-code">
				<span>AN</span>
				<span>01</span>
				<span>CONTACTS</span>
			</div>
		</section>

		<!-- =================================================
		     LEFT FLOATING UI
		     ================================================= -->

		<div class="floating-panel floating-panel-left">
			<div class="floating-panel-title">
				CONTACT
			</div>

			<div class="floating-panel-number">
				01
			</div>

			<div class="floating-panel-rule"></div>

			<div class="floating-panel-row">
				<span>SYS</span>
				<strong>READY</strong>
			</div>

			<div class="floating-panel-row">
				<span>LINK</span>
				<strong>OPEN</strong>
			</div>

			<div class="floating-panel-row">
				<span>MODE</span>
				<strong>DIRECT</strong>
			</div>

			<div class="floating-panel-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- =================================================
		     RIGHT FLOATING UI
		     ================================================= -->

		<div class="floating-panel floating-panel-right">
			<div class="floating-panel-title">
				CHANNEL
			</div>

			<div class="floating-panel-number">
				04
			</div>

			<div class="floating-panel-rule"></div>

			<div class="floating-panel-row">
				<span>MAIL</span>
				<strong>01</strong>
			</div>

			<div class="floating-panel-row">
				<span>SOCIAL</span>
				<strong>02</strong>
			</div>

			<div class="floating-panel-row">
				<span>CODE</span>
				<strong>01</strong>
			</div>

			<div class="floating-panel-bars">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<!-- =================================================
		     CARD
		     ================================================= -->

		<section class="card-shell">
			<div
				class="shell-angle shell-angle-left"
				aria-hidden="true"
			></div>

			<div
				class="shell-angle shell-angle-right"
				aria-hidden="true"
			></div>

			<div
				class="shell-lower-left"
				aria-hidden="true"
			></div>

			<div
				class="shell-lower-right"
				aria-hidden="true"
			></div>

			<div class="contact-card">
				<!-- =========================================
				     CARD TOP
				     ========================================= -->

				<div class="card-top">
					<div class="card-marker">
						<span></span>
						<span></span>
						<span></span>
					</div>

					<div class="card-id">
						CONTACT SYSTEM / 01
					</div>

					<div class="card-status">
						ACTIVE
					</div>
				</div>

				<!-- =========================================
				     WORD PANEL
				     ========================================= -->

				<div class="word-panel">
					<div class="word-panel-top">
						<span>ANIHIE</span>
						<span>CONTACT DIRECTORY</span>
					</div>

					<h2>
						CONTACTS
					</h2>

					<div class="word-panel-bottom">
						<span>MECH_SYS</span>
						<span>EST. 2025</span>
						<span>ONLINE</span>
					</div>

					<div
						class="word-angle left"
						aria-hidden="true"
					></div>

					<div
						class="word-angle right"
						aria-hidden="true"
					></div>
				</div>

				<!-- =========================================
				     CONTACT GRID
				     ========================================= -->

				<div class="contact-grid">
					{#each contacts as contact, index}
						{#if contact.href !== '#'}
							<a
								class="contact-item"
								href={contact.href}
								target="_blank"
								rel="noreferrer"
							>
								<div class="contact-index">
									0{index + 1}
								</div>

								<div class="contact-main">
									<div class="contact-type">
										{contact.type}
									</div>

									<div class="contact-value">
										{contact.value}
									</div>
								</div>

								<div class="contact-code">
									{contact.code}
								</div>

								<div class="contact-arrow">
									&gt;&gt;
								</div>

								<div
									class="item-corner"
									aria-hidden="true"
								></div>
							</a>
						{:else}
							<div
								class="contact-item contact-item-static"
							>
								<div class="contact-index">
									0{index + 1}
								</div>

								<div class="contact-main">
									<div class="contact-type">
										{contact.type}
									</div>

									<div class="contact-value">
										{contact.value}
									</div>
								</div>

								<div class="contact-code">
									{contact.code}
								</div>

								<div class="contact-arrow">
									//
								</div>

								<div
									class="item-corner"
									aria-hidden="true"
								></div>
							</div>
						{/if}
					{/each}
				</div>

				<!-- =========================================
				     CARD FOOTER
				     ========================================= -->

				<div class="card-bottom">
					<div>
						<span>
							COMMUNICATION CHANNEL
						</span>

						<strong>
							OPEN
						</strong>
					</div>

					<div class="card-bottom-center">
						<span class="tiny-dot"></span>

						SIGNAL VERIFIED

						<span class="tiny-dot"></span>
					</div>

					<div>
						<span>
							STATUS
						</span>

						<strong>
							AVAILABLE
						</strong>
					</div>
				</div>

				<div
					class="bottom-angle left"
					aria-hidden="true"
				></div>

				<div
					class="bottom-angle right"
					aria-hidden="true"
				></div>
			</div>
		</section>

		<!-- =================================================
		     LOWER UX STRIP
		     ================================================= -->

		<section class="bottom-panel">
			<div class="bottom-block">
				<div class="bottom-block-label">
					PROGRAM
				</div>

				<strong>
					MECHANICAL ENGINEERING
				</strong>
			</div>

			<div class="bottom-block">
				<div class="bottom-block-label">
					LOCATION
				</div>

				<strong>
					LOS ANGELES / CA
				</strong>
			</div>

			<div class="bottom-block">
				<div class="bottom-block-label">
					DIRECT
				</div>

				<strong>
					ANIHIE
				</strong>
			</div>
		</section>
	</main>
</div>

<style>
	/* =====================================================
	   GLOBAL FONT
	   ===================================================== */

	:global(html),
	:global(body),
	:global(button),
	:global(input),
	:global(textarea),
	:global(select),
	:global(a) {
		font-family:
			'Courier New',
			Courier,
			monospace;
	}

	/* =====================================================
	   PAGE VARIABLES
	   ===================================================== */

	.contact-page {
		--pink: #ff0080;
		--pink-bright: #ff1493;

		--pink-soft:
			rgba(
				255,
				0,
				128,
				0.68
			);

		--pink-faint:
			rgba(
				255,
				0,
				128,
				0.2
			);

		--white-soft:
			rgba(
				255,
				255,
				255,
				0.72
			);

		position:
			fixed;

		inset:
			0;

		width:
			100vw;

		height:
			100dvh;

		overflow:
			hidden;

		background:
			#000;

		color:
			#fff;
	}

	/* =====================================================
	   BACKGROUND HUD
	   ===================================================== */

	.hud-background {
		position:
			absolute;

		inset:
			0;

		z-index:
			0;

		overflow:
			hidden;

		pointer-events:
			none;
	}

	.hud-top-line,
	.hud-bottom-line {
		position:
			absolute;

		left:
			0;

		right:
			0;

		height:
			1px;

		background:
			var(--pink);
	}

	.hud-top-line {
		top:
			10px;
	}

	.hud-bottom-line {
		bottom:
			10px;
	}

	/* =====================================================
	   TOP CENTER MARKER
	   ===================================================== */

	.hud-top-marker {
		position:
			absolute;

		left:
			50%;

		top:
			31px;

		width:
			36px;

		height:
			36px;

		transform:
			translateX(-50%);

		opacity:
			0.55;
	}

	.hud-top-marker-ring {
		position:
			absolute;

		inset:
			7px;

		border:
			1px solid
			var(--pink-soft);

		border-radius:
			50%;
	}

	.hud-top-marker-center {
		position:
			absolute;

		left:
			50%;

		top:
			50%;

		width:
			4px;

		height:
			4px;

		background:
			var(--pink);

		border-radius:
			50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.hud-top-marker-line {
		position:
			absolute;

		left:
			-13px;

		right:
			-13px;

		top:
			50%;

		height:
			1px;

		background:
			var(--pink-faint);
	}

	/* =====================================================
	   TARGETS
	   ===================================================== */

	.hud-target {
		position:
			absolute;

		width:
			120px;

		height:
			120px;

		border:
			1px solid
			var(--pink-soft);

		border-radius:
			50%;

		opacity:
			0.55;
	}

	.hud-target::before,
	.hud-target::after {
		content:
			'';

		position:
			absolute;

		background:
			var(--pink-soft);
	}

	.hud-target::before {
		left:
			-22px;

		right:
			-22px;

		top:
			50%;

		height:
			1px;
	}

	.hud-target::after {
		top:
			-22px;

		bottom:
			-22px;

		left:
			50%;

		width:
			1px;
	}

	.hud-target.left {
		left:
			20px;

		top:
			48%;

		transform:
			translateY(-50%);
	}

	.hud-target.right {
		right:
			20px;

		top:
			48%;

		transform:
			translateY(-50%);
	}

	.target-ring {
		position:
			absolute;

		left:
			50%;

		top:
			50%;

		border:
			1px solid
			var(--pink-soft);

		border-radius:
			50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.target-ring-large {
		width:
			76px;

		height:
			76px;
	}

	.target-ring-small {
		width:
			30px;

		height:
			30px;
	}

	.target-dot {
		position:
			absolute;

		left:
			50%;

		top:
			50%;

		width:
			4px;

		height:
			4px;

		background:
			var(--pink);

		border-radius:
			50%;

		transform:
			translate(
				-50%,
				-50%
			);
	}

	.target-cross-horizontal,
	.target-cross-vertical {
		position:
			absolute;

		background:
			var(--pink-soft);
	}

	.target-cross-horizontal {
		left:
			0;

		right:
			0;

		top:
			50%;

		height:
			1px;
	}

	.target-cross-vertical {
		top:
			0;

		bottom:
			0;

		left:
			50%;

		width:
			1px;
	}

	/* =====================================================
	   BACKGROUND ANGLES
	   ===================================================== */

	.hud-diagonal {
		position:
			absolute;

		width:
			130px;

		height:
			1px;

		background:
			var(--pink-soft);
	}

	.diagonal-left {
		left:
			3%;

		top:
			24%;

		transform:
			rotate(45deg);
	}

	.diagonal-right {
		right:
			3%;

		top:
			24%;

		transform:
			rotate(-45deg);
	}

	.hud-diamond {
		position:
			absolute;

		width:
			27px;

		height:
			27px;

		border:
			1px solid
			var(--pink-soft);

		transform:
			rotate(45deg);
	}

	.diamond-left {
		left:
			24%;

		top:
			9%;
	}

	.diamond-right {
		right:
			24%;

		top:
			9%;
	}

	/* =====================================================
	   CORNER CODES
	   ===================================================== */

	.hud-code {
		position:
			absolute;

		color:
			rgba(
				255,
				255,
				255,
				0.72
			);

		font-size:
			9px;

		letter-spacing:
			0.08em;
	}

	.code-top-left {
		left:
			4.5%;

		top:
			28%;
	}

	.code-top-right {
		right:
			4.5%;

		top:
			28%;
	}

	.code-bottom-left {
		left:
			4.5%;

		bottom:
			29%;
	}

	.code-bottom-right {
		right:
			4.5%;

		bottom:
			29%;
	}

	/* =====================================================
	   TECH SEGMENTS
	   ===================================================== */

	.hud-segment {
		position:
			absolute;

		height:
			1px;

		background:
			var(--pink-faint);
	}

	.segment-one {
		left:
			7%;

		top:
			14%;

		width:
			190px;
	}

	.segment-two {
		right:
			7%;

		top:
			14%;

		width:
			190px;
	}

	.segment-three {
		left:
			7%;

		bottom:
			18%;

		width:
			210px;
	}

	.segment-four {
		right:
			7%;

		bottom:
			18%;

		width:
			210px;
	}

	/* =====================================================
	   SIDE SYSTEM PANELS
	   ===================================================== */

	.side-system {
		position:
			absolute;

		z-index:
			2;

		top:
			37%;

		width:
			128px;

		padding:
			10px;

		border-top:
			1px solid
			var(--pink-soft);

		border-bottom:
			1px solid
			var(--pink-faint);

		color:
			var(--pink-soft);

		background:
			rgba(
				0,
				0,
				0,
				0.18
			);
	}

	.side-system-left {
		left:
			4.5%;
	}

	.side-system-right {
		right:
			4.5%;
	}

	.side-system-title {
		color:
			var(--pink);

		font-size:
			8px;

		font-weight:
			700;

		letter-spacing:
			0.15em;
	}

	.side-system-rule {
		width:
			100%;

		height:
			1px;

		margin:
			6px 0;

		background:
			var(--pink-soft);
	}

	.side-system-row {
		display:
			flex;

		justify-content:
			space-between;

		gap:
			8px;

		margin-top:
			5px;

		font-size:
			7px;
	}

	.side-system-row strong {
		color:
			#fff;

		font-weight:
			400;
	}

	.side-system-bars {
		display:
			flex;

		gap:
			3px;

		margin-top:
			8px;
	}

	.side-system-bars span {
		flex:
			1;

		height:
			4px;

		background:
			var(--pink-faint);
	}

	.side-system-bars span:nth-child(-n + 3) {
		background:
			var(--pink);
	}

	/* =====================================================
	   VERTICAL DOTS
	   ===================================================== */

	.vertical-dots {
		position:
			absolute;

		z-index:
			2;

		display:
			flex;

		flex-direction:
			column;

		gap:
			8px;
	}

	.dots-left {
		left:
			6px;

		top:
			57%;
	}

	.dots-right {
		right:
			6px;

		top:
			57%;
	}

	.vertical-dots span {
		width:
			6px;

		height:
			6px;

		border:
			1px solid
			var(--pink-soft);

		border-radius:
			50%;
	}

	/* =====================================================
	   BOTTOM CENTER SYSTEM LINE
	   ===================================================== */

	.bottom-system-line {
		position:
			absolute;

		left:
			50%;

		bottom:
			27px;

		width:
			430px;

		transform:
			translateX(-50%);

		display:
			flex;

		justify-content:
			space-between;

		align-items:
			center;
	}

	.bottom-system-line::before {
		content:
			'';

		position:
			absolute;

		left:
			0;

		right:
			0;

		top:
			50%;

		height:
			1px;

		background:
			var(--pink-soft);
	}

	.bottom-system-line span {
		position:
			relative;

		z-index:
			2;

		width:
			8px;

		height:
			8px;

		border:
			1px solid
			var(--pink);

		border-radius:
			50%;

		background:
			#000;
	}

	/* =====================================================
	   MAIN
	   ===================================================== */

	.contact-interface {
		position:
			relative;

		z-index:
			5;

		width:
			100%;

		height:
			100%;

		display:
			flex;

		flex-direction:
			column;

		align-items:
			center;

		justify-content:
			center;

		padding:
			50px
			5vw
			42px;

		box-sizing:
			border-box;
	}

	/* =====================================================
	   TOP LABEL
	   ===================================================== */

	.top-label {
		position:
			absolute;

		top:
			20px;

		left:
			50%;

		transform:
			translateX(-50%);

		display:
			flex;

		gap:
			14px;

		color:
			var(--pink);

		font-size:
			9px;

		letter-spacing:
			0.18em;
	}

	/* =====================================================
	   HERO
	   ===================================================== */

	.hero {
		display:
			flex;

		flex-direction:
			column;

		align-items:
			center;

		margin-bottom:
			10px;

		text-align:
			center;
	}

	.hero-small {
		color:
			var(--pink);

		font-size:
			9px;

		font-weight:
			600;

		letter-spacing:
			0.2em;
	}

	.hero-subtitle {
		margin-top:
			3px;

		color:
			var(--white-soft);

		font-size:
			8px;

		letter-spacing:
			0.18em;
	}

	/* Smaller / thinner ANIHIE */

	.hero h1 {
		margin:
			7px 0 3px;

		color:
			#fff;

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size:
			clamp(
				1.25rem,
				2.25vw,
				2.25rem
			);

		font-weight:
			400;

		letter-spacing:
			0.13em;

		line-height:
			0.92;
	}

	.hero-code {
		display:
			flex;

		align-items:
			center;

		gap:
			15px;

		color:
			var(--pink-soft);

		font-size:
			7px;

		letter-spacing:
			0.16em;
	}

	/* =====================================================
	   FLOATING SIDE UX
	   ===================================================== */

	.floating-panel {
		position:
			absolute;

		z-index:
			6;

		top:
			42%;

		width:
			145px;

		padding:
			11px;

		border-top:
			1px solid
			var(--pink-soft);

		border-bottom:
			1px solid
			var(--pink-soft);

		background:
			rgba(
				0,
				0,
				0,
				0.72
			);

		color:
			var(--pink-soft);
	}

	.floating-panel::before,
	.floating-panel::after {
		content:
			'';

		position:
			absolute;

		width:
			14px;

		height:
			14px;

		border-color:
			var(--pink-soft);
	}

	.floating-panel::before {
		left:
			-1px;

		top:
			-1px;

		border-left:
			1px solid;

		border-top:
			1px solid;
	}

	.floating-panel::after {
		right:
			-1px;

		bottom:
			-1px;

		border-right:
			1px solid;

		border-bottom:
			1px solid;
	}

	.floating-panel-left {
		left:
			3.7%;
	}

	.floating-panel-right {
		right:
			3.7%;
	}

	.floating-panel-title {
		color:
			var(--pink);

		font-size:
			8px;

		font-weight:
			700;

		letter-spacing:
			0.15em;
	}

	.floating-panel-number {
		margin-top:
			3px;

		color:
			#fff;

		font-size:
			12px;

		font-weight:
			400;

		letter-spacing:
			0.08em;
	}

	.floating-panel-rule {
		width:
			100%;

		height:
			1px;

		margin:
			6px 0;

		background:
			var(--pink-faint);
	}

	.floating-panel-row {
		display:
			flex;

		justify-content:
			space-between;

		margin-top:
			5px;

		font-size:
			7px;
	}

	.floating-panel-row strong {
		color:
			#fff;

		font-weight:
			400;
	}

	.floating-panel-bars {
		display:
			flex;

		gap:
			3px;

		margin-top:
			9px;
	}

	.floating-panel-bars span {
		flex:
			1;

		height:
			4px;

		background:
			var(--pink-faint);
	}

	.floating-panel-bars span:nth-child(-n + 3) {
		background:
			var(--pink);
	}

	/* =====================================================
	   CARD SHELL
	   ===================================================== */

	.card-shell {
		position:
			relative;

		width:
			min(
				1040px,
				78vw
			);

		padding:
			1px;

		background:
			var(--pink);

		clip-path:
			polygon(
				3.2% 0,
				96.8% 0,
				98.4% 7%,
				100% 7%,
				100% 90%,
				97.6% 90%,
				95.8% 100%,
				4.2% 100%,
				2.5% 93%,
				0 93%,
				0 7%,
				1.6% 7%
			);
	}

	.card-shell::before {
		content:
			'';

		position:
			absolute;

		inset:
			4px;

		z-index:
			0;

		background:
			var(--pink-faint);

		clip-path:
			polygon(
				3.3% 0,
				96.7% 0,
				98% 7%,
				100% 7%,
				100% 90%,
				97.3% 90%,
				95.6% 100%,
				4.3% 100%,
				2.7% 93%,
				0 93%,
				0 7%,
				2% 7%
			);

		pointer-events:
			none;
	}

	/* =====================================================
	   ANGLED OUTER DETAILS
	   ===================================================== */

	.shell-angle {
		position:
			absolute;

		z-index:
			4;

		top:
			27px;

		width:
			118px;

		height:
			28px;

		border-top:
			1px solid
			var(--pink);

		border-bottom:
			1px solid
			var(--pink);

		background:
			#000;
	}

	.shell-angle-left {
		left:
			-1px;

		clip-path:
			polygon(
				0 0,
				75% 0,
				100% 50%,
				75% 100%,
				0 100%,
				15% 50%
			);
	}

	.shell-angle-right {
		right:
			-1px;

		clip-path:
			polygon(
				25% 0,
				100% 0,
				85% 50%,
				100% 100%,
				25% 100%,
				0 50%
			);
	}

	.shell-lower-left,
	.shell-lower-right {
		position:
			absolute;

		z-index:
			4;

		bottom:
			22px;

		width:
			170px;

		height:
			26px;

		border-top:
			1px solid
			var(--pink-soft);

		background:
			#000;
	}

	.shell-lower-left {
		left:
			7%;

		transform:
			skewX(-38deg);
	}

	.shell-lower-right {
		right:
			7%;

		transform:
			skewX(38deg);
	}

	/* =====================================================
	   CARD
	   ===================================================== */

	.contact-card {
		position:
			relative;

		z-index:
			2;

		width:
			100%;

		background:
			rgba(
				0,
				0,
				0,
				0.96
			);

		clip-path:
			polygon(
				3.2% 0,
				96.8% 0,
				98.2% 7.5%,
				100% 7.5%,
				100% 89.5%,
				97.4% 89.5%,
				95.6% 100%,
				4.4% 100%,
				2.6% 93%,
				0 93%,
				0 7.5%,
				1.8% 7.5%
			);

		overflow:
			hidden;
	}

	.contact-card::before {
		content:
			'';

		position:
			absolute;

		inset:
			8px;

		z-index:
			15;

		border:
			1px solid
			var(--pink-faint);

		clip-path:
			polygon(
				3.3% 0,
				96.7% 0,
				98.4% 7.5%,
				100% 7.5%,
				100% 89%,
				97.2% 89%,
				95.3% 100%,
				4.7% 100%,
				2.8% 93%,
				0 93%,
				0 7.5%,
				1.6% 7.5%
			);

		pointer-events:
			none;
	}

	/* =====================================================
	   CARD TOP
	   ===================================================== */

	.card-top {
		position:
			relative;

		z-index:
			5;

		display:
			grid;

		grid-template-columns:
			1fr
			auto
			1fr;

		align-items:
			center;

		min-height:
			40px;

		padding:
			0 20px;

		border-bottom:
			1px solid
			var(--pink-soft);

		color:
			var(--pink);

		font-size:
			8px;

		letter-spacing:
			0.12em;
	}

	.card-marker {
		display:
			flex;

		gap:
			3px;
	}

	.card-marker span {
		width:
			8px;

		height:
			5px;

		background:
			var(--pink);
	}

	.card-id {
		justify-self:
			center;

		color:
			var(--white-soft);
	}

	.card-status {
		justify-self:
			end;
	}

	/* =====================================================
	   WORD PANEL
	   ===================================================== */

	.word-panel {
		position:
			relative;

		z-index:
			5;

		padding:
			13px 26px 11px;

		border-bottom:
			1px solid
			var(--pink-soft);
	}

	.word-panel-top,
	.word-panel-bottom {
		display:
			flex;

		justify-content:
			space-between;

		align-items:
			center;

		color:
			rgba(
				255,
				255,
				255,
				0.68
			);

		font-size:
			8px;

		letter-spacing:
			0.13em;
	}

	/* Smaller / thinner CONTACTS */

	.word-panel h2 {
		margin:
			10px 0 9px;

		color:
			#fff;

		font-family:
			'Courier New',
			Courier,
			monospace;

		font-size:
			clamp(
				1.15rem,
				2.15vw,
				2.2rem
			);

		font-weight:
			400;

		letter-spacing:
			0.09em;

		line-height:
			0.92;

		text-align:
			center;
	}

	.word-panel-bottom {
		color:
			var(--pink-soft);
	}

	.word-angle {
		position:
			absolute;

		top:
			50%;

		width:
			18px;

		height:
			18px;

		border:
			1px solid
			var(--pink-soft);

		transform:
			translateY(-50%)
			rotate(45deg);
	}

	.word-angle.left {
		left:
			4px;
	}

	.word-angle.right {
		right:
			4px;
	}

	/* =====================================================
	   CONTACT GRID
	   ===================================================== */

	.contact-grid {
		position:
			relative;

		z-index:
			5;

		display:
			grid;

		grid-template-columns:
			1fr
			1fr;
	}

	.contact-item {
		position:
			relative;

		display:
			grid;

		grid-template-columns:
			34px
			1fr
			auto
			28px;

		align-items:
			center;

		gap:
			9px;

		min-height:
			68px;

		padding:
			10px 18px;

		color:
			#fff;

		text-decoration:
			none;

		border-bottom:
			1px solid
			var(--pink-faint);

		transition:
			background
			120ms ease,
			color
			120ms ease;
	}

	.contact-item:nth-child(odd) {
		border-right:
			1px solid
			var(--pink-faint);
	}

	.contact-item:nth-last-child(-n + 2) {
		border-bottom:
			0;
	}

	.contact-item:hover {
		background:
			rgba(
				255,
				0,
				128,
				0.055
			);
	}

	.contact-item-static {
		cursor:
			default;
	}

	.contact-index {
		color:
			var(--pink);

		font-size:
			10px;

		font-weight:
			700;
	}

	.contact-main {
		min-width:
			0;
	}

	.contact-type {
		margin-bottom:
			4px;

		color:
			var(--pink);

		font-size:
			9px;

		font-weight:
			700;

		letter-spacing:
			0.15em;
	}

	.contact-value {
		color:
			rgba(
				255,
				255,
				255,
				0.92
			);

		font-size:
			10px;

		white-space:
			nowrap;

		overflow:
			hidden;

		text-overflow:
			ellipsis;
	}

	.contact-code {
		color:
			rgba(
				255,
				255,
				255,
				0.46
			);

		font-size:
			7px;

		white-space:
			nowrap;
	}

	.contact-arrow {
		color:
			var(--pink);

		font-size:
			11px;

		font-weight:
			700;

		text-align:
			right;
	}

	.item-corner {
		position:
			absolute;

		right:
			-4px;

		bottom:
			-4px;

		width:
			11px;

		height:
			11px;

		border-left:
			1px solid
			var(--pink-soft);

		border-top:
			1px solid
			var(--pink-soft);

		transform:
			rotate(45deg);
	}

	/* =====================================================
	   CARD FOOTER
	   ===================================================== */

	.card-bottom {
		position:
			relative;

		z-index:
			5;

		display:
			grid;

		grid-template-columns:
			1fr
			auto
			1fr;

		align-items:
			center;

		gap:
			18px;

		min-height:
			44px;

		padding:
			0 19px;

		border-top:
			1px solid
			var(--pink-soft);

		color:
			var(--pink-soft);

		font-size:
			7px;

		letter-spacing:
			0.09em;
	}

	.card-bottom > div {
		display:
			flex;

		align-items:
			center;

		gap:
			8px;
	}

	.card-bottom > div:last-child {
		justify-content:
			flex-end;
	}

	.card-bottom strong {
		color:
			#fff;

		font-weight:
			400;
	}

	.card-bottom-center {
		justify-content:
			center;

		color:
			var(--pink);
	}

	.tiny-dot {
		width:
			4px;

		height:
			4px;

		background:
			var(--pink);

		border-radius:
			50%;
	}

	/* =====================================================
	   LOWER ANGLES
	   ===================================================== */

	.bottom-angle {
		position:
			absolute;

		z-index:
			10;

		bottom:
			2px;

		width:
			100px;

		height:
			20px;

		background:
			#000;

		border-top:
			1px solid
			var(--pink-soft);

		pointer-events:
			none;
	}

	.bottom-angle.left {
		left:
			11%;

		transform:
			skewX(-40deg);
	}

	.bottom-angle.right {
		right:
			11%;

		transform:
			skewX(40deg);
	}

	/* =====================================================
	   LOWER UX STRIP
	   ===================================================== */

	.bottom-panel {
		width:
			min(
				1040px,
				78vw
			);

		display:
			grid;

		grid-template-columns:
			1.2fr
			1fr
			0.7fr;

		gap:
			12px;

		margin-top:
			8px;
	}

	.bottom-block {
		display:
			flex;

		justify-content:
			space-between;

		align-items:
			center;

		padding:
			8px 10px;

		border-top:
			1px solid
			var(--pink-soft);

		color:
			var(--pink-soft);

		font-size:
			8px;

		letter-spacing:
			0.08em;
	}

	.bottom-block-label {
		color:
			var(--pink);

		font-size:
			8px;
	}

	.bottom-block strong {
		color:
			rgba(
				255,
				255,
				255,
				0.84
			);

		font-size:
			9px;

		font-weight:
			400;

		text-align:
			right;
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 1200px) {
		.floating-panel {
			display:
				none;
		}
	}

	@media (max-width: 1000px) {
		.card-shell,
		.bottom-panel {
			width:
				83vw;
		}

		.hud-target {
			width:
				90px;

			height:
				90px;
		}
	}

	@media (max-width: 760px) {
		.contact-interface {
			justify-content:
				flex-start;

			padding:
				58px
				4vw
				30px;

			overflow-y:
				auto;
		}

		.card-shell,
		.bottom-panel {
			width:
				92vw;
		}

		.contact-grid {
			grid-template-columns:
				1fr;
		}

		.contact-item:nth-child(odd) {
			border-right:
				0;
		}

		.contact-item:nth-last-child(-n + 2) {
			border-bottom:
				1px solid
				var(--pink-faint);
		}

		.contact-item:last-child {
			border-bottom:
				0;
		}

		.contact-code {
			display:
				none;
		}

		.bottom-panel {
			grid-template-columns:
				1fr;
		}

		.hud-diagonal,
		.side-system {
			display:
				none;
		}

		.hero h1 {
			font-size:
				1.6rem;
		}

		.word-panel h2 {
			font-size:
				1.45rem;
		}
	}

	@media (max-width: 520px) {
		.top-label {
			font-size:
				6px;
		}

		.hero-small,
		.hero-subtitle {
			font-size:
				7px;
		}

		.hero h1 {
			font-size:
				1.2rem;
		}

		.word-panel h2 {
			font-size:
				1.2rem;
		}

		.card-top {
			grid-template-columns:
				1fr
				auto;
		}

		.card-id {
			display:
				none;
		}

		.contact-item {
			grid-template-columns:
				26px
				1fr
				20px;

			min-height:
				74px;
		}

		.contact-value {
			font-size:
				8px;
		}

		.card-bottom {
			grid-template-columns:
				1fr
				1fr;
		}

		.card-bottom-center {
			display:
				none;
		}

		.hud-code,
		.hud-segment,
		.hud-diamond,
		.vertical-dots,
		.bottom-system-line {
			display:
				none;
		}

		.bottom-block {
			font-size:
				7px;
		}

		.bottom-block strong {
			font-size:
				8px;
		}
	}

	/* =====================================================
	   ACCESSIBILITY
	   ===================================================== */

	.contact-item:focus-visible {
		outline:
			1px solid
			var(--pink-bright);

		outline-offset:
			-2px;

		background:
			rgba(
				255,
				0,
				128,
				0.08
			);
	}
</style>

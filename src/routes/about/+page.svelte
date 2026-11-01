<script lang="ts">
	import HudFrame from '$lib/HudFrame.svelte';

	/* ---------------------------------------------------------
	   CONTENT — edit the text here
	   --------------------------------------------------------- */

	const facts = [
		[
			'STUDENT AT UNIVERSITY OF SOUTHERN CALIFORNIA',
			'MAJOR : MECHANICAL ENGINEERING',
			'YEAR : SOPHOMORE',
			'AFFILIATIONS : ADVANCED ROBOTICS COMBAT'
		],
		['ORIGIN : BERKELEY', 'ETHNICITY : VIETNAMESE', 'SEX : F']
	];

	// level out of 10
	const skills = [
		{ label: 'COLLABORATION', level: 9 },
		{ label: 'FOCUS', level: 8 },
		{ label: 'CREATIVITY', level: 8 },
		{ label: 'PROJECT MGMT', level: 7 },
		{ label: 'OVERTHINKING', level: 5 }
	];

	const links = [
		{ label: 'LinkedIn', value: 'ani-le-9612731b6', href: 'https://www.linkedin.com/in/ani-le-9612731b6/' },
		{ label: 'Email', value: 'ale95199@usc.edu', href: 'mailto:ale95199@usc.edu' },
		{ label: 'GitHub', value: 'anihie09', href: 'https://github.com/anihie09' }
	];

	// photos in the lower-right collage
	const collage = [
		{ src: '/about-photo.png', title: 'NIGHT_01.PNG', pos: '50% 30%' },
		{ src: '/home-background.png', title: 'VENDING.PNG', pos: '78% 40%' },
		{ src: '/images/ani-profile.jpg', title: 'PORTRAIT_02.JPG', pos: '50% 20%' }
	];

	/* start the skill bars when they scroll into view */
	function reveal(node: HTMLElement) {
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					io.disconnect();
				}
			},
			{ threshold: 0.35 }
		);

		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<svelte:head>
	<title>ANI — About</title>

	<meta
		name="description"
		content="ANI — Mechanical Engineering student at USC"
	/>
</svelte:head>

<div class="about-page">
	<div class="about">
		<!-- =================================================
		     HERO
		     ================================================= -->

		<section class="hero">
			<div class="face">
				<HudFrame
					label="ANI_LE.JPG"
					code="SUBJECT / 01"
					cut={22}
				>
					<img
						src="/images/ani-profile.jpg"
						alt="Ani Le"
					/>
					<div class="face-caption">MECHANICAL ENGINEERING | ROBOTICS</div>
				</HudFrame>
			</div>

			<div class="facts">
				{#each facts as group, g}
					<ul class:spaced={g > 0}>
						{#each group as line, i}
							<li style="--i: {facts.slice(0, g).flat().length + i}; --chars: {line.length + 2};">
								<span class="caret-mark">&gt;</span>
								{line}
							</li>
						{/each}
					</ul>
				{/each}

				<span
					class="cursor"
					aria-hidden="true"
				></span>

				<div
					class="skills"
					use:reveal
				>
					<span class="sk-corner tl" aria-hidden="true"></span>
					<span class="sk-corner tr" aria-hidden="true"></span>
					<span class="sk-corner bl" aria-hidden="true"></span>
					<span class="sk-corner br" aria-hidden="true"></span>

					<div class="skills-head">
						<span>SKILLS</span>
						<span class="skills-code">LVL / 10</span>
					</div>

					{#each skills as skill, s}
						<div
							class="skill-row"
							style="--s: {s};"
						>
							<span class="skill-name">{skill.label}</span>

							<div
								class="cells"
								role="meter"
								aria-label={skill.label}
								aria-valuemin={0}
								aria-valuemax={10}
								aria-valuenow={skill.level}
							>
								{#each Array(20) as _, k}
									<span
										class="cell"
										class:on={k < skill.level * 2}
										class:edge={k === skill.level * 2 - 1}
										style="--k: {k};"
									></span>
								{/each}
							</div>

							<span class="skill-value">{String(skill.level).padStart(2, '0')}</span>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- =================================================
		     CONNECT / COLLAGE
		     ================================================= -->

		<section class="lower">
			<div class="lower-left">
				<div class="connect">
					<h2 class="section-title small">LET’S CONNECT</h2>

					{#each links as link}
						<p>
							{link.label}:
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer">{link.value}</a
							>
						</p>
					{/each}
				</div>
			</div>

			<div
				class="collage"
				aria-label="Photos"
			>
				{#each collage as photo, n}
					<div class="collage-item c{n + 1}">
						<HudFrame label={photo.title}>
							<img
								src={photo.src}
								alt=""
								style="object-position: {photo.pos};"
							/>
						</HudFrame>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.about-page {
		--pink: #ff0000;
		--pink-bright: #ff4f4f;
		--light: #ffe1e1;

		min-height: 100vh;
		box-sizing: border-box;

		/* room for the site border + signature */
		padding: 122px 0 80px;

		background: #000;
		color: var(--light);

		font-family: var(--font-mono);
	}

	.about {
		width: min(1140px, 84vw);
		margin: 0 auto;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* =====================================================
	   HERO
	   ===================================================== */

	.hero {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: clamp(24px, 3vw, 48px);
		align-items: stretch;

		/* fills the first screen, like the reference */
		height: clamp(440px, calc(100vh - 186px), 760px);
	}

	.face {
		height: 100%;
		min-height: 0;

		opacity: 0;
		animation: pop-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
	}

	.face-caption {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;

		padding: 10px 12px;

		background: linear-gradient(180deg, rgba(0, 0, 0, 0.65), transparent);

		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-align: center;

		color: #fff;
	}

	.facts {
		position: relative;

		display: flex;
		flex-direction: column;

		min-height: 0;
		padding-top: 4px;
	}

	.facts ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.facts ul.spaced {
		margin-top: clamp(14px, 2.4vh, 24px);
	}

	.facts li {
		font-size: clamp(0.72rem, 0.92vw, 0.9rem);
		line-height: 1.75;
		letter-spacing: 0.02em;

		color: #f4f0f0;

		/* typed out one line after another */
		clip-path: inset(0 100% 0 0);
		animation: type calc(var(--chars) * 0.028s) steps(var(--chars), end)
			calc(0.5s + var(--i) * 0.42s) forwards;
	}

	.caret-mark {
		color: var(--pink);
		text-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
	}

	.cursor {
		display: inline-block;

		width: 0.55em;
		height: 1em;
		margin-top: 4px;

		background: var(--pink);
		box-shadow: 0 0 8px var(--pink);

		animation: blink 1s steps(2, start) infinite;
	}

	/* =====================================================
	   SECTION TITLES
	   ===================================================== */

	.section-title {
		margin: 0 0 18px;

		font-size: clamp(1.1rem, 1.7vw, 1.5rem);
		font-weight: 700;
		letter-spacing: 0.24em;
		text-align: center;

		color: #fff;
		text-shadow: 0 0 12px rgba(255, 0, 0, 0.45);
	}

	.section-title.small {
		margin: 0 0 18px;
		font-size: clamp(0.9rem, 1.2vw, 1.1rem);
	}

	/* =====================================================
	   LOWER
	   ===================================================== */

	.lower {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(28px, 4vw, 60px);
		align-items: center;

		margin-top: clamp(48px, 8vh, 80px);
	}

	/* ---------- skill bars (horizontal) ---------- */

	.skills {
		position: relative;

		margin-top: auto;
		padding: 0 16px 14px;

		border: 1px solid rgba(255, 0, 0, 0.3);
		background: linear-gradient(180deg, rgba(255, 0, 0, 0.06), rgba(0, 0, 0, 0.2));
	}

	/* bracket corners with + marks */
	.sk-corner {
		position: absolute;

		width: 12px;
		height: 12px;

		border-color: #ffe1e1;
		border-style: solid;
		border-width: 0;
	}

	.sk-corner::after {
		content: '+';
		position: absolute;

		font-size: 10px;
		line-height: 1;
		color: var(--pink-bright);
	}

	.sk-corner.tl { left: -6px; top: -6px; border-left-width: 2px; border-top-width: 2px; }
	.sk-corner.tr { right: -6px; top: -6px; border-right-width: 2px; border-top-width: 2px; }
	.sk-corner.bl { left: -6px; bottom: -6px; border-left-width: 2px; border-bottom-width: 2px; }
	.sk-corner.br { right: -6px; bottom: -6px; border-right-width: 2px; border-bottom-width: 2px; }

	.sk-corner.tl::after { left: 8px; top: 6px; }
	.sk-corner.tr::after { right: 8px; top: 6px; }
	.sk-corner.bl::after { left: 8px; bottom: 6px; }
	.sk-corner.br::after { right: 8px; bottom: 6px; }

	.skills-head {
		display: flex;
		align-items: center;
		justify-content: space-between;

		margin: 12px -6px 12px;
		padding: 5px 10px;

		background: rgba(255, 0, 0, 0.16);
		border-left: 3px solid var(--pink);

		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;

		color: var(--pink-bright);
	}

	.skills-code {
		font-size: 0.55rem;
		letter-spacing: 0.16em;
		color: rgba(255, 225, 225, 0.55);
	}

	.skill-row {
		display: grid;
		grid-template-columns: minmax(84px, 0.32fr) 1fr 22px;
		gap: 12px;
		align-items: center;

		margin-top: 8px;
	}

	.skill-name {
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		white-space: nowrap;

		color: rgba(255, 225, 225, 0.8);
	}

	.cells {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		gap: 2px;
	}

	.cell {
		height: clamp(8px, 1.3vh, 11px);

		border: 1px solid rgba(255, 0, 0, 0.35);
		background: transparent;

		transition:
			background 220ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;

		/* fills left to right, each row a beat after the last */
		transition-delay: calc(0.3s + var(--s) * 0.18s + var(--k) * 0.035s);
	}

	:global(.in-view) .cell.on {
		background: var(--pink);
		border-color: var(--pink-bright);
		box-shadow: 0 0 6px rgba(255, 0, 0, 0.5);
	}

	:global(.in-view) .cell.edge {
		animation: edge-pulse 1.8s ease-in-out calc(1.6s + var(--s) * 0.2s) infinite;
	}

	.skill-value {
		font-size: 0.68rem;
		font-weight: 700;
		text-align: right;
		color: var(--pink-bright);
		font-variant-numeric: tabular-nums;
	}

	/* ---------- connect ---------- */

	.connect {
		text-align: center;
	}

	.connect p {
		margin: 0 0 10px;

		font-size: 0.78rem;
		letter-spacing: 0.04em;
	}

	.connect a {
		color: var(--light);
		text-decoration: underline;
		text-decoration-color: rgba(255, 0, 0, 0.7);
		text-underline-offset: 3px;

		transition: color 250ms ease, text-shadow 250ms ease;
	}

	.connect a:hover,
	.connect a:focus-visible {
		color: var(--pink-bright);
		text-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
		outline: none;
	}

	/* ---------- collage ---------- */

	.collage {
		position: relative;
		height: clamp(380px, 38vw, 470px);
	}

	.collage-item {
		position: absolute;

		transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.collage-item:hover {
		z-index: 5;
		transform: translateY(-6px) rotate(0deg);
	}

	.c1 {
		left: 6%;
		top: 0;
		width: 38%;
		height: 58%;
		transform: rotate(-2deg);
	}

	.c2 {
		right: 0;
		top: 10%;
		width: 46%;
		height: 46%;
		transform: rotate(2deg);
	}

	.c3 {
		left: 30%;
		bottom: 0;
		width: 42%;
		height: 42%;
		transform: rotate(-1deg);
		z-index: 2;
	}

	/* =====================================================
	   ANIMATIONS
	   ===================================================== */

	@keyframes type {
		to { clip-path: inset(0 0 0 0); }
	}

	@keyframes blink {
		to { visibility: hidden; }
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.98);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes edge-pulse {
		0%,
		100% { box-shadow: 0 0 6px rgba(255, 0, 0, 0.5); }
		50% { box-shadow: 0 0 14px rgba(255, 79, 79, 0.95); background: #ffd1d1; }
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 860px) {
		.hero,
		.lower {
			grid-template-columns: 1fr;
		}

		.hero {
			height: auto;
		}

		.face {
			width: min(380px, 100%);
			height: auto;
			aspect-ratio: 4 / 4.6;
			justify-self: center;
		}

		.skills {
			margin-top: 28px;
		}

		.collage {
			height: 420px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.face,
		.facts li {
			animation: none;
			opacity: 1;
			clip-path: none;
		}

		.cell {
			transition: none;
		}

		.cursor {
			animation: none;
		}
	}

	/* display font for headings */
	.section-title,
	.skills-head {
		font-family: var(--font-display);
	}
</style>

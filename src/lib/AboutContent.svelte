<script lang="ts">
	import HudFrame from '$lib/HudFrame.svelte';
	import SkillRadar from '$lib/SkillRadar.svelte';

	/* ---------------------------------------------------------
	   CONTENT — edit the text here
	   --------------------------------------------------------- */

	const facts = [
		[
			'STUDENT AT UNIVERSITY OF SOUTHERN CALIFORNIA',
			'MAJOR : MECHANICAL ENGINEERING',
			'YEAR : JUNIOR',
			'AFFILIATIONS : ADVANCED ROBOTIC COMBAT, SOCIETY OF WOMEN ENGINEERS, COLLEGE TRACK'
		],
		['ORIGIN : OAKLAND', 'ETHNICITY : VIETNAMESE', 'SEX : F']
	];

	// level out of 10
	const skills = [
		{ label: 'COLLABORATION', level: 9 },
		{ label: 'FOCUS', level: 9 },
		{ label: 'CREATIVITY', level: 8 },
		{ label: 'PROJECT MANAGEMENT', level: 7 },
		{ label: 'OVERTHINKING', level: 10 }
	];

	// introduction (each string is a paragraph)
	const intro = [
		'Ani has had a range of interests from sustainable fashion, product design to biomimicry within robotics. Her main focus is on how automated engineering can contribute to environmental sustainability.',
		'She prefers exploring new terrains with a team that allows room for collaboration, creativity and connections that will last after projects.'
	];

	// photos in the lower-right collage
	const collage = [
		{ src: '/about-photo.png', title: 'NIGHT_01.PNG', pos: '50% 30%' },
		{ src: '/about-photo.jpeg', title: 'VENDING.PNG', pos: '78% 40%' },
		{ src: '/images/ani-profile.jpg', title: 'PORTRAIT_02.JPG', pos: '50% 20%' }
	];

	let skillsInView = $state(false);

	/* start the skill bars when they scroll into view */
	function reveal(node: HTMLElement, onShow?: () => void) {
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					onShow?.();
					io.disconnect();
				}
			},
			{ threshold: 0.35 }
		);

		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

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
						src="/about-photo.png"
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
					use:reveal={() => (skillsInView = true)}
				>
					<span class="sk-corner tl" aria-hidden="true"></span>
					<span class="sk-corner tr" aria-hidden="true"></span>
					<span class="sk-corner bl" aria-hidden="true"></span>
					<span class="sk-corner br" aria-hidden="true"></span>

					<div class="skills-head">
						<span class="head-title">SKILLS</span>
						<span class="skills-code">LVL / 10</span>
					</div>

					<div class="radar-wrap">
						<SkillRadar
							{skills}
							active={skillsInView}
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- =================================================
		     INTRODUCTION / COLLAGE
		     ================================================= -->

		<section class="lower">
			<div
				class="intro"
				use:reveal
			>
				<span class="sk-corner tl" aria-hidden="true"></span>
				<span class="sk-corner tr" aria-hidden="true"></span>
				<span class="sk-corner bl" aria-hidden="true"></span>
				<span class="sk-corner br" aria-hidden="true"></span>

				<div class="skills-head">
					<span class="head-title">INTRODUCTION</span>
					<span class="skills-code">README.TXT</span>
				</div>

				{#each intro as paragraph, n}
					<p style="--p: {n};">{paragraph}</p>
				{/each}
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
		--pink: #f1f1f1;
		--pink-bright: #f6f6f6;
		--light: #ffffff;

		box-sizing: border-box;

		padding: 28px clamp(20px, 3vw, 40px) 56px;

		color: var(--light);

		font-family: var(--font-mono);
	}

	.about {
		width: 100%;
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
		grid-template-columns: 0.8fr 1.2fr;
		gap: clamp(24px, 3.5vw, 56px);
		align-items: stretch;

		/* fills the first screen, like the reference */
		height: clamp(400px, calc(100vh - 240px), 640px);
	}

	.face {
		align-self: stretch;

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
		padding-top: 0;

		/* first line's cap height sits on the photo's top edge */
		margin-top: -0.4em;
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

		color: #ffffff;

		/* typed out one line after another */
		clip-path: inset(0 100% 0 0);
		animation: type calc(var(--chars) * 0.028s) steps(var(--chars), end)
			calc(0.5s + var(--i) * 0.42s) forwards;
	}

	.caret-mark {
		color: var(--hot-red);
		text-shadow: 0 0 8px var(--hot-red-glow);
	}

	.cursor {
		display: inline-block;

		width: 0.55em;
		height: 1em;
		margin-top: 4px;

		background: var(--strawberry);
		box-shadow: 0 0 8px rgba(255, 62, 165, 0.6);

		animation: blink 1s steps(2, start) infinite;
	}

	/* =====================================================
	   LOWER
	   ===================================================== */

	.lower {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(24px, 3.5vw, 56px);
		align-items: stretch;

		margin-top: clamp(48px, 8vh, 80px);
	}

	/* ---------- skill bars (horizontal) ---------- */

	.skills {
		position: relative;

		margin-top: auto;
		padding: 0 16px 14px;

		border: 1px solid rgba(241, 241, 241, 0.3);
		background: linear-gradient(180deg, rgba(241, 241, 241, 0.06), rgba(0, 0, 0, 0.2));
	}

	/* bracket corners with + marks */
	.sk-corner {
		position: absolute;

		width: 12px;
		height: 12px;

		border-color: #ffffff;
		border-style: solid;
		border-width: 0;
	}

	.sk-corner::after {
		content: '+';
		position: absolute;

		font-size: 10px;
		line-height: 1;
		color: var(--hot-red);
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

		background: rgba(241, 241, 241, 0.08);
		border-left: 3px solid var(--strawberry);

		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;

		color: var(--pink-bright);
	}

	.skills-code {
		font-size: 0.55rem;
		letter-spacing: 0.16em;
		color: rgba(255, 255, 255, 0.55);
	}

	/* ---------- introduction ---------- */

	.intro {
		position: relative;

		padding: 0 22px 22px;

		border: 1px solid rgba(241, 241, 241, 0.3);
		background: linear-gradient(180deg, rgba(241, 241, 241, 0.06), rgba(0, 0, 0, 0.2));
	}

	.intro .skills-head {
		margin: 14px -10px 18px;
	}

	.intro p {
		margin: 0 0 16px;

		font-size: clamp(0.78rem, 0.95vw, 0.92rem);
		line-height: 1.85;
		letter-spacing: 0.02em;

		color: rgba(255, 255, 255, 0.9);

		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 600ms ease calc(0.2s + var(--p) * 0.25s),
			transform 600ms cubic-bezier(0.22, 1, 0.36, 1) calc(0.2s + var(--p) * 0.25s);
	}

	.intro p:last-child {
		margin-bottom: 0;
	}

	:global(.in-view) .intro p,
	.intro:global(.in-view) p {
		opacity: 1;
		transform: none;
	}

	/* ---------- collage (straight, no hover) ---------- */

	.collage {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(2, minmax(0, 1fr));
		gap: 24px;

		height: clamp(380px, 36vw, 460px);
	}

	.collage-item {
		position: relative;
		min-height: 0;
	}

	.c1 {
		grid-column: 1;
		grid-row: 1 / 3;
	}

	.c2 {
		grid-column: 2;
		grid-row: 1;
	}

	.c3 {
		grid-column: 2;
		grid-row: 2;
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
		100% { box-shadow: 0 0 6px rgba(241, 241, 241, 0.5); }
		50% { box-shadow: 0 0 14px rgba(214, 31, 129, 0.8); background: var(--petal-rouge); border-color: var(--petal-rouge); }
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

		.intro p {
			transition: none;
			opacity: 1;
			transform: none;
		}
	}

	/* display font for headings */
	.skills-head {
		font-family: var(--font-display);
	}

	/* the chart shrinks to fit, so the box still ends on the photo's bottom edge */
	.skills {
		display: flex;
		flex-direction: column;
		flex: 0 1 auto;
		min-height: 0;
	}

	.radar-wrap {
		flex: 1 1 auto;
		height: clamp(150px, 30vh, 250px);
		min-height: 130px;
		margin-top: 2px;
	}

	/* section headings: same tech style, heavier than body text */
	.head-title {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.22em;

		color: #ffffff;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
	}
</style>

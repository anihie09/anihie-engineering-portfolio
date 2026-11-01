<script lang="ts">
	import HudFrame from '$lib/HudFrame.svelte';

	/* ---------------------------------------------------------
	   CONTENT — edit / add projects here.
	   kind 'project' shows text (+ optional images),
	   kind 'gallery' shows only images.
	   Put images in static/ and list them like '/projects/nemesis-1.jpg'.
	   --------------------------------------------------------- */

	type Item = {
		id: string;
		name: string;
		kind: 'project' | 'gallery';
		subtitle?: string;
		description?: string;
		points?: string[];
		tags?: string[];
		images?: string[];
	};

	const items: Item[] = [
		{
			id: 'nemesis',
			name: 'NEMESIS',
			kind: 'project',
			subtitle: 'USC ADVANCED ROBOTICS COMBAT · 250 LB HEAVYWEIGHT',
			description:
				'One of ARC’s heavyweight combat robots, built to compete in BattleBots and regional events.',
			points: [
				'Contributed to early Nemesis development',
				'Wrote the funding proposal for Nemesis V2’s autonomous driving system',
				'Part of the team behind ARC’s first official BattleBots win at Proving Grounds 2026'
			],
			tags: ['COMBAT ROBOTICS', 'BATTLEBOTS', 'ARC'],
			images: []
		},
		{
			id: 'openarm',
			name: 'OPENARM',
			kind: 'project',
			subtitle: 'ROBOTICS CENTER OF SILICON VALLEY · INTERNSHIP',
			description: 'Hands-on work with OpenArm, a bimanual robotic arm platform.',
			points: [
				'Assembled and calibrated OpenArm bimanual robotic arms',
				'Worked on teleoperation development',
				'Represented the company at a Bay Area data summit'
			],
			tags: ['ROBOTIC ARMS', 'TELEOPERATION', 'CALIBRATION'],
			images: []
		},
		{
			id: 'drivetrain',
			name: 'DRIVETRAIN',
			kind: 'project',
			subtitle: 'USC ARC · DRIVETRAIN LEAD',
			description: 'Drivetrain work for ARC’s combat robots.',
			points: ['Drivetrain Lead for USC Advanced Robotics Combat', 'Also served as club Secretary'],
			tags: ['MECHANICAL DESIGN', 'COMBAT ROBOTICS'],
			images: []
		},
		{
			id: 'photos',
			name: 'PHOTOS',
			kind: 'gallery',
			subtitle: 'ARCHIVE',
			images: ['/images/ani-profile.jpg', '/about-photo.png', '/home-background.png']
		}
	];

	let selected = $state<number | null>(null);
	const item = $derived(selected === null ? null : items[selected]);

	const pad = (n: number, len = 2) => String(n).padStart(len, '0');

	let tabEls: HTMLButtonElement[] = [];

	/* arrow keys move between tabs */
	function onTabKey(e: KeyboardEvent, n: number) {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();

		const next = (n + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
		tabEls[next]?.focus();
		selected = next;
	}
</script>

<svelte:head>
	<title>ANI — Projects</title>

	<meta
		name="description"
		content="ANI — engineering projects"
	/>
</svelte:head>

<div class="projects-page">
	<div class="console">
		<!-- =================================================
		     HEADER
		     ================================================= -->

		<header class="console-head">
			<div class="head-left">
				<span class="range">[ 0-{items.length} ]</span>
				<svg
					class="head-line"
					viewBox="0 0 400 30"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path d="M0 29 H300 L330 1 H400" />
				</svg>
			</div>

			<div class="head-right">
				<span
					class="slashes"
					aria-hidden="true"
				>
					<span></span><span></span><span></span>
				</span>

				<div class="head-id">
					<span class="src">PRJ</span>
					<h1>PROJECTS-{pad(selected === null ? items.length : selected + 1)}</h1>
				</div>

				<svg
					class="head-arrow"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M19 5 L5 19 M5 8 V19 H16" />
				</svg>
			</div>
		</header>

		<!-- =================================================
		     BODY
		     ================================================= -->

		<div class="console-body">
			<!-- TABS -->
			<nav
				class="tabs"
				aria-label="Projects"
			>
				{#each items as entry, n}
					<div
						class="tab-row"
						style="--n: {n};"
					>
						<div class="tab-wrap">
							<button
								type="button"
								class="tab"
								class:active={selected === n}
								aria-pressed={selected === n}
								bind:this={tabEls[n]}
								onclick={() => (selected = n)}
								onkeydown={(e) => onTabKey(e, n)}
							>
								<span class="tab-name">{entry.name}</span>
								<svg
									class="chev"
									viewBox="0 0 10 16"
									aria-hidden="true"
								>
									<path d="M2 2 L8 8 L2 14" />
								</svg>
							</button>

							<div
								class="tab-under"
								aria-hidden="true"
							>
								<span class="under-fill"></span>
								<span class="tab-idx">{pad(n + 1, 3)}</span>
							</div>
						</div>

						<span
							class="hatch"
							aria-hidden="true"
						></span>
					</div>
				{/each}

				<div
					class="tab-row"
					style="--n: {items.length};"
				>
					<div class="tab-wrap">
						<a
							class="tab"
							href="/resume.pdf"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="tab-name">RESUME</span>
							<svg
								class="chev ext"
								viewBox="0 0 16 16"
								aria-hidden="true"
							>
								<path d="M4 12 L12 4 M6 4 H12 V10" />
							</svg>
						</a>

						<div
							class="tab-under"
							aria-hidden="true"
						>
							<span class="under-fill"></span>
							<span class="tab-idx">PDF</span>
						</div>
					</div>

					<span
						class="hatch"
						aria-hidden="true"
					></span>
				</div>
			</nav>

			<!-- DETAIL -->
			<section
				class="panel-area"
				aria-live="polite"
			>
				<div
					class="markers"
					aria-hidden="true"
				>
					{#each Array(12) as _}
						<span>+</span>
					{/each}
				</div>

				{#if item}
					{#key selected}
						<div class="detail">
							<div class="detail-top">
								<div class="load-bar">
									<span class="load-fill"></span>
								</div>
								<span class="detail-code">PRJ.{pad((selected ?? 0) + 1, 3)}</span>
							</div>

							<div class="box main">
								<span class="corner tl"></span>
								<span class="corner tr"></span>
								<span class="corner bl"></span>
								<span class="corner br"></span>

								<h2 class="box-title">{item.name} <span>// UNLOCKED</span></h2>

								{#if item.subtitle}
									<p class="subtitle">{item.subtitle}</p>
								{/if}

								{#if item.description}
									<p class="desc">{item.description}</p>
								{/if}

								{#if item.points?.length}
									<ul>
										{#each item.points as point}
											<li><span>&gt;</span> {point}</li>
										{/each}
									</ul>
								{/if}
							</div>

							<div
								class="box signal"
								aria-hidden="true"
							>
								<span class="corner tl"></span>
								<span class="corner tr"></span>
								<span class="corner bl"></span>
								<span class="corner br"></span>

								<span class="sig s1"></span>
								<span class="sig s2"></span>
								<span class="sig s3"></span>
							</div>

							{#if item.tags?.length}
								<div class="box data">
									<span class="corner tl"></span>
									<span class="corner tr"></span>
									<span class="corner bl"></span>
									<span class="corner br"></span>

									<div class="data-head">TAGS</div>

									<div class="tags">
										{#each item.tags as tag}
											<span>{tag}</span>
										{/each}
									</div>
								</div>
							{/if}

							{#if item.images?.length}
								<div class="gallery">
									{#each item.images as src, k}
										<div class="thumb">
											<HudFrame
												label={`IMG_${pad(k + 1, 2)}`}
												cut={12}
											>
												<img
													{src}
													alt=""
													loading="lazy"
												/>
											</HudFrame>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/key}
				{:else}
					<div class="idle">
						<svg
							class="idle-target"
							viewBox="0 0 100 100"
							aria-hidden="true"
						>
							<circle cx="50" cy="50" r="30" />
							<circle cx="50" cy="50" r="14" />
							<path d="M50 6 V30 M50 70 V94 M6 50 H30 M70 50 H94" />
						</svg>
						<p>SELECT A PROJECT<span class="blink">_</span></p>
						<span class="idle-sub">[ AWAITING INPUT ]</span>
					</div>
				{/if}
			</section>
		</div>

		<!-- =================================================
		     FOOTER
		     ================================================= -->

		<footer
			class="console-foot"
			aria-hidden="true"
		>
			<span class="count">{pad(selected === null ? 0 : selected + 1)}/{pad(items.length)}</span>
			<span class="count-bar">
				<span style="width: {selected === null ? 0 : ((selected + 1) / items.length) * 100}%;"></span>
			</span>
		</footer>
	</div>
</div>

<style>
	.projects-page {
		--pink: #ff0000;
		--pink-bright: #ff4f4f;
		--pink-soft: rgba(255, 0, 0, 0.5);
		--light: #ffe1e1;

		min-height: 100vh;
		box-sizing: border-box;

		/* room for the site border + signature */
		padding: 118px 0 70px;

		display: grid;
		place-items: start center;

		background: #000;
		color: var(--light);

		font-family: var(--font-mono);
	}

	.console {
		width: min(1200px, 86vw);
		height: max(520px, calc(100vh - 190px));

		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 18px;
	}

	/* =====================================================
	   HEADER
	   ===================================================== */

	.console-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
	}

	.head-left {
		position: relative;
		flex: 1;
		max-width: 420px;
	}

	.range {
		display: block;
		margin: 0 0 4px auto;
		width: max-content;

		font-size: 0.62rem;
		letter-spacing: 0.16em;
		color: rgba(255, 225, 225, 0.7);
	}

	.head-line {
		display: block;
		width: 100%;
		height: 24px;
	}

	.head-line path {
		fill: none;
		stroke: var(--pink-soft);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.head-right {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.slashes {
		display: flex;
		gap: 6px;
	}

	.slashes span {
		width: 6px;
		height: 22px;

		background: var(--pink-soft);
		transform: skewX(-30deg);
	}

	.slashes span:nth-child(1) {
		opacity: 0.4;
	}

	.head-id {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}

	.src {
		padding: 1px 8px;

		background: rgba(255, 0, 0, 0.25);
		border: 1px solid var(--pink-soft);

		font-size: 0.55rem;
		letter-spacing: 0.16em;
	}

	.head-id h1 {
		margin: 0;

		font-size: clamp(1.3rem, 2.2vw, 2rem);
		font-weight: 700;
		letter-spacing: 0.1em;

		color: var(--light);
		text-shadow: 0 0 14px rgba(255, 0, 0, 0.5);
	}

	.head-arrow {
		width: 30px;
		height: 30px;
	}

	.head-arrow path {
		fill: none;
		stroke: var(--light);
		stroke-width: 2.5;
	}

	/* =====================================================
	   BODY
	   ===================================================== */

	.console-body {
		display: grid;
		grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
		gap: clamp(24px, 3vw, 44px);

		min-height: 0;
	}

	/* ---------- tabs ---------- */

	.tabs {
		display: flex;
		flex-direction: column;
		gap: 14px;

		min-height: 0;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.tab-row {
		display: grid;
		grid-template-columns: 1fr 26px;
		gap: 14px;
		align-items: start;

		opacity: 0;
		animation: slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(0.1s + var(--n) * 0.07s) forwards;
	}

	.tab {
		position: relative;

		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 14px;

		width: 100%;
		height: clamp(40px, 6.2vh, 54px);
		padding: 0 18px;
		box-sizing: border-box;

		background: rgba(255, 0, 0, 0.04);
		border: 1px solid var(--pink-soft);

		clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);

		color: var(--light);
		font: inherit;
		text-decoration: none;

		cursor: pointer;

		transition:
			background 280ms ease,
			color 280ms ease,
			border-color 280ms ease;
	}

	/* chamfer edges, since clip-path cuts the border */
	.tab::before,
	.tab::after {
		content: '';
		position: absolute;

		width: 20px;
		height: 1px;

		background: var(--pink-soft);
		transform: rotate(-45deg);
	}

	.tab::before {
		left: -3px;
		top: 6px;
	}

	.tab::after {
		right: -3px;
		bottom: 6px;
	}

	.tab-name {
		font-size: clamp(0.85rem, 1.25vw, 1.15rem);
		font-weight: 700;
		letter-spacing: 0.14em;

		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.chev {
		width: 10px;
		height: 16px;
		flex: none;

		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.chev.ext {
		width: 14px;
		height: 14px;
	}

	.chev path {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.4;
	}

	.tab:hover,
	.tab:focus-visible {
		background: rgba(255, 0, 0, 0.14);
		border-color: var(--pink);
		outline: none;
	}

	.tab:hover .chev,
	.tab:focus-visible .chev {
		transform: translateX(3px);
	}

	.tab:hover .tab-name,
	.tab:focus-visible .tab-name {
		transform: translateX(-3px);
	}

	.tab.active {
		background: var(--light);
		border-color: var(--light);
		color: #120303;

		box-shadow: 0 0 18px rgba(255, 0, 0, 0.45);
	}

	.tab.active::before,
	.tab.active::after {
		background: var(--light);
	}

	.tab-under {
		position: relative;

		display: flex;
		align-items: center;
		justify-content: space-between;

		margin-top: 5px;
		padding-left: 2px;
	}

	.under-fill {
		width: 26%;
		height: 2px;

		background: rgba(255, 225, 225, 0.4);

		transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1), background 280ms ease;
	}

	.tab-wrap:has(.tab:hover) .under-fill,
	.tab-wrap:has(.tab.active) .under-fill {
		width: 78%;
		background: var(--pink);
	}

	.tab-idx {
		padding-bottom: 1px;
		border-bottom: 2px solid rgba(255, 225, 225, 0.6);

		font-size: 0.5rem;
		letter-spacing: 0.14em;
		color: rgba(255, 225, 225, 0.55);
	}

	.hatch {
		height: clamp(40px, 6.2vh, 54px);

		background:
			repeating-linear-gradient(
				-45deg,
				rgba(255, 0, 0, 0.55) 0 4px,
				transparent 4px 9px
			);

		opacity: 0.6;
		transition: opacity 280ms ease;
	}

	.tab-row:has(.tab.active) .hatch,
	.tab-row:has(.tab:hover) .hatch {
		opacity: 1;
	}

	/* ---------- panel area ---------- */

	.panel-area {
		position: relative;
		min-height: 0;

		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--pink) transparent;
	}

	.markers {
		position: absolute;
		inset: 0;

		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		place-items: center;

		pointer-events: none;
	}

	.markers span {
		font-size: 14px;
		color: rgba(255, 0, 0, 0.35);
	}

	.idle {
		position: absolute;
		inset: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.idle-target {
		width: 90px;
		height: 90px;

		animation: spin 12s linear infinite;
	}

	.idle-target circle,
	.idle-target path {
		fill: none;
		stroke: rgba(255, 0, 0, 0.5);
		stroke-width: 1;
	}

	.idle p {
		margin: 0;

		font-size: 0.85rem;
		letter-spacing: 0.24em;
		color: var(--light);
	}

	.blink {
		color: var(--pink);
		animation: blink 1s steps(2, start) infinite;
	}

	.idle-sub {
		font-size: 0.55rem;
		letter-spacing: 0.2em;
		color: rgba(255, 225, 225, 0.45);
	}

	/* ---------- detail ---------- */

	.detail {
		position: relative;
		z-index: 1;

		display: flex;
		flex-direction: column;
		gap: 16px;

		padding: 4px 10px 12px 4px;
	}

	.detail > * {
		opacity: 0;
		animation: reveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.detail > :nth-child(1) { animation-delay: 0s; }
	.detail > :nth-child(2) { animation-delay: 0.08s; }
	.detail > :nth-child(3) { animation-delay: 0.16s; }
	.detail > :nth-child(4) { animation-delay: 0.24s; }
	.detail > :nth-child(5) { animation-delay: 0.32s; }

	.detail-top {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.load-bar {
		flex: 1;
		height: 8px;

		border: 1px solid rgba(255, 225, 225, 0.35);
		padding: 1px;
	}

	.load-fill {
		display: block;
		height: 100%;
		width: 0;

		background: linear-gradient(90deg, var(--pink), var(--pink-bright));
		box-shadow: 0 0 8px rgba(255, 0, 0, 0.6);

		animation: load 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
	}

	.detail-code {
		font-size: 0.65rem;
		letter-spacing: 0.14em;
		color: var(--pink-bright);
	}

	.box {
		position: relative;

		padding: 16px 18px;

		border: 1px solid rgba(255, 225, 225, 0.18);
		background: rgba(30, 6, 6, 0.55);
	}

	/* faint offset echo, like the reference */
	.box.main::before {
		content: '';
		position: absolute;
		inset: 10px -10px -10px 10px;

		border: 1px solid rgba(255, 0, 0, 0.12);
		pointer-events: none;
		z-index: -1;
	}

	.corner {
		position: absolute;

		width: 12px;
		height: 12px;

		border-color: var(--light);
		border-style: solid;
		border-width: 0;
	}

	.corner::after {
		content: '+';
		position: absolute;

		font-size: 10px;
		line-height: 1;
		color: var(--pink-bright);
	}

	.corner.tl { left: -5px; top: -5px; border-left-width: 2px; border-top-width: 2px; }
	.corner.tr { right: -5px; top: -5px; border-right-width: 2px; border-top-width: 2px; }
	.corner.bl { left: -5px; bottom: -5px; border-left-width: 2px; border-bottom-width: 2px; }
	.corner.br { right: -5px; bottom: -5px; border-right-width: 2px; border-bottom-width: 2px; }

	.corner.tl::after { left: 8px; top: 6px; }
	.corner.tr::after { right: 8px; top: 6px; }
	.corner.bl::after { left: 8px; bottom: 6px; }
	.corner.br::after { right: 8px; bottom: 6px; }

	.box-title {
		margin: 0 0 6px;

		font-size: clamp(0.95rem, 1.3vw, 1.2rem);
		font-weight: 700;
		letter-spacing: 0.14em;

		color: var(--pink-bright);
	}

	.box-title span {
		font-size: 0.7em;
		color: rgba(255, 225, 225, 0.5);
	}

	.subtitle {
		margin: 0 0 12px;

		font-size: 0.6rem;
		letter-spacing: 0.14em;
		color: rgba(255, 225, 225, 0.6);
	}

	.desc {
		margin: 0 0 10px;

		font-size: 0.8rem;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.main ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.main li {
		margin-bottom: 6px;

		font-size: 0.74rem;
		line-height: 1.5;
		text-transform: uppercase;

		color: rgba(255, 225, 225, 0.85);
	}

	.main li span {
		color: var(--pink);
	}

	.signal {
		display: flex;
		flex-direction: column;
		gap: 7px;

		padding: 14px 18px;
	}

	.sig {
		display: block;
		height: 6px;

		background:
			linear-gradient(90deg, rgba(255, 225, 225, 0.05), var(--light) 70%, var(--pink-bright));
		box-shadow: 0 0 6px rgba(255, 0, 0, 0.4);

		transform-origin: left center;
		animation: sig 3.2s ease-in-out infinite alternate;
	}

	.s1 { width: 92%; }
	.s2 { width: 64%; animation-delay: -1.1s; }
	.s3 { width: 80%; animation-delay: -2.2s; }

	.data-head {
		margin: -6px -8px 12px;
		padding: 4px 10px;

		background: rgba(255, 0, 0, 0.18);
		border-left: 3px solid var(--pink);

		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: var(--pink-bright);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tags span {
		padding: 4px 10px;

		border: 1px solid rgba(255, 0, 0, 0.5);
		background: rgba(255, 0, 0, 0.06);

		font-size: 0.58rem;
		letter-spacing: 0.12em;
		color: var(--light);
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 22px;

		padding: 10px 8px 6px;
	}

	.thumb {
		aspect-ratio: 4 / 5;
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* ---------- footer ---------- */

	.console-foot {
		display: flex;
		flex-direction: column;
		gap: 6px;

		width: 200px;
	}

	.count {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		font-variant-numeric: tabular-nums;
	}

	.count-bar {
		height: 6px;
		background: rgba(255, 225, 225, 0.15);
	}

	.count-bar span {
		display: block;
		height: 100%;

		background: var(--pink);
		box-shadow: 0 0 8px rgba(255, 0, 0, 0.6);

		transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* =====================================================
	   ANIMATIONS
	   ===================================================== */

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(-14px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateX(-10px);
			clip-path: inset(0 100% 0 0);
		}

		to {
			opacity: 1;
			transform: none;
			clip-path: inset(-20px -20px -20px -20px);
		}
	}

	@keyframes load {
		to { width: 72%; }
	}

	@keyframes sig {
		from { transform: scaleX(0.55); }
		to { transform: scaleX(1); }
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes blink {
		to { visibility: hidden; }
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 820px) {
		.console {
			height: auto;
		}

		.console-body {
			grid-template-columns: 1fr;
		}

		.panel-area {
			min-height: 360px;
			overflow: visible;
		}

		.head-left {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab-row,
		.detail > * {
			animation: none;
			opacity: 1;
		}

		.sig,
		.idle-target,
		.blink {
			animation: none;
		}

		.load-fill {
			animation: none;
			width: 72%;
		}
	}

	/* display font for headings and tabs */
	.tab-name,
	.head-id h1,
	.box-title,
	.count,
	.idle p {
		font-family: var(--font-display);
	}
</style>

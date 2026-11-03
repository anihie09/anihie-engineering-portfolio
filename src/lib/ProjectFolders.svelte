<script lang="ts">
	import { onMount } from 'svelte';
	import HudFrame from '$lib/HudFrame.svelte';
	import { projects, type Project } from '$lib/projects';

	/*
	 * Projects panel content.
	 * Shows a folder per project; clicking one opens that project's page.
	 * The address follows along (/#projects/<slug>) so a project can be
	 * linked to directly, and the back button returns to the folders.
	 */

	let openSlug = $state<string | null>(null);
	const open = $derived<Project | null>(projects.find((p) => p.slug === openSlug) ?? null);

	const isEmpty = (p: Project) =>
		!p.subtitle && !p.summary && !p.details?.length && !p.sections?.length && !p.images?.length;

	const pad = (n: number) => String(n).padStart(2, '0');

	function readHash() {
		const m = location.hash.match(/^#projects\/(.+)$/);
		openSlug = m && projects.some((p) => p.slug === m[1]) ? m[1] : null;
	}

	function openProject(slug: string) {
		openSlug = slug;
		history.replaceState(history.state, '', `#projects/${slug}`);
	}

	function back() {
		openSlug = null;
		history.replaceState(history.state, '', '#projects');
	}

	onMount(() => {
		readHash();
		window.addEventListener('hashchange', readHash);
		return () => window.removeEventListener('hashchange', readHash);
	});
</script>

<div class="projects">
	{#key openSlug}
		{#if !open}
			<!-- ================= FOLDERS ================= -->
			<div class="view">
				<div class="bar">
					<span class="bar-tag">DIRECTORY</span>
					<span class="bar-rule"></span>
					<span class="bar-count">{pad(projects.length)} ITEMS</span>
				</div>

				<div class="folders">
					{#each projects as project, n}
						<button
							type="button"
							class="folder"
							style="--n: {n};"
							onclick={() => openProject(project.slug)}
						>
							<svg
								class="icon"
								viewBox="0 0 64 52"
								aria-hidden="true"
							>
								<defs>
									<linearGradient id="folder-edge-{n}" x1="0" y1="0" x2="1" y2="1">
										<stop offset="0" style="stop-color: var(--strawberry)" />
										<stop offset="0.5" style="stop-color: var(--petal-rouge)" />
										<stop offset="1" style="stop-color: var(--rose-punch)" />
									</linearGradient>
								</defs>

								<path
									class="flap-back"
									d="M2 8 Q2 4 6 4 H22 L27 9 H58 Q62 9 62 13 V46 Q62 50 58 50 H6 Q2 50 2 46 Z"
								/>
								<rect
									class="paper"
									x="8"
									y="12"
									width="48"
									height="18"
									rx="1"
								/>
								<path
									class="front"
									d="M2 19 Q2 16 5 16 H59 Q62 16 62 19 V46 Q62 50 58 50 H6 Q2 50 2 46 Z"
									stroke="url(#folder-edge-{n})"
								/>
							</svg>

							<span class="index">{pad(n + 1)}</span>
							<span class="name">{project.title}</span>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<!-- ================= PROJECT PAGE ================= -->
			<article class="view page">
				<div class="bar">
					<button
						type="button"
						class="back"
						onclick={back}
					>
						<span aria-hidden="true">←</span> ALL PROJECTS
					</button>
					<span class="bar-rule"></span>
					<span class="bar-count">PRJ.{pad(projects.indexOf(open) + 1)}</span>
				</div>

				<header class="page-head">
					<h2>{open.title}</h2>
					{#if open.subtitle}
						<p class="subtitle">{open.subtitle}</p>
					{/if}
				</header>

				{#if isEmpty(open)}
					<div class="soon">
						<p>MATERIAL COMING SOON<span class="blink">_</span></p>
						<span>Add this project's content in src/lib/projects.ts</span>
					</div>
				{:else}
					{#if open.summary}
						<p class="summary">{open.summary}</p>
					{/if}

					{#if open.details?.length}
						<dl class="details">
							{#each open.details as d}
								<div>
									<dt>{d.label}</dt>
									<dd>{d.value}</dd>
								</div>
							{/each}
						</dl>
					{/if}

					{#each open.sections ?? [] as section}
						<section class="section">
							<h3>{section.heading}</h3>
							<p>{section.body}</p>
						</section>
					{/each}

					{#if open.images?.length}
						<div class="gallery">
							{#each open.images as src, k}
								<div class="thumb">
									<HudFrame
										label={`IMG_${pad(k + 1)}`}
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
				{/if}
			</article>
		{/if}
	{/key}
</div>

<style>
	.projects {
		padding: 22px clamp(18px, 2.6vw, 34px) 34px;
	}

	.view {
		animation: view-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	/* ---------- top bar ---------- */

	.bar {
		display: flex;
		align-items: center;
		gap: 14px;

		margin-bottom: 26px;

		font-size: 0.62rem;
		letter-spacing: 0.16em;
	}

	.bar-tag {
		padding: 4px 10px;

		border-left: 3px solid var(--petal-rouge);
		background: rgba(255, 255, 255, 0.08);

		font-weight: 700;
	}

	.bar-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.35), transparent);
	}

	.bar-count {
		color: var(--hot-red);
		font-variant-numeric: tabular-nums;
	}

	.back {
		padding: 6px 12px;

		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.35);

		color: #f4f4f4;
		font: inherit;
		font-weight: 700;
		letter-spacing: 0.16em;

		cursor: pointer;

		transition: border-color 250ms ease, color 250ms ease, background 250ms ease;
	}

	.back:hover,
	.back:focus-visible {
		border-color: var(--petal-rouge);
		color: var(--hot-red);
		background: rgba(255, 255, 255, 0.06);
		outline: none;
	}

	/* ---------- folders ---------- */

	.folders {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 22px;
	}

	.folder {
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;

		padding: 26px 16px 22px;

		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.16);

		color: #f4f4f4;
		font: inherit;
		text-align: center;

		cursor: pointer;

		opacity: 0;
		animation: view-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(0.08s + var(--n) * 0.07s) forwards;

		transition:
			border-color 300ms ease,
			background 300ms ease,
			transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* gradient accent line along the bottom, grows on hover */
	.folder::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;

		height: 2px;

		background: var(--accent-grad);

		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.folder:hover,
	.folder:focus-visible {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-3px);
		outline: none;
	}

	.folder:hover::after,
	.folder:focus-visible::after {
		transform: scaleX(1);
	}

	.icon {
		width: 76px;
		height: 62px;
		overflow: visible;

		filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5));
		transition: filter 300ms ease;
	}

	.folder:hover .icon,
	.folder:focus-visible .icon {
		filter:
			drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5))
			drop-shadow(0 0 10px rgba(255, 45, 149, 0.45));
	}

	.icon .flap-back {
		fill: rgba(255, 255, 255, 0.14);
		stroke: rgba(255, 255, 255, 0.5);
		stroke-width: 1;
	}

	.icon .paper {
		fill: #ffffff;
		opacity: 0.85;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.icon .front {
		fill: rgba(255, 255, 255, 0.22);
		stroke-width: 1.6;

		transform-origin: 32px 50px;
		transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* the folder flap tips open on hover */
	.folder:hover .icon .front,
	.folder:focus-visible .icon .front {
		transform: skewX(-8deg) scaleY(0.9);
	}

	.folder:hover .icon .paper,
	.folder:focus-visible .icon .paper {
		transform: translateY(-4px);
	}

	.index {
		font-size: 0.55rem;
		letter-spacing: 0.18em;
		color: var(--hot-red);
	}

	.name {
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1.35;
		text-transform: uppercase;

		transition: color 300ms ease;
	}

	.folder:hover .name,
	.folder:focus-visible .name {
		background: var(--accent-grad);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	/* ---------- project page ---------- */

	.page-head {
		padding-bottom: 16px;
		margin-bottom: 22px;

		border-bottom: 1px solid rgba(255, 255, 255, 0.16);
		border-image: var(--accent-grad) 1;
		border-image-slice: 0 0 1 0;
	}

	.page-head h2 {
		margin: 0;

		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.4vw, 2.1rem);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;

		color: #ffffff;
		text-shadow: 0 0 14px rgba(255, 255, 255, 0.25);
	}

	.subtitle {
		margin: 8px 0 0;

		font-size: 0.7rem;
		letter-spacing: 0.16em;
		color: rgba(255, 255, 255, 0.6);
	}

	.summary {
		margin: 0 0 22px;

		font-size: clamp(0.8rem, 0.95vw, 0.92rem);
		line-height: 1.85;
		color: rgba(255, 255, 255, 0.9);
	}

	.details {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;

		margin: 0 0 24px;
	}

	.details div {
		padding: 10px 12px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.04);
	}

	.details dt {
		font-size: 0.55rem;
		letter-spacing: 0.16em;
		color: var(--hot-red);
	}

	.details dd {
		margin: 4px 0 0;
		font-size: 0.8rem;
	}

	.section {
		margin-bottom: 22px;
	}

	.section h3 {
		margin: 0 0 8px;

		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.section p {
		margin: 0;

		font-size: 0.82rem;
		line-height: 1.8;
		white-space: pre-line;
		color: rgba(255, 255, 255, 0.88);
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 24px;

		margin-top: 10px;
		padding-top: 10px;
	}

	.thumb {
		aspect-ratio: 4 / 3;
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.soon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;

		padding: 70px 20px;

		border: 1px dashed rgba(255, 255, 255, 0.22);
		text-align: center;
	}

	.soon p {
		margin: 0;

		font-family: var(--font-display);
		font-size: 0.9rem;
		letter-spacing: 0.22em;
	}

	.soon > span {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
	}

	.blink {
		color: var(--hot-red);
		animation: blink 1s steps(2, start) infinite;
	}

	@keyframes view-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes blink {
		to { visibility: hidden; }
	}

	@media (prefers-reduced-motion: reduce) {
		.view,
		.folder {
			animation: none;
			opacity: 1;
		}
	}
</style>

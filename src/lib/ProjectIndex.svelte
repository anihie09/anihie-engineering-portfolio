<script lang="ts">
	import { onMount } from 'svelte';
	import HudFrame from '$lib/HudFrame.svelte';
	import { projects, type Project } from '$lib/projects';

	/*
	 * Projects panel: index + preview.
	 * Left: a numbered list of projects. Hovering / focusing one shows its
	 * preview on the right (cover, tagline, role, year, tags).
	 * Clicking a project (or "Open project") shows its full page.
	 * The address follows along (/#projects/<slug>) so a project page can
	 * be linked to directly.
	 */

	let selected = $state(0);
	let openSlug = $state<string | null>(null);

	const open = $derived<Project | null>(projects.find((p) => p.slug === openSlug) ?? null);
	const current = $derived(projects[selected]);

	const isEmpty = (p: Project) =>
		!p.subtitle && !p.summary && !p.details?.length && !p.sections?.length && !p.images?.length;

	const pad = (n: number) => String(n).padStart(2, '0');

	// initials for the placeholder cover, e.g. "Underwater Manta Ray Drone" -> "UM"
	const initials = (t: string) =>
		t
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();

	let itemEls: HTMLButtonElement[] = $state([]);

	function readHash() {
		const m = location.hash.match(/^#projects\/(.+)$/);
		const i = m ? projects.findIndex((p) => p.slug === m[1]) : -1;
		openSlug = i >= 0 ? projects[i].slug : null;
		if (i >= 0) selected = i;
	}

	function openProject(i: number) {
		selected = i;
		openSlug = projects[i].slug;
		history.replaceState(history.state, '', `#projects/${projects[i].slug}`);
	}

	function back() {
		openSlug = null;
		history.replaceState(history.state, '', '#projects');
		// put focus back on the project you came from
		requestAnimationFrame(() => itemEls[selected]?.focus());
	}

	/* arrow keys move through the list */
	function onListKey(e: KeyboardEvent, i: number) {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + projects.length) % projects.length;
		selected = next;
		itemEls[next]?.focus();
	}

	onMount(() => {
		readHash();
		window.addEventListener('hashchange', readHash);
		return () => window.removeEventListener('hashchange', readHash);
	});
</script>

<div class="projects">
	{#if !open}
		<!-- ================= INDEX + PREVIEW ================= -->
		<div class="view">
			<div class="bar">
				<span class="bar-tag">INDEX</span>
				<span class="bar-rule"></span>
				<span class="bar-count">{pad(projects.length)} PROJECTS</span>
			</div>

			<div class="index">
				<!-- list -->
				<ol
					class="list"
					aria-label="Projects"
				>
					{#each projects as project, i}
						<li style="--n: {i};">
							<button
								type="button"
								class="item"
								class:active={selected === i}
								aria-current={selected === i ? 'true' : undefined}
								bind:this={itemEls[i]}
								onpointerenter={() => (selected = i)}
								onfocus={() => (selected = i)}
								onclick={() => openProject(i)}
								onkeydown={(e) => onListKey(e, i)}
							>
								<span class="item-index">{pad(i + 1)}</span>
								<span class="item-text">
									<span class="item-title">{project.title}</span>
									<span class="item-meta">
										{[project.year, project.role].filter(Boolean).join(' · ') || 'DETAILS TO COME'}
									</span>
								</span>
								<span
									class="item-arrow"
									aria-hidden="true">›</span
								>
							</button>
						</li>
					{/each}
				</ol>

				<!-- preview -->
				<section
					class="preview"
					aria-live="polite"
				>
					{#key selected}
						<div class="preview-inner">
							<div class="cover">
								<HudFrame
									label={`PRJ_${pad(selected + 1)}`}
									code={current.year || 'COVER'}
									cut={18}
								>
									{#if current.cover}
										<img
											src={current.cover}
											alt={`${current.title} cover`}
										/>
									{:else}
										<div
											class="placeholder"
											aria-hidden="true"
										>
											<span class="ph-initials">{initials(current.title)}</span>
											<span class="ph-note">COVER IMAGE PENDING</span>
										</div>
									{/if}
								</HudFrame>
							</div>

							<div class="info">
								<h2 class="p-title">{current.title}</h2>

								{#if current.tagline}
									<p class="p-tagline">{current.tagline}</p>
								{/if}

								<dl class="p-meta">
									<div>
										<dt>ROLE</dt>
										<dd>{current.role || '—'}</dd>
									</div>
									<div>
										<dt>YEAR</dt>
										<dd>{current.year || '—'}</dd>
									</div>
								</dl>

								{#if current.tags?.length}
									<ul class="p-tags">
										{#each current.tags as tag}
											<li>{tag}</li>
										{/each}
									</ul>
								{/if}

								<button
									type="button"
									class="open-btn"
									onclick={() => openProject(selected)}
								>
									OPEN PROJECT <span aria-hidden="true">→</span>
								</button>
							</div>
						</div>
					{/key}
				</section>
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

	/* ---------- index layout ---------- */

	.index {
		display: grid;
		grid-template-columns: minmax(240px, 0.85fr) 1.6fr;
		gap: clamp(20px, 3vw, 40px);
		align-items: start;
	}

	/* ---------- list ---------- */

	.list {
		margin: 0;
		padding: 0;
		list-style: none;

		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.list li {
		opacity: 0;
		animation: slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(0.06s + var(--n) * 0.07s) forwards;
	}

	.item {
		--cut: 12px;

		position: relative;
		isolation: isolate;

		display: grid;
		grid-template-columns: 34px 1fr 14px;
		align-items: center;
		gap: 10px;

		width: 100%;
		padding: 14px 14px 14px 12px;

		background: rgba(255, 255, 255, 0.03);
		border: 0;

		color: #f4f4f4;
		font: inherit;
		text-align: left;

		cursor: pointer;

		clip-path: polygon(
			var(--cut) 0,
			100% 0,
			100% calc(100% - var(--cut)),
			calc(100% - var(--cut)) 100%,
			0 100%,
			0 var(--cut)
		);

		transition: background 300ms ease;
	}

	/* outline ring: faint white at rest, gradient when selected */
	.item::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;

		padding: 1.5px;
		background: rgba(255, 255, 255, 0.16);

		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;

		pointer-events: none;
	}

	.item.active {
		background: linear-gradient(
			100deg,
			rgba(232, 19, 47, 0.18),
			rgba(255, 42, 127, 0.1) 60%,
			rgba(255, 90, 42, 0.05)
		);
	}

	.item.active::before {
		background: var(--accent-grad);
	}

	.item:focus-visible {
		outline: none;
	}

	.item-index {
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		color: rgba(255, 255, 255, 0.45);
		transition: color 300ms ease;
	}

	.item.active .item-index {
		color: var(--hot-red);
		text-shadow: 0 0 8px var(--hot-red-glow);
	}

	.item-text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.item-title {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		line-height: 1.3;
		text-transform: uppercase;

		transition: color 300ms ease, text-shadow 300ms ease;
	}

	.item.active .item-title {
		color: var(--blush);
		text-shadow:
			0 0 6px rgba(255, 61, 138, 0.9),
			0 0 16px rgba(232, 19, 47, 0.5);
	}

	.item-meta {
		font-size: 0.55rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.45);
	}

	.item-arrow {
		font-size: 1.1rem;
		line-height: 1;
		color: rgba(255, 255, 255, 0.3);

		transition: color 300ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.item.active .item-arrow {
		color: var(--hot-red);
		transform: translateX(3px);
	}

	/* ---------- preview ---------- */

	.preview {
		min-width: 0;
	}

	.preview-inner {
		display: flex;
		flex-direction: column;
		gap: 16px;

		animation: preview-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.cover {
		/* capped by screen height so the info below stays in view */
		width: min(100%, calc(44vh * 1.6));
		aspect-ratio: 16 / 10;
	}

	.cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* placeholder cover until a real image is added */
	.placeholder {
		position: absolute;
		inset: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;

		background:
			linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px) 0 0 / 28px 28px,
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px) 0 0 / 28px 28px,
			radial-gradient(ellipse at 30% 70%, rgba(232, 19, 47, 0.35), transparent 60%),
			radial-gradient(ellipse at 75% 25%, rgba(255, 42, 127, 0.28), transparent 55%),
			linear-gradient(160deg, #1a0510, #070205);
	}

	.ph-initials {
		font-family: var(--font-display);
		font-size: clamp(3rem, 7vw, 5.5rem);
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1;

		color: transparent;
		-webkit-text-stroke: 1.5px var(--blush);
		text-shadow: 0 0 22px rgba(255, 61, 138, 0.55);
	}

	.ph-note {
		font-size: 0.55rem;
		letter-spacing: 0.24em;
		color: rgba(255, 217, 230, 0.6);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.p-title {
		margin: 0;

		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2vw, 1.7rem);
		font-weight: 700;
		letter-spacing: 0.1em;
		line-height: 1.2;
		text-transform: uppercase;

		color: #ffffff;
	}

	.p-tagline {
		margin: 0;

		font-size: 0.82rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.85);
	}

	.p-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 28px;

		margin: 0;
		padding: 10px 0;

		border-top: 1px solid rgba(255, 255, 255, 0.14);
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
	}

	.p-meta dt {
		font-size: 0.55rem;
		letter-spacing: 0.18em;
		color: var(--hot-red);
	}

	.p-meta dd {
		margin: 4px 0 0;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
	}

	.p-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;

		margin: 0;
		padding: 0;
		list-style: none;
	}

	.p-tags li {
		padding: 4px 10px;

		border: 1px solid rgba(255, 61, 138, 0.5);
		background: rgba(255, 42, 127, 0.08);

		font-size: 0.58rem;
		letter-spacing: 0.12em;
	}

	/* "Open project": same neon glass hover as the rest of the site */
	.open-btn {
		--cut: 10px;

		position: relative;
		isolation: isolate;
		align-self: flex-start;

		padding: 10px 18px;

		background: rgba(255, 255, 255, 0.04);
		border: 0;

		color: #f4f4f4;
		font: inherit;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.2em;

		cursor: pointer;

		clip-path: polygon(
			var(--cut) 0,
			100% 0,
			100% calc(100% - var(--cut)),
			calc(100% - var(--cut)) 100%,
			0 100%,
			0 var(--cut)
		);

		transition: background 300ms ease, color 300ms ease, text-shadow 300ms ease;
	}

	.open-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;

		padding: 1.5px;
		background: var(--accent-grad);

		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;

		pointer-events: none;
	}

	.open-btn:hover,
	.open-btn:focus-visible {
		background: linear-gradient(100deg, rgba(232, 19, 47, 0.22), rgba(255, 42, 127, 0.14));
		color: var(--blush);
		text-shadow: 0 0 8px rgba(255, 61, 138, 0.9);
		outline: none;
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

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes preview-in {
		from {
			opacity: 0;
			transform: translateX(10px);
			filter: blur(3px);
		}

		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}

	@keyframes blink {
		to { visibility: hidden; }
	}

	@media (max-width: 760px) {
		.index {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.view,
		.list li,
		.preview-inner {
			animation: none;
			opacity: 1;
		}
	}
</style>

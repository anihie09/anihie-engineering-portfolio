<script lang="ts">
	import { onMount } from 'svelte';
	import HudFrame from '$lib/HudFrame.svelte';
	import { projects, type Media } from '$lib/projects';

	/*
	 * Projects panel: index + preview.
	 * Left: numbered list of projects. Hovering, focusing or clicking one
	 * shows it on the right: a media viewer (photos / video), a strip of
	 * thumbnails, then the description, highlights, role, year and tags.
	 * The address follows the selected project (/#projects/<slug>).
	 */

	let selected = $state(0);
	let mediaIndex = $state(0);
	let ytPlaying = $state(false);

	const current = $derived(projects[selected]);
	const media = $derived<Media[]>(current.media ?? []);
	const shown = $derived<Media | undefined>(media[mediaIndex]);

	const pad = (n: number) => String(n).padStart(2, '0');

	const initials = (t: string) =>
		t
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();

	const thumbOf = (m: Media) => (m.type === 'image' ? m.thumb : m.poster);

	let itemEls: HTMLButtonElement[] = $state([]);

	function select(i: number, updateHash = false) {
		if (i !== selected) {
			selected = i;
			mediaIndex = 0;
			ytPlaying = false;
		}
		if (updateHash) {
			history.replaceState(history.state, '', `#projects/${projects[i].slug}`);
		}
	}

	function showMedia(k: number) {
		mediaIndex = k;
		ytPlaying = false;
	}

	/* arrow keys move through the list */
	function onListKey(e: KeyboardEvent, i: number) {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + projects.length) % projects.length;
		select(next);
		itemEls[next]?.focus();
	}

	function readHash() {
		const m = location.hash.match(/^#projects\/(.+)$/);
		const i = m ? projects.findIndex((p) => p.slug === m[1]) : -1;
		if (i >= 0) select(i);
	}

	onMount(() => {
		readHash();
		window.addEventListener('hashchange', readHash);
		return () => window.removeEventListener('hashchange', readHash);
	});
</script>

<div class="projects">
	<div class="bar">
		<span class="bar-tag">INDEX</span>
		<span class="bar-rule"></span>
		<span class="bar-count">{pad(projects.length)} PROJECTS</span>
	</div>

	<div class="index">
		<!-- ================= LIST ================= -->
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
						aria-controls="project-preview"
						bind:this={itemEls[i]}
						onpointerenter={() => select(i)}
						onfocus={() => select(i)}
						onclick={() => select(i, true)}
						onkeydown={(e) => onListKey(e, i)}
					>
						<span class="item-index">{pad(i + 1)}</span>
						<span class="item-text">
							<span class="item-title">{project.title}</span>
							<span class="item-meta">
								{[project.year, project.role?.split(' · ')[0]].filter(Boolean).join(' · ') || 'DETAILS TO COME'}
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

		<!-- ================= PREVIEW ================= -->
		<section
			id="project-preview"
			class="preview"
			aria-live="polite"
			aria-label={current.title}
		>
			{#key selected}
				<div class="preview-inner">
					<!-- media viewer -->
					<div class="viewer">
						<HudFrame
							label={`PRJ_${pad(selected + 1)}`}
							code={media.length ? `${pad(mediaIndex + 1)} / ${pad(media.length)}` : 'MEDIA'}
							cut={18}
						>
							{#if !shown}
								<div
									class="placeholder"
									aria-hidden="true"
								>
									<span class="ph-initials">{initials(current.title)}</span>
									<span class="ph-note">MEDIA PENDING</span>
								</div>
							{:else if shown.type === 'image'}
								{#key shown.src}
									<div class="stage">
										<img
											class="stage-bg"
											src={shown.thumb}
											alt=""
											aria-hidden="true"
										/>
										<img
											class="stage-main"
											src={shown.src}
											alt={shown.alt}
										/>
									</div>
								{/key}
							{:else if shown.type === 'video'}
								{#key shown.src}
									<div class="stage">
										<img
											class="stage-bg"
											src={shown.poster}
											alt=""
											aria-hidden="true"
										/>
										<!-- muted autoplay preview; it has no sound -->
										<video
											class="stage-main"
											poster={shown.poster}
											autoplay
											muted
											loop
											playsinline
											aria-label={shown.alt}
										>
											<!-- WebM first where supported, MP4 everywhere else -->
											<source
												src={shown.src.replace(/\.mp4$/, '.webm')}
												type="video/webm"
											/>
											<source
												src={shown.src}
												type="video/mp4"
											/>
										</video>
									</div>
								{/key}
							{:else if shown.type === 'youtube'}
								<div class="stage">
									{#if ytPlaying}
										<iframe
											class="yt"
											src={`https://www.youtube-nocookie.com/embed/${shown.id}?autoplay=1&rel=0`}
											title={shown.alt}
											allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
											allowfullscreen
										></iframe>
									{:else}
										<button
											type="button"
											class="yt-poster"
											onclick={() => (ytPlaying = true)}
											aria-label={`Play ${shown.alt}`}
										>
											<img
												src={shown.poster}
												alt=""
											/>
											<span
												class="play"
												aria-hidden="true"
											>
												<svg viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z" /></svg>
											</span>
											<span class="yt-label">{shown.alt.toUpperCase()}</span>
										</button>
									{/if}
								</div>
							{/if}
						</HudFrame>
					</div>

					<!-- thumbnails -->
					{#if media.length > 1}
						<div
							class="thumbs"
							role="group"
							aria-label="Pictures"
						>
							{#each media as m, k}
								<button
									type="button"
									class="thumb"
									class:on={mediaIndex === k}
									aria-label={m.type === 'image' ? m.alt : `${m.alt} (video)`}
									aria-pressed={mediaIndex === k}
									onclick={() => showMedia(k)}
								>
									<img
										src={thumbOf(m)}
										alt=""
										loading="lazy"
									/>
									{#if m.type !== 'image'}
										<span
											class="thumb-play"
											aria-hidden="true">▶</span
										>
									{/if}
								</button>
							{/each}
						</div>
					{/if}

					<!-- info -->
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

						{#if current.description}
							<p class="p-desc">{current.description}</p>
						{/if}

						{#if current.highlights?.length}
							<ul class="p-highlights">
								{#each current.highlights as h}
									<li><span aria-hidden="true">&gt;</span> {h}</li>
								{/each}
							</ul>
						{/if}

						{#if current.tags?.length}
							<h3 class="p-label">SKILLS</h3>
							<ul class="p-tags">
								{#each current.tags as tag}
									<li>{tag}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			{/key}
		</section>
	</div>
</div>

<style>
	.projects {
		padding: 22px clamp(18px, 2.6vw, 34px) 34px;
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

	/* ---------- index layout ---------- */

	.index {
		display: grid;
		grid-template-columns: minmax(230px, 0.8fr) 1.7fr;
		gap: clamp(20px, 3vw, 40px);
		align-items: start;
	}

	/* the list stays in view while the preview scrolls */
	.list {
		position: sticky;
		top: 0;
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
		gap: 14px;

		animation: preview-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.viewer {
		width: min(100%, calc(46vh * 1.6));
		aspect-ratio: 16 / 10;
	}

	.stage {
		position: absolute;
		inset: 0;

		display: grid;
		place-items: center;

		background: #070205;
		overflow: hidden;

		animation: fade-in 0.35s ease both;
	}

	/* blurred copy fills the frame behind photos of any shape */
	.stage-bg {
		position: absolute;
		inset: -10%;

		width: 120%;
		height: 120%;
		object-fit: cover;

		filter: blur(18px) brightness(0.45) saturate(1.1);
	}

	/* the whole photo / video always fits, whatever its shape */
	.stage-main {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.yt,
	.yt-poster {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;

		border: 0;
	}

	.yt-poster {
		padding: 0;

		background: #000;
		cursor: pointer;
	}

	.yt-poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;

		filter: brightness(0.55);
		transition: filter 300ms ease;
	}

	.yt-poster:hover img,
	.yt-poster:focus-visible img {
		filter: brightness(0.7);
	}

	.yt-poster:focus-visible {
		outline: 2px solid var(--petal-rouge);
		outline-offset: -4px;
	}

	.play {
		position: absolute;
		left: 50%;
		top: 50%;

		display: grid;
		place-items: center;

		width: 68px;
		height: 68px;

		border-radius: 50%;
		background: rgba(232, 19, 47, 0.25);
		border: 1.5px solid var(--blush);
		box-shadow:
			0 0 18px rgba(255, 61, 138, 0.7),
			inset 0 0 14px rgba(255, 42, 127, 0.4);

		transform: translate(-50%, -50%);
		transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.yt-poster:hover .play,
	.yt-poster:focus-visible .play {
		transform: translate(-50%, -50%) scale(1.1);
	}

	.play svg {
		width: 26px;
		height: 26px;
		margin-left: 4px;
		fill: var(--blush);
	}

	.yt-label {
		position: absolute;
		left: 50%;
		top: calc(50% + 52px);

		transform: translateX(-50%);

		font-family: var(--font-display);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		white-space: nowrap;

		color: var(--blush);
		text-shadow: 0 0 8px rgba(255, 61, 138, 0.8);
	}

	/* placeholder until media is added */
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

	/* ---------- thumbnails ---------- */

	.thumbs {
		display: flex;
		gap: 8px;

		width: min(100%, calc(46vh * 1.6));
		padding-bottom: 4px;

		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
	}

	.thumb {
		position: relative;
		flex: none;

		width: 74px;
		height: 50px;
		padding: 0;

		background: #070205;
		border: 1.5px solid rgba(255, 255, 255, 0.18);

		cursor: pointer;
		overflow: hidden;

		transition: border-color 250ms ease, box-shadow 250ms ease;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;

		opacity: 0.6;
		transition: opacity 250ms ease;
	}

	.thumb:hover img,
	.thumb:focus-visible img,
	.thumb.on img {
		opacity: 1;
	}

	.thumb:hover,
	.thumb:focus-visible {
		border-color: rgba(255, 217, 230, 0.6);
		outline: none;
	}

	.thumb.on {
		border-color: var(--petal-rouge);
		box-shadow: 0 0 10px rgba(255, 42, 127, 0.55);
	}

	.thumb-play {
		position: absolute;
		left: 50%;
		top: 50%;

		transform: translate(-50%, -50%);

		font-size: 0.8rem;
		color: var(--blush);
		text-shadow: 0 0 6px rgba(255, 61, 138, 0.9);
	}

	/* ---------- info ---------- */

	.info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.p-title {
		margin: 4px 0 0;

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

		font-size: 0.8rem;
		letter-spacing: 0.04em;
		color: var(--blush);
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
		font-size: 0.76rem;
		letter-spacing: 0.04em;
	}

	.p-desc {
		margin: 0;

		font-size: clamp(0.76rem, 0.9vw, 0.86rem);
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.9);
	}

	.p-highlights {
		margin: 0;
		padding: 0;
		list-style: none;

		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.p-highlights li {
		font-size: 0.74rem;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.85);
	}

	.p-highlights span {
		color: var(--hot-red);
	}

	.p-label {
		margin: 6px 0 -4px;

		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.22em;

		color: var(--hot-red);
	}

	.p-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;

		margin: 4px 0 0;
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

	/* ---------- motion ---------- */

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

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@media (max-width: 760px) {
		.index {
			grid-template-columns: 1fr;
		}

		.list {
			position: static;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.projects,
		.list li,
		.preview-inner,
		.stage {
			animation: none;
			opacity: 1;
		}
	}
</style>

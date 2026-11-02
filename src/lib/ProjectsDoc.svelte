<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Shows your projects document inside the Projects panel.
	 * Put the file at static/projects.pdf (or change DOC_SRC).
	 */
	const DOC_SRC = '/projects.pdf';

	let status = $state<'checking' | 'ready' | 'missing'>('checking');

	onMount(async () => {
		try {
			const res = await fetch(DOC_SRC, { method: 'HEAD' });
			const type = res.headers.get('content-type') ?? '';
			status = res.ok && !type.includes('text/html') ? 'ready' : 'missing';
		} catch {
			status = 'missing';
		}
	});
</script>

<div class="doc">
	<div class="doc-bar">
		<span class="doc-name">PROJECTS.PDF</span>
		<span class="doc-rule"></span>

		{#if status === 'ready'}
			<a
				class="doc-open"
				href={DOC_SRC}
				target="_blank"
				rel="noopener noreferrer"
			>
				OPEN IN NEW TAB ↗
			</a>
		{/if}
	</div>

	<div class="doc-view">
		{#if status === 'ready'}
			<iframe
				src={`${DOC_SRC}#view=FitH`}
				title="Projects document"
			></iframe>
		{:else if status === 'missing'}
			<div class="doc-empty">
				<p>DOCUMENT NOT FOUND<span class="blink">_</span></p>
				<span>Add your file at static/projects.pdf</span>
			</div>
		{:else}
			<div class="doc-empty">
				<p>LOADING DOCUMENT<span class="blink">_</span></p>
			</div>
		{/if}
	</div>
</div>

<style>
	.doc {
		display: flex;
		flex-direction: column;
		gap: 12px;

		height: 100%;
		box-sizing: border-box;

		padding: 22px clamp(18px, 2.6vw, 34px) 30px;
	}

	.doc-bar {
		flex: none;

		display: flex;
		align-items: center;
		gap: 14px;

		font-size: 0.62rem;
		letter-spacing: 0.16em;
	}

	.doc-name {
		padding: 4px 10px;

		border-left: 3px solid var(--rose-punch);
		background: rgba(255, 255, 255, 0.08);

		font-weight: 700;
	}

	.doc-rule {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.2);
	}

	.doc-open {
		padding: 6px 12px;

		border: 1px solid rgba(255, 255, 255, 0.35);

		color: #f4f4f4;
		text-decoration: none;

		transition: border-color 250ms ease, color 250ms ease;
	}

	.doc-open:hover,
	.doc-open:focus-visible {
		border-color: var(--strawberry);
		color: var(--petal-rouge);
		outline: none;
	}

	.doc-view {
		position: relative;
		flex: 1;
		min-height: 420px;

		border: 1px solid rgba(255, 255, 255, 0.22);
		background: #0a0a0a;
	}

	iframe {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;

		border: 0;
	}

	.doc-empty {
		position: absolute;
		inset: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;

		text-align: center;
	}

	.doc-empty p {
		margin: 0;

		font-family: var(--font-display);
		font-size: 0.9rem;
		letter-spacing: 0.22em;
	}

	.doc-empty > span {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
	}

	.blink {
		color: var(--strawberry);
		animation: blink 1s steps(2, start) infinite;
	}

	@keyframes blink {
		to { visibility: hidden; }
	}
</style>

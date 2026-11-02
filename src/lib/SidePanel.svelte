<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut, cubicIn } from 'svelte/easing';

	/*
	 * Panel that slides in from the left over the home page.
	 * Closes with the × button, the Esc key, or a click on the dimmed area.
	 */
	let {
		open = false,
		title = '',
		index = '',
		width = '1100px',
		onclose,
		children
	}: {
		open?: boolean;
		title?: string;
		index?: string;
		width?: string;
		onclose?: () => void;
		children?: Snippet;
	} = $props();

	let closeBtn: HTMLButtonElement | null = $state(null);
	let returnFocus: HTMLElement | null = null;

	$effect(() => {
		if (open) {
			returnFocus = document.activeElement as HTMLElement | null;
			// wait for the panel to mount before focusing
			requestAnimationFrame(() => closeBtn?.focus());
		} else if (returnFocus) {
			returnFocus.focus?.();
			returnFocus = null;
		}
	});

	function onKey(e: KeyboardEvent) {
		if (open && e.key === 'Escape') onclose?.();
	}

	function slide(_node: Element, { out = false } = {}) {
		return {
			duration: out ? 420 : 620,
			easing: out ? cubicIn : cubicOut,
			css: (t: number) => `transform: translateX(${(1 - t) * -104}%); opacity: ${0.4 + t * 0.6};`
		};
	}

	function fade(_node: Element, { duration = 400 } = {}) {
		return {
			duration,
			css: (t: number) => `opacity: ${t};`
		};
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div
		class="backdrop"
		transition:fade
		onclick={onclose}
		role="presentation"
	></div>

	<div
		class="panel"
		style="--panel-w: {width};"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		in:slide
		out:slide={{ out: true }}
	>
		<header class="panel-head">
			<div class="panel-title">
				{#if index}<span class="panel-index">{index}</span>{/if}
				<span>{title}</span>
			</div>

			<span
				class="head-rule"
				aria-hidden="true"
			></span>

			<button
				type="button"
				class="close"
				aria-label="Close"
				bind:this={closeBtn}
				onclick={onclose}
			>
				<span aria-hidden="true"></span>
			</button>
		</header>

		<div class="panel-body">
			{@render children?.()}
		</div>

		<span
			class="edge-glow"
			aria-hidden="true"
		></span>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;

		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
	}

	.panel {
		position: fixed;
		left: 28px;
		top: 28px;
		bottom: 28px;
		z-index: 65;

		width: min(var(--panel-w), calc(100vw - 96px));

		display: flex;
		flex-direction: column;

		background:
			radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1.5px) 0 0 / 14px 14px,
			linear-gradient(160deg, rgba(20, 20, 20, 0.97), rgba(4, 4, 4, 0.98));

		border: 1px solid rgba(255, 255, 255, 0.28);

		clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%);

		box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);

		font-family: var(--font-mono);
		color: #f4f4f4;
	}

	.panel-head {
		flex: none;

		display: flex;
		align-items: center;
		gap: 16px;

		height: 92px;

		/* leaves room for the signature in the top-left corner */
		padding: 0 18px 0 clamp(130px, 13vw, 190px);

		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
	}

	.panel-title {
		display: flex;
		align-items: baseline;
		gap: 12px;

		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		white-space: nowrap;
	}

	.panel-index {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		color: var(--accent);
	}

	.head-rule {
		flex: 1;
		height: 1px;

		background: linear-gradient(90deg, rgba(255, 255, 255, 0.35), transparent);
	}

	.close {
		position: relative;

		width: 34px;
		height: 34px;

		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.35);

		cursor: pointer;

		transition: border-color 250ms ease, background 250ms ease;
	}

	.close span::before,
	.close span::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;

		width: 14px;
		height: 1.5px;

		background: #f4f4f4;
	}

	.close span::before { transform: translate(-50%, -50%) rotate(45deg); }
	.close span::after { transform: translate(-50%, -50%) rotate(-45deg); }

	.close:hover,
	.close:focus-visible {
		border-color: var(--accent);
		background: rgba(255, 255, 255, 0.08);
		outline: none;
	}

	.panel-body {
		position: relative;
		flex: 1;
		min-height: 0;

		overflow-y: auto;
		overscroll-behavior: contain;

		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
	}

	/* thin accent light running down the open edge */
	.edge-glow {
		position: absolute;
		right: 0;
		top: 0;

		width: 2px;
		height: 22%;

		background: linear-gradient(180deg, transparent, var(--accent), transparent);
		box-shadow: 0 0 10px var(--accent-glow);

		animation: edge-run 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}

	@keyframes edge-run {
		from { transform: translateY(-100%); }
		to { transform: translateY(560%); }
	}

	@media (max-width: 700px) {
		.panel {
			left: 10px;
			top: 10px;
			bottom: 10px;
			width: calc(100vw - 20px);
		}

		.panel-head {
			padding-left: 110px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.edge-glow {
			animation: none;
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	/*
	 * Retro desktop window frame (title bar with _ □ ×,
	 * bevelled chrome, inset content, scrollbar strip).
	 * Used for photos on /about and real windows on /projects.
	 * If the on* handlers are left out, the buttons are just decoration.
	 */
	let {
		title = '',
		active = true,
		maximized = false,
		scrollbar = true,
		onclose,
		onminimize,
		onmaximize,
		ontitlepointerdown,
		children
	}: {
		title?: string;
		active?: boolean;
		maximized?: boolean;
		scrollbar?: boolean;
		onclose?: () => void;
		onminimize?: () => void;
		onmaximize?: () => void;
		ontitlepointerdown?: (e: PointerEvent) => void;
		children?: Snippet;
	} = $props();

	const interactive = $derived(!!(onclose || onminimize || onmaximize));
</script>

<div
	class="window"
	class:inactive={!active}
>
	<div
		class="titlebar"
		class:draggable={!!ontitlepointerdown}
		onpointerdown={ontitlepointerdown}
		role="presentation"
	>
		<span class="title">{title}</span>

		<div class="controls">
			{#if interactive}
				<button
					type="button"
					aria-label="Minimize"
					onpointerdown={(e) => e.stopPropagation()}
					onclick={onminimize}
				>
					<span class="glyph min"></span>
				</button>
				<button
					type="button"
					aria-label={maximized ? 'Restore' : 'Maximize'}
					onpointerdown={(e) => e.stopPropagation()}
					onclick={onmaximize}
				>
					<span
						class="glyph max"
						class:restore={maximized}
					></span>
				</button>
				<button
					type="button"
					class="close"
					aria-label="Close"
					onpointerdown={(e) => e.stopPropagation()}
					onclick={onclose}
				>
					<span class="glyph x"></span>
				</button>
			{:else}
				<span class="btn" aria-hidden="true"><span class="glyph min"></span></span>
				<span class="btn" aria-hidden="true"><span class="glyph max"></span></span>
				<span class="btn" aria-hidden="true"><span class="glyph x"></span></span>
			{/if}
		</div>
	</div>

	<div class="body">
		{@render children?.()}
	</div>

	{#if scrollbar}
		<div
			class="scrollbar"
			aria-hidden="true"
		>
			<span class="arrow"></span>
			<span class="track"><span class="thumb"></span></span>
			<span class="arrow right"></span>
		</div>
	{/if}
</div>

<style>
	.window {
		--chrome-hi: #f2f2f6;
		--chrome: #c9c9d0;
		--chrome-lo: #7c7c86;
		--chrome-dark: #3a3a42;
		--pink: #ff0000;

		position: relative;

		display: flex;
		flex-direction: column;

		width: 100%;
		height: 100%;
		box-sizing: border-box;

		padding: 4px;

		background:
			linear-gradient(
				160deg,
				var(--chrome-hi) 0%,
				var(--chrome) 38%,
				#a9a9b2 100%
			);

		border: 1px solid;
		border-color: var(--chrome-hi) var(--chrome-dark) var(--chrome-dark) var(--chrome-hi);

		box-shadow:
			inset 1px 1px 0 #fff,
			inset -1px -1px 0 var(--chrome-lo),
			0 0 0 1px rgba(255, 0, 0, 0.35),
			0 10px 30px rgba(0, 0, 0, 0.6),
			0 0 22px rgba(255, 0, 0, 0.18);

		font-family: var(--font-mono);

		transition: box-shadow 300ms ease, filter 300ms ease;
	}

	.window.inactive {
		filter: saturate(0.6) brightness(0.85);
	}

	/* ---------- title bar ---------- */

	.titlebar {
		flex: none;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;

		height: 18px;
		padding: 0 2px 0 6px;
		margin-bottom: 4px;

		background:
			linear-gradient(
				90deg,
				#2a0000,
				#8a0000 55%,
				var(--pink)
			);

		user-select: none;
		touch-action: none;
	}

	.inactive .titlebar {
		background: linear-gradient(90deg, #4a4a52, #8c8c96);
	}

	.titlebar.draggable {
		cursor: grab;
	}

	.titlebar.draggable:active {
		cursor: grabbing;
	}

	.title {
		overflow: hidden;

		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		white-space: nowrap;
		text-overflow: ellipsis;

		color: #fff;
	}

	.controls {
		display: flex;
		gap: 2px;
		flex: none;
	}

	.controls button,
	.controls .btn {
		display: grid;
		place-items: center;

		width: 15px;
		height: 13px;
		padding: 0;

		background: var(--chrome);

		border: 1px solid;
		border-color: var(--chrome-hi) var(--chrome-dark) var(--chrome-dark) var(--chrome-hi);

		cursor: default;
	}

	.controls button {
		cursor: pointer;
		transition: background 150ms ease;
	}

	.controls button:hover {
		background: #ffd1d1;
	}

	.controls button.close:hover {
		background: var(--pink);
	}

	.controls button.close:hover .glyph.x::before,
	.controls button.close:hover .glyph.x::after {
		background: #fff;
	}

	.controls button:active {
		border-color: var(--chrome-dark) var(--chrome-hi) var(--chrome-hi) var(--chrome-dark);
	}

	.controls button:focus-visible {
		outline: 1px dotted #000;
		outline-offset: -3px;
	}

	.glyph {
		position: relative;
		display: block;
		width: 7px;
		height: 7px;
	}

	.glyph.min::before {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 6px;
		height: 2px;
		background: #000;
	}

	.glyph.max::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid #000;
		border-top-width: 2px;
	}

	.glyph.max.restore::before {
		inset: 2px 0 0 0;
	}

	.glyph.max.restore::after {
		content: '';
		position: absolute;
		inset: 0 0 2px 2px;
		border-top: 1px solid #000;
		border-right: 1px solid #000;
	}

	.glyph.x::before,
	.glyph.x::after {
		content: '';
		position: absolute;
		left: -1px;
		top: 3px;
		width: 9px;
		height: 1.5px;
		background: #000;
	}

	.glyph.x::before { transform: rotate(45deg); }
	.glyph.x::after { transform: rotate(-45deg); }

	/* ---------- content ---------- */

	.body {
		position: relative;
		flex: 1;
		min-height: 0;

		overflow: hidden;

		background: #050202;

		border: 1px solid;
		border-color: var(--chrome-lo) var(--chrome-hi) var(--chrome-hi) var(--chrome-lo);
		box-shadow: inset 1px 1px 0 var(--chrome-dark);
	}

	/* ---------- scrollbar strip ---------- */

	.scrollbar {
		flex: none;

		display: flex;
		gap: 2px;

		height: 11px;
		margin-top: 3px;
	}

	.scrollbar .arrow {
		width: 11px;

		background: var(--chrome);
		border: 1px solid;
		border-color: var(--chrome-hi) var(--chrome-dark) var(--chrome-dark) var(--chrome-hi);
	}

	.scrollbar .track {
		position: relative;
		flex: 1;

		background:
			repeating-linear-gradient(
				45deg,
				#b8b8c0 0 1px,
				#d6d6dc 1px 3px
			);
	}

	.scrollbar .thumb {
		position: absolute;
		left: 6%;
		top: 0;
		bottom: 0;

		width: 34%;

		background: var(--chrome);
		border: 1px solid;
		border-color: var(--chrome-hi) var(--chrome-dark) var(--chrome-dark) var(--chrome-hi);
	}
</style>

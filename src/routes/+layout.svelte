<script lang="ts">
	import { onMount } from 'svelte';
	import {
		onNavigate,
		afterNavigate
	} from '$app/navigation';
	import type { Snippet } from 'svelte';

	import CursorHUD from '$lib/CursorHUD.svelte';
	import LoadingScreen from '$lib/LoadingScreen.svelte';
	import CyberFrame from '$lib/CyberFrame.svelte';

	let { children }: { children: Snippet } = $props();

	let booting = $state(true);
	let bootExiting = $state(false);

	let transitioning = $state(false);
	let transitionLeaving = $state(false);

	let pendingPageTransition = false;

	/* =====================================================
	   INITIAL BOOT
	   ===================================================== */

	onMount(() => {
		const timer = window.setTimeout(() => {
			bootExiting = true;

			window.setTimeout(() => {
				booting = false;
				bootExiting = false;
			}, 950);
		}, 3000);

		return () => {
			window.clearTimeout(timer);
		};
	});

	/* =====================================================
	   PAGE TRANSITION
	   ===================================================== */

	onNavigate((navigation) => {
		if (!navigation.from) {
			return;
		}

		pendingPageTransition = true;
		transitioning = true;
		transitionLeaving = false;

		// wait until the loading screen has fully glitched in
		return new Promise<void>((resolve) => {
			window.setTimeout(resolve, 750);
		});
	});

	afterNavigate(() => {
		if (!pendingPageTransition) {
			return;
		}

		pendingPageTransition = false;

		window.setTimeout(() => {
			transitionLeaving = true;

			window.setTimeout(() => {
				transitioning = false;
				transitionLeaving = false;
			}, 950);
		}, 1000);
	});
</script>

<svelte:head>
	<meta
		name="theme-color"
		content="#000000"
	/>
</svelte:head>

<div class="site">

	<!-- =================================================
	     GLOBAL CURSOR
	     ================================================= -->

	<CursorHUD />

	<!-- =================================================
	     GLOBAL HOME BUTTON
	     ================================================= -->

	<a
		class="home-button"
		href="/"
		aria-label="Home"
		title="Home"
	>
		<span class="signature-layer signature-base">
			<img
				src="/signature.png"
				alt="Anihie"
			/>
		</span>
	</a>

	<!-- =================================================
	     PAGE CONTENT
	     ================================================= -->

	{@render children()}

	<!-- =================================================
	     GLOBAL CYBER FRAME
	     ================================================= -->

	<CyberFrame />

	<!-- =================================================
	     LOADING SCREEN (boot + page transitions)
	     ================================================= -->

	{#if booting || transitioning}
		<LoadingScreen
			instant={booting}
			leaving={bootExiting || transitionLeaving}
		/>
	{/if}
</div>

<style>
	/* =====================================================
	   COLORS / RESET
	   ===================================================== */

	:global(:root) {
		--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
		--font-display: 'Chakra Petch', 'JetBrains Mono', system-ui, sans-serif;

		--hud-pink: #ff0000;
		--hud-pink-soft: rgba(255, 0, 0, 0.55);
		--hud-pink-faint: rgba(255, 0, 0, 0.2);
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		min-width: 100%;
		min-height: 100%;
		background: #000;
		color: #fff;

		font-family: var(--font-mono);
	}

	:global(*) {
		box-sizing: border-box;
	}

	.site {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: #000;
	}

	/* =====================================================
	   HOME BUTTON
	   ===================================================== */

	/*
	 * signature.png is 818x198 but the signature itself only
	 * fills roughly x 104-407, y 4-163. The box is sized to that
	 * area and the image is offset so the empty padding sits
	 * outside it.
	 */
	.home-button {
		position: fixed;

		/* inside the frame's corner bracket, below the top circuit line */
		left: 62px;
		top: 58px;

		z-index: 1000;

		width: clamp(85px, 7.5vw, 120px);
		aspect-ratio: 303 / 159;

		display: block;

		cursor: pointer;
		text-decoration: none;
		pointer-events: auto;

		outline: none;
	}

	.signature-layer {
		position: absolute;
		inset: 0;

		display: block;
		pointer-events: none;
	}

	.signature-layer img {
		position: absolute;

		left: -34.3%;
		top: -2.5%;

		width: 270%;
		height: auto;

		max-width: none;
		display: block;

		filter:
			drop-shadow(0 0 3px rgba(255, 0, 0, 0.2));

		transition: filter 350ms ease;
	}

	/* =====================================================
	   HOME HOVER — just lights up
	   ===================================================== */

	.home-button:hover .signature-layer img,
	.home-button:focus-visible .signature-layer img {
		filter:
			brightness(1.35)
			drop-shadow(0 0 2px rgba(255, 120, 120, 0.95))
			drop-shadow(0 0 8px rgba(255, 0, 0, 0.75))
			drop-shadow(0 0 18px rgba(255, 0, 0, 0.4));
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 900px) {
		.home-button {
			left: 56px;
			top: 54px;
			width: 95px;
		}
	}

	@media (max-width: 650px) {
		.home-button {
			left: 40px;
			top: 42px;
			width: 72px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.signature-layer img {
			transition: none;
		}
	}
</style>

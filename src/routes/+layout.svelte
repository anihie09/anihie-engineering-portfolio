<script lang="ts">
	import { onMount } from 'svelte';
	import {
		onNavigate,
		afterNavigate
	} from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	import CursorHUD from '$lib/CursorHUD.svelte';
	import LoadingScreen from '$lib/LoadingScreen.svelte';
	import CyberFrame from '$lib/CyberFrame.svelte';
	import Signature from '$lib/Signature.svelte';

	let { children }: { children: Snippet } = $props();

	// the archive has its own loading screen, so it skips the regular one
	const isArchive = (path: string) => path === '/archive' || path.startsWith('/archive/');

	let booting = $state(!isArchive(page.url.pathname));
	let bootExiting = $state(false);

	let transitioning = $state(false);
	let transitionLeaving = $state(false);

	let pendingPageTransition = false;

	/* =====================================================
	   INITIAL BOOT
	   ===================================================== */

	onMount(() => {
		if (!booting) return;

		const timer = window.setTimeout(() => {
			bootExiting = true;

			window.setTimeout(() => {
				booting = false;
				bootExiting = false;
			}, 1500);
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

		// going to the archive: it plays its own loading screen
		if (navigation.to && isArchive(navigation.to.url.pathname)) {
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
			}, 1500);
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
		<Signature />
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

		/* theme: clean cyber white; red is only a tiny signal colour */
		--accent: #fde6ee;
		--accent-bright: #ffffff;
		--accent-soft: rgba(253, 230, 238, 0.45);
		--accent-glow: rgba(255, 205, 224, 0.55);
		--signal: #e8132f;

		/* accent palette, from K/DA FIRESTARTER (accents only) */
		--ember: #ff5a2a;        /* fire orange */
		--strawberry: #e8132f;   /* crimson red */
		--petal-rouge: #ff2a7f;  /* hot magenta-pink */
		--rose-punch: #c2187a;   /* deep magenta */
		--vintage-berry: #7a0a2c;
		--vintage-grape: #2b0716;
		--blush: #ffd9e6;        /* glowing title white */
		--accent-grad: linear-gradient(90deg, #ff5a2a 0%, #e8132f 32%, #ff2a7f 68%, #ff9cc2 100%);

		/* accented text: neon pink */
		--hot-red: #ff3d8a;
		--hot-red-glow: rgba(255, 61, 138, 0.55);

		--hud-pink: #f1f1f1;
		--hud-pink-soft: rgba(241, 241, 241, 0.55);
		--hud-pink-faint: rgba(241, 241, 241, 0.2);
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		min-width: 100%;
		min-height: 100%;
		background: #070205;
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
		background: #070205;
	}

	/* =====================================================
	   HOME BUTTON (ANI logotype, see $lib/Signature.svelte)
	   ===================================================== */

	.home-button {
		position: fixed;

		/* inside the frame's corner bracket, below the top circuit line */
		left: 52px;
		top: 46px;

		z-index: 1000;

		width: clamp(170px, 15vw, 230px);
		aspect-ratio: 340 / 150;

		display: block;

		color: inherit;
		text-decoration: none;
		pointer-events: auto;

		outline: none;
	}

	/* =====================================================
	   RESPONSIVE
	   ===================================================== */

	@media (max-width: 900px) {
		.home-button {
			left: 48px;
			top: 44px;
			width: 160px;
		}
	}

	@media (max-width: 650px) {
		.home-button {
			left: 30px;
			top: 30px;
			width: 124px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
	}
</style>

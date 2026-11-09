<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Clean cursor follower: one thin ring that eases after the pointer.
	 * Grows and turns accent-red over anything clickable,
	 * tightens on press, hides on touch screens.
	 */
	let ring: HTMLDivElement;

	onMount(() => {
		if (!window.matchMedia('(pointer: fine)').matches) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const ease = reduced ? 1 : 0.2;

		let tx = -100;
		let ty = -100;
		let x = tx;
		let y = ty;
		let raf = 0;

		const interactive = 'a, button, [role="button"], input, textarea, select, label';

		function onMove(e: PointerEvent) {
			tx = e.clientX;
			ty = e.clientY;
			ring.classList.add('visible');

			const target = e.target as Element | null;
			ring.classList.toggle('active', !!target?.closest?.(interactive));

			if (!raf) raf = requestAnimationFrame(tick);
		}

		function tick() {
			x += (tx - x) * ease;
			y += (ty - y) * ease;
			ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;

			if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
				raf = requestAnimationFrame(tick);
			} else {
				raf = 0;
			}
		}

		const onDown = () => ring.classList.add('pressed');
		const onUp = () => ring.classList.remove('pressed');
		const onLeave = () => ring.classList.remove('visible');

		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('pointerdown', onDown);
		window.addEventListener('pointerup', onUp);
		document.documentElement.addEventListener('pointerleave', onLeave);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointerup', onUp);
			document.documentElement.removeEventListener('pointerleave', onLeave);
		};
	});
</script>

<div
	class="cursor"
	bind:this={ring}
	aria-hidden="true"
>
	<span class="ring"></span>
</div>

<style>
	.cursor {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 20000;

		pointer-events: none;

		opacity: 0;
		transition: opacity 250ms ease;

		will-change: transform;
	}

	.cursor:global(.visible) {
		opacity: 1;
	}

	.ring {
		position: absolute;
		left: 0;
		top: 0;

		width: 30px;
		height: 30px;

		border: 1px solid rgba(255, 255, 255, 0.7);
		border-radius: 50%;

		transform: translate(-50%, -50%) scale(1);

		transition:
			transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 250ms ease,
			background 250ms ease;
	}

	.cursor:global(.active) .ring {
		transform: translate(-50%, -50%) scale(1.5);
		border-color: var(--petal-rouge);
		background: rgba(232, 19, 95, 0.08);
	}

	.cursor:global(.pressed) .ring {
		transform: translate(-50%, -50%) scale(0.8);
	}

	@media (pointer: coarse) {
		.cursor {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		alt?: string;

		/*
		 * Kept for compatibility with existing callers.
		 * The portrait is now rendered as a photograph rather
		 * than ASCII/halftone characters.
		 */
		characters?: string;
		color?: string;
		background?: string;
		cellSize?: number;

		cursorRadius?: number;
		zoom?: number;

		/*
		 * Kept for API compatibility.
		 */
		noiseInterval?: number;

		opacity?: number;
	}

	let {
		src,
		alt = '',
		characters = ' .:-=+*#%@',
		color = '#ff0080',
		background = '#000000',
		cellSize = 6,
		cursorRadius = 145,
		zoom = 1.045,
		noiseInterval = 100,
		opacity = 0.96
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	let image:
		HTMLImageElement | null = null;

	let ctx:
		CanvasRenderingContext2D | null = null;

	let width = 1;
	let height = 1;
	let dpr = 1;

	let animationFrame = 0;

	let targetX = 0;
	let targetY = 0;

	let mouseX = 0;
	let mouseY = 0;

	let pointerInitialized = false;
	let imageLoaded = false;

	/*
	 * Prevent compiler warnings while preserving the public
	 * component API used elsewhere in the project.
	 *
	 * These values are intentionally not used by the current
	 * photograph renderer.
	 */
	function keepCompatibilityProps() {
		return [
			characters,
			color,
			background,
			cellSize,
			noiseInterval
		];
	}

	/* =====================================================
	   RESIZE
	   ===================================================== */

	function resize() {
		if (
			!canvas ||
			!container
		) {
			return;
		}

		const rect =
			container.getBoundingClientRect();

		width =
			Math.max(
				rect.width,
				1
			);

		height =
			Math.max(
				rect.height,
				1
			);

		dpr =
			Math.min(
				window.devicePixelRatio ||
					1,
				2
			);

		canvas.width =
			Math.round(
				width *
				dpr
			);

		canvas.height =
			Math.round(
				height *
				dpr
			);

		ctx =
			canvas.getContext(
				'2d'
			);

		if (ctx) {
			ctx.setTransform(
				dpr,
				0,
				0,
				dpr,
				0,
				0
			);

			ctx.imageSmoothingEnabled =
				true;

			ctx.imageSmoothingQuality =
				'high';
		}
	}

	/* =====================================================
	   POINTER
	   ===================================================== */

	function handlePointerMove(
		event: PointerEvent
	) {
		const rect =
			container.getBoundingClientRect();

		targetX =
			event.clientX -
			rect.left;

		targetY =
			event.clientY -
			rect.top;

		if (
			!pointerInitialized
		) {
			mouseX =
				targetX;

			mouseY =
				targetY;

			pointerInitialized =
				true;
		}
	}

	function handlePointerLeave() {
		pointerInitialized =
			false;
	}

	/* =====================================================
	   IMAGE
	   ===================================================== */

	function loadImage() {
		image =
			new Image();

		image.decoding =
			'async';

		image.onload =
			() => {
				imageLoaded =
					true;

				resize();
			};

		image.onerror =
			() => {
				console.error(
					`Unable to load portrait image: ${src}`
				);
			};

		image.src =
			src;
	}

	/* =====================================================
	   COVER GEOMETRY
	   ===================================================== */

	function getCoverGeometry() {
		if (
			!image ||
			!image.naturalWidth ||
			!image.naturalHeight
		) {
			return null;
		}

		const imageAspect =
			image.naturalWidth /
			image.naturalHeight;

		const viewportAspect =
			width /
			height;

		let drawWidth =
			width;

		let drawHeight =
			height;

		if (
			imageAspect >
			viewportAspect
		) {
			drawHeight =
				height;

			drawWidth =
				height *
				imageAspect;
		} else {
			drawWidth =
				width;

			drawHeight =
				width /
				imageAspect;
		}

		return {
			drawWidth,
			drawHeight,

			offsetX:
				(
					width -
					drawWidth
				) /
				2,

			offsetY:
				(
					height -
					drawHeight
				) /
				2
		};
	}

	/* =====================================================
	   RENDER
	   ===================================================== */

	function render() {
		if (!ctx) {
			animationFrame =
				requestAnimationFrame(
					render
				);

			return;
		}

		/*
		 * Keep the compatibility props referenced through a
		 * function so Svelte does not complain about captured
		 * initial values.
		 */
		keepCompatibilityProps();

		/* =================================================
		   SMOOTH POINTER
		   ================================================= */

		if (
			pointerInitialized
		) {
			mouseX +=
				(
					targetX -
					mouseX
				) *
				0.22;

			mouseY +=
				(
					targetY -
					mouseY
				) *
				0.22;
		}

		/* =================================================
		   CLEAR
		   ================================================= */

		ctx.clearRect(
			0,
			0,
			width,
			height
		);

		/* =================================================
		   BASE
		   ================================================= */

		ctx.fillStyle =
			background;

		ctx.fillRect(
			0,
			0,
			width,
			height
		);

		/* =================================================
		   PHOTOGRAPH
		   ================================================= */

		if (
			imageLoaded &&
			image
		) {
			const geometry =
				getCoverGeometry();

			if (geometry) {
				ctx.save();

				/*
				 * Preserve facial detail while matching the
				 * darker visual language of the homepage.
				 */
				ctx.globalAlpha =
					opacity;

				ctx.filter =
					'grayscale(0.35) contrast(1.1) brightness(0.78) saturate(0.9)';

				/* =========================================
				   CURSOR-CENTERED ZOOM
				   ========================================= */

				let zoomInfluence =
					0;

				if (
					pointerInitialized
				) {
					const centerX =
						width * 0.5;

					const centerY =
						height * 0.5;

					const dx =
						centerX -
						mouseX;

					const dy =
						centerY -
						mouseY;

					const centerDistance =
						Math.sqrt(
							dx * dx +
							dy * dy
						);

					const influenceDistance =
						Math.sqrt(
							width * width +
							height * height
						) *
						0.45;

					zoomInfluence =
						1 -
						Math.min(
							centerDistance /
								Math.max(
									influenceDistance,
									1
								),
							1
						);

					zoomInfluence =
						zoomInfluence *
						zoomInfluence *
						(
							3 -
							2 *
								zoomInfluence
						);
				}

				const finalZoom =
					1 +
					(
						zoom -
						1
					) *
					zoomInfluence;

				const scaledWidth =
					geometry.drawWidth *
					finalZoom;

				const scaledHeight =
					geometry.drawHeight *
					finalZoom;

				const scaledX =
					(
						width -
						scaledWidth
					) /
					2;

				const scaledY =
					(
						height -
						scaledHeight
					) /
					2;

				ctx.drawImage(
					image,
					scaledX,
					scaledY,
					scaledWidth,
					scaledHeight
				);

				ctx.restore();
			}
		}

		/* =================================================
		   SUBTLE SCANLINES
		   ================================================= */

		ctx.save();

		ctx.globalAlpha =
			0.035;

		ctx.fillStyle =
			color;

		for (
			let y = 0;
			y < height;
			y += 8
		) {
			ctx.fillRect(
				0,
				y,
				width,
				1
			);
		}

		ctx.restore();

		/* =================================================
		   SOFT CURSOR LIGHT
		   ================================================= */

		if (
			pointerInitialized
		) {
			const gradient =
				ctx.createRadialGradient(
					mouseX,
					mouseY,
					0,
					mouseX,
					mouseY,
					cursorRadius
				);

			gradient.addColorStop(
				0,
				'rgba(255, 0, 128, 0.055)'
			);

			gradient.addColorStop(
				0.45,
				'rgba(255, 0, 128, 0.018)'
			);

			gradient.addColorStop(
				1,
				'rgba(255, 0, 128, 0)'
			);

			ctx.save();

			ctx.fillStyle =
				gradient;

			ctx.fillRect(
				0,
				0,
				width,
				height
			);

			ctx.restore();
		}

		animationFrame =
			requestAnimationFrame(
				render
			);
	}

	/* =====================================================
	   MOUNT
	   ===================================================== */

	onMount(() => {
		resize();

		loadImage();

		window.addEventListener(
			'resize',
			resize
		);

		container.addEventListener(
			'pointermove',
			handlePointerMove,
			{
				passive: true
			}
		);

		container.addEventListener(
			'pointerleave',
			handlePointerLeave
		);

		animationFrame =
			requestAnimationFrame(
				render
			);

		return () => {
			window.removeEventListener(
				'resize',
				resize
			);

			container.removeEventListener(
				'pointermove',
				handlePointerMove
			);

			container.removeEventListener(
				'pointerleave',
				handlePointerLeave
			);

			cancelAnimationFrame(
				animationFrame
			);
		};
	});
</script>

<div
	class="ascii-container"
	bind:this={container}
>
	<canvas
		bind:this={canvas}
		aria-label={alt}
	></canvas>
</div>

<style>
	.ascii-container {
		position:
			relative;

		width:
			100%;

		height:
			100%;

		overflow:
			hidden;

		background:
			#000;
	}

	canvas {
		position:
			absolute;

		inset:
			0;

		display:
			block;

		width:
			100%;

		height:
			100%;
	}
</style>

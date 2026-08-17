<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		alt?: string;

		/* Distance between halftone particles */
		cellSize?: number;

		/* Radius around the mouse affected by movement */
		cursorRadius?: number;

		/* Base opacity of the halftone field */
		opacity?: number;

		/* Maximum directional displacement */
		maxBend?: number;

		/* How quickly the effect follows the mouse */
		smoothing?: number;

		/* Physical size of each dot */
		dotScale?: number;

		/* Minimum brightness used when drawing dark pixels */
		darkFloor?: number;

		/* Strength of mouse-speed response */
		velocityStrength?: number;
	}

	let {
		src,
		alt = '',

		cellSize = 6,

		cursorRadius = 230,

		opacity = 0.34,

		maxBend = 38,

		smoothing = 0.12,

		dotScale = 0.34,

		darkFloor = 48,

		velocityStrength = 1
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	let ctx: CanvasRenderingContext2D | null = null;

	let sourceCanvas: HTMLCanvasElement | null = null;
	let sourceCtx: CanvasRenderingContext2D | null = null;

	let sourceImage: HTMLImageElement | null = null;

	let animationFrame = 0;

	let width = 0;
	let height = 0;

	let dpr = 1;

	/* =====================================================
	   POINTER
	   ===================================================== */

	let targetX = 0;
	let targetY = 0;

	let mouseX = 0;
	let mouseY = 0;

	let previousMouseX = 0;
	let previousMouseY = 0;

	let directionX = 0;
	let directionY = 0;

	let velocity = 0;

	let pointerActive = false;

	let initializedPointer = false;

	/* =====================================================
	   RESIZE
	   ===================================================== */

	const resize = () => {
		if (!canvas || !container) {
			return;
		}

		const rect =
			container.getBoundingClientRect();

		width =
			rect.width;

		height =
			rect.height;

		dpr =
			Math.min(
				window.devicePixelRatio || 1,
				2
			);

		canvas.width =
			Math.max(
				1,
				Math.floor(
					width * dpr
				)
			);

		canvas.height =
			Math.max(
				1,
				Math.floor(
					height * dpr
				)
			);

		canvas.style.width =
			`${width}px`;

		canvas.style.height =
			`${height}px`;

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
		}
	};

	/* =====================================================
	   POINTER EVENTS
	   ===================================================== */

	const handlePointerMove = (
		event: PointerEvent
	) => {
		targetX =
			event.clientX;

		targetY =
			event.clientY;

		if (!initializedPointer) {
			mouseX =
				targetX;

			mouseY =
				targetY;

			previousMouseX =
				targetX;

			previousMouseY =
				targetY;

			initializedPointer =
				true;
		}

		pointerActive =
			true;
	};

	const handlePointerLeave = () => {
		pointerActive =
			false;
	};

	/* =====================================================
	   LOAD IMAGE
	   ===================================================== */

	const initializeImage = () => {
		sourceImage =
			new Image();

		sourceImage.decoding =
			'async';

		sourceImage.src =
			src;

		sourceImage.onload =
			() => {
				if (!sourceImage) {
					return;
				}

				sourceCanvas =
					document.createElement(
						'canvas'
					);

				/*
				 * A reduced source canvas is enough for
				 * sampling colors and is much faster than
				 * repeatedly reading the full-resolution image.
				 */

				const maximumWidth =
					1400;

				const scale =
					Math.min(
						1,
						maximumWidth /
							sourceImage.naturalWidth
					);

				sourceCanvas.width =
					Math.max(
						1,
						Math.round(
							sourceImage.naturalWidth *
								scale
						)
					);

				sourceCanvas.height =
					Math.max(
						1,
						Math.round(
							sourceImage.naturalHeight *
								scale
						)
					);

				sourceCtx =
					sourceCanvas.getContext(
						'2d',
						{
							willReadFrequently:
								true
						}
					);

				if (!sourceCtx) {
					return;
				}

				sourceCtx.drawImage(
					sourceImage,
					0,
					0,
					sourceCanvas.width,
					sourceCanvas.height
				);

				resize();
			};
	};

	/* =====================================================
	   CSS BACKGROUND-SIZE: COVER GEOMETRY
	   ===================================================== */

	const getImageGeometry = () => {
		if (!sourceCanvas) {
			return null;
		}

		const sourceWidth =
			sourceCanvas.width;

		const sourceHeight =
			sourceCanvas.height;

		const imageAspect =
			sourceWidth /
			sourceHeight;

		const viewportAspect =
			width /
			Math.max(
				height,
				1
			);

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

		const offsetX =
			(
				width -
				drawWidth
			) /
			2;

		const offsetY =
			(
				height -
				drawHeight
			) /
			2;

		return {
			sourceWidth,
			sourceHeight,
			drawWidth,
			drawHeight,
			offsetX,
			offsetY
		};
	};

	type ImageGeometry =
		NonNullable<
			ReturnType<
				typeof getImageGeometry
			>
		>;

	/* =====================================================
	   SAMPLE IMAGE
	   ===================================================== */

	const sampleColor = (
		x: number,
		y: number,
		geometry: ImageGeometry
	) => {
		if (!sourceCtx) {
			return null;
		}

		const normalizedX =
			(
				x -
				geometry.offsetX
			) /
			geometry.drawWidth;

		const normalizedY =
			(
				y -
				geometry.offsetY
			) /
			geometry.drawHeight;

		const sampleX =
			Math.floor(
				normalizedX *
					geometry.sourceWidth
			);

		const sampleY =
			Math.floor(
				normalizedY *
					geometry.sourceHeight
			);

		if (
			sampleX < 0 ||
			sampleY < 0 ||
			sampleX >=
				geometry.sourceWidth ||
			sampleY >=
				geometry.sourceHeight
		) {
			return null;
		}

		const data =
			sourceCtx.getImageData(
				sampleX,
				sampleY,
				1,
				1
			).data;

		return {
			r: data[0],
			g: data[1],
			b: data[2],
			a: data[3]
		};
	};

	/* =====================================================
	   KEEP DARK PIXELS VISIBLE
	   ===================================================== */

	const getVisibleColor = (
		r: number,
		g: number,
		b: number
	) => {
		/*
		 * IMPORTANT:
		 *
		 * We preserve the hue of the photograph but impose
		 * a small brightness floor.
		 *
		 * Without this, a black pixel produces a black
		 * halftone on top of a black part of the photograph,
		 * making the particle mathematically present but
		 * visually invisible.
		 */

		const brightest =
			Math.max(
				r,
				g,
				b
			);

		if (
			brightest >=
			darkFloor
		) {
			return {
				r,
				g,
				b
			};
		}

		/*
		 * Pure/near black has essentially no hue to preserve.
		 * Lift it toward a neutral gray.
		 */

		if (brightest < 4) {
			return {
				r: darkFloor,
				g: darkFloor,
				b: darkFloor
			};
		}

		const multiplier =
			darkFloor /
			brightest;

		return {
			r:
				Math.min(
					255,
					Math.round(
						r *
							multiplier
					)
				),

			g:
				Math.min(
					255,
					Math.round(
						g *
							multiplier
					)
				),

			b:
				Math.min(
					255,
					Math.round(
						b *
							multiplier
					)
				)
		};
	};

	/* =====================================================
	   UPDATE MOUSE PHYSICS
	   ===================================================== */

	const updatePointer = () => {
		if (!initializedPointer) {
			return;
		}

		/*
		 * Smoothly follow the real mouse.
		 */

		mouseX +=
			(
				targetX -
				mouseX
			) *
			smoothing;

		mouseY +=
			(
				targetY -
				mouseY
			) *
			smoothing;

		const dx =
			mouseX -
			previousMouseX;

		const dy =
			mouseY -
			previousMouseY;

		const movement =
			Math.sqrt(
				dx * dx +
					dy * dy
			);

		if (movement > 0.001) {
			directionX =
				dx /
				movement;

			directionY =
				dy /
				movement;
		}

		/*
		 * Fast mouse movement = stronger bend.
		 */

		const desiredVelocity =
			pointerActive
				? Math.min(
						movement /
							7,
						1
					)
				: 0;

		velocity +=
			(
				desiredVelocity -
				velocity
			) *
			0.2;

		previousMouseX =
			mouseX;

		previousMouseY =
			mouseY;
	};

	/* =====================================================
	   RENDER
	   ===================================================== */

	const render = (
		timestamp: number
	) => {
		if (
			!ctx ||
			!sourceCanvas ||
			!sourceCtx
		) {
			animationFrame =
				requestAnimationFrame(
					render
				);

			return;
		}

		updatePointer();

		ctx.clearRect(
			0,
			0,
			width,
			height
		);

		const geometry =
			getImageGeometry();

		if (!geometry) {
			animationFrame =
				requestAnimationFrame(
					render
				);

			return;
		}

		const size =
			Math.max(
				3,
				cellSize
			);

		/*
		 * =================================================
		 * UNIFORM HALFTONE FIELD
		 * =================================================
		 *
		 * Every coordinate in this grid gets a particle.
		 *
		 * There is NO brightness condition here.
		 *
		 * Dark pixels, light pixels, black pixels and colored
		 * pixels all participate.
		 */

		for (
			let y =
				size * 0.5;
			y <
				height;
			y +=
				size
		) {
			for (
				let x =
					size * 0.5;
				x <
					width;
				x +=
					size
			) {
				const pixel =
					sampleColor(
						x,
						y,
						geometry
					);

				if (!pixel) {
					continue;
				}

				/*
				 * Do not use brightness to skip particles.
				 */

				const visibleColor =
					getVisibleColor(
						pixel.r,
						pixel.g,
						pixel.b
					);

				let finalX =
					x;

				let finalY =
					y;

				let influence =
					0;

				/*
				 * =================================================
				 * MOUSE DEFORMATION
				 * =================================================
				 */

				if (
					pointerActive &&
					initializedPointer
				) {
					const dx =
						x -
						mouseX;

					const dy =
						y -
						mouseY;

					const distance =
						Math.sqrt(
							dx * dx +
								dy * dy
						);

					if (
						distance <
						cursorRadius
					) {
						influence =
							1 -
							distance /
								cursorRadius;

						/*
						 * Smoothstep creates a soft edge instead
						 * of an obvious circular cutoff.
						 */

						influence =
							influence *
							influence *
							(
								3 -
									2 *
										influence
							);

						/*
						 * Cursor heading.
						 *
						 * All particles inside the radius bend
						 * toward the direction the mouse travels.
						 */

						const speedAmount =
							0.3 +
							velocity *
								0.7 *
								velocityStrength;

						const directionalBend =
							maxBend *
							influence *
							speedAmount;

						finalX +=
							directionX *
							directionalBend;

						finalY +=
							directionY *
							directionalBend;

						/*
						 * Add a curved wake perpendicular to the
						 * direction of travel.
						 */

						const perpendicularX =
							-directionY;

						const perpendicularY =
							directionX;

						const wave =
							Math.sin(
								distance *
									0.055 -
									timestamp *
										0.004
							) *
							4 *
							influence *
							(
								0.25 +
									velocity
							);

						finalX +=
							perpendicularX *
							wave;

						finalY +=
							perpendicularY *
							wave;

						/*
						 * A tiny radial deformation makes the
						 * surface look flexible rather than like
						 * the dots are simply sliding sideways.
						 */

						const safeDistance =
							Math.max(
								distance,
								1
							);

						const radial =
							5 *
							influence *
							(
								0.2 +
									velocity *
										0.8
							);

						finalX +=
							(
								dx /
									safeDistance
							) *
							radial;

						finalY +=
							(
								dy /
									safeDistance
							) *
							radial;
					}
				}

				/*
				 * =================================================
				 * PARTICLE SIZE
				 * =================================================
				 *
				 * The size is intentionally NOT based on image
				 * brightness.
				 *
				 * This guarantees the same halftone structure
				 * exists over dark and bright areas.
				 */

				const hoverScale =
					1 +
					influence *
						0.18;

				const radius =
					Math.max(
						0.45,
						size *
							dotScale *
							0.5 *
							hoverScale
					);

				/*
				 * =================================================
				 * PARTICLE OPACITY
				 * =================================================
				 *
				 * Also independent from source brightness.
				 */

				const particleOpacity =
					Math.min(
						0.52,
						opacity *
							(
								1 +
									influence *
										0.22
							)
					);

				ctx.globalAlpha =
					particleOpacity;

				ctx.fillStyle =
					`rgb(${visibleColor.r}, ${visibleColor.g}, ${visibleColor.b})`;

				ctx.beginPath();

				ctx.arc(
					finalX,
					finalY,
					radius,
					0,
					Math.PI *
						2
				);

				ctx.fill();
			}
		}

		ctx.globalAlpha =
			1;

		animationFrame =
			requestAnimationFrame(
				render
			);
	};

	/* =====================================================
	   MOUNT
	   ===================================================== */

	onMount(() => {
		resize();

		initializeImage();

		window.addEventListener(
			'resize',
			resize
		);

		window.addEventListener(
			'pointermove',
			handlePointerMove,
			{
				passive: true
			}
		);

		window.addEventListener(
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

			window.removeEventListener(
				'pointermove',
				handlePointerMove
			);

			window.removeEventListener(
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
	class="halftone-container"
	bind:this={container}
	aria-hidden={alt ? undefined : 'true'}
>
	<canvas
		bind:this={canvas}
		aria-label={alt}
	></canvas>
</div>

<style>
	.halftone-container {
		position: absolute;

		inset: 0;

		width: 100%;
		height: 100%;

		overflow: hidden;

		pointer-events: none;

		background: transparent;
	}

	canvas {
		position: absolute;

		inset: 0;

		display: block;

		width: 100%;
		height: 100%;

		pointer-events: none;
	}
</style>

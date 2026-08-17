<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		alt?: string;
		characters?: string;
		color?: string;
		background?: string;
		cellSize?: number;
		cursorRadius?: number;
		zoom?: number;
		noiseInterval?: number;
		opacity?: number;
	}

	let {
		src,
		alt = '',
		characters = ' .:-=+*#%@',
		color = '#ff0080',
		background = 'transparent',
		cellSize = 7,
		cursorRadius = 150,
		zoom = 1.06,
		noiseInterval = 100,
		opacity = 0.95
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	let image:
		HTMLImageElement | null = null;

	let ctx:
		CanvasRenderingContext2D | null = null;

	let sourceCanvas:
		HTMLCanvasElement | null = null;

	let sourceCtx:
		CanvasRenderingContext2D | null = null;

	let animationFrame = 0;

	let targetX = 0;
	let targetY = 0;

	let currentX = 0;
	let currentY = 0;

	let previousX = 0;
	let previousY = 0;

	let velocity = 0;

	let noiseTimer = 0;

	let dpr = 1;

	onMount(() => {
		const resize = () => {
			if (!canvas || !container) {
				return;
			}

			const rect =
				container.getBoundingClientRect();

			dpr =
				Math.min(
					window.devicePixelRatio || 1,
					2
				);

			canvas.width =
				rect.width * dpr;

			canvas.height =
				rect.height * dpr;

			canvas.style.width =
				`${rect.width}px`;

			canvas.style.height =
				`${rect.height}px`;

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
			}
		};

		const mouseMove =
			(event: PointerEvent) => {
				const rect =
					container.getBoundingClientRect();

				targetX =
					event.clientX -
					rect.left;

				targetY =
					event.clientY -
					rect.top;
			};

		const initializeImage =
			() => {
				image =
					new Image();

				image.src = src;

				image.onload = () => {
					sourceCanvas =
						document.createElement(
							'canvas'
						);

					const maxWidth =
						900;

					const scale =
						Math.min(
							1,
							maxWidth /
								image!.naturalWidth
						);

					sourceCanvas.width =
						Math.max(
							1,
							Math.floor(
								image!.naturalWidth *
									scale
							)
						);

					sourceCanvas.height =
						Math.max(
							1,
							Math.floor(
								image!.naturalHeight *
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

					sourceCtx?.drawImage(
						image!,
						0,
						0,
						sourceCanvas.width,
						sourceCanvas.height
					);

					resize();
				};
			};

		const render =
			(timestamp: number) => {
				if (
					!canvas ||
					!ctx ||
					!sourceCanvas ||
					!sourceCtx ||
					!image
				) {
					animationFrame =
						requestAnimationFrame(
							render
						);

					return;
				}

				const rect =
					container.getBoundingClientRect();

				const width =
					rect.width;

				const height =
					rect.height;

				/* =========================================
				   SMOOTH POINTER
				   ========================================= */

				currentX +=
					(targetX - currentX) *
					0.105;

				currentY +=
					(targetY - currentY) *
					0.105;

				const dx =
					currentX -
					previousX;

				const dy =
					currentY -
					previousY;

				const movement =
					Math.sqrt(
						dx * dx +
							dy * dy
					);

				velocity +=
					(
						Math.min(
							movement / 18,
							1
						) -
						velocity
					) *
					0.16;

				previousX =
					currentX;

				previousY =
					currentY;

				/* =========================================
				   PERSISTENT IDLE MOVEMENT

				   The reference has a living/static quality
				   instead of becoming perfectly frozen.
				   ========================================= */

				const idleX =
					Math.sin(
						timestamp * 0.00055
					) * 1.8;

				const idleY =
					Math.cos(
						timestamp * 0.00042
					) * 1.8;

				const strength =
					0.3 +
					velocity * 0.7;

				/* =========================================
				   CLEAR
				   ========================================= */

				ctx.clearRect(
					0,
					0,
					width,
					height
				);

				if (
					background !==
					'transparent'
				) {
					ctx.fillStyle =
						background;

					ctx.fillRect(
						0,
						0,
						width,
						height
					);
				}

				/* =========================================
				   SOURCE IMAGE GEOMETRY
				   ========================================= */

				const imageAspect =
					sourceCanvas.width /
					sourceCanvas.height;

				const containerAspect =
					width / height;

				let drawWidth =
					width;

				let drawHeight =
					height;

				if (
					imageAspect >
					containerAspect
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

				const baseX =
					(width - drawWidth) /
					2;

				const baseY =
					(height - drawHeight) /
					2;

				/* =========================================
				   SOURCE PIXEL DATA
				   ========================================= */

				const sourceWidth =
					sourceCanvas.width;

				const sourceHeight =
					sourceCanvas.height;

				const pixels =
					sourceCtx.getImageData(
						0,
						0,
						sourceWidth,
						sourceHeight
					).data;

				/* =========================================
				   ASCII CELL SIZE
				   ========================================= */

				const size =
					Math.max(
						4,
						cellSize
					);

				/* =========================================
				   CURSOR FIELD
				   ========================================= */

				for (
					let y = 0;
					y < height;
					y += size
				) {
					for (
						let x = 0;
						x < width;
						x += size
					) {
						const sampleX =
							Math.floor(
								(
									x -
									baseX
								) /
								drawWidth *
								sourceWidth
							);

						const sampleY =
							Math.floor(
								(
									y -
									baseY
								) /
								drawHeight *
								sourceHeight
							);

						if (
							sampleX < 0 ||
							sampleY < 0 ||
							sampleX >=
								sourceWidth ||
							sampleY >=
								sourceHeight
						) {
							continue;
						}

						const index =
							(
								sampleY *
									sourceWidth +
								sampleX
							) * 4;

						const red =
							pixels[index];

						const green =
							pixels[index + 1];

						const blue =
							pixels[index + 2];

						const alpha =
							pixels[index + 3];

						if (
							alpha < 20
						) {
							continue;
						}

						/* =================================
						   LUMINANCE
						   ================================= */

						const luminance =
							(
								0.2126 *
									red +
								0.7152 *
									green +
								0.0722 *
									blue
							) / 255;

						/* =================================
						   CURSOR DISTANCE
						   ================================= */

						const distance =
							Math.sqrt(
								(
									x -
									currentX
								) ** 2 +
								(
									y -
									currentY
								) ** 2
							);

						const field =
							Math.max(
								0,
								1 -
									distance /
										cursorRadius
							);

						/*
						 * The cursor creates a local zoom field.
						 */
						const localZoom =
							1 +
							(
								zoom -
								1
							) *
							field *
							(
								0.72 +
								strength *
									0.35
							);

						/* =================================
						   ASCII CHARACTER
						   ================================= */

						const noise =
							Math.sin(
								(
									x * 12.9898 +
									y * 78.233 +
									noiseTimer
								) *
								0.017
							);

						const brightness =
							Math.max(
								0,
								Math.min(
									1,
									luminance +
										field *
											0.18 +
										noise *
											0.025
								)
							);

						const characterIndex =
							Math.min(
								characters.length -
									1,
								Math.max(
									0,
									Math.floor(
										brightness *
											(
												characters.length -
												1
											)
									)
								)
							);

						const character =
							characters[
								characterIndex
							];

						if (
							character ===
							' '
						) {
							continue;
						}

						/* =================================
						   LOCALIZED POSITION DISTORTION
						   ================================= */

						const offsetX =
							(
								x -
								currentX
							) *
							0.022 *
							field;

						const offsetY =
							(
								y -
								currentY
							) *
							0.022 *
							field;

						const finalX =
							x +
							offsetX +
							dx *
								0.8 *
								field +
							idleX *
								field;

						const finalY =
							y +
							offsetY +
							dy *
								0.8 *
								field +
							idleY *
								field;

						/* =================================
						   DRAW
						   ================================= */

						const localOpacity =
							Math.min(
								1,
								0.32 +
									luminance *
										0.68 +
									field *
										0.35
							);

						ctx.globalAlpha =
							localOpacity *
							opacity;

						ctx.fillStyle =
							color;

						ctx.font =
							`${size}px monospace`;

						ctx.textBaseline =
							'top';

						ctx.fillText(
							character,
							finalX,
							finalY
						);
					}
				}

				ctx.globalAlpha = 1;

				/* =========================================
				   CURSOR GLOW
				   ========================================= */

				const glow =
					ctx.createRadialGradient(
						currentX,
						currentY,
						0,
						currentX,
						currentY,
						cursorRadius
					);

				glow.addColorStop(
					0,
					'rgba(255,0,128,0.16)'
				);

				glow.addColorStop(
					0.38,
					'rgba(255,0,128,0.06)'
				);

				glow.addColorStop(
					1,
					'rgba(255,0,128,0)'
				);

				ctx.fillStyle =
					glow;

				ctx.fillRect(
					0,
					0,
					width,
					height
				);

				/* =========================================
				   NOISE INTERVAL
				   ========================================= */

				if (
					timestamp -
						noiseTimer >
					noiseInterval
				) {
					noiseTimer =
						timestamp;
				}

				animationFrame =
					requestAnimationFrame(
						render
					);
			};

		window.addEventListener(
			'resize',
			resize
		);

		container.addEventListener(
			'pointermove',
			mouseMove,
			{
				passive: true
			}
		);

		initializeImage();

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
				mouseMove
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

	<div class="ascii-vignette"></div>
</div>

<style>
	.ascii-container {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;

		background:
			#000;
	}

	canvas {
		position: absolute;

		inset: 0;

		width: 100%;
		height: 100%;

		display: block;
	}

	.ascii-vignette {
		position: absolute;

		inset: 0;

		pointer-events: none;

		background:
			radial-gradient(
				circle at center,
				transparent 55%,
				rgba(
					0,
					0,
					0,
					0.42
				)
				100%
			);

		mix-blend-mode:
			multiply;
	}
</style>

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

	let ctx:
		CanvasRenderingContext2D | null =
			null;

	let image:
		HTMLImageElement | null =
			null;

	let pixelData:
		Uint8ClampedArray | null =
			null;

	let sourceWidth = 0;
	let sourceHeight = 0;

	let animationFrame = 0;

	let width = 1;
	let height = 1;

	let dpr = 1;

	let targetX = 0;
	let targetY = 0;

	let mouseX = 0;
	let mouseY = 0;

	let pointerInitialized = false;

	let noiseSeed = 0;

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
		}
	}

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

		if (!pointerInitialized) {
			mouseX =
				targetX;

			mouseY =
				targetY;

			pointerInitialized =
				true;
		}
	}

	function loadImage() {
		image =
			new Image();

		image.decoding =
			'async';

		image.src =
			src;

		image.onload =
			() => {
				if (!image) {
					return;
				}

				const maximumWidth =
					1000;

				const scale =
					Math.min(
						1,
						maximumWidth /
							image.naturalWidth
					);

				sourceWidth =
					Math.max(
						1,
						Math.round(
							image.naturalWidth *
								scale
						)
					);

				sourceHeight =
					Math.max(
						1,
						Math.round(
							image.naturalHeight *
								scale
						)
					);

				const sourceCanvas =
					document.createElement(
						'canvas'
					);

				sourceCanvas.width =
					sourceWidth;

				sourceCanvas.height =
					sourceHeight;

				const sourceContext =
					sourceCanvas.getContext(
						'2d',
						{
							willReadFrequently:
								true
						}
					);

				if (!sourceContext) {
					return;
				}

				sourceContext.drawImage(
					image,
					0,
					0,
					sourceWidth,
					sourceHeight
				);

				pixelData =
					sourceContext.getImageData(
						0,
						0,
						sourceWidth,
						sourceHeight
					).data;
			};
	}

	function getGeometry() {
		if (
			sourceWidth <= 0 ||
			sourceHeight <= 0
		) {
			return null;
		}

		const imageAspect =
			sourceWidth /
				sourceHeight;

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

	function sampleBrightness(
		x: number,
		y: number
	) {
		if (!pixelData) {
			return 0;
		}

		const geometry =
			getGeometry();

		if (!geometry) {
			return 0;
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

		if (
			normalizedX < 0 ||
			normalizedX > 1 ||
			normalizedY < 0 ||
			normalizedY > 1
		) {
			return 0;
		}

		const sampleX =
			Math.min(
				sourceWidth - 1,
				Math.max(
					0,
					Math.floor(
						normalizedX *
							sourceWidth
					)
				)
			);

		const sampleY =
			Math.min(
				sourceHeight - 1,
				Math.max(
					0,
					Math.floor(
						normalizedY *
							sourceHeight
					)
				)
			);

		const index =
			(
				sampleY *
					sourceWidth +
				sampleX
			) *
				4;

		const red =
			pixelData[
				index
			];

		const green =
			pixelData[
				index + 1
			];

		const blue =
			pixelData[
				index + 2
			];

		return (
			0.2126 * red +
			0.7152 * green +
			0.0722 * blue
		) / 255;
	}

	function render(
		timestamp: number
	) {
		if (
			!ctx ||
			!pixelData
		) {
			animationFrame =
				requestAnimationFrame(
					render
				);

			return;
		}

		if (pointerInitialized) {
			mouseX +=
				(
					targetX -
						mouseX
				) *
					0.25;

			mouseY +=
				(
					targetY -
						mouseY
				) *
					0.25;
		}

		if (
			timestamp -
				noiseSeed >
			noiseInterval
		) {
			noiseSeed =
				timestamp;
		}

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

		const size =
			Math.max(
				cellSize,
				4
			);

		ctx.fillStyle =
			color;

		ctx.font =
			`${size}px monospace`;

		ctx.textBaseline =
			'middle';

		ctx.textAlign =
			'center';

		for (
			let y =
				size / 2;
			y <
				height;
			y +=
				size
		) {
			for (
				let x =
					size / 2;
				x <
					width;
				x +=
					size
			) {
				const brightness =
					sampleBrightness(
						x,
						y
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

				let finalX =
					x;

				let finalY =
					y;

				if (pointerInitialized) {
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
						let influence =
							1 -
								distance /
									cursorRadius;

						influence =
							influence *
								influence *
								(
									3 -
										2 *
											influence
								);

						const localZoom =
							1 +
								(
									zoom -
										1
								) *
									influence;

						finalX =
							mouseX +
								dx *
									localZoom;

						finalY =
							mouseY +
								dy *
									localZoom;
					}
				}

				const localOpacity =
					Math.min(
						1,
						0.25 +
							brightness *
								0.75
					);

				ctx.globalAlpha =
					opacity *
						localOpacity;

				ctx.fillText(
					character,
					finalX,
					finalY
				);
			}
		}

		ctx.globalAlpha =
			1;

		animationFrame =
			requestAnimationFrame(
				render
			);
	}

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
		position: relative;

		width: 100%;
		height: 100%;

		overflow: hidden;

		background: transparent;
	}

	canvas {
		position: absolute;

		inset: 0;

		display: block;

		width: 100%;
		height: 100%;
	}
</style>

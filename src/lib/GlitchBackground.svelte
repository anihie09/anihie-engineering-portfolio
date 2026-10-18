<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		intensity?: number;
		speed?: number;
		opacity?: number;
		pink?: string;
		active?: boolean;
		imageSrc?: string;
		src?: string;
	}

	let {
		intensity = 1,
		speed = 1,
		opacity = 1,
		pink = '#ff0080',
		active = true,
		imageSrc = '',
		src = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;

	let ctx: CanvasRenderingContext2D | null = null;

	let image: HTMLImageElement | null = null;

	let imageLoaded = false;

	let width = 1;
	let height = 1;
	let dpr = 1;

	let animationFrame = 0;

	let resizeObserver: ResizeObserver | null = null;

	let elapsed = 0;

	let time = 0;

	let previousTime = 0;

	const LOOP_DURATION = 15;

	/* =====================================================
	   HELPERS
	   ===================================================== */

	function random(
		min: number,
		max: number
	): number {
		return (
			Math.random() *
				(max - min) +
			min
		);
	}

	function clamp(
		value: number,
		min: number,
		max: number
	): number {
		return Math.max(
			min,
			Math.min(
				max,
				value
			)
		);
	}

	function easeInOut(
		value: number
	): number {
		const t =
			clamp(
				value,
				0,
				1
			);

		return (
			t *
			t *
			(
				3 -
				2 * t
			)
		);
	}

	/* =====================================================
	   RESIZE
	   ===================================================== */

	function resize(): void {
		if (!canvas) {
			return;
		}

		const rect =
			canvas.getBoundingClientRect();

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
				width * dpr
			);

		canvas.height =
			Math.round(
				height * dpr
			);

		ctx =
			canvas.getContext(
				'2d'
			);

		if (!ctx) {
			return;
		}

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

	/* =====================================================
	   IMAGE
	   ===================================================== */

	function loadImage(): void {
		const source =
			imageSrc ||
			src;

		if (!source) {
			return;
		}

		image =
			new Image();

		image.decoding =
			'async';

		image.onload =
			() => {
				imageLoaded =
					true;
			};

		image.onerror =
			() => {
				imageLoaded =
					false;

				console.warn(
					`Unable to load loading background image: ${source}`
				);
			};

		image.src =
			source;
	}

	/* =====================================================
	   COVER IMAGE
	   ===================================================== */

	function drawCoverImage(
		filter: string,
		alpha: number,
		blurPx: number
	): void {
		if (
			!ctx ||
			!image ||
			!imageLoaded
		) {
			return;
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

		const x =
			(
				width -
				drawWidth
			) /
			2;

		const y =
			(
				height -
				drawHeight
			) /
			2;

		ctx.save();

		ctx.globalAlpha =
			alpha;

		ctx.filter =
			blurPx > 0
				? `blur(${blurPx}px) ${filter}`
				: filter;

		ctx.drawImage(
			image,
			x,
			y,
			drawWidth,
			drawHeight
		);

		ctx.restore();
	}

	/* =====================================================
	   BASE
	   ===================================================== */

	function drawBase(): void {
		if (!ctx) {
			return;
		}

		ctx.clearRect(
			0,
			0,
			width,
			height
		);

		/*
		 * Only draw an image when one is explicitly supplied.
		 * Otherwise the canvas remains transparent.
		 */
		if (
			imageLoaded
		) {
			drawCoverImage(
				'brightness(0.38) saturate(0.7) contrast(1.08)',
				0.82 * opacity,
				0
			);
		}

		const atmosphere =
			ctx.createRadialGradient(
				width * 0.5,
				height * 0.5,
				0,
				width * 0.5,
				height * 0.5,
				Math.max(
					width,
					height
				) * 0.75
			);

		atmosphere.addColorStop(
			0,
			'rgba(255,0,128,0.045)'
		);

		atmosphere.addColorStop(
			0.65,
			'rgba(255,0,128,0.015)'
		);

		atmosphere.addColorStop(
			1,
			'rgba(0,0,0,0.72)'
		);

		ctx.fillStyle =
			atmosphere;

		ctx.fillRect(
			0,
			0,
			width,
			height
		);
	}

	/* =====================================================
	   FRAME
	   ===================================================== */

	function getFrame() {
		const frameWidth =
			Math.min(
				710,
				width * 0.58
			);

		const frameHeight =
			Math.min(
				390,
				height * 0.52
			);

		return {
			x:
				(
					width -
					frameWidth
				) /
				2,

			y:
				(
					height -
					frameHeight
				) /
				2,

			width:
				frameWidth,

			height:
				frameHeight
		};
	}

	function drawFrame(
		visibility = 1
	) {
		if (!ctx) {
			return;
		}

		const frame =
			getFrame();

		ctx.save();

		ctx.globalAlpha =
			visibility *
			opacity;

		ctx.strokeStyle =
			pink;

		ctx.lineWidth =
			1;

		ctx.strokeRect(
			frame.x,
			frame.y,
			frame.width,
			frame.height
		);

		ctx.strokeStyle =
			'rgba(255,255,255,0.85)';

		const corner = 31;

		/* Top left */

		ctx.beginPath();

		ctx.moveTo(
			frame.x,
			frame.y +
				corner
		);

		ctx.lineTo(
			frame.x,
			frame.y
		);

		ctx.lineTo(
			frame.x +
				corner,
			frame.y
		);

		ctx.stroke();

		/* Top right */

		ctx.beginPath();

		ctx.moveTo(
			frame.x +
				frame.width -
				corner,
			frame.y
		);

		ctx.lineTo(
			frame.x +
				frame.width,
			frame.y
		);

		ctx.lineTo(
			frame.x +
				frame.width,
			frame.y +
				corner
		);

		ctx.stroke();

		/* Bottom left */

		ctx.beginPath();

		ctx.moveTo(
			frame.x,
			frame.y +
				frame.height -
				corner
		);

		ctx.lineTo(
			frame.x,
			frame.y +
				frame.height
		);

		ctx.lineTo(
			frame.x +
				corner,
			frame.y +
				frame.height
		);

		ctx.stroke();

		/* Bottom right */

		ctx.beginPath();

		ctx.moveTo(
			frame.x +
				frame.width -
				corner,
			frame.y +
				frame.height
		);

		ctx.lineTo(
			frame.x +
				frame.width,
			frame.y +
				frame.height
		);

		ctx.lineTo(
			frame.x +
				frame.width,
			frame.y +
				frame.height -
				corner
		);

		ctx.stroke();

		/* Internal divider */

		ctx.globalAlpha =
			visibility *
			0.25 *
			opacity;

		ctx.strokeStyle =
			pink;

		ctx.beginPath();

		ctx.moveTo(
			frame.x,
			frame.y +
				frame.height *
				0.73
		);

		ctx.lineTo(
			frame.x +
				frame.width,
			frame.y +
				frame.height *
				0.73
		);

		ctx.stroke();

		ctx.restore();

		return frame;
	}

	/* =====================================================
	   TARGET
	   ===================================================== */

	function drawTarget(
		visibility = 1
	): void {
		if (!ctx) {
			return;
		}

		const frame =
			getFrame();

		const cx =
			frame.x +
			frame.width * 0.5;

		const cy =
			frame.y +
			frame.height * 0.48;

		ctx.save();

		ctx.globalAlpha =
			visibility *
			0.3 *
			opacity;

		ctx.strokeStyle =
			pink;

		ctx.lineWidth =
			1;

		ctx.beginPath();

		ctx.arc(
			cx,
			cy,
			47,
			0,
			Math.PI * 2
		);

		ctx.stroke();

		ctx.beginPath();

		ctx.arc(
			cx,
			cy,
			20,
			0,
			Math.PI * 2
		);

		ctx.stroke();

		ctx.beginPath();

		ctx.moveTo(
			cx - 82,
			cy
		);

		ctx.lineTo(
			cx + 82,
			cy
		);

		ctx.stroke();

		ctx.beginPath();

		ctx.moveTo(
			cx,
			cy - 70
		);

		ctx.lineTo(
			cx,
			cy + 70
		);

		ctx.stroke();

		ctx.restore();
	}

	/* =====================================================
	   HUD
	   ===================================================== */

	function drawHUD(
		visibility = 1
	): void {
		if (!ctx) {
			return;
		}

		ctx.save();

		ctx.globalAlpha =
			visibility *
			0.36 *
			opacity;

		ctx.strokeStyle =
			pink;

		ctx.lineWidth =
			1;

		const lines = [
			0.14,
			0.23,
			0.79,
			0.88
		];

		for (
			const position of lines
		) {
			const y =
				height *
				position;

			ctx.beginPath();

			ctx.moveTo(
				width * 0.05,
				y
			);

			ctx.lineTo(
				width * 0.42,
				y
			);

			ctx.stroke();

			ctx.beginPath();

			ctx.moveTo(
				width * 0.58,
				y
			);

			ctx.lineTo(
				width * 0.95,
				y
			);

			ctx.stroke();
		}

		for (
			const side of [0, 1]
		) {
			const x =
				side === 0
					? width * 0.03
					: width * 0.97;

			const direction =
				side === 0
					? 1
					: -1;

			const y =
				height * 0.36;

			ctx.beginPath();

			ctx.moveTo(
				x,
				y
			);

			ctx.lineTo(
				x +
					direction * 34,
				y
			);

			ctx.stroke();

			ctx.beginPath();

			ctx.moveTo(
				x +
					direction * 12,
				y - 12
			);

			ctx.lineTo(
				x +
					direction * 12,
				y + 12
			);

			ctx.stroke();
		}

		ctx.restore();
	}

	/* =====================================================
	   ATMOSPHERE
	   ===================================================== */

	function drawAtmosphere(): void {
		if (!ctx) {
			return;
		}

		const count =
			Math.round(
				24 *
				intensity
			);

		ctx.save();

		ctx.globalCompositeOperation =
			'screen';

		for (
			let i = 0;
			i < count;
			i++
		) {
			const seed =
				i *
				13.41;

			const x =
				width *
				(
					0.08 +
					(
						(
							Math.sin(
								seed
							) +
							1
						) /
						2
					) *
					0.84
				);

			const y =
				height *
				(
					0.08 +
					(
						(
							Math.cos(
								seed *
								1.7
							) +
							1
						) /
						2
					) *
					0.84
				);

			const pulse =
				0.5 +
				0.5 *
				Math.sin(
					time *
						0.0004 *
						speed +
					seed
				);

			const radius =
				3 +
				pulse *
				7;

			const gradient =
				ctx.createRadialGradient(
					x,
					y,
					0,
					x,
					y,
					radius
				);

			gradient.addColorStop(
				0,
				'rgba(255,182,226,0.12)'
			);

			gradient.addColorStop(
				0.45,
				'rgba(255,0,128,0.035)'
			);

			gradient.addColorStop(
				1,
				'rgba(255,0,128,0)'
			);

			ctx.globalAlpha =
				0.25 *
				opacity;

			ctx.fillStyle =
				gradient;

			ctx.fillRect(
				x - radius,
				y - radius,
				radius * 2,
				radius * 2
			);
		}

		ctx.restore();
	}

	/* =====================================================
	   FINE SCANLINES
	   ===================================================== */

	function drawFineScanlines(): void {
		if (!ctx) {
			return;
		}

		ctx.save();

		ctx.globalCompositeOperation =
			'screen';

		ctx.globalAlpha =
			0.045 *
			opacity;

		ctx.fillStyle =
			pink;

		for (
			let y = 0;
			y < height;
			y += 4
		) {
			ctx.fillRect(
				0,
				y,
				width,
				0.7
			);
		}

		ctx.restore();
	}

	/* =====================================================
	   FINE SIGNAL
	   ===================================================== */

	function drawFineSignal(): void {
		if (!ctx) {
			return;
		}

		const lineCount =
			Math.round(
				70 *
				intensity
			);

		for (
			let i = 0;
			i < lineCount;
			i++
		) {
			const normalized =
				i /
				Math.max(
					lineCount - 1,
					1
				);

			const baseY =
				height *
				(
					0.08 +
					normalized *
					0.84
				);

			const movement =
				(
					time *
					(
						0.012 +
						(i % 5) *
							0.003
					) *
					speed
				) %
				(width * 1.3);

			const length =
				width *
				(
					0.025 +
					(
						(
							Math.sin(
								i * 4.17
							) +
							1
						) /
						2
					) *
					0.12
				);

			const x =
				movement -
				length;

			const jitter =
				Math.sin(
					time *
						0.0012 *
						speed +
					i
				) * 2;

			ctx.save();

			ctx.globalCompositeOperation =
				'screen';

			ctx.globalAlpha =
				(
					0.04 +
					(
						(
							Math.sin(
								i * 2.31
							) +
							1
						) /
						2
					) *
					0.18
				) *
				opacity;

			ctx.fillStyle =
				i % 9 === 0
					? '#ff91d7'
					: pink;

			ctx.fillRect(
				x,
				baseY +
					jitter,
				length,
				0.7
			);

			ctx.restore();
		}
	}

	/* =====================================================
	   SIGNAL LINES
	   ===================================================== */

	function drawSignalLines(): void {
		if (!ctx) {
			return;
		}

		const lineCount =
			Math.round(
				18 *
				intensity
			);

		for (
			let i = 0;
			i < lineCount;
			i++
		) {
			const seed =
				i *
				4.17;

			const normalized =
				i /
				Math.max(
					lineCount - 1,
					1
				);

			const baseY =
				height *
				(
					0.08 +
					normalized *
					0.84
				);

			const jitter =
				Math.sin(
					time *
						0.0012 *
						speed +
					seed
				) * 4;

			const y =
				baseY +
				jitter;

			const movement =
				(
					time *
					(
						0.018 +
						(i % 5) *
							0.004
					) *
					speed
				) %
				(width * 1.4);

			const length =
				width *
				(
					0.12 +
					(
						(
							Math.sin(
								seed
							) +
							1
						) /
						2
					) *
					0.33
				);

			const x =
				movement -
				length;

			const alpha =
				(
					0.12 +
					(
						(
							Math.sin(
								time *
									0.001 +
								seed
							) +
							1
						) /
						2
					) *
					0.24
				) *
				opacity;

			ctx.save();

			ctx.globalCompositeOperation =
				'screen';

			ctx.globalAlpha =
				alpha;

			ctx.shadowBlur =
				7;

			ctx.shadowColor =
				pink;

			ctx.fillStyle =
				pink;

			ctx.fillRect(
				x,
				y,
				length,
				0.8
			);

			ctx.restore();
		}
	}

	/* =====================================================
	   GLITCH LINES
	   ===================================================== */

	function drawGlitchLines(
		amount = 1
	): void {
		if (!ctx) {
			return;
		}

		const total =
			Math.round(
				160 *
				intensity *
				amount
			);

		for (
			let i = 0;
			i < total;
			i++
		) {
			const y =
				random(
					height *
						0.08,
					height *
						0.92
				);

			const length =
				random(
					10,
					width *
						0.2
				);

			const x =
				random(
					-width *
						0.08,
					width
				);

			const h =
				random(
					0.4,
					2.4
				);

			const type =
				Math.random();

			let color =
				pink;

			if (
				type < 0.08
			) {
				color =
					'#ffffff';
			} else if (
				type < 0.14
			) {
				color =
					'#66dbff';
			} else if (
				type < 0.22
			) {
				color =
					'#ff91d7';
			}

			ctx.save();

			ctx.globalCompositeOperation =
				'screen';

			ctx.globalAlpha =
				random(
					0.13,
					0.78
				) *
				opacity;

			ctx.fillStyle =
				color;

			ctx.fillRect(
				x,
				y,
				length,
				h
			);

			ctx.restore();
		}
	}

	/* =====================================================
	   TEARING
	   ===================================================== */

	function drawTearing(
		amount = 1
	): void {
		if (!ctx) {
			return;
		}

		const total =
			Math.round(
				16 *
				intensity *
				amount
			);

		for (
			let i = 0;
			i < total;
			i++
		) {
			const y =
				random(
					height *
						0.2,
					height *
						0.8
				);

			const lineWidth =
				random(
					width *
						0.08,
					width *
						0.45
				);

			const x =
				random(
					-width *
						0.05,
					width
				);

			ctx.save();

			ctx.globalCompositeOperation =
				'screen';

			ctx.globalAlpha =
				random(
					0.25,
					0.88
				) *
				opacity;

			ctx.shadowBlur =
				8;

			ctx.shadowColor =
				pink;

			ctx.fillStyle =
				Math.random() < 0.2
					? '#ffffff'
					: pink;

			ctx.fillRect(
				x,
				y,
				lineWidth,
				random(
					0.7,
					2.8
				)
			);

			if (
				Math.random() <
				0.42
			) {
				ctx.globalAlpha *=
					0.5;

				ctx.fillStyle =
					'#6edfff';

				ctx.fillRect(
					x +
						random(
							3,
							12
						),
					y +
						random(
							2,
							5
						),
					lineWidth *
						0.6,
					0.7
				);
			}

			ctx.restore();
		}
	}

	/* =====================================================
	   GRAIN
	   ===================================================== */

	function drawGrain(): void {
		if (!ctx) {
			return;
		}

		const total =
			Math.round(
				180 *
				intensity
			);

		ctx.save();

		ctx.globalCompositeOperation =
			'screen';

		for (
			let i = 0;
			i < total;
			i++
		) {
			const x =
				random(
					0,
					width
				);

			const y =
				random(
					0,
					height
				);

			ctx.globalAlpha =
				random(
					0.01,
					0.05
				) *
				opacity;

			ctx.fillStyle =
				Math.random() < 0.75
					? pink
					: '#ffffff';

			ctx.fillRect(
				x,
				y,
				random(
					0.4,
					1.5
				),
				random(
					0.4,
					1.5
				)
			);
		}

		ctx.restore();
	}

	/* =====================================================
	   TEXT
	   ===================================================== */

	function drawText(
		title: string,
		subtitle: string,
		visibility: number,
		textScale = 1
	): void {
		if (!ctx) {
			return;
		}

		const frame =
			getFrame();

		const cx =
			frame.x +
			frame.width *
				0.5;

		const cy =
			frame.y +
			frame.height *
				0.48;

		ctx.save();

		ctx.globalAlpha =
			visibility *
			opacity;

		ctx.textAlign =
			'center';

		ctx.textBaseline =
			'middle';

		ctx.fillStyle =
			pink;

		ctx.font =
			`400 ${
				Math.max(
					7,
					8 * textScale
				)
			}px "Courier New", monospace`;

		ctx.fillText(
			'STREAM WILL BE',
			cx,
			cy -
				25 *
					textScale
		);

		ctx.fillStyle =
			'#ff7cc8';

		ctx.font =
			`700 ${
				Math.max(
					14,
					20 * textScale
				)
			}px "Courier New", monospace`;

		ctx.fillText(
			title,
			cx,
			cy
		);

		ctx.fillStyle =
			'rgba(255,255,255,0.55)';

		ctx.font =
			`400 ${
				Math.max(
					6,
					8 * textScale
				)
			}px "Courier New", monospace`;

		ctx.fillText(
			subtitle,
			cx,
			cy +
				25 *
					textScale
		);

		ctx.restore();
	}

	/* =====================================================
	   NOTIFICATION
	   ===================================================== */

	function drawNotification(
		visibility: number
	): void {
		if (!ctx) {
			return;
		}

		const panelWidth =
			Math.min(
				310,
				width * 0.28
			);

		const panelHeight = 82;

		const x =
			(
				width -
				panelWidth
			) / 2;

		const y =
			(
				height -
				panelHeight
			) / 2 +
			12;

		ctx.save();

		ctx.globalAlpha =
			visibility *
			opacity;

		ctx.fillStyle =
			'rgba(0,0,0,0.86)';

		ctx.fillRect(
			x,
			y,
			panelWidth,
			panelHeight
		);

		ctx.strokeStyle =
			pink;

		ctx.lineWidth =
			1;

		ctx.strokeRect(
			x,
			y,
			panelWidth,
			panelHeight
		);

		const tabWidth =
			panelWidth *
			0.34;

		ctx.fillStyle =
			pink;

		ctx.fillRect(
			x +
				(
					panelWidth -
					tabWidth
				) /
				2,
			y - 5,
			tabWidth,
			5
		);

		ctx.fillStyle =
			'#ff7bc9';

		ctx.textAlign =
			'center';

		ctx.font =
			'400 7px "Courier New", monospace';

		ctx.fillText(
			'NEW FOLLOWER',
			x +
				panelWidth / 2,
			y + 9
		);

		ctx.restore();
	}

	/* =====================================================
	   PHASE
	   ===================================================== */

	function getPhase() {
		const seconds =
			elapsed %
			LOOP_DURATION;

		if (
			seconds <
			1.4
		) {
			return {
				stage:
					'INTRO',
				t:
					seconds /
					1.4
			};
		}

		if (
			seconds <
			3.5
		) {
			return {
				stage:
					'START',
				t:
					(
						seconds -
						1.4
					) /
					2.1
			};
		}

		if (
			seconds <
			5.2
		) {
			return {
				stage:
					'GLITCH_IN',
				t:
					(
						seconds -
						3.5
					) /
					1.7
			};
		}

		if (
			seconds <
			11.8
		) {
			return {
				stage:
					'STREAM',
				t:
					(
						seconds -
						5.2
					) /
					6.6
			};
		}

		return {
			stage:
				'GLITCH_OUT',
			t:
				(
					seconds -
					11.8
				) /
				(
					LOOP_DURATION -
					11.8
				)
		};
	}

	/* =====================================================
	   VIGNETTE
	   ===================================================== */

	function drawVignette(): void {
		if (!ctx) {
			return;
		}

		const gradient =
			ctx.createRadialGradient(
				width * 0.5,
				height * 0.5,
				Math.min(
					width,
					height
				) * 0.22,
				width * 0.5,
				height * 0.5,
				Math.max(
					width,
					height
				) * 0.8
			);

		gradient.addColorStop(
			0,
			'rgba(0,0,0,0)'
		);

		gradient.addColorStop(
			0.72,
			'rgba(0,0,0,0.06)'
		);

		gradient.addColorStop(
			1,
			'rgba(0,0,0,0.74)'
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

	/* =====================================================
	   RENDER
	   ===================================================== */

	function render(
		timestamp: number
	): void {
		if (!ctx) {
			animationFrame =
				requestAnimationFrame(
					render
				);

			return;
		}

		const delta =
			Math.min(
				timestamp -
					previousTime,
				40
			);

		previousTime =
			timestamp;

		elapsed +=
			(delta / 1000) *
			speed;

		/*
		 * Keep the legacy `time` value in milliseconds so
		 * all animation functions use the same clock.
		 */
		time =
			elapsed *
			1000;

		ctx.clearRect(
			0,
			0,
			width,
			height
		);

		const phase =
			getPhase();

		/* =================================================
		   INTRO
		   ================================================= */

		if (
			phase.stage ===
			'INTRO'
		) {
			drawBase();

			const fade =
				easeInOut(
					phase.t
				);

			drawHUD(
				0.65 +
					fade *
					0.35
			);

			drawFrame(
				0.8 +
					fade *
					0.2
			);

			drawTarget(
				0.6
			);

			drawFineSignal();

			drawFineScanlines();

			drawGrain();
		}

		/* =================================================
		   START
		   ================================================= */

		else if (
			phase.stage ===
			'START'
		) {
			drawBase();

			drawHUD(
				0.9
			);

			drawFrame(
				1
			);

			drawTarget(
				0.75
			);

			drawFineSignal();

			drawFineScanlines();

			drawText(
				'STARTING SOON',
				'STREAM WILL BE',
				1,
				1
			);

			drawGrain();
		}

		/* =================================================
		   GLITCH IN
		   ================================================= */

		else if (
			phase.stage ===
			'GLITCH_IN'
		) {
			drawBase();

			drawHUD(
				1
			);

			drawFrame(
				1
			);

			drawTarget(
				0.65
			);

			if (
				imageLoaded
			) {
				const reveal =
					easeInOut(
						phase.t
					);

				drawCoverImage(
					`brightness(${
						0.46 +
						reveal *
						0.14
					}) contrast(1.04) saturate(0.72)`,
					reveal *
						0.62 *
						opacity,
					8 -
						reveal *
						4
				);
			}

			const amount =
				0.5 +
				phase.t *
				2.1;

			drawGlitchLines(
				amount
			);

			drawTearing(
				amount
			);

			drawFineSignal();

			drawGrain();
		}

		/* =================================================
		   STREAM
		   ================================================= */

		else if (
			phase.stage ===
			'STREAM'
		) {
			if (
				imageLoaded
			) {
				drawCoverImage(
					'brightness(0.62) contrast(1.03) saturate(0.72)',
					0.78 *
						opacity,
					7
				);
			} else {
				drawBase();
			}

			drawHUD(
				0.78
			);

			drawFineSignal();

			drawFineScanlines();

			drawNotification(
				1
			);

			drawGrain();

			if (
				Math.sin(
					elapsed *
					0.0024
				) >
				0.93
			) {
				drawGlitchLines(
					0.55
				);
			}
		}

		/* =================================================
		   GLITCH OUT
		   ================================================= */

		else {
			if (
				imageLoaded
			) {
				drawCoverImage(
					'brightness(0.54) contrast(1.06) saturate(0.68)',
					0.72 *
						opacity,
					6
				);
			} else {
				drawBase();
			}

			drawHUD(
				1
			);

			const amount =
				0.75 +
				phase.t *
				2.8;

			drawGlitchLines(
				amount
			);

			drawTearing(
				amount
			);

			drawFineSignal();

			drawGrain();

			const fade =
				clamp(
					(
						phase.t -
						0.25
					) /
					0.65,
					0,
					1
				);

			if (
				fade > 0
			) {
				ctx.save();

				ctx.globalAlpha =
					fade *
					0.7;

				ctx.fillStyle =
					'#020003';

				ctx.fillRect(
					0,
					0,
					width,
					height
				);

				ctx.restore();
			}

			drawFrame(
				1 -
					fade *
					0.4
			);

			drawTarget(
				0.6
			);
		}

		drawVignette();

		animationFrame =
			requestAnimationFrame(
				render
			);
	}

	/* =====================================================
	   VISIBILITY
	   ===================================================== */

	function handleVisibility(): void {
		if (
			document.hidden
		) {
			cancelAnimationFrame(
				animationFrame
			);

			animationFrame =
				0;

			return;
		}

		if (
			animationFrame ===
			0
		) {
			animationFrame =
				requestAnimationFrame(
					render
				);
		}
	}

	/* =====================================================
	   MOUNT
	   ===================================================== */

	onMount(() => {
		resize();

		loadImage();

		resizeObserver =
			new ResizeObserver(
				resize
			);

		resizeObserver.observe(
			canvas
		);

		window.addEventListener(
			'resize',
			resize
		);

		document.addEventListener(
			'visibilitychange',
			handleVisibility
		);

		animationFrame =
			requestAnimationFrame(
				render
			);

		return () => {
			resizeObserver?.disconnect();

			window.removeEventListener(
				'resize',
				resize
			);

			document.removeEventListener(
				'visibilitychange',
				handleVisibility
			);

			cancelAnimationFrame(
				animationFrame
			);
		};
	});
</script>

<div class="glitch-background">
	<canvas
		bind:this={canvas}
		aria-hidden="true"
	></canvas>

	<div class="loading-overlay">
		<div class="loading-label">
			LOADING
		</div>

		<div class="loading-subtitle">
			SYSTEM LINK
			<span>///</span>
			01
		</div>

		<div class="loading-progress">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</div>

<style>
	.glitch-background {
		--pink:
			#ff0080;

		position:
			fixed;

		inset:
			0;

		z-index:
			9999;

		width:
			100vw;

		height:
			100dvh;

		overflow:
			hidden;

		background:
			transparent;

		pointer-events:
			none;
	}

	canvas {
		position:
			absolute;

		inset:
			0;

		width:
			100%;

		height:
			100%;

		display:
			block;
	}

	.loading-overlay {
		position:
			absolute;

		left:
			50%;

		top:
			50%;

		z-index:
			30;

		transform:
			translate(
				-50%,
				-50%
			);

		display:
			flex;

		flex-direction:
			column;

		align-items:
			center;

		pointer-events:
			none;

		font-family:
			'Courier New',
			Courier,
			monospace;
	}

	.loading-label {
		color:
			rgba(
				255,
				255,
				255,
				0.85
			);

		font-size:
			clamp(
				0.65rem,
				0.9vw,
				0.9rem
			);

		font-weight:
			400;

		letter-spacing:
			0.26em;

		text-shadow:
			0 0 8px
			rgba(
				255,
				255,
				255,
				0.16
			);
	}

	.loading-subtitle {
		margin-top:
			6px;

		color:
			rgba(
				255,
				0,
				128,
				0.7
			);

		font-size:
			6px;

		letter-spacing:
			0.18em;
	}

	.loading-subtitle span {
		margin:
			0 4px;

		color:
			#ff1493;
	}

	.loading-progress {
		display:
			flex;

		gap:
			4px;

		margin-top:
			20px;
	}

	.loading-progress span {
		width:
			8px;

		height:
			3px;

		background:
			rgba(
				255,
				0,
				128,
				0.55
			);

		animation:
			progress-pulse
			1.1s
			steps(3, end)
			infinite;
	}

	.loading-progress span:nth-child(1) {
		animation-delay:
			0ms;
	}

	.loading-progress span:nth-child(2) {
		animation-delay:
			90ms;
	}

	.loading-progress span:nth-child(3) {
		animation-delay:
			180ms;
	}

	.loading-progress span:nth-child(4) {
		animation-delay:
			270ms;
	}

	@keyframes progress-pulse {
		0% {
			opacity:
				0.15;

			transform:
				scaleX(
					0.55
				);
		}

		50% {
			opacity:
				1;

			transform:
				scaleX(
					1
				);
		}

		100% {
			opacity:
				0.2;

			transform:
				scaleX(
					0.65
				);
		}
	}

	@media (max-width: 700px) {
		.loading-label {
			font-size:
				0.6rem;
		}

		.loading-subtitle {
			font-size:
				5px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loading-progress span {
			animation:
				none;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;

		cellSize?: number;
		dotScale?: number;
		dotOpacity?: number;

		cursorRadius?: number;

		warpStrength?: number;
		smoothing?: number;
		velocityStrength?: number;

		darkFloor?: number;

		swirlStrength?: number;
		stretchStrength?: number;
		radialStrength?: number;

		/*
		 * NEW:
		 * Amount of zoom/magnification directly underneath
		 * the mouse cursor.
		 */
		zoomStrength?: number;

		/*
		 * Controls how far the zoom extends around the
		 * cursor relative to cursorRadius.
		 */
		zoomRadius?: number;
	}

	let {
		src,

		cellSize = 6,
		dotScale = 0.42,
		dotOpacity = 0.55,

		cursorRadius = 250,

		warpStrength = 0.018,
		smoothing = 0.62,
		velocityStrength = 1.05,

		darkFloor = 0.12,

		swirlStrength = 0.75,
		stretchStrength = 1.0,
		radialStrength = 0.55,

		/*
		 * Small default zoom.
		 *
		 * 0.035 = subtle
		 * 0.05  = noticeable
		 * 0.08  = strong
		 */
		zoomStrength = 0.045,

		zoomRadius = 0.9
	}: Props = $props();

	let canvas: HTMLCanvasElement;

	let gl: WebGLRenderingContext | null = null;

	let program:
		WebGLProgram | null = null;

	let positionBuffer:
		WebGLBuffer | null = null;

	let texture:
		WebGLTexture | null = null;

	let image:
		HTMLImageElement | null = null;

	let animationFrame = 0;

	let width = 1;
	let height = 1;
	let pixelRatio = 1;

	/* =====================================================
	   POINTER
	   ===================================================== */

	let targetX = 0;
	let targetY = 0;

	let mouseX = 0;
	let mouseY = 0;

	let previousMouseX = 0;
	let previousMouseY = 0;

	let directionX = 1;
	let directionY = 0;

	let mouseSpeed = 0;

	let pointerInitialized = false;
	let pointerActive = false;

	/* =====================================================
	   VERTEX SHADER
	   ===================================================== */

	const vertexShaderSource = `
		attribute vec2 a_position;

		varying vec2 v_uv;

		void main() {
			v_uv =
				a_position *
				0.5 +
				0.5;

			gl_Position =
				vec4(
					a_position,
					0.0,
					1.0
				);
		}
	`;

	/* =====================================================
	   FRAGMENT SHADER
	   ===================================================== */

	const fragmentShaderSource = `
		precision highp float;

		uniform sampler2D u_texture;

		uniform vec2 u_resolution;
		uniform vec2 u_mouse;
		uniform vec2 u_direction;

		uniform float u_speed;
		uniform float u_radius;

		uniform float u_warpStrength;
		uniform float u_velocityStrength;

		uniform float u_cellSize;
		uniform float u_dotScale;
		uniform float u_dotOpacity;

		uniform float u_darkFloor;

		uniform float u_imageAspect;
		uniform float u_viewportAspect;

		uniform float u_swirlStrength;
		uniform float u_stretchStrength;
		uniform float u_radialStrength;

		/*
		 * NEW ZOOM UNIFORMS
		 */
		uniform float u_zoomStrength;
		uniform float u_zoomRadius;

		varying vec2 v_uv;

		/* =================================================
		   COVER UV
		   ================================================= */

		vec2 coverUV(
			vec2 uv
		) {
			if (
				u_imageAspect >
				u_viewportAspect
			) {
				float scale =
					u_viewportAspect /
					u_imageAspect;

				uv.x =
					(
						uv.x -
						0.5
					) *
					scale +
					0.5;
			}
			else {
				float scale =
					u_imageAspect /
					u_viewportAspect;

				uv.y =
					(
						uv.y -
						0.5
					) *
					scale +
					0.5;
			}

			return uv;
		}

		/* =================================================
		   SMOOTH FIELD
		   ================================================= */

		float smoothField(
			float value
		) {
			value =
				clamp(
					value,
					0.0,
					1.0
				);

			return
				value *
				value *
				(
					3.0 -
					2.0 *
					value
				);
		}

		/* =================================================
		   MAIN
		   ================================================= */

		void main() {
			vec2 uv =
				v_uv;

			/* =============================================
			   CURSOR FIELD
			   ============================================= */

			vec2 fromMouse =
				uv -
				u_mouse;

			fromMouse.x *=
				u_viewportAspect;

			float distanceFromMouse =
				length(
					fromMouse
				);

			float normalizedRadius =
				max(
					u_radius /
						u_resolution.y,
					0.0001
				);

			float normalizedDistance =
				distanceFromMouse /
					normalizedRadius;

			/*
			 * Main bend influence.
			 */
			float influence =
				1.0 -
				normalizedDistance;

			influence =
				smoothField(
					influence
				);

			/*
			 * Softer field surrounding the main interaction.
			 */
			float outerInfluence =
				1.0 -
				smoothstep(
					0.0,
					1.6,
					normalizedDistance
				);

			/* =============================================
			   MOUSE SPEED
			   ============================================= */

			float speed =
				clamp(
					u_speed *
					u_velocityStrength,
					0.0,
					1.5
				);

			float dynamicStrength =
				0.18 +
				speed *
				0.82;

			/* =============================================
			   DIRECTION
			   ============================================= */

			vec2 travelDirection =
				normalize(
					u_direction +
					vec2(
						0.00001
					)
				);

			vec2 perpendicularDirection =
				vec2(
					-travelDirection.y,
					travelDirection.x
				);

			vec2 radialDirection =
				distanceFromMouse >
				0.0001
					? normalize(
						fromMouse
					)
					: vec2(
						0.0
					);

			/* =============================================
			   DIRECTIONAL FLOW
			   ============================================= */

			float directionalAmount =
				u_warpStrength *
				u_stretchStrength *
				influence *
				dynamicStrength;

			vec2 directionalFlow =
				travelDirection *
				directionalAmount;

			/* =============================================
			   RADIAL FLOW
			   ============================================= */

			float radialAmount =
				u_warpStrength *
				u_radialStrength *
				influence *
				(
					0.35 +
					speed *
					0.65
				);

			vec2 radialFlow =
				radialDirection *
				radialAmount;

			/* =============================================
			   SWIRL
			   ============================================= */

			float alignment =
				dot(
					radialDirection,
					travelDirection
				);

			float swirlProfile =
				1.0 -
				abs(
					alignment
				);

			float swirlAmount =
				u_warpStrength *
				u_swirlStrength *
				influence *
				(
					0.15 +
					speed *
					0.85
				) *
				swirlProfile;

			float crossValue =
				travelDirection.x *
					radialDirection.y -
				travelDirection.y *
					radialDirection.x;

			float sideSign =
				crossValue >= 0.0
					? 1.0
					: -1.0;

			vec2 swirlFlow =
				perpendicularDirection *
				sideSign *
				swirlAmount;

			/* =============================================
			   SOFT WAVE
			   ============================================= */

			float wave =
				sin(
					normalizedDistance *
					7.0
				) *
				0.0025 *
				outerInfluence *
				(
					0.15 +
					speed *
					0.85
				);

			vec2 waveFlow =
				perpendicularDirection *
				wave;

			/* =============================================
			   BENDING DISPLACEMENT
			   ============================================= */

			vec2 displacement =
				directionalFlow +
				radialFlow +
				swirlFlow +
				waveFlow;

			/*
			 * Correct X displacement for widescreen aspect ratio.
			 */
			displacement.x /=
				u_viewportAspect;

			/* =============================================
			   BASE WARPED POSITION
			   ============================================= */

			vec2 warpedUV =
				uv +
				displacement;

			/* =============================================
			   NEW: MOUSE-CENTERED ZOOM
			   ============================================= */

			/*
			 * The zoom is centered directly on the cursor.
			 *
			 * This is NOT a global transform.
			 *
			 * Points farther from the cursor are affected less.
			 */

			float zoomDistance =
				distanceFromMouse /
					max(
						normalizedRadius *
						u_zoomRadius,
						0.0001
					);

			/*
			 * Smooth radial zoom field.
			 */
			float zoomInfluence =
				1.0 -
				smoothstep(
					0.0,
					1.0,
					zoomDistance
				);

			/*
			 * Smoother falloff.
			 */
			zoomInfluence =
				zoomInfluence *
				zoomInfluence *
				(
					3.0 -
					2.0 *
					zoomInfluence
				);

			/*
			 * Positive zoom means:
			 *
			 * content underneath cursor becomes magnified.
			 *
			 * This is achieved by moving sampling coordinates
			 * closer to the cursor.
			 */

			float localZoom =
				1.0 +
				u_zoomStrength *
				zoomInfluence;

			vec2 zoomedUV =
				u_mouse +
				(
					warpedUV -
					u_mouse
				) /
				localZoom;

			/*
			 * Blend the zoom into the existing warp.
			 *
			 * The bending remains completely intact.
			 */
			warpedUV =
				mix(
					warpedUV,
					zoomedUV,
					zoomInfluence
				);

			/* =============================================
			   ACTUAL IMAGE
			   ============================================= */

			vec2 imageUV =
				coverUV(
					warpedUV
				);

			imageUV =
				clamp(
					imageUV,
					vec2(0.001),
					vec2(0.999)
				);

			vec4 imageColor =
				texture2D(
					u_texture,
					imageUV
				);

			/* =============================================
			   HALFTONE
			   ============================================= */

			/*
			 * The halftone uses the SAME zoomed + warped
			 * coordinate as the photograph.
			 *
			 * So the zoom magnifies the halftones too.
			 */

			vec2 warpedPixel =
				warpedUV *
				u_resolution;

			vec2 cell =
				floor(
					warpedPixel /
					u_cellSize
				);

			vec2 cellCenter =
				(
					cell +
					0.5
				) *
				u_cellSize;

			vec2 localPosition =
				(
					warpedPixel -
					cellCenter
				) /
				(
					u_cellSize *
					0.5
				);

			float cellDistance =
				length(
					localPosition
				);

			float dotRadius =
				clamp(
					u_dotScale,
					0.10,
					0.9
				);

			float dotMask =
				1.0 -
				smoothstep(
					dotRadius,
					dotRadius +
					0.05,
					cellDistance
				);

			/* =============================================
			   DOT COLOR
			   ============================================= */

			vec3 dotColor =
				imageColor.rgb;

			float brightest =
				max(
					dotColor.r,
					max(
						dotColor.g,
						dotColor.b
					)
				);

			/*
			 * Keep halftones visible in dark regions.
			 */

			if (
				brightest <
				u_darkFloor
			) {
				if (
					brightest <
					0.005
				) {
					dotColor =
						vec3(
							u_darkFloor
						);
				}
				else {
					float multiplier =
						u_darkFloor /
						brightest;

					dotColor =
						min(
							dotColor *
							multiplier,
							vec3(
								1.0
							)
						);
				}
			}

			/* =============================================
			   DOT VISIBILITY
			   ============================================= */

			float interactionBoost =
				1.0 +
				influence *
				0.8;

			/*
			 * Slight boost at zoom center.
			 */
			float zoomBoost =
				1.0 +
				zoomInfluence *
				0.15;

			float finalDotOpacity =
				dotMask *
				u_dotOpacity *
				interactionBoost *
				zoomBoost;

			finalDotOpacity =
				clamp(
					finalDotOpacity,
					0.0,
					0.85
				);

			/* =============================================
			   FINAL IMAGE
			   ============================================= */

			vec3 finalColor =
				mix(
					imageColor.rgb,
					dotColor,
					finalDotOpacity
				);

			gl_FragColor =
				vec4(
					finalColor,
					1.0
				);
		}
	`;

	/* =====================================================
	   SHADER HELPERS
	   ===================================================== */

	function createShader(
		context: WebGLRenderingContext,
		type: number,
		source: string
	) {
		const shader =
			context.createShader(
				type
			);

		if (!shader) {
			return null;
		}

		context.shaderSource(
			shader,
			source
		);

		context.compileShader(
			shader
		);

		if (
			!context.getShaderParameter(
				shader,
				context.COMPILE_STATUS
			)
		) {
			console.error(
				'Shader compilation failed:',
				context.getShaderInfoLog(
					shader
				)
			);

			context.deleteShader(
				shader
			);

			return null;
		}

		return shader;
	}

	function createProgram(
		context: WebGLRenderingContext
	) {
		const vertexShader =
			createShader(
				context,
				context.VERTEX_SHADER,
				vertexShaderSource
			);

		const fragmentShader =
			createShader(
				context,
				context.FRAGMENT_SHADER,
				fragmentShaderSource
			);

		if (
			!vertexShader ||
			!fragmentShader
		) {
			return null;
		}

		const linkedProgram =
			context.createProgram();

		if (!linkedProgram) {
			return null;
		}

		context.attachShader(
			linkedProgram,
			vertexShader
		);

		context.attachShader(
			linkedProgram,
			fragmentShader
		);

		context.linkProgram(
			linkedProgram
		);

		context.deleteShader(
			vertexShader
		);

		context.deleteShader(
			fragmentShader
		);

		if (
			!context.getProgramParameter(
				linkedProgram,
				context.LINK_STATUS
			)
		) {
			console.error(
				'Program linking failed:',
				context.getProgramInfoLog(
					linkedProgram
				)
			);

			context.deleteProgram(
				linkedProgram
			);

			return null;
		}

		return linkedProgram;
	}

	/* =====================================================
	   RESIZE
	   ===================================================== */

	function resize() {
		if (
			!canvas ||
			!gl
		) {
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

		pixelRatio =
			Math.min(
				window.devicePixelRatio ||
					1,
				2
			);

		canvas.width =
			Math.max(
				1,
				Math.round(
					width *
					pixelRatio
				)
			);

		canvas.height =
			Math.max(
				1,
				Math.round(
					height *
					pixelRatio
				)
			);

		gl.viewport(
			0,
			0,
			canvas.width,
			canvas.height
		);
	}

	/* =====================================================
	   POINTER
	   ===================================================== */

	function handlePointerMove(
		event: PointerEvent
	) {
		targetX =
			event.clientX;

		targetY =
			event.clientY;

		if (
			!pointerInitialized
		) {
			mouseX =
				targetX;

			mouseY =
				targetY;

			previousMouseX =
				mouseX;

			previousMouseY =
				mouseY;

			pointerInitialized =
				true;
		}

		pointerActive =
			true;
	}

	function handlePointerLeave() {
		pointerActive =
			false;
	}

	/* =====================================================
	   MOUSE PHYSICS
	   ===================================================== */

	function updatePointer() {
		if (
			!pointerInitialized
		) {
			return;
		}

		/*
		 * Smooth mouse tracking.
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

		/*
		 * Smooth direction.
		 */

		if (
			movement >
			0.001
		) {
			const rawDirectionX =
				dx /
				movement;

			const rawDirectionY =
				dy /
				movement;

			const directionBlend =
				0.28 +
				mouseSpeed *
				0.18;

			directionX +=
				(
					rawDirectionX -
					directionX
				) *
				directionBlend;

			directionY +=
				(
					rawDirectionY -
					directionY
				) *
				directionBlend;

			const directionLength =
				Math.sqrt(
					directionX *
						directionX +
					directionY *
						directionY
				);

			if (
				directionLength >
				0.0001
			) {
				directionX /=
					directionLength;

				directionY /=
					directionLength;
			}
		}

		/*
		 * Speed.
		 */

		const targetSpeed =
			pointerActive
				? Math.min(
						movement /
							7,
						1
					)
				: 0;

		const speedBlend =
			targetSpeed >
			mouseSpeed
				? 0.32
				: 0.11;

		mouseSpeed +=
			(
				targetSpeed -
				mouseSpeed
			) *
			speedBlend;

		previousMouseX =
			mouseX;

		previousMouseY =
			mouseY;
	}

	/* =====================================================
	   WEBGL
	   ===================================================== */

	function initializeWebGL() {
		gl =
			canvas.getContext(
				'webgl',
				{
					alpha: false,
					antialias: false,
					powerPreference:
						'high-performance'
				}
			);

		if (!gl) {
			console.error(
				'WebGL is not supported.'
			);

			return false;
		}

		program =
			createProgram(
				gl
			);

		if (!program) {
			return false;
		}

		positionBuffer =
			gl.createBuffer();

		if (!positionBuffer) {
			return false;
		}

		gl.bindBuffer(
			gl.ARRAY_BUFFER,
			positionBuffer
		);

		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-1,
				-1,

				3,
				-1,

				-1,
				3
			]),
			gl.STATIC_DRAW
		);

		const positionLocation =
			gl.getAttribLocation(
				program,
				'a_position'
			);

		gl.enableVertexAttribArray(
			positionLocation
		);

		gl.vertexAttribPointer(
			positionLocation,
			2,
			gl.FLOAT,
			false,
			0,
			0
		);

		texture =
			gl.createTexture();

		if (!texture) {
			return false;
		}

		gl.bindTexture(
			gl.TEXTURE_2D,
			texture
		);

		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			gl.CLAMP_TO_EDGE
		);

		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			gl.CLAMP_TO_EDGE
		);

		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR
		);

		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			gl.LINEAR
		);

		return true;
	}

	/* =====================================================
	   IMAGE
	   ===================================================== */

	function loadImage() {
		image =
			new Image();

		image.decoding =
			'async';

		image.src =
			src;

		image.onload =
			() => {
				if (
					!gl ||
					!texture ||
					!image
				) {
					return;
				}

				gl.bindTexture(
					gl.TEXTURE_2D,
					texture
				);

				gl.pixelStorei(
					gl.UNPACK_FLIP_Y_WEBGL,
					true
				);

				gl.texImage2D(
					gl.TEXTURE_2D,
					0,
					gl.RGBA,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					image
				);

				resize();

				animationFrame =
					requestAnimationFrame(
						render
					);
			};

		image.onerror =
			() => {
				console.error(
					`Unable to load ${src}`
				);
			};
	}

	/* =====================================================
	   RENDER
	   ===================================================== */

	function render() {
		if (
			!gl ||
			!program ||
			!texture ||
			!image
		) {
			return;
		}

		updatePointer();

		gl.useProgram(
			program
		);

		const getUniform = (
			name: string
		) =>
			gl!.getUniformLocation(
				program!,
				name
			);

		const mouseNormalizedX =
			mouseX /
			Math.max(
				width,
				1
			);

		const mouseNormalizedY =
			1 -
			mouseY /
				Math.max(
					height,
					1
				);

		gl.uniform2f(
			getUniform(
				'u_resolution'
			),
			canvas.width,
			canvas.height
		);

		gl.uniform2f(
			getUniform(
				'u_mouse'
			),
			mouseNormalizedX,
			mouseNormalizedY
		);

		gl.uniform2f(
			getUniform(
				'u_direction'
			),
			directionX,
			-directionY
		);

		gl.uniform1f(
			getUniform(
				'u_speed'
			),
			mouseSpeed
		);

		gl.uniform1f(
			getUniform(
				'u_radius'
			),
			cursorRadius *
			pixelRatio
		);

		gl.uniform1f(
			getUniform(
				'u_warpStrength'
			),
			warpStrength
		);

		gl.uniform1f(
			getUniform(
				'u_velocityStrength'
			),
			velocityStrength
		);

		gl.uniform1f(
			getUniform(
				'u_cellSize'
			),
			cellSize *
			pixelRatio
		);

		gl.uniform1f(
			getUniform(
				'u_dotScale'
			),
			dotScale
		);

		gl.uniform1f(
			getUniform(
				'u_dotOpacity'
			),
			dotOpacity
		);

		gl.uniform1f(
			getUniform(
				'u_darkFloor'
			),
			darkFloor
		);

		gl.uniform1f(
			getUniform(
				'u_swirlStrength'
			),
			swirlStrength
		);

		gl.uniform1f(
			getUniform(
				'u_stretchStrength'
			),
			stretchStrength
		);

		gl.uniform1f(
			getUniform(
				'u_radialStrength'
			),
			radialStrength
		);

		/*
		 * NEW ZOOM UNIFORMS
		 */

		gl.uniform1f(
			getUniform(
				'u_zoomStrength'
			),
			zoomStrength
		);

		gl.uniform1f(
			getUniform(
				'u_zoomRadius'
			),
			zoomRadius
		);

		gl.uniform1f(
			getUniform(
				'u_imageAspect'
			),
			image.naturalWidth /
			image.naturalHeight
		);

		gl.uniform1f(
			getUniform(
				'u_viewportAspect'
			),
			width /
			Math.max(
				height,
				1
			)
		);

		gl.activeTexture(
			gl.TEXTURE0
		);

		gl.bindTexture(
			gl.TEXTURE_2D,
			texture
		);

		gl.uniform1i(
			getUniform(
				'u_texture'
			),
			0
		);

		gl.drawArrays(
			gl.TRIANGLES,
			0,
			3
		);

		animationFrame =
			requestAnimationFrame(
				render
			);
	}

	/* =====================================================
	   MOUNT
	   ===================================================== */

	onMount(() => {
		if (
			!initializeWebGL()
		) {
			return;
		}

		resize();

		loadImage();

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

		document.documentElement.addEventListener(
			'pointerleave',
			handlePointerLeave
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

			document.documentElement.removeEventListener(
				'pointerleave',
				handlePointerLeave
			);

			cancelAnimationFrame(
				animationFrame
			);

			if (
				gl &&
				texture
			) {
				gl.deleteTexture(
					texture
				);
			}

			if (
				gl &&
				positionBuffer
			) {
				gl.deleteBuffer(
					positionBuffer
				);
			}

			if (
				gl &&
				program
			) {
				gl.deleteProgram(
					program
				);
			}
		};
	});
</script>

<div class="interactive-background">
	<img
		class="base-image"
		src={src}
		alt=""
		aria-hidden="true"
	/>

	<canvas
		bind:this={canvas}
		aria-hidden="true"
	></canvas>
</div>

<style>
	.interactive-background {
		position: absolute;

		inset: 0;

		z-index: 0;

		width: 100%;
		height: 100%;

		overflow: hidden;

		background: #000;

		pointer-events: none;
	}

	.base-image {
		position: absolute;

		inset: 0;

		width: 100%;
		height: 100%;

		display: block;

		object-fit: cover;
		object-position: center;

		pointer-events: none;
		user-select: none;
	}

	canvas {
		position: absolute;

		inset: 0;

		width: 100%;
		height: 100%;

		display: block;

		pointer-events: none;
	}
</style>

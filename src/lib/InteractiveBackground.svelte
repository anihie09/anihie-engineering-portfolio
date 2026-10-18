<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;

		/* Halftone */
		cellSize?: number;
		dotScale?: number;
		dotOpacity?: number;
		darkFloor?: number;

		/* Main cursor interaction */
		cursorRadius?: number;
		cursorStrength?: number;

		/* Pointer smoothing */
		positionSmoothing?: number;
		velocitySmoothing?: number;
		velocityStrength?: number;

		/* Directional response */
		trailStrength?: number;
		radialStrength?: number;
		swirlStrength?: number;
		stretchStrength?: number;

		/* Zoom */
		zoomStrength?: number;
		zoomRadius?: number;

		/*
		 * Backwards-compatible names from the older version.
		 */
		warpStrength?: number;
		smoothing?: number;
	}

	let {
		src,

		cellSize = 6,
		dotScale = 0.42,
		dotOpacity = 0.55,
		darkFloor = 0.12,

		cursorRadius = 250,
		cursorStrength = 0.028,

		positionSmoothing = 0.22,
		velocitySmoothing = 0.16,
		velocityStrength = 0.75,

		trailStrength = 0.008,
		radialStrength = 0.35,
		swirlStrength = 0.75,
		stretchStrength = 1.0,

		zoomStrength = 0.045,
		zoomRadius = 0.9,

		warpStrength = undefined,
		smoothing = undefined
	}: Props = $props();

	/*
	 * Reactive compatibility helpers.
	 *
	 * These are functions rather than constants so Svelte 5
	 * does not warn about capturing the initial prop value.
	 */
	function getCursorStrength() {
		return warpStrength ?? cursorStrength;
	}

	function getPositionSmoothing() {
		return smoothing ?? positionSmoothing;
	}

	let canvas: HTMLCanvasElement;
	let fallbackImage: HTMLImageElement;

	let gl: WebGLRenderingContext | null = null;
	let program: WebGLProgram | null = null;
	let positionBuffer: WebGLBuffer | null = null;
	let texture: WebGLTexture | null = null;
	let image: HTMLImageElement | null = null;

	let animationFrame = 0;

	let width = 1;
	let height = 1;
	let pixelRatio = 1;

	let imageReady = $state(false);

	/* =====================================================
	   POINTER STATE
	   ===================================================== */

	let targetX = 0;
	let targetY = 0;

	let mouseX = 0;
	let mouseY = 0;

	let previousX = 0;
	let previousY = 0;

	let velocityX = 0;
	let velocityY = 0;

	let smoothVelocityX = 0;
	let smoothVelocityY = 0;

	let mouseSpeed = 0;

	let pointerInitialized = false;
	let pointerActive = false;

	/* =====================================================
	   CACHED UNIFORMS
	   ===================================================== */

	let uniforms:
		| {
				texture: WebGLUniformLocation | null;
				resolution: WebGLUniformLocation | null;
				mouse: WebGLUniformLocation | null;
				velocity: WebGLUniformLocation | null;

				radius: WebGLUniformLocation | null;
				cursorStrength: WebGLUniformLocation | null;

				velocityStrength: WebGLUniformLocation | null;
				trailStrength: WebGLUniformLocation | null;
				radialStrength: WebGLUniformLocation | null;

				swirlStrength: WebGLUniformLocation | null;
				stretchStrength: WebGLUniformLocation | null;

				zoomStrength: WebGLUniformLocation | null;
				zoomRadius: WebGLUniformLocation | null;

				cellSize: WebGLUniformLocation | null;
				dotScale: WebGLUniformLocation | null;
				dotOpacity: WebGLUniformLocation | null;
				darkFloor: WebGLUniformLocation | null;

				imageAspect: WebGLUniformLocation | null;
				viewportAspect: WebGLUniformLocation | null;
		  }
		| null = null;

	/* =====================================================
	   SHADERS
	   ===================================================== */

	const vertexShaderSource = `
		attribute vec2 a_position;

		varying vec2 v_uv;

		void main() {
			v_uv =
				a_position * 0.5 +
				0.5;

			gl_Position =
				vec4(
					a_position,
					0.0,
					1.0
				);
		}
	`;

	const fragmentShaderSource = `
		precision mediump float;

		uniform sampler2D u_texture;

		uniform vec2 u_resolution;
		uniform vec2 u_mouse;
		uniform vec2 u_velocity;

		uniform float u_radius;
		uniform float u_cursorStrength;

		uniform float u_velocityStrength;
		uniform float u_trailStrength;
		uniform float u_radialStrength;

		uniform float u_swirlStrength;
		uniform float u_stretchStrength;

		uniform float u_zoomStrength;
		uniform float u_zoomRadius;

		uniform float u_cellSize;
		uniform float u_dotScale;
		uniform float u_dotOpacity;
		uniform float u_darkFloor;

		uniform float u_imageAspect;
		uniform float u_viewportAspect;

		varying vec2 v_uv;

		/* =================================================
		   COVER IMAGE
		   ================================================= */

		vec2 coverUV(vec2 uv) {
			if (
				u_imageAspect >
				u_viewportAspect
			) {
				float scale =
					u_viewportAspect /
					u_imageAspect;

				uv.x =
					(
						uv.x - 0.5
					) *
					scale +
					0.5;
			} else {
				float scale =
					u_imageAspect /
					u_viewportAspect;

				uv.y =
					(
						uv.y - 0.5
					) *
					scale +
					0.5;
			}

			return uv;
		}

		/* =================================================
		   SMOOTH FIELDS
		   ================================================= */

		float smootherstep(float x) {
			x =
				clamp(
					x,
					0.0,
					1.0
				);

			return
				x * x * x *
				(
					x *
					(
						x * 6.0 -
						15.0
					) +
					10.0
				);
		}

		void main() {
			vec2 uv = v_uv;

			/* =============================================
			   CURSOR FIELD
			   ============================================= */

			vec2 delta =
				uv -
				u_mouse;

			/*
			 * Aspect correction.
			 */
			delta.x *=
				u_viewportAspect;

			float distanceToCursor =
				length(delta);

			float normalizedRadius =
				max(
					u_radius /
						u_resolution.y,
					0.0001
				);

			float normalizedDistance =
				distanceToCursor /
				normalizedRadius;

			/*
			 * Main soft field.
			 */
			float influence =
				smootherstep(
					1.0 -
					normalizedDistance
				);

			/*
			 * Larger soft field for motion trailing.
			 */
			float outerInfluence =
				1.0 -
				smoothstep(
					0.0,
					1.5,
					normalizedDistance
				);

			/* =============================================
			   VELOCITY
			   ============================================= */

			vec2 velocity =
				u_velocity;

			float speed =
				length(velocity);

			speed =
				clamp(
					speed *
						u_velocityStrength,
					0.0,
					1.0
				);

			/* =============================================
			   DIRECTIONS
			   ============================================= */

			vec2 radialDirection =
				distanceToCursor >
				0.0001
					? normalize(delta)
					: vec2(0.0);

			vec2 movementDirection =
				speed >
				0.0001
					? normalize(velocity)
					: vec2(0.0);

			vec2 perpendicularDirection =
				vec2(
					-movementDirection.y,
					movementDirection.x
				);

			/* =============================================
			   RADIAL BEND
			   ============================================= */

			float radialAmount =
				u_cursorStrength *
				u_radialStrength *
				influence *
				(
					0.65 +
					speed *
					0.35
				);

			vec2 radialFlow =
				radialDirection *
				radialAmount;

			/* =============================================
			   DIRECTIONAL FLOW
			   ============================================= */

			float directionalAmount =
				u_cursorStrength *
				u_stretchStrength *
				influence *
				speed;

			vec2 directionalFlow =
				movementDirection *
				directionalAmount;

			/* =============================================
			   SWIRL
			   ============================================= */

			float alignment =
				dot(
					radialDirection,
					movementDirection
				);

			float sideInfluence =
				1.0 -
				abs(alignment);

			float swirlAmount =
				u_cursorStrength *
				u_swirlStrength *
				influence *
				speed *
				sideInfluence;

			vec2 swirlFlow =
				perpendicularDirection *
				swirlAmount;

			/* =============================================
			   TRAIL
			   ============================================= */

			vec2 trailFlow =
				movementDirection *
				u_trailStrength *
				speed *
				outerInfluence;

			/* =============================================
			   COMBINED WARP
			   ============================================= */

			vec2 displacement =
				radialFlow +
				directionalFlow +
				swirlFlow +
				trailFlow;

			/*
			 * Correct X displacement for widescreen layouts.
			 */
			displacement.x /=
				max(
					u_viewportAspect,
					0.0001
				);

			vec2 warpedUV =
				uv +
				displacement;

			/* =============================================
			   MOUSE ZOOM
			   ============================================= */

			float zoomDistance =
				distanceToCursor /
				max(
					normalizedRadius *
					u_zoomRadius,
					0.0001
				);

			float zoomInfluence =
				1.0 -
				smoothstep(
					0.0,
					1.0,
					zoomDistance
				);

			zoomInfluence =
				smootherstep(
					zoomInfluence
				);

			float localZoom =
				1.0 +
				u_zoomStrength *
				zoomInfluence;

			/*
			 * Pull sampling toward the cursor.
			 */
			warpedUV =
				u_mouse +
				(
					warpedUV -
					u_mouse
				) /
				localZoom;

			/* =============================================
			   IMAGE
			   ============================================= */

			vec2 imageUV =
				coverUV(
					warpedUV
				);

			imageUV =
				clamp(
					imageUV,
					0.001,
					0.999
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
			 * Same warped coordinate means the image and
			 * halftone stay physically connected.
			 */
			vec2 warpedPixels =
				warpedUV *
				u_resolution;

			vec2 cell =
				floor(
					warpedPixels /
					u_cellSize
				);

			vec2 cellCenter =
				(
					cell + 0.5
				) *
				u_cellSize;

			vec2 local =
				(
					warpedPixels -
					cellCenter
				) /
				(
					u_cellSize * 0.5
				);

			float dotDistance =
				length(local);

			float dotRadius =
				clamp(
					u_dotScale,
					0.06,
					0.9
				);

			float dotMask =
				1.0 -
				smoothstep(
					dotRadius,
					dotRadius + 0.05,
					dotDistance
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
			 * Prevent completely dark areas from losing
			 * the halftone structure.
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
				} else {
					float multiplier =
						u_darkFloor /
						brightest;

					dotColor =
						min(
							dotColor *
							multiplier,
							vec3(1.0)
						);
				}
			}

			/* =============================================
			   DOT OPACITY
			   ============================================= */

			float interactionBoost =
				1.0 +
				influence *
				0.55;

			float zoomBoost =
				1.0 +
				zoomInfluence *
				0.12;

			float finalDotOpacity =
				dotMask *
				u_dotOpacity *
				interactionBoost *
				zoomBoost;

			finalDotOpacity =
				clamp(
					finalDotOpacity,
					0.0,
					0.8
				);

			/* =============================================
			   COMPOSITE
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
				'Program link failed:',
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

	function cacheUniforms() {
		if (
			!gl ||
			!program
		) {
			return;
		}

		/*
		 * Cache every uniform exactly once.
		 */
		uniforms = {
			texture:
				gl.getUniformLocation(
					program,
					'u_texture'
				),

			resolution:
				gl.getUniformLocation(
					program,
					'u_resolution'
				),

			mouse:
				gl.getUniformLocation(
					program,
					'u_mouse'
				),

			velocity:
				gl.getUniformLocation(
					program,
					'u_velocity'
				),

			radius:
				gl.getUniformLocation(
					program,
					'u_radius'
				),

			cursorStrength:
				gl.getUniformLocation(
					program,
					'u_cursorStrength'
				),

			velocityStrength:
				gl.getUniformLocation(
					program,
					'u_velocityStrength'
				),

			trailStrength:
				gl.getUniformLocation(
					program,
					'u_trailStrength'
				),

			radialStrength:
				gl.getUniformLocation(
					program,
					'u_radialStrength'
				),

			swirlStrength:
				gl.getUniformLocation(
					program,
					'u_swirlStrength'
				),

			stretchStrength:
				gl.getUniformLocation(
					program,
					'u_stretchStrength'
				),

			zoomStrength:
				gl.getUniformLocation(
					program,
					'u_zoomStrength'
				),

			zoomRadius:
				gl.getUniformLocation(
					program,
					'u_zoomRadius'
				),

			cellSize:
				gl.getUniformLocation(
					program,
					'u_cellSize'
				),

			dotScale:
				gl.getUniformLocation(
					program,
					'u_dotScale'
				),

			dotOpacity:
				gl.getUniformLocation(
					program,
					'u_dotOpacity'
				),

			darkFloor:
				gl.getUniformLocation(
					program,
					'u_darkFloor'
				),

			imageAspect:
				gl.getUniformLocation(
					program,
					'u_imageAspect'
				),

			viewportAspect:
				gl.getUniformLocation(
					program,
					'u_viewportAspect'
				)
		};
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

		const renderWidth =
			Math.max(
				1,
				Math.round(
					width *
					pixelRatio
				)
			);

		const renderHeight =
			Math.max(
				1,
				Math.round(
					height *
					pixelRatio
				)
			);

		if (
			canvas.width !==
			renderWidth
		) {
			canvas.width =
				renderWidth;
		}

		if (
			canvas.height !==
			renderHeight
		) {
			canvas.height =
				renderHeight;
		}

		gl.viewport(
			0,
			0,
			renderWidth,
			renderHeight
		);

		if (fallbackImage) {
			fallbackImage.style.width =
				'100%';

			fallbackImage.style.height =
				'100%';
		}
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

			previousX =
				targetX;

			previousY =
				targetY;

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
	   POINTER PHYSICS
	   ===================================================== */

	function updatePointer() {
		if (
			!pointerInitialized
		) {
			return;
		}

		const positionBlend =
			getPositionSmoothing();

		/*
		 * Smooth mouse position.
		 */
		mouseX +=
			(
				targetX -
				mouseX
			) *
			positionBlend;

		mouseY +=
			(
				targetY -
				mouseY
			) *
			positionBlend;

		/*
		 * Raw movement.
		 */
		const rawVelocityX =
			mouseX -
			previousX;

		const rawVelocityY =
			mouseY -
			previousY;

		/*
		 * Smooth movement vector.
		 */
		smoothVelocityX +=
			(
				rawVelocityX -
				smoothVelocityX
			) *
			velocitySmoothing;

		smoothVelocityY +=
			(
				rawVelocityY -
				smoothVelocityY
			) *
			velocitySmoothing;

		const rawSpeed =
			Math.sqrt(
				smoothVelocityX *
					smoothVelocityX +
				smoothVelocityY *
					smoothVelocityY
			);

		/*
		 * Convert the 2D velocity to normalized screen units.
		 */
		velocityX =
			smoothVelocityX /
			Math.max(
				height,
				1
			);

		velocityY =
			smoothVelocityY /
			Math.max(
				height,
				1
			);

		/*
		 * Mouse speed is kept as an actual state value.
		 *
		 * This fixes the previous `Cannot find name 'mouseSpeed'`
		 * error.
		 */
		const targetSpeed =
			pointerActive
				? Math.min(
					rawSpeed / 8,
					1
				)
				: 0;

		const speedBlend =
			targetSpeed >
			mouseSpeed
				? 0.35
				: 0.12;

		mouseSpeed +=
			(
				targetSpeed -
				mouseSpeed
			) *
			speedBlend;

		previousX =
			mouseX;

		previousY =
			mouseY;
	}

	/* =====================================================
	   WEBGL INIT
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
			console.warn(
				'WebGL unavailable. Using static background.'
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

		cacheUniforms();

		return true;
	}

	/* =====================================================
	   IMAGE LOADING
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
				imageReady =
					true;

				if (
					gl &&
					texture &&
					image
				) {
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
				}

				resize();

				animationFrame =
					requestAnimationFrame(
						render
					);
			};

		image.onerror =
			() => {
				console.error(
					`Unable to load background image: ${src}`
				);
			};
	}

	/* =====================================================
	   RENDER
	   ===================================================== */

	function render() {
		if (
			document.hidden ||
			!gl ||
			!program ||
			!texture ||
			!image ||
			!uniforms
		) {
			return;
		}

		updatePointer();

		gl.useProgram(
			program
		);

		/*
		 * Frame-varying uniforms only.
		 * Locations are already cached.
		 */

		gl.uniform2f(
			uniforms.resolution,
			canvas.width,
			canvas.height
		);

		gl.uniform2f(
			uniforms.mouse,
			mouseX /
				Math.max(
					width,
					1
				),
			1 -
				mouseY /
					Math.max(
						height,
						1
					)
		);

		gl.uniform2f(
			uniforms.velocity,
			velocityX,
			-velocityY
		);

		gl.uniform1f(
			uniforms.radius,
			cursorRadius *
				pixelRatio
		);

		gl.uniform1f(
			uniforms.cursorStrength,
			getCursorStrength()
		);

		gl.uniform1f(
			uniforms.velocityStrength,
			velocityStrength
		);

		gl.uniform1f(
			uniforms.trailStrength,
			trailStrength
		);

		gl.uniform1f(
			uniforms.radialStrength,
			radialStrength
		);

		gl.uniform1f(
			uniforms.swirlStrength,
			swirlStrength
		);

		gl.uniform1f(
			uniforms.stretchStrength,
			stretchStrength
		);

		gl.uniform1f(
			uniforms.zoomStrength,
			zoomStrength
		);

		gl.uniform1f(
			uniforms.zoomRadius,
			zoomRadius
		);

		gl.uniform1f(
			uniforms.cellSize,
			cellSize *
				pixelRatio
		);

		gl.uniform1f(
			uniforms.dotScale,
			dotScale
		);

		gl.uniform1f(
			uniforms.dotOpacity,
			dotOpacity
		);

		gl.uniform1f(
			uniforms.darkFloor,
			darkFloor
		);

		gl.uniform1f(
			uniforms.imageAspect,
			image.naturalWidth /
				image.naturalHeight
		);

		gl.uniform1f(
			uniforms.viewportAspect,
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
			uniforms.texture,
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
	   VISIBILITY
	   ===================================================== */

	function handleVisibilityChange() {
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
			imageReady &&
			animationFrame === 0
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
		initializeWebGL();

		resize();

		loadImage();

		const resizeObserver =
			new ResizeObserver(
				resize
			);

		resizeObserver.observe(
			canvas
		);

		window.addEventListener(
			'pointermove',
			handlePointerMove,
			{
				passive: true
			}
		);

		document.addEventListener(
			'visibilitychange',
			handleVisibilityChange
		);

		document.documentElement.addEventListener(
			'pointerleave',
			handlePointerLeave
		);

		return () => {
			resizeObserver.disconnect();

			window.removeEventListener(
				'pointermove',
				handlePointerMove
			);

			document.removeEventListener(
				'visibilitychange',
				handleVisibilityChange
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
		bind:this={fallbackImage}
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

		opacity: 0;
	}

	canvas {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;

		display: block;

		pointer-events: none;
	}

	/*
	 * While WebGL is loading, the static image provides the
	 * visual fallback. Once the shader is active, the canvas
	 * becomes the primary renderer.
	 */
</style>

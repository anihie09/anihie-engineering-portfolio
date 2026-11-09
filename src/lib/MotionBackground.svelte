<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Home background, rendered as ONE image on the GPU.
	 *
	 * At rest the shader outputs the photo exactly as it is.
	 * Where the mouse moves, the photo is bent like liquid glass:
	 *   - mirrored, lens-like refraction around the cursor
	 *   - cyan / red colour fringing on edges (chromatic aberration)
	 *   - glass rings and a soft flare with a horizontal light streak
	 * Every part fades in and out with smooth curves, so there are
	 * no hard edges or lines between the effect and the photo.
	 *
	 * - speed / magnitude -> size and strength of the distortion
	 * - direction         -> the image streams along the movement
	 * - still mouse       -> settles back to the clean photo
	 *
	 * Falls back to the plain photo if WebGL isn't available.
	 */
	let {
		src,
		paused = false,
		maxRadius = 260,
		speedForFull = 1.2, // px per ms that counts as "full strength"
		fade = 340 // ms for a trail point to fade to ~37%
	}: {
		src: string;
		paused?: boolean;
		maxRadius?: number;
		speedForFull?: number;
		fade?: number;
	} = $props();

	let canvas: HTMLCanvasElement;
	let gpu = $state(false);

	const MAX_PTS = 32;

	const VERT = `
		attribute vec2 a_pos;
		void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
	`;

	const FRAG = `
		precision highp float;

		uniform sampler2D u_img;
		uniform vec2 u_res;        // canvas size, device px
		uniform vec2 u_imgSize;    // photo size after "cover" scaling, device px
		uniform vec2 u_imgOffset;  // top-left of the scaled photo, device px
		uniform float u_dpr;
		uniform vec4 u_pts[${MAX_PTS}]; // x, y, radius, strength
		uniform vec2 u_vel[${MAX_PTS}]; // velocity, device px per ms
		uniform int u_count;
		uniform float u_time;

		const float PI = 3.14159265;

		vec3 photoAt(vec2 p) {
			vec2 uv = clamp((p - u_imgOffset) / u_imgSize, 0.0, 1.0);
			return texture2D(u_img, uv).rgb;
		}

		void main() {
			vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
			vec3 photo = photoAt(p);

			// soft union of all trail points (no hard "max" seams)
			float keep = 1.0;
			float wsum = 0.0;
			vec2 center = vec2(0.0);
			vec2 vel = vec2(0.0);
			float rad = 1.0;

			for (int i = 0; i < ${MAX_PTS}; i++) {
				if (i >= u_count) break;
				vec4 q = u_pts[i];
				float d = length(p - q.xy);
				float f = exp(-(d * d) / (q.z * q.z * 0.32)); // gaussian falloff
				float v = q.w * f;
				keep *= 1.0 - v;
				wsum += v;
				center += q.xy * v;
				vel += u_vel[i] * v;
				rad += q.z * v;
			}

			float inf = 1.0 - keep;

			if (inf < 0.003) {
				gl_FragColor = vec4(photo, 1.0);
				return;
			}

			center /= wsum;
			vel /= wsum;
			rad /= wsum;

			vec2 d = p - center;
			float r = length(d);
			float rn = r / max(rad, 1.0);

			// --- mirrored lens refraction ---
			// fold the angle into mirrored quadrants (the kaleidoscope look),
			// blended in by strength so it melts back into the photo
			float a = atan(d.y, d.x);
			float seg = PI / 2.0;
			float fa = abs(mod(a + seg * 0.5, seg) - seg * 0.5);
			vec2 folded = vec2(cos(fa), sin(fa)) * r;
			// strongest near the cursor, gone by the edge -> no visible seams
			float foldAmt = 0.32 * smoothstep(0.2, 0.9, inf) * (1.0 - smoothstep(0.0, 0.75, rn));
			vec2 k = mix(d, folded, foldAmt);

			// glass lens: pull the image inward with a soft ripple
			float lens = 1.0 - 0.14 * inf * (1.0 - smoothstep(0.0, 1.0, rn));
			float ripple = sin(rn * 9.0 - u_time * 2.0) * 0.006 * inf * rad;
			vec2 dir = r > 0.001 ? d / r : vec2(0.0);
			// stream along the movement (capped so fast flicks don't tear the image)
			vec2 v = vel / max(1.0, length(vel) / (2.5 * u_dpr));
			vec2 warp = center + k * lens + dir * ripple - v * inf * 9.0;

			// --- chromatic aberration (cyan / red fringes) ---
			float ca = inf * 3.2 * u_dpr * (0.3 + rn);
			vec3 refr;
			refr.r = photoAt(warp + dir * ca).r;
			refr.g = photoAt(warp).g;
			refr.b = photoAt(warp - dir * ca).b;

			vec3 col = mix(photo, refr, smoothstep(0.0, 0.55, inf));

			// --- light: glass rings, flare, horizontal streak ---
			float ringR = 0.55 + 0.05 * sin(u_time * 1.5);
			float ring = exp(-pow((rn - ringR) / 0.035, 2.0));
			float flare = exp(-rn * rn * 9.0);
			float streak = exp(-abs(d.y) / (2.5 * u_dpr)) * exp(-abs(d.x) / (rad * 0.7));
			float vstreak = exp(-abs(d.x) / (1.5 * u_dpr)) * exp(-abs(d.y) / (rad * 0.35));

			// light picks up the photo's brightness so it stays part of the image
			float lum = dot(refr, vec3(0.299, 0.587, 0.114));
			vec3 light =
				vec3(1.0, 0.9, 0.94) * (ring * 0.16 + flare * 0.1 + streak * 0.42 + vstreak * 0.14) +
				vec3(1.0, 0.3, 0.68) * ring * 0.08 * max(0.0, dir.x) +
				vec3(1.0, 0.55, 0.25) * ring * 0.08 * max(0.0, -dir.x);

			col += light * inf * (0.3 + lum);

			// gentle lift of the brightest parts, like light through glass
			col += pow(lum, 3.0) * inf * 0.12;

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
		if (!gl) return;

		/* ---------- program ---------- */

		function shader(type: number, source: string) {
			const s = gl!.createShader(type)!;
			gl!.shaderSource(s, source);
			gl!.compileShader(s);
			if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
				console.warn(gl!.getShaderInfoLog(s));
				return null;
			}
			return s;
		}

		const vs = shader(gl.VERTEX_SHADER, VERT);
		const fs = shader(gl.FRAGMENT_SHADER, FRAG);
		if (!vs || !fs) return;

		const prog = gl.createProgram()!;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
		gl.useProgram(prog);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const aPos = gl.getAttribLocation(prog, 'a_pos');
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

		const U = (n: string) => gl!.getUniformLocation(prog, n);
		const uRes = U('u_res');
		const uImgSize = U('u_imgSize');
		const uImgOffset = U('u_imgOffset');
		const uPts = U('u_pts');
		const uVel = U('u_vel');
		const uCount = U('u_count');
		const uTime = U('u_time');
		const uDpr = U('u_dpr');
		gl.uniform1i(U('u_img'), 0);

		function texture(unit: number) {
			const t = gl!.createTexture();
			gl!.activeTexture(gl!.TEXTURE0 + unit);
			gl!.bindTexture(gl!.TEXTURE_2D, t);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
			return t;
		}

		const imgTex = texture(0);

		/* ---------- state ---------- */

		const img = new Image();
		img.src = src;

		let W = 0;
		let H = 0;
		let dpr = 1;
		let loaded = false;

		type Pt = { x: number; y: number; s: number; vx: number; vy: number };
		let pts: Pt[] = [];
		let last = { x: 0, y: 0, t: 0, has: false };
		let speed = 0;
		let energy = 0;
		let vx = 0;
		let vy = 0;
		let time = 0;
		let raf = 0;
		let prevT = 0;

		const ptsArr = new Float32Array(MAX_PTS * 4);
		const velArr = new Float32Array(MAX_PTS * 2);

		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = canvas.clientWidth;
			H = canvas.clientHeight;
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			gl!.viewport(0, 0, canvas.width, canvas.height);
			gl!.uniform2f(uRes, canvas.width, canvas.height);
			gl!.uniform1f(uDpr, dpr);

			if (loaded) {
				const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
				const sw = img.naturalWidth * scale;
				const sh = img.naturalHeight * scale;
				gl!.uniform2f(uImgSize, sw * dpr, sh * dpr);
				gl!.uniform2f(uImgOffset, ((W - sw) / 2) * dpr, ((H - sh) / 2) * dpr);
			}

			draw();
		}

		function draw() {
			if (!loaded) return;

			const n = Math.min(pts.length, MAX_PTS);
			for (let i = 0; i < n; i++) {
				const p = pts[pts.length - n + i];
				ptsArr[i * 4] = p.x * dpr;
				ptsArr[i * 4 + 1] = p.y * dpr;
				ptsArr[i * 4 + 2] = (80 + maxRadius * p.s) * dpr;
				ptsArr[i * 4 + 3] = p.s;
				velArr[i * 2] = p.vx * dpr;
				velArr[i * 2 + 1] = p.vy * dpr;
			}

			gl!.uniform4fv(uPts, ptsArr);
			gl!.uniform2fv(uVel, velArr);
			gl!.uniform1i(uCount, n);
			gl!.uniform1f(uTime, time);
			gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
		}

		function frame(now: number) {
			const dt = Math.max(0, Math.min(now - prevT, 50));
			prevT = now;

			const k = Math.exp(-dt / fade);
			for (const p of pts) p.s *= k;
			pts = pts.filter((p) => p.s > 0.015);
			energy *= Math.exp(-dt / 400);

			// faster mouse -> the ripples move faster
			time += (dt / 1000) * (1 + energy * 4);

			draw();

			raf = pts.length ? requestAnimationFrame(frame) : 0;
		}

		function onMove(e: PointerEvent) {
			if (paused || !loaded) return;

			const now = performance.now();
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			if (!last.has) {
				last = { x, y, t: now, has: true };
				return;
			}

			const dt = Math.max(now - last.t, 1);
			const dx = x - last.x;
			const dy = y - last.y;
			const dist = Math.hypot(dx, dy);

			speed = speed * 0.6 + (dist / dt) * 0.4;
			vx = vx * 0.7 + (dx / dt) * 0.3;
			vy = vy * 0.7 + (dy / dt) * 0.3;

			const s = Math.min(1, speed / speedForFull);
			energy = Math.max(energy, s);

			if (dist > 5 && s > 0.03) {
				pts.push({ x, y, s, vx, vy });
				if (pts.length > MAX_PTS) pts.shift();
			}

			last = { x, y, t: now, has: true };

			if (!raf) {
				prevT = now;
				raf = requestAnimationFrame(frame);
			}
		}

		img.onload = () => {
			gl!.activeTexture(gl!.TEXTURE0);
			gl!.bindTexture(gl!.TEXTURE_2D, imgTex);
			gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
			loaded = true;
			gpu = true;
			resize();
		};

		const ro = new ResizeObserver(() => resize());
		ro.observe(canvas);
		window.addEventListener('pointermove', onMove, { passive: true });

		return () => {
			ro.disconnect();
			window.removeEventListener('pointermove', onMove);
			cancelAnimationFrame(raf);
		};
	});
</script>

<div
	class="motion-bg"
	aria-hidden="true"
>
	<!-- plain photo: shown until the GPU version is ready, or if WebGL is unavailable -->
	<img
		{src}
		alt=""
		class:hidden={gpu}
	/>
	<canvas bind:this={canvas}></canvas>
	<div class="vignette"></div>
</div>

<style>
	.motion-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;

		background: #000;
	}

	img,
	canvas {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
	}

	img.hidden {
		visibility: hidden;
	}

	.vignette {
		position: absolute;
		inset: 0;

		background: radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.55) 100%);
		pointer-events: none;
	}
</style>

"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Stable-fluids background (advection, vorticity confinement, Jacobi pressure projection).
 * Curl noise stirs it so it drifts without a visible loop; the pointer injects velocity and a faint wake.
 */

type Tier = { sim: number; dye: number; iterations: number; interaction: number; fps: number };

const TIERS: Record<"desktop" | "tablet" | "mobile", Tier> = {
  desktop: { sim: 128, dye: 512, iterations: 20, interaction: 1, fps: 60 },
  tablet: { sim: 96, dye: 384, iterations: 12, interaction: 0.5, fps: 60 },
  mobile: { sim: 64, dye: 256, iterations: 8, interaction: 0, fps: 30 },
};

// One hue per theme: purple smoke in light mode, gold in dark. These are the strongest tints the
// fluid may reach; tertiary text keeps AA over them (4.74:1 light, 4.52:1 dark).
const THEMES = {
  light: { paper: "#fafafa", a: "#ece7f7", b: "#ece7f7", lift: 1 },
  dark: { paper: "#0a0a0a", a: "#28231a", b: "#28231a", lift: 0.87 },
};

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

const VERT = `#version 300 es
in vec2 aPos;
uniform vec2 texelSize;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB;
out vec4 fragColor;
`;

// 3D simplex noise by Ian McEwan and Stefan Gustavson (MIT).
const NOISE = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
// Domain-warped so the field keeps changing shape instead of sliding in one direction.
vec2 warp(vec2 p, float t) {
  return p + 0.8 * vec2(snoise(vec3(p * 0.5, t * 0.013)), snoise(vec3(p * 0.5 + 31.7, t * 0.011)));
}
`;

const FRAG = {
  splat: `${HEADER}
uniform sampler2D uTarget;
uniform float aspect, radius, radial, drag;
uniform vec2 point;
uniform vec3 color;
void main() {
  vec2 p = vUv - point;
  p.x *= aspect;
  float g = exp(-dot(p, p) / radius);
  vec3 base = texture(uTarget, vUv).xyz;
  if (drag > 0.0) {
    // Pull the local flow toward the pointer's velocity, so speed sets strength rather than event count.
    fragColor = vec4(mix(base.xy, color.xy, g * drag), base.z, 1.0);
    return;
  }
  // Radial push grows smoothly from zero at the center; normalize(p) would jump there and advect into speckle.
  vec3 add = radial > 0.5 ? vec3(p / sqrt(radius) * color.x, 0.0) : color;
  fragColor = vec4(base + add * g, 1.0);
}`,
  advect: `${HEADER}
uniform sampler2D uVelocity, uSource;
uniform vec2 simTexel;
uniform float dt, dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * simTexel;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  ambient: `${HEADER}
uniform sampler2D uVelocity;
uniform float aspect, time, dt, strength;
${NOISE}
float psi(vec2 p) {
  vec2 q = warp(p, time);
  return snoise(vec3(q, time * 0.021)) + 0.45 * snoise(vec3(q * 2.3 + 11.3, time * 0.034));
}
void main() {
  vec2 p = vec2(vUv.x * aspect, vUv.y) * 1.6;
  float e = 0.02;
  // Curl of a scalar potential is divergence-free, so it stirs without clumping.
  vec2 curl = vec2(psi(p + vec2(0.0, e)) - psi(p - vec2(0.0, e)), -(psi(p + vec2(e, 0.0)) - psi(p - vec2(e, 0.0)))) / (2.0 * e);
  fragColor = vec4(texture(uVelocity, vUv).xy + curl * strength * dt, 0.0, 1.0);
}`,
  source: `${HEADER}
uniform sampler2D uDye;
uniform float aspect, time, dt, rate;
${NOISE}
void main() {
  vec2 p = warp(vec2(vUv.x * aspect, vUv.y) * 1.1, time + 50.0);
  float na = snoise(vec3(p, time * 0.017));
  float nb = snoise(vec3(p + 71.3, time * 0.015));
  vec4 dye = texture(uDye, vUv);
  dye.r += rate * dt * smoothstep(0.25, 0.75, na);
  dye.g += rate * dt * smoothstep(0.35, 0.8, nb);
  fragColor = clamp(dye, 0.0, 1.0);
}`,
  curl: `${HEADER}
uniform sampler2D uVelocity;
void main() {
  float c = texture(uVelocity, vR).y - texture(uVelocity, vL).y - texture(uVelocity, vT).x + texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * c, 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEADER}
uniform sampler2D uVelocity, uCurl;
uniform float curlStrength, dt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force = force / (length(force) + 1e-4) * curlStrength * C * vec2(1.0, -1.0);
  fragColor = vec4(texture(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
}`,
  divergence: `${HEADER}
uniform sampler2D uVelocity;
void main() {
  float d = 0.5 * (texture(uVelocity, vR).x - texture(uVelocity, vL).x + texture(uVelocity, vT).y - texture(uVelocity, vB).y);
  fragColor = vec4(d, 0.0, 0.0, 1.0);
}`,
  clear: `${HEADER}
uniform sampler2D uTexture;
uniform float value;
void main() { fragColor = value * texture(uTexture, vUv); }`,
  pressure: `${HEADER}
uniform sampler2D uPressure, uDivergence;
void main() {
  float p = texture(uPressure, vL).x + texture(uPressure, vR).x + texture(uPressure, vB).x + texture(uPressure, vT).x;
  fragColor = vec4((p - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEADER}
uniform sampler2D uPressure, uVelocity;
void main() {
  vec2 g = 0.5 * vec2(texture(uPressure, vR).x - texture(uPressure, vL).x, texture(uPressure, vT).x - texture(uPressure, vB).x);
  fragColor = vec4(texture(uVelocity, vUv).xy - g, 0.0, 1.0);
}`,
  display: `${HEADER}
uniform sampler2D uDye;
uniform vec3 paper, tintA, tintB;
uniform float lift;
void main() {
  // lift < 1 raises mid-tones so dim hues read as clearly as bright ones; the cap still bounds the result.
  vec2 d = pow(clamp(texture(uDye, vUv).rg, 0.0, 1.0), vec2(lift));
  d = d * d * (3.0 - 2.0 * d);
  float s = d.x + d.y;
  if (s > 1.0) d /= s;
  // A convex mix never gets darker than the capped tints, which keeps text contrast intact.
  fragColor = vec4(paper * (1.0 - d.x - d.y) + tintA * d.x + tintB * d.y, 1.0);
}`,
};

type Program = { program: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

function tierFor(): Tier {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return TIERS.desktop;
  return Math.min(window.innerWidth, window.innerHeight) >= 700 ? TIERS.tablet : TIERS.mobile;
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Bumped when the browser restores a lost GL context, which re-runs the setup below.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false });
    // Without float render targets the page simply keeps its flat background.
    if (!gl || gl.isContextLost() || !gl.getExtension("EXT_color_buffer_float")) return;

    // Everything created here is deleted on cleanup. The context itself stays alive, because React
    // remounts effects in development and a lost context can't be reused by the next mount.
    const owned: (() => void)[] = [];
    let lost = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tier = tierFor();
    let iterations = tier.iterations;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      owned.push(() => gl.deleteShader(s));
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const makeProgram = (src: string): Program => {
      const program = gl.createProgram()!;
      owned.push(() => gl.deleteProgram(program));
      gl.attachShader(program, vert);
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, src));
      gl.bindAttribLocation(program, 0, "aPos");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
      const u: Program["u"] = {};
      const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        u[name] = gl.getUniformLocation(program, name);
      }
      return { program, u };
    };

    let p: Record<keyof typeof FRAG, Program>;
    try {
      p = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, makeProgram(src)])) as typeof p;
    } catch (err) {
      console.warn("Fluid background disabled:", err);
      owned.forEach((free) => free());
      return;
    }

    const quad = gl.createBuffer();
    owned.push(() => gl.deleteBuffer(quad));
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const createFBO = (w: number, h: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo, w, h };
    };
    const createDouble = (w: number, h: number): DoubleFBO => {
      const d = { read: createFBO(w, h), write: createFBO(w, h), swap: () => ([d.read, d.write] = [d.write, d.read]) };
      return d;
    };
    const freeFBO = (f: FBO) => {
      gl.deleteTexture(f.tex);
      gl.deleteFramebuffer(f.fbo);
    };

    let velocity: DoubleFBO, dye: DoubleFBO, pressure: DoubleFBO, divergence: FBO, curl: FBO;
    let aspect = 1;

    const allocate = () => {
      [velocity, dye, pressure].forEach((d) => d && (freeFBO(d.read), freeFBO(d.write)));
      [divergence, curl].forEach((f) => f && freeFBO(f));
      // Half-resolution canvas: the field is soft, so the browser's upscale is invisible and much cheaper.
      canvas.width = Math.max(1, Math.round(window.innerWidth * 0.5));
      canvas.height = Math.max(1, Math.round(window.innerHeight * 0.5));
      aspect = canvas.width / canvas.height;
      const size = (base: number) => (aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)]);
      const [sw, sh] = size(tier.sim);
      const [dw, dh] = size(tier.dye);
      velocity = createDouble(sw, sh);
      pressure = createDouble(sw, sh);
      divergence = createFBO(sw, sh);
      curl = createFBO(sw, sh);
      dye = createDouble(dw, dh);
    };

    const use = (prog: Program) => {
      gl.useProgram(prog.program);
      return prog.u;
    };
    let unit = 0;
    const bind = (loc: WebGLUniformLocation | null, f: FBO) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, f.tex);
      gl.uniform1i(loc, unit++);
    };
    const draw = (u: Program["u"], target: FBO | null, texel: FBO) => {
      gl.uniform2f(u.texelSize, 1 / texel.w, 1 / texel.h);
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.w, target.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      unit = 0;
    };

    const splat = (d: DoubleFBO, x: number, y: number, color: number[], radius: number, radial = false, drag = 0) => {
      const u = use(p.splat);
      bind(u.uTarget, d.read);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, color[0], color[1], color[2]);
      gl.uniform1f(u.radius, radius);
      gl.uniform1f(u.radial, radial ? 1 : 0);
      gl.uniform1f(u.drag, drag);
      draw(u, d.write, d.read);
      d.swap();
    };

    let time = Math.random() * 1000;

    const step = (dt: number) => {
      time += dt;
      let u = use(p.ambient);
      bind(u.uVelocity, velocity.read);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.strength, tier.sim * 0.035);
      draw(u, velocity.write, velocity.read);
      velocity.swap();

      u = use(p.curl);
      bind(u.uVelocity, velocity.read);
      draw(u, curl, velocity.read);

      u = use(p.vorticity);
      bind(u.uVelocity, velocity.read);
      bind(u.uCurl, curl);
      gl.uniform1f(u.curlStrength, 6);
      gl.uniform1f(u.dt, dt);
      draw(u, velocity.write, velocity.read);
      velocity.swap();

      u = use(p.divergence);
      bind(u.uVelocity, velocity.read);
      draw(u, divergence, velocity.read);

      u = use(p.clear);
      bind(u.uTexture, pressure.read);
      gl.uniform1f(u.value, 0.8);
      draw(u, pressure.write, pressure.read);
      pressure.swap();

      u = use(p.pressure);
      for (let i = 0; i < iterations; i++) {
        bind(u.uPressure, pressure.read);
        bind(u.uDivergence, divergence);
        draw(u, pressure.write, pressure.read);
        pressure.swap();
      }

      u = use(p.gradient);
      bind(u.uPressure, pressure.read);
      bind(u.uVelocity, velocity.read);
      draw(u, velocity.write, velocity.read);
      velocity.swap();

      u = use(p.advect);
      bind(u.uVelocity, velocity.read);
      bind(u.uSource, velocity.read);
      gl.uniform2f(u.simTexel, 1 / velocity.read.w, 1 / velocity.read.h);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 0.25);
      draw(u, velocity.write, velocity.read);
      velocity.swap();

      u = use(p.source);
      bind(u.uDye, dye.read);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.rate, 0.28);
      draw(u, dye.write, dye.read);
      dye.swap();

      u = use(p.advect);
      bind(u.uVelocity, velocity.read);
      bind(u.uSource, dye.read);
      gl.uniform2f(u.simTexel, 1 / velocity.read.w, 1 / velocity.read.h);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 0.48);
      draw(u, dye.write, dye.read);
      dye.swap();
    };

    let colors = THEMES.light;
    const readTheme = () => {
      colors = document.documentElement.classList.contains("dark") ? THEMES.dark : THEMES.light;
    };
    const render = () => {
      const u = use(p.display);
      bind(u.uDye, dye.read);
      gl.uniform3fv(u.paper, hex(colors.paper));
      gl.uniform3fv(u.tintA, hex(colors.a));
      gl.uniform3fv(u.tintB, hex(colors.b));
      gl.uniform1f(u.lift, colors.lift);
      draw(u, null, dye.read);
    };

    // Run the field forward so the first frame already shows developed flow instead of an empty page.
    // Semi-Lagrangian advection stays stable at large steps, so a few big ones keep the startup stall short.
    const prewarm = (steps: number) => {
      for (let i = 0; i < steps; i++) step(1 / 15);
    };

    readTheme();
    allocate();
    prewarm(reducedMotion.matches ? 90 : 60);
    render();
    canvas.style.opacity = "1";

    // Pointer input is queued and applied once per frame.
    const pending: { x: number; y: number; dx: number; dy: number; speed: number; travel: number; click: boolean }[] = [];
    let last: { x: number; y: number; t: number } | null = null;
    const interactive = () => tier.interaction > 0 && !reducedMotion.matches;

    const onMove = (e: PointerEvent) => {
      if (!interactive() || (e.pointerType === "touch" && tier === TIERS.desktop)) return;
      const now = performance.now();
      if (last && now - last.t < 100) {
        const dt = Math.max(now - last.t, 1) / 1000;
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const travel = Math.hypot(dx, dy);
        pending.push({ x: e.clientX, y: e.clientY, dx: dx / dt, dy: dy / dt, speed: travel / dt, travel, click: false });
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const onDown = (e: PointerEvent) => {
      if (!interactive() || e.button !== 0) return;
      pending.push({ x: e.clientX, y: e.clientY, dx: 0, dy: 0, speed: 0, travel: 0, click: true });
    };
    const onLeave = () => (last = null);

    const applyInput = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Convert screen px/s into sim texels/s (sim cells are square).
      const toSim = velocity.read.h / h;
      for (const ev of pending.splice(0)) {
        const x = ev.x / w;
        const y = 1 - ev.y / h;
        if (ev.click) {
          splat(velocity, x, y, [tier.sim * 0.6 * tier.interaction, 0, 0], 0.0012, true);
          splat(dye, x, y, [0, 0.1, 0], 0.0009);
          continue;
        }
        // Faster pointer: faster local flow, wider reach, and a stronger wake per pixel travelled.
        const k = Math.min(ev.speed / 1500, 1);
        const drag = 0.85 * tier.interaction;
        splat(velocity, x, y, [ev.dx * toSim, -ev.dy * toSim, 0], 0.0006 + 0.0022 * k, false, drag);
        const wake = Math.min(ev.travel / 30, 1) * (0.03 + 0.5 * k) * tier.interaction;
        splat(dye, x, y, [wake, 0, 0], 0.0003 + 0.0012 * k);
      }
    };

    let raf = 0;
    let prev = performance.now();
    let slowFrames = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = now - prev;
      if (elapsed < 1000 / tier.fps - 2) return;
      prev = now;

      // Adaptive quality: if frames keep running long, spend fewer pressure iterations.
      if (elapsed > 24) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 90 && iterations > 8) {
        iterations = Math.max(8, Math.floor(iterations * 0.6));
        slowFrames = 0;
      }

      applyInput();
      step(Math.min(elapsed / 1000, 1 / 30));
      render();
    };

    const start = () => {
      cancelAnimationFrame(raf);
      pending.length = 0;
      if (reducedMotion.matches) {
        render();
        return;
      }
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };
    start();

    let resizeTimer = 0;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Mobile URL bars change the height while scrolling; only rebuild on real layout changes.
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === lastWidth && Math.abs(h - lastHeight) / lastHeight < 0.25) return;
        lastWidth = w;
        lastHeight = h;
        tier = tierFor();
        iterations = tier.iterations;
        allocate();
        prewarm(reducedMotion.matches ? 90 : 30);
        render();
      }, 200);
    };

    const themeObserver = new MutationObserver(() => {
      readTheme();
      render();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    reducedMotion.addEventListener("change", start);

    // A GPU reset drops the context; hide the canvas until the browser hands a new one back.
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      canvas.style.opacity = "0";
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", start);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      if (!lost) {
        [velocity, dye, pressure].forEach((d) => (freeFBO(d.read), freeFBO(d.write)));
        [divergence, curl].forEach(freeFBO);
        owned.forEach((free) => free());
      }
    };
  }, [generation]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-fluid
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-700"
    />
  );
}

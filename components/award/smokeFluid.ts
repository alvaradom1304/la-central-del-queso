/**
 * Humo sensorial: fluido estable (Stam, «Stable Fluids») en WebGL2, sin dependencias.
 * Advección semilagrangiana, vorticidad (rizos del humo), divergencia y presión por Jacobi.
 * El color del humo se pinta con alfa premultiplicado sobre los fotogramas de la finca.
 *
 * - Lo mueve el reloj único del runtime: quien lo use llama a step(dt) y render() desde subscribe().
 * - Devuelve null si el navegador no puede renderizar a texturas de media precisión: el
 *   llamador muestra la neblina CSS de respaldo.
 * - dispose() libera texturas, framebuffers, programas y búferes.
 */

export interface SmokeFluid {
  /** Tamaño en píxeles CSS del lienzo visible. */
  resize(width: number, height: number): void;
  /**
   * Inyecta humo y empuje. x, y en [0, 1] (origen abajo a la izquierda); dx, dy en pantallas
   * por segundo (1 = cruzar la pantalla en un segundo); color lineal (0–1) que se suma a la densidad.
   */
  splat(x: number, y: number, dx: number, dy: number, color: readonly [number, number, number], radius?: number): void;
  step(dt: number): void;
  render(): void;
  /** Borra humo y velocidad (al pausar o con movimiento reducido). */
  clear(): void;
  /** Disipación de la densidad por segundo: más alta = el humo se va antes. */
  setDissipation(density: number): void;
  readonly lost: boolean;
  dispose(): void;
}

interface Options {
  simResolution?: number;
  dyeResolution?: number;
  pressureIterations?: number;
  curl?: number;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
}
interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap(): void;
}

const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 uTexel;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 outColor;
`;

const FRAG = {
  clear: `${HEAD}
uniform sampler2D uTexture;
uniform float uValue;
void main() { outColor = uValue * texture(uTexture, vUv); }`,

  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 s = exp(-dot(p, p) / uRadius) * uColor;
  outColor = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,

  advect: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uSimTexel;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uSimTexel;
  outColor = texture(uSource, coord) / (1.0 + uDissipation * uDt);
}`,

  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,

  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,

  vorticity: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * uDt;
  outColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,

  pressure: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`,

  gradient: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(v, 0.0, 1.0);
}`,

  // Humo: la densidad se vuelve alfa con una curva que no satura (sin bordes duros) y un ruido
  // fbm lento la rompe en jirones; un poco de grano evita bandas.
  display: `${HEAD}
uniform sampler2D uDye;
uniform float uOpacity;
uniform float uTime;
uniform float uAspect;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
void main() {
  vec3 c = texture(uDye, vUv).rgb;
  float d = max(c.r, max(c.g, c.b));
  vec2 q = vec2(vUv.x * uAspect, vUv.y) * 3.2;
  float n = fbm(q + vec2(uTime * 0.035, -uTime * 0.05) + fbm(q * 0.7 - uTime * 0.02));
  float a = (1.0 - exp(-d * mix(0.35, 1.45, n) * 1.8)) * 0.8 * uOpacity;
  vec3 tint = c / max(d, 0.0001);
  a += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  a = max(a, 0.0);
  outColor = vec4(tint * a, a);
}`,
};

function getResolution(res: number, w: number, h: number) {
  let aspect = w / Math.max(1, h);
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(res);
  const max = Math.round(res * aspect);
  return w > h ? { w: max, h: min } : { w: min, h: max };
}

export function createSmokeFluid(canvas: HTMLCanvasElement, options: Options = {}): SmokeFluid | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  // Renderizar a RGBA16F exige una de estas extensiones; el filtrado lineal de 16F es estándar en WebGL2.
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  const SIM = options.simResolution ?? 112;
  const DYE = options.dyeResolution ?? 448;
  const ITER = options.pressureIterations ?? 14;
  const CURL = options.curl ?? 22;
  const VELOCITY_DISSIPATION = 0.9;
  const PRESSURE = 0.8;
  let densityDissipation = 0.9;
  let clock = 0;
  let lost = false;

  const shaders: WebGLShader[] = [];
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error("smokeFluid: " + log);
    }
    shaders.push(s);
    return s;
  };

  interface Program { program: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }
  const programs: Program[] = [];
  let vs: WebGLShader;
  const make = (frag: string): Program => {
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("smokeFluid: " + gl.getProgramInfoLog(program));
    const u: Program["u"] = {};
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      u[name] = gl.getUniformLocation(program, name);
    }
    const p = { program, u };
    programs.push(p);
    return p;
  };

  let P: Record<keyof typeof FRAG, Program>;
  try {
    vs = compile(gl.VERTEX_SHADER, VERT);
    P = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, make(src)])) as typeof P;
  } catch (err) {
    console.warn(err);
    return null;
  }

  // Cuadrado a pantalla completa.
  const vao = gl.createVertexArray()!;
  const vbo = gl.createBuffer()!;
  const ibo = gl.createBuffer()!;
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const fbos: FBO[] = [];
  const createFBO = (w: number, h: number): FBO | null => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const f = { texture, fbo, width: w, height: h, texelX: 1 / w, texelY: 1 / h };
    fbos.push(f);
    return ok ? f : null;
  };
  const createDouble = (w: number, h: number): DoubleFBO | null => {
    const a = createFBO(w, h);
    const b = createFBO(w, h);
    if (!a || !b) return null;
    const d = { read: a, write: b, swap() { const t = d.read; d.read = d.write; d.write = t; } };
    return d;
  };
  const deleteFBOs = () => {
    for (const f of fbos) {
      gl.deleteTexture(f.texture);
      gl.deleteFramebuffer(f.fbo);
    }
    fbos.length = 0;
  };

  let velocity!: DoubleFBO, dye!: DoubleFBO, pressure!: DoubleFBO, divergence!: FBO, curl!: FBO;
  let cssW = 1, cssH = 1;
  const allocate = () => {
    deleteFBOs();
    const sim = getResolution(SIM, cssW, cssH);
    const dyeRes = getResolution(DYE, cssW, cssH);
    const v = createDouble(sim.w, sim.h);
    const d = createDouble(dyeRes.w, dyeRes.h);
    const p = createDouble(sim.w, sim.h);
    const dv = createFBO(sim.w, sim.h);
    const c = createFBO(sim.w, sim.h);
    if (!v || !d || !p || !dv || !c) return false;
    velocity = v; dye = d; pressure = p; divergence = dv; curl = c;
    return true;
  };

  const use = (p: Program, texel: { texelX: number; texelY: number }) => {
    gl.useProgram(p.program);
    gl.uniform2f(p.u.uTexel, texel.texelX, texel.texelY);
    return p.u;
  };
  let unit = 0;
  const tex = (loc: WebGLUniformLocation | null, f: FBO) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, f.texture);
    gl.uniform1i(loc, unit);
    unit++;
  };
  const blit = (target: FBO | null) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    unit = 0;
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const splatInto = (target: DoubleFBO, x: number, y: number, color: readonly [number, number, number], radius: number) => {
    const u = use(P.splat, target.read);
    tex(u.uTarget, target.read);
    gl.uniform1f(u.uAspect, cssW / cssH);
    gl.uniform2f(u.uPoint, x, y);
    gl.uniform3f(u.uColor, color[0], color[1], color[2]);
    gl.uniform1f(u.uRadius, radius);
    blit(target.write);
    target.swap();
  };

  const api: SmokeFluid = {
    get lost() { return lost; },
    resize(width, height) {
      const w = Math.max(1, Math.round(width));
      const h = Math.max(1, Math.round(height));
      if (w === cssW && h === cssH && velocity) return;
      cssW = w;
      cssH = h;
      // El humo es blando: se dibuja a 0,6× y el CSS lo escala (menos píxeles para el ruido fbm).
      canvas.width = Math.max(1, Math.round(w * 0.6));
      canvas.height = Math.max(1, Math.round(h * 0.6));
      if (!allocate()) lost = true;
    },
    splat(x, y, dx, dy, color, radius = 0.6) {
      if (lost || !velocity) return;
      gl.disable(gl.BLEND);
      const aspect = cssW / cssH;
      const r = (radius / 100) * (aspect > 1 ? aspect : 1);
      splatInto(velocity, x, y, [dx * velocity.read.width, dy * velocity.read.height, 0], r);
      splatInto(dye, x, y, color, r);
    },
    step(rawDt) {
      if (lost || !velocity) return;
      const dt = Math.min(rawDt, 1 / 30);
      clock += dt;
      gl.disable(gl.BLEND);
      let u = use(P.curl, velocity.read);
      tex(u.uVelocity, velocity.read);
      blit(curl);

      u = use(P.vorticity, velocity.read);
      tex(u.uVelocity, velocity.read);
      tex(u.uCurl, curl);
      gl.uniform1f(u.uCurlStrength, CURL);
      gl.uniform1f(u.uDt, dt);
      blit(velocity.write);
      velocity.swap();

      u = use(P.divergence, velocity.read);
      tex(u.uVelocity, velocity.read);
      blit(divergence);

      u = use(P.clear, pressure.read);
      tex(u.uTexture, pressure.read);
      gl.uniform1f(u.uValue, PRESSURE);
      blit(pressure.write);
      pressure.swap();

      for (let i = 0; i < ITER; i++) {
        u = use(P.pressure, pressure.read);
        tex(u.uPressure, pressure.read);
        tex(u.uDivergence, divergence);
        blit(pressure.write);
        pressure.swap();
      }

      u = use(P.gradient, velocity.read);
      tex(u.uPressure, pressure.read);
      tex(u.uVelocity, velocity.read);
      blit(velocity.write);
      velocity.swap();

      u = use(P.advect, velocity.read);
      tex(u.uVelocity, velocity.read);
      tex(u.uSource, velocity.read);
      gl.uniform2f(u.uSimTexel, velocity.read.texelX, velocity.read.texelY);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDissipation, VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      u = use(P.advect, dye.read);
      tex(u.uVelocity, velocity.read);
      tex(u.uSource, dye.read);
      gl.uniform2f(u.uSimTexel, velocity.read.texelX, velocity.read.texelY);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDissipation, densityDissipation);
      blit(dye.write);
      dye.swap();
    },
    render() {
      if (lost || !dye) return;
      gl.disable(gl.BLEND);
      const u = use(P.display, dye.read);
      tex(u.uDye, dye.read);
      gl.uniform1f(u.uOpacity, 1);
      gl.uniform1f(u.uTime, clock);
      gl.uniform1f(u.uAspect, cssW / cssH);
      blit(null);
    },
    clear() {
      if (lost || !velocity) return;
      for (const f of fbos) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    setDissipation(d) {
      densityDissipation = d;
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!gl.isContextLost()) {
        deleteFBOs();
        for (const p of programs) gl.deleteProgram(p.program);
        for (const s of shaders) gl.deleteShader(s);
        gl.deleteBuffer(vbo);
        gl.deleteBuffer(ibo);
        gl.deleteVertexArray(vao);
      }
      // Sin loseContext(): con el doble montaje de React el mismo lienzo vuelve a pedir el contexto.
      lost = true;
    },
  };
  return api;
}

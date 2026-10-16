import * as THREE from 'three';
import gsap from 'gsap';

/* Ashima Arts 3D simplex noise (MIT) */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uW1;
uniform float uW2;
uniform float uW3;
uniform float uW4;
uniform float uNoise;
uniform float uSize;
uniform float uPixelRatio;
uniform float uIntro;
uniform vec3 uMouse;
uniform float uMouseForce;

attribute vec3 aSphere;
attribute vec3 aRing;
attribute vec3 aWave;
attribute vec4 aRandom;

varying float vAlpha;
varying float vTone;

${NOISE}

mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

// per-particle staggered transition so shapes dissolve organically
float stagger(float w, float r){ return smoothstep(r*0.4, r*0.4+0.6, w); }

void main(){
  // 1 · Dust — weightless particles rising slowly (anti-gravity), wrapping around
  vec3 dust = position;
  dust.y = mod(dust.y + 9.0 + uTime*(0.06 + aRandom.z*0.22), 18.0) - 9.0;
  dust.x += sin(uTime*0.18 + aRandom.w*6.2831)*0.35;
  dust.z += cos(uTime*0.15 + aRandom.x*6.2831)*0.25;

  // 2 · Sphere — a planet with a thin ring, slowly spinning
  vec3 sph = aSphere;
  sph.xz = rot(uTime*0.1) * sph.xz;

  // 3 · Galaxy — spiral disc
  vec3 gal = aRing;
  gal.xz = rot(uTime*0.07) * gal.xz;

  // 4 · Wave field — a breathing terrain
  vec3 wav = aWave;
  wav.y += sin(wav.x*0.55 + uTime*0.7)*0.42 + cos(wav.z*0.75 + uTime*0.5)*0.32;

  vec3 p = dust;
  p = mix(p, sph, stagger(uW1, aRandom.x));
  p = mix(p, gal, stagger(uW2, aRandom.y));
  p = mix(p, wav, stagger(uW3, aRandom.x));
  p = mix(p, dust, stagger(uW4, aRandom.y));

  // organic turbulence
  float t = uTime*0.12;
  vec3 q = p*0.32;
  p += vec3(snoise(q + t), snoise(q + t + 17.1), snoise(q + t + 31.7)) * uNoise;

  // intro: particles condense from a wide scattered cloud
  p = mix(p*2.6 + aRandom.xyz*4.0 - 2.0, p, uIntro);

  vec4 world = modelMatrix * vec4(p, 1.0);

  // cursor force field
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float f = smoothstep(1.9, 0.0, dist) * uMouseForce;
  world.xy += normalize(d + 0.0001) * f * 0.85;
  world.z += f * 0.8;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.35 + aRandom.w*aRandom.w*1.6);
  gl_PointSize = size * uPixelRatio * (30.0 / -mv.z);

  vAlpha = (0.22 + aRandom.z*0.78) * uIntro * (1.0 + f*1.8);
  vAlpha *= smoothstep(-26.0, -5.0, mv.z) * smoothstep(-1.0, -2.6, mv.z);
  vTone = aRandom.y;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform float uOpacity;
varying float vAlpha;
varying float vTone;

void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.8);
  vec3 col = vTone < 0.55 ? mix(uC1, uC2, vTone/0.55) : mix(uC2, uC3, (vTone-0.55)/0.45);
  col = mix(col, vec3(1.0), smoothstep(0.22, 0.0, d)*0.55);
  gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  if (gl_FragColor.a < 0.003) discard;
}
`;

/* ---------- Shape generators ---------- */
function rand(a, b) {
  return a + Math.random() * (b - a);
}
function gauss() {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
}

function buildGeometry(count) {
  const dust = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const random = new Float32Array(count * 4);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const cols = Math.ceil(Math.sqrt(count * 1.9));
  const rows = Math.ceil(count / cols);
  const ringTilt = 0.42;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // dust volume
    dust[i3] = rand(-13, 13);
    dust[i3 + 1] = rand(-9, 9);
    dust[i3 + 2] = rand(-9, 3);

    // planet + ring
    if (i % 6 === 0) {
      const a = Math.random() * Math.PI * 2;
      const r = rand(3.3, 4.3);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = gauss() * 0.04;
      sphere[i3] = x;
      sphere[i3 + 1] = y * Math.cos(ringTilt) - z * Math.sin(ringTilt);
      sphere[i3 + 2] = y * Math.sin(ringTilt) + z * Math.cos(ringTilt);
    } else {
      const y = 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const r = 2.35 + gauss() * 0.04;
      sphere[i3] = Math.cos(th) * rad * r;
      sphere[i3 + 1] = y * r;
      sphere[i3 + 2] = Math.sin(th) * rad * r;
    }

    // spiral galaxy (3 arms + bulge)
    if (i % 9 === 0) {
      const r = Math.abs(gauss()) * 0.9;
      const a = Math.random() * Math.PI * 2;
      ring[i3] = Math.cos(a) * r;
      ring[i3 + 1] = gauss() * 0.35;
      ring[i3 + 2] = Math.sin(a) * r;
    } else {
      const arm = i % 3;
      const r = 0.5 + Math.pow(Math.random(), 0.7) * 5.2;
      const a = r * 1.05 + (arm * Math.PI * 2) / 3 + gauss() * (0.55 / (r * 0.35 + 0.6));
      ring[i3] = Math.cos(a) * r + gauss() * 0.12;
      ring[i3 + 1] = gauss() * 0.18 * (1.2 / (r * 0.4 + 0.8));
      ring[i3 + 2] = Math.sin(a) * r + gauss() * 0.12;
    }

    // wave grid
    const cx = i % cols;
    const cz = Math.floor(i / cols);
    wave[i3] = (cx / (cols - 1) - 0.5) * 24;
    wave[i3 + 1] = 0;
    wave[i3 + 2] = (cz / (rows - 1) - 0.5) * 13 - 2.5;

    random[i * 4] = Math.random();
    random[i * 4 + 1] = Math.random();
    random[i * 4 + 2] = Math.random();
    random[i * 4 + 3] = Math.random();
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  g.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3));
  g.setAttribute('aRing', new THREE.BufferAttribute(ring, 3));
  g.setAttribute('aWave', new THREE.BufferAttribute(wave, 3));
  g.setAttribute('aRandom', new THREE.BufferAttribute(random, 4));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
  return g;
}

/* ---------- Scene states (driven by sections via data-particles) ---------- */
const STATES = {
  dust: { w: [0, 0, 0, 0], pos: [0, 0, 0], rot: [0, 0, 0], opacity: 1, noise: 0.18, size: 1 },
  sphere: { w: [1, 0, 0, 0], pos: [3.4, 0, 0], rot: [0.15, 0, -0.12], opacity: 1, noise: 0.08, size: 1, mobile: { pos: [0, 1.6, -3], opacity: 0.5 } },
  ring: { w: [1, 1, 0, 0], pos: [2.6, -0.4, -1], rot: [0.95, 0, -0.35], opacity: 0.9, noise: 0.1, size: 1.05, mobile: { pos: [0, 0.8, -3], opacity: 0.45 } },
  wave: { w: [1, 1, 1, 0], pos: [0, -2.6, 0], rot: [0.12, 0, 0], opacity: 0.75, noise: 0.06, size: 0.9, mobile: { opacity: 0.4 } },
  dust2: { w: [1, 1, 1, 1], pos: [0, 0, 0], rot: [0, 0, 0], opacity: 0.9, noise: 0.22, size: 1 },
  hidden: { opacity: 0 },
};

export class ParticleField {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas;
    this.reduced = reduced;
    this.isMobile = matchMedia('(max-width: 860px)').matches;
    this.count = this.isMobile ? 9000 : 22000;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(99, 99, 0);
    this.mouseTarget = new THREE.Vector3(99, 99, 0);
    this.state = 'dust';

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.uniforms = {
      uTime: { value: 0 },
      uW1: { value: 0 },
      uW2: { value: 0 },
      uW3: { value: 0 },
      uW4: { value: 0 },
      uNoise: { value: STATES.dust.noise },
      uSize: { value: 1 },
      uPixelRatio: { value: 1 },
      uIntro: { value: reduced ? 1 : 0 },
      uMouse: { value: this.mouseWorld },
      uMouseForce: { value: reduced ? 0 : 1 },
      uOpacity: { value: 1 },
      uC1: { value: new THREE.Color('#dfeaff') },
      uC2: { value: new THREE.Color('#6cf0ff') },
      uC3: { value: new THREE.Color('#8d7dff') },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.group = new THREE.Group();
    this.points = new THREE.Points(buildGeometry(this.count), material);
    this.group.add(this.points);
    this.scene.add(this.group);

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.resize();
    addEventListener('resize', this.resize);
    addEventListener('pointermove', (e) => {
      this.mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
      this.mouseTarget.set(this.mouse.x * halfH * this.camera.aspect, this.mouse.y * halfH, 0);
    });
    document.addEventListener('pointerleave', () => this.mouseTarget.set(99, 99, 0));

    gsap.ticker.add(this.tick);
  }

  intro(delay = 0) {
    gsap.to(this.uniforms.uIntro, { value: 1, duration: 3.2, delay, ease: 'expo.out' });
  }

  setState(name) {
    if (!STATES[name] || name === this.state) return;
    this.state = name;
    const base = STATES[name];
    const s = { ...base, ...(this.isMobile ? base.mobile : null) };
    const d = this.reduced ? 0 : 2.4;
    const ease = 'power3.inOut';
    const u = this.uniforms;

    gsap.to(u.uOpacity, { value: s.opacity, duration: name === 'hidden' ? 0.8 : 1.6, ease: 'power2.out', overwrite: true });
    if (name === 'hidden') return;

    gsap.to(u.uW1, { value: s.w[0], duration: d, ease, overwrite: true });
    gsap.to(u.uW2, { value: s.w[1], duration: d, ease, overwrite: true });
    gsap.to(u.uW3, { value: s.w[2], duration: d, ease, overwrite: true });
    gsap.to(u.uW4, { value: s.w[3], duration: d, ease, overwrite: true });
    gsap.to(u.uNoise, { value: s.noise, duration: d, ease, overwrite: true });
    gsap.to(u.uSize, { value: s.size, duration: d, ease, overwrite: true });
    gsap.to(this.group.position, { x: s.pos[0], y: s.pos[1], z: s.pos[2], duration: d, ease, overwrite: true });
    gsap.to(this.group.rotation, { x: s.rot[0], y: s.rot[1], z: s.rot[2], duration: d, ease, overwrite: true });
  }

  resize() {
    const w = innerWidth;
    const h = innerHeight;
    const dpr = Math.min(devicePixelRatio, this.isMobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 1 ? 60 : 45;
    this.camera.updateProjectionMatrix();
    this.uniforms.uPixelRatio.value = dpr * (h / 900);
  }

  tick(_, deltaMs) {
    const dt = Math.min(deltaMs / 1000, 0.05);
    if (!this.reduced) this.uniforms.uTime.value += dt;

    this.mouseWorld.lerp(this.mouseTarget, 0.08);

    // subtle camera parallax
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.03;
    this.camera.position.y += (this.mouse.y * 0.3 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);

    if (this.uniforms.uOpacity.value < 0.005) return;
    this.renderer.render(this.scene, this.camera);
  }
}

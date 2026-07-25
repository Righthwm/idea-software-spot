import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NAV_LINKS } from '../data/content'

/**
 * Global particle layer, fixed behind all content. ~24k GPU points hold a
 * distinct shape per section — sphere, torus knot, double helix, galaxy,
 * asterisk (the logo star) — and the morph is driven by scroll position:
 * leaving a section the shape unravels and rains downward, arriving at the
 * next one the stream gathers into the new shape. Scrolling up reverses it.
 */

const COUNT_HIGH = 24000
const COUNT_LOW = 4200 // phones: back near the original density for all shapes
const SHAPES = 5 // must match NAV_LINKS length

const VERT = /* glsl */ `
uniform float uTime;
uniform float uProg;     // continuous section index 0..4, scroll-driven
uniform vec3 uMouse;     // world-space pointer on the z=0 plane
uniform float uSize;

attribute vec3 aPosB;
attribute vec3 aPosC;
attribute vec3 aPosD;
attribute vec3 aPosE;
attribute vec3 aRand;

varying vec3 vColor;
varying float vAlpha;

float smootherstep01(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

vec3 shapePos(float i) {
  if (i < 0.5) return position;
  if (i < 1.5) return aPosB;
  if (i < 2.5) return aPosC;
  if (i < 3.5) return aPosD;
  return aPosE;
}

vec3 shapeColor(float i) {
  vec3 blue = vec3(0.30, 0.42, 1.0);
  vec3 deep = vec3(0.14, 0.19, 0.94);
  vec3 orange = vec3(1.0, 0.42, 0.20);
  vec3 pink = vec3(1.0, 0.22, 0.50);
  vec3 paper = vec3(0.93, 0.93, 0.95);

  if (i < 0.5) return mix(blue, deep, aRand.y);                       // sphere
  if (i < 1.5) return mix(orange, pink, aRand.x);                     // knot
  if (i < 2.5) return mix(blue, pink, aRand.y * 0.8);                 // helix
  if (i < 3.5) return mix(mix(blue, pink, aRand.y), orange, step(0.85, aRand.z)); // galaxy
  return mix(blue, paper, step(0.72, aRand.x) * aRand.y);             // asterisk
}

void main() {
  float v = clamp(uProg, 0.0, float(${SHAPES - 1}));
  float seg = floor(min(v, float(${SHAPES - 2}) + 0.999));
  float f = v - seg;

  // hold the shape for the first stretch of a section, morph on the way out
  float k = smootherstep01(clamp((f - 0.25) / 0.75, 0.0, 1.0));
  // per-particle stagger so the shape frays instead of moving as one block
  float kk = smootherstep01(clamp(k * 1.35 - aRand.x * 0.35, 0.0, 1.0));

  vec3 A = shapePos(seg);
  vec3 B = shapePos(seg + 1.0);
  vec3 pos = mix(A, B, kk);

  // dissolve peaks mid-transition: unravel, rain downward, swirl
  float dis = sin(kk * 3.14159);
  pos.y -= dis * (1.3 + aRand.z * 2.2);
  pos.x += dis * sin(uTime * (0.5 + aRand.x) + aRand.y * 6.2831) * 0.7;
  pos.z += dis * cos(uTime * (0.4 + aRand.y) + aRand.x * 6.2831) * 0.7;

  // idle shimmer
  float t = uTime * (0.6 + aRand.x * 0.8);
  pos += 0.04 * vec3(
    sin(t + aRand.y * 6.2831),
    cos(t * 1.3 + aRand.z * 6.2831),
    sin(t * 0.7 + aRand.x * 6.2831)
  );

  // cursor repulsion
  vec2 d = pos.xy - uMouse.xy;
  float force = exp(-dot(d, d) * 2.2) * 0.5;
  pos.xy += normalize(d + 0.0001) * force;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand.x) * (5.2 / -mv.z);

  vColor = mix(shapeColor(seg), shapeColor(seg + 1.0), kk);
  vColor *= 1.0 + dis * 0.7; // flare while the stream is in flight

  vAlpha = (0.32 + aRand.z * 0.6) * (1.0 - dis * 0.3);
}
`

const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`

/** Acasă — fibonacci sphere with slight radial jitter. */
function makeSphere(rand: () => number, count: number) {
  const arr = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const rad = 1.65 * (0.96 + rand() * 0.08)
    arr[i * 3] = Math.cos(th) * r * rad
    arr[i * 3 + 1] = y * rad
    arr[i * 3 + 2] = Math.sin(th) * r * rad
  }
  return arr
}

/** Servicii — trefoil torus knot (p=2, q=3) with a fuzzy tube. */
function makeKnot(rand: () => number, count: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = rand() * Math.PI * 2
    const cx = (2 + Math.cos(3 * t)) * Math.cos(2 * t)
    const cy = (2 + Math.cos(3 * t)) * Math.sin(2 * t)
    const cz = Math.sin(3 * t)
    const a = rand() * Math.PI * 2
    const b = rand() * Math.PI * 2
    const tube = 0.16 * Math.sqrt(rand())
    arr[i * 3] = cx * 0.62 + Math.cos(a) * Math.sin(b) * tube
    arr[i * 3 + 1] = cy * 0.62 + Math.sin(a) * Math.sin(b) * tube
    arr[i * 3 + 2] = cz * 0.62 + Math.cos(b) * tube
  }
  return arr
}

/** Proiecte — double helix, echoing the descending card spiral. */
function makeHelix(rand: () => number, count: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const strand = i % 2
    const y = (rand() - 0.5) * 4.2
    const th = y * 2.4 + strand * Math.PI
    const r = 1.05 + (rand() - 0.5) * 0.12
    const fuzz = 0.09
    arr[i * 3] = Math.cos(th) * r + (rand() - 0.5) * fuzz
    arr[i * 3 + 1] = y
    arr[i * 3 + 2] = Math.sin(th) * r + (rand() - 0.5) * fuzz
  }
  return arr
}

/** Despre — three-armed spiral galaxy facing the camera. */
function makeGalaxy(rand: () => number, count: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const arm = i % 3
    const r = Math.pow(rand(), 0.65) * 2.3
    const th = arm * ((Math.PI * 2) / 3) + r * 1.7 + (rand() - 0.5) * 0.45
    const thick = (rand() - 0.5) * 0.28 * Math.exp(-r * 0.5)
    arr[i * 3] = Math.cos(th) * r
    arr[i * 3 + 1] = Math.sin(th) * r * 0.85
    arr[i * 3 + 2] = thick + (rand() - 0.5) * 0.1
  }
  return arr
}

/** Contact — six-armed asterisk, the star from the idea*spot logo. */
function makeAsterisk(rand: () => number, count: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const ray = i % 6
    const th = ray * (Math.PI / 3) + Math.PI / 6
    const len = Math.sqrt(rand()) * 2.0
    // rays taper toward the tips
    const spread = 0.16 * (1 - len / 2.4)
    arr[i * 3] = Math.cos(th) * len + (rand() - 0.5) * spread
    arr[i * 3 + 1] = Math.sin(th) * len + (rand() - 0.5) * spread
    arr[i * 3 + 2] = (rand() - 0.5) * 0.25
  }
  return arr
}

function Particles({
  count,
  sizeScale,
  mobile,
}: {
  count: number
  sizeScale: number
  mobile: boolean
}) {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const group = useRef<THREE.Group>(null!)
  const pointer = useRef({ x: 0, y: 0 })
  const sections = useRef<HTMLElement[]>([])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const geo = useMemo(() => {
    const rand = Math.random
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(makeSphere(rand, count), 3))
    g.setAttribute('aPosB', new THREE.BufferAttribute(makeKnot(rand, count), 3))
    g.setAttribute('aPosC', new THREE.BufferAttribute(makeHelix(rand, count), 3))
    g.setAttribute('aPosD', new THREE.BufferAttribute(makeGalaxy(rand, count), 3))
    g.setAttribute('aPosE', new THREE.BufferAttribute(makeAsterisk(rand, count), 3))
    const rnd = new Float32Array(count * 3)
    for (let i = 0; i < rnd.length; i++) rnd[i] = rand()
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 3))
    return g
  }, [count])

  useFrame((state) => {
    const u = mat.current.uniforms
    u.uTime.value = state.clock.elapsedTime

    // continuous section index from the live section tops (pins shift them)
    if (sections.current.length === 0) {
      sections.current = NAV_LINKS.map(
        (l) => document.querySelector(l.href) as HTMLElement,
      ).filter(Boolean)
    }
    const probe = window.scrollY + window.innerHeight * 0.4
    let target = 0
    const els = sections.current
    for (let i = 0; i < els.length; i++) {
      const top = els[i].getBoundingClientRect().top + window.scrollY
      if (probe >= top) {
        const el2 = els[i + 1]
        const next = el2
          ? el2.getBoundingClientRect().top + window.scrollY
          : document.documentElement.scrollHeight
        target = i + Math.min(1, (probe - top) / Math.max(1, next - top))
      }
    }
    u.uProg.value = THREE.MathUtils.lerp(u.uProg.value, target, 0.07)

    const vp = state.viewport
    u.uMouse.value.set(
      (pointer.current.x * vp.width) / 2,
      (pointer.current.y * vp.height) / 2,
      0,
    )

    // spin while a shape is in flight, land facing the camera when settled
    const g = group.current
    const v = u.uProg.value
    g.rotation.y =
      Math.sin(v * Math.PI) * 1.4 + Math.sin(state.clock.elapsedTime * 0.12) * 0.18
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * -0.22 - 0.08, 0.04)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, pointer.current.x * 0.1, 0.04)
    if (mobile) {
      // Only the hero (uProg≈0) gets the enlarged, airy, near-centered orb;
      // every other section keeps the original compact shape & sprite size.
      const hero = THREE.MathUtils.clamp(1 - u.uProg.value, 0, 1)
      const baseScale = Math.min(1, vp.width / 7.5)
      const heroScale = Math.min(1.05, vp.width / 2.6)
      g.scale.setScalar(THREE.MathUtils.lerp(baseScale, heroScale, hero))
      // small lift so the orb sits a touch above dead-centre behind the copy
      g.position.y = THREE.MathUtils.lerp(g.position.y, vp.height * 0.05 * hero, 0.05)
      // airy sprites on the hero, chunkier original sprites elsewhere
      u.uSize.value = Math.min(2, window.devicePixelRatio) * (3.7 - hero)
    } else {
      g.scale.setScalar(Math.min(1, vp.width / 7.5))
    }
  })

  return (
    <group ref={group}>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uProg: { value: 0 },
            uMouse: { value: new THREE.Vector3(99, 99, 0) },
            uSize: { value: Math.min(2, window.devicePixelRatio) * sizeScale },
          }}
        />
      </points>
    </group>
  )
}

export default function ParticleField({
  ready,
  lowPower,
}: {
  ready: boolean
  lowPower: boolean
}) {
  // Phones: far fewer points, and render at ~0.7× resolution — a soft glowing
  // cloud hides the lower res, and cutting the backing store is the single
  // biggest fill-rate win on mobile GPUs (0.7² ≈ half the pixels of DPR 1).
  const count = lowPower ? COUNT_LOW : COUNT_HIGH
  // Smaller sprites on mobile: spread over a bigger orb they read as airy
  // stars, not a solid blob, and the smaller fill footprint stays cheap.
  const sizeScale = lowPower ? 2.7 : 3.4
  const dpr: number | [number, number] = lowPower ? 0.75 : [1, 1.75]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1500ms]"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Particles count={count} sizeScale={sizeScale} mobile={lowPower} />
      </Canvas>
    </div>
  )
}

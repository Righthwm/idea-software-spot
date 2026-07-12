import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { fxState } from '../lib/fx'

/**
 * Full-viewport fluid shader background, fixed behind all content.
 * Flowing nebula built from fbm noise in the brand palette; scroll
 * progress drifts the field downward-past-you and morphs the hues,
 * scroll velocity pumps the glow, the showcase pin boosts it further.
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform float uBoost;
uniform float uShowcase;
uniform vec2 uRes;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.9;

  // the field flows upward as you scroll down -> feeling of descent
  p.y += uScroll * 4.0;

  float t = uTime * 0.06;

  // slow swirl that winds up with scroll
  float ang = uScroll * 2.2 + t * 0.3;
  p = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p;

  float n1 = fbm(p + vec2(t, -t * 0.7));
  float n2 = fbm(p * 1.6 + vec2(-t * 1.3, t) + n1 * 1.8);
  float n3 = fbm(p * 0.7 - vec2(t * 0.5) + n2);

  vec3 base = vec3(0.039, 0.039, 0.059); // --color-void
  vec3 blue = vec3(0.30, 0.42, 1.0);     // electric
  vec3 deep = vec3(0.14, 0.19, 0.94);    // electric-deep
  vec3 orange = vec3(1.0, 0.35, 0.18);   // signal
  vec3 pink = vec3(1.0, 0.18, 0.48);
  vec3 green = vec3(0.48, 1.0, 0.62);

  // palette morphs as the page scrolls
  float m = uScroll * 6.28318;
  vec3 c1 = mix(blue, pink, 0.5 + 0.5 * sin(m));
  vec3 c2 = mix(orange, green, 0.5 + 0.5 * sin(m * 0.7 + 1.7));
  vec3 c3 = mix(deep, blue, 0.5 + 0.5 * cos(m * 0.5));

  float glow = 1.0 + uBoost * 1.4 + uShowcase * 0.9;
  vec3 col = base;
  col += c3 * smoothstep(0.35, 0.85, n3) * 0.35 * glow;
  col += c1 * smoothstep(0.45, 0.95, n1) * 0.50 * glow;
  col += c2 * smoothstep(0.55, 1.00, n2) * 0.55 * glow;

  // vignette keeps edges quiet and text readable
  float d = length(uv - 0.5);
  col *= 1.0 - d * 0.9;
  col = min(col, vec3(0.85));

  gl_FragColor = vec4(col, 1.0);
}
`

function FXPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const { size } = useThree()

  useFrame((state) => {
    const u = mat.current.uniforms
    u.uTime.value = state.clock.elapsedTime
    // lerp toward the scroll state so hue/boost changes feel liquid
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, fxState.progress, 0.06)
    u.uBoost.value = THREE.MathUtils.lerp(u.uBoost.value, fxState.velocity, 0.08)
    u.uShowcase.value = THREE.MathUtils.lerp(u.uShowcase.value, fxState.showcase, 0.06)
    u.uRes.value.set(size.width, size.height)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        depthTest={false}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uBoost: { value: 0 },
          uShowcase: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
        }}
      />
    </mesh>
  )
}

export default function BackgroundFX({ reduced }: { reduced: boolean }) {
  // feed fxState from native scroll (Lenis keeps native scroll position)
  useEffect(() => {
    let lastY = window.scrollY
    let vel = 0
    let raf = 0

    const tick = () => {
      const y = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      fxState.progress = Math.min(1, Math.max(0, y / max))
      // normalize velocity: ~40px/frame feels "fast"
      vel += (Math.min(1, Math.abs(y - lastY) / 40) - vel) * 0.12
      fxState.velocity = vel
      lastY = y
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (reduced) {
    // static, calm version of the same palette
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 20%, rgba(77,107,255,0.22) 0%, transparent 70%),' +
            'radial-gradient(50% 45% at 85% 30%, rgba(255,90,45,0.14) 0%, transparent 70%),' +
            'radial-gradient(55% 50% at 60% 85%, rgba(255,45,123,0.14) 0%, transparent 70%),' +
            '#0a0a0f',
        }}
      />
    )
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
      >
        <FXPlane />
      </Canvas>
    </div>
  )
}

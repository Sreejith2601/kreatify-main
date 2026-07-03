"use client"

import { useMemo, useRef, memo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"
import { orbTransformRef } from "./carousel"

// ─── 3D Simplex Noise (compact implementation) ──────────────────────────────
// This generates smooth, organic, cloud-like patterns in 3D space.
const F3 = 1.0 / 3.0
const G3 = 1.0 / 6.0

function simplexNoise3D(xin: number, yin: number, zin: number): number {
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
  ]
  const perm = new Uint8Array(512)
  // Standard permutation table (precomputed, no seeding artifacts)
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
  for (let i = 0; i < 256; i++) { perm[i] = p[i]; perm[i + 256] = p[i]; }
  // perm table already doubled above

  const s = (xin + yin + zin) * F3
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const k = Math.floor(zin + s)
  const t = (i + j + k) * G3
  const X0 = i - t, Y0 = j - t, Z0 = k - t
  const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0

  let i1: number, j1: number, k1: number
  let i2: number, j2: number, k2: number
  if (x0 >= y0) {
    if (y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
    else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
    else               { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
  } else {
    if (y0 < z0)       { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
    else if (x0 < z0)  { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
    else               { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
  }

  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3
  const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3
  const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3

  const ii = ((i % 256) + 256) % 256
  const jj = ((j % 256) + 256) % 256
  const kk = ((k % 256) + 256) % 256

  const dot = (g: number[], x: number, y: number, z: number) => g[0]*x + g[1]*y + g[2]*z

  let n0 = 0, n1 = 0, n2 = 0, n3 = 0
  let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
  if (t0 > 0) { t0 *= t0; const gi = perm[ii + perm[jj + perm[kk]]] % 12; n0 = t0 * t0 * dot(grad3[gi], x0, y0, z0) }
  let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
  if (t1 > 0) { t1 *= t1; const gi = perm[ii+i1 + perm[jj+j1 + perm[kk+k1]]] % 12; n1 = t1 * t1 * dot(grad3[gi], x1, y1, z1) }
  let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
  if (t2 > 0) { t2 *= t2; const gi = perm[ii+i2 + perm[jj+j2 + perm[kk+k2]]] % 12; n2 = t2 * t2 * dot(grad3[gi], x2, y2, z2) }
  let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
  if (t3 > 0) { t3 *= t3; const gi = perm[ii+1 + perm[jj+1 + perm[kk+1]]] % 12; n3 = t3 * t3 * dot(grad3[gi], x3, y3, z3) }

  return 32.0 * (n0 + n1 + n2 + n3) // Returns value between -1 and 1
}

// ─── Custom Shader: Sharp Glassy Sphere (Fix 2 + Fix 4) ─────────────────────
const sphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vPosition = position;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const sphereFragmentShader = `
  uniform vec3 colorTop;
  uniform vec3 colorMiddle;
  uniform vec3 colorBottom;
  uniform vec3 glowColor;
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vPosition;

  // Smooth 3D noise function
  float smoothNoise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n = i.x + i.y * 157.0 + 113.0 * i.z;
      return mix(
          mix(mix(fract(sin(n + 0.0) * 43758.5453), fract(sin(n + 1.0) * 43758.5453), f.x),
              mix(fract(sin(n + 157.0) * 43758.5453), fract(sin(n + 158.0) * 43758.5453), f.x), f.y),
          mix(mix(fract(sin(n + 113.0) * 43758.5453), fract(sin(n + 114.0) * 43758.5453), f.x),
              mix(fract(sin(n + 270.0) * 43758.5453), fract(sin(n + 271.0) * 43758.5453), f.x), f.y), f.z);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Calculate Y-based gradient (-2.3 to 2.3 approx)
    float normalizedY = clamp((vPosition.y + 2.3) / 4.6, 0.0, 1.0);

    vec3 baseColor;
    if (normalizedY > 0.6) {
      baseColor = mix(colorMiddle, colorTop, (normalizedY - 0.6) / 0.4);
    } else {
      baseColor = mix(colorBottom, colorMiddle, normalizedY / 0.6);
    }

    // Add cloudy 3D noise texture to the surface so rotation is visible
    float noiseVal = smoothNoise(vPosition * 1.5 + uTime * 0.15);
    baseColor += (noiseVal - 0.5) * 0.15;

    // Thin crisp Fresnel rim (cell membrane)
    float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
    fresnel = pow(fresnel, 5.0);

    // Soft diagonal highlight — very narrow, only lights a small patch
    vec3 halfVec = normalize(normalize(vec3(1.5, -0.6, 2.0)) + viewDir);
    float spec = max(dot(normal, halfVec), 0.0);
    spec = pow(spec, 32.0) * 0.45;

    vec3 finalColor = baseColor;
    finalColor = mix(finalColor, glowColor, fresnel * 0.6);
    finalColor += glowColor * spec;

    gl_FragColor = vec4(finalColor, 0.55);
  }
`

function BaseSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12
      meshRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.3, 128, 128]} />
      <meshPhysicalMaterial
        transmission={0.65}
        thickness={0.8}
        roughness={0.06}
        ior={1.18}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        envMapIntensity={2.5}
        color="#ffb59a"
        attenuationColor="#f26f52"
        attenuationDistance={0.6}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Reusable Particle Texture ────────────────────────────────────────────────
function createParticleTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, "rgba(255,255,255,1)")
    g.addColorStop(0.5, "rgba(255,255,255,0.85)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
  }
  return new THREE.CanvasTexture(canvas)
}

// ─── Custom Shaders for Interior Particles (Fix 1: Fluid-Like Swirling Wave motion)
const particleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uScrollVelocity;
  uniform vec2 uMouse;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
    vColor = customColor;
    vec3 pos = position;

    // Fade out displacement at the edges to maintain a perfect outer sphere boundary
    float distNorm = length(position) / 1.95;
    float waveScale = (1.0 - clamp(distNorm, 0.0, 1.0)) * 0.38;

    // 1. S-Wave propagation along the vertical Y-axis (snake-like traveling wave)
    pos.x += sin(pos.y * 5.2 - uTime * 4.8) * waveScale * 1.45;
    pos.z += cos(pos.y * 5.2 - uTime * 4.8) * waveScale * 1.45;

    // 2. Scroll-responsive horizontal inertia lag (sloshing)
    // Shift is in the opposite direction (lag) of container travel.
    float scrollOffset = clamp(uScrollVelocity * -0.015, -0.6, 0.6) * waveScale;
    pos.x += scrollOffset;

    // 3. Interactive Cursor Repulsion Force Field
    // Map uMouse (NDC -1 to 1) to world coordinate space bounds (approx [-3.1, 3.1])
    vec2 mouseWorldPos = uMouse * 3.1;
    float distToMouse = distance(pos.xy, mouseWorldPos);
    if (distToMouse < 1.0) {
      float force = (1.0 - distToMouse / 1.0) * 0.45;
      vec2 dir = normalize(pos.xy - mouseWorldPos);
      if (distToMouse < 0.01) {
        dir = vec2(1.0, 0.0);
      }
      pos.xy += dir * force * waveScale;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuate point size by distance to camera
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
  }
`;

const particleFragmentShader = `
  uniform sampler2D uMap;
  varying vec3 vColor;

  void main() {
    vec4 texColor = texture2D(uMap, gl_PointCoord);
    if (texColor.a < 0.01) discard;
    gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * 0.85);
  }
`;

// ─── Fix 1: Fluid-Like Swirling Particles with Dense Core ───────────────────
function InteriorParticles() {
  const ref = useRef<THREE.Points>(null)
  const lastLeft = useRef(orbTransformRef.current.left)
  const velocity = useRef(0)
  const mouseSmooth = useRef(new THREE.Vector2(0, 0))

  const circleTexture = useMemo(() => {
    if (typeof window !== "undefined") return createParticleTexture()
    return null
  }, [])

  const { positions, colors } = useMemo(() => {
    const count = 3500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const radius = 2.34

    const cRed     = new THREE.Color("#6b0c0c")  // Deep dark red
    const cRust    = new THREE.Color("#8f1313")  // Rich dark crimson
    const cCopper  = new THREE.Color("#c22727")  // Ruby red highlight
    const cDark    = new THREE.Color("#300303")  // Intense black-maroon core

    // Dense core position (slightly below center)
    const coreX = 0, coreY = -0.4, coreZ = 0

    let placed = 0
    let attempts = 0
    const maxAttempts = count * 20

    while (placed < count && attempts < maxAttempts) {
      attempts++

      // Random point in sphere volume
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const rRaw = Math.pow(Math.random(), 0.35) * radius  // Bias toward surface
      
      const x = rRaw * Math.sin(phi) * Math.cos(theta)
      const y = rRaw * Math.cos(phi)  // Y is vertical (up)
      const z = rRaw * Math.sin(phi) * Math.sin(theta)

      // Distance from the dense core
      const dx = x - coreX, dy = y - coreY, dz = z - coreZ
      const distFromCore = Math.sqrt(dx*dx + dy*dy + dz*dz)

      // 3D Simplex Noise: creates organic swirl patterns
      // Multiple octaves layered for complexity
      const noiseScale = 1.8
      const n1 = simplexNoise3D(x * noiseScale, y * noiseScale, z * noiseScale)
      const n2 = simplexNoise3D(x * noiseScale * 2.5 + 5.0, y * noiseScale * 2.5 + 3.0, z * noiseScale * 2.5 + 7.0) * 0.5
      const noise = n1 + n2

      // Core density boost — particles near the core are much more likely to be placed
      const coreBias = Math.exp(-distFromCore * distFromCore * 0.8) * 0.6

      // Acceptance probability: noise creates density variation, floor ensures full coverage
      const noiseAccept = Math.max(0, noise * 0.35 + 0.55) // Higher baseline = more particles everywhere
      const acceptance = Math.max(0.15, noiseAccept) + coreBias // Floor of 0.15 = always some particles
      
      if (Math.random() < acceptance) {
        positions[placed * 3]     = x
        positions[placed * 3 + 1] = y
        positions[placed * 3 + 2] = z

        // Color: core particles are very dark, surface particles are copper/rust
        const distNorm = rRaw / radius
        const coreIntensity = Math.exp(-distFromCore * distFromCore * 1.2)
        
        const c = new THREE.Color()
        if (coreIntensity > 0.5) {
          // Dense core: dark crimson to red
          c.copy(cDark).lerp(cRed, Math.random() * 0.4)
        } else if (noise > 0.3) {
          // Dense swirl bands: rust/red
          c.copy(cRust).lerp(cRed, Math.random() * 0.5)
        } else {
          // Sparse areas: copper/orange, some white sparkle
          if (Math.random() < 0.15) {
            c.set("#ffffff")  // Occasional white sparkle
          } else {
            c.copy(cCopper).lerp(cRust, Math.random() * 0.6)
          }
        }

        colors[placed * 3]     = c.r
        colors[placed * 3 + 1] = c.g
        colors[placed * 3 + 2] = c.b

        placed++
      }
    }

    // If we didn't fill all particles, trim arrays
    return {
      positions: positions.subarray(0, placed * 3),
      colors: colors.subarray(0, placed * 3),
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.14 },
      uScrollVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMap: { value: circleTexture },
    }),
    [circleTexture]
  )

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.06
      ref.current.rotation.x += delta * 0.015

      // Smoothly lerp mouse coordinates to prevent physics jitter
      mouseSmooth.current.lerp(state.pointer, 0.15)

      // Calculate horizontal motion speed per frame
      const currentLeft = orbTransformRef.current.left
      const diff = currentLeft - lastLeft.current
      lastLeft.current = currentLeft

      // Calculate instantaneous speed, smoothing out jitter
      const targetVel = diff / Math.max(delta, 0.001)
      velocity.current = THREE.MathUtils.lerp(velocity.current, targetVel, 0.15)

      // Decay velocity slowly back to zero when scrolling stops
      if (Math.abs(diff) < 0.001) {
        velocity.current = THREE.MathUtils.lerp(velocity.current, 0, 0.1)
      }
      
      const material = ref.current.material as THREE.ShaderMaterial
      if (material) {
        if (material.uniforms.uTime) {
          material.uniforms.uTime.value = state.clock.elapsedTime
        }
        if (material.uniforms.uScrollVelocity) {
          material.uniforms.uScrollVelocity.value = velocity.current
        }
        if (material.uniforms.uMouse) {
          material.uniforms.uMouse.value.copy(mouseSmooth.current)
        }
      }
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-customColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Inward Glowing Particles: Materialize outside and travel slowly inward ──
const inwardVertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = vec3(1.0, 0.584, 0.463); // Warm coral-orange sparks (#ff9576)

    // Slow inward traveling motion
    float speed = 0.12; 
    float shrink = fract(aPhase - uTime * speed); 

    // Radial distance goes from 1.45 (outside) to 0.70 (inside)
    float baseRadius = 2.3;
    float currentRadius = baseRadius * (1.45 - shrink * 0.75);

    // Position is direction (position attribute) * radius
    vec3 pos = position * currentRadius;

    // Gentle swirling vortex rotation as they travel inward
    float angle = shrink * 1.8; 
    float cosA = cos(angle);
    float sinA = sin(angle);
    float newX = pos.x * cosA - pos.z * sinA;
    float newZ = pos.x * sinA + pos.z * cosA;
    pos.x = newX;
    pos.z = newZ;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = uSize * (300.0 / -mvPosition.z);

    // Fade in as they spawn outside, peak at boundary, fade out inside
    vAlpha = sin(shrink * 3.14159);
  }
`;

const inwardFragmentShader = `
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 texColor = texture2D(uMap, gl_PointCoord);
    if (texColor.a < 0.01) discard;
    gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha * 0.85);
  }
`;

function ExternalSparks() {
  const ref = useRef<THREE.Points>(null)

  const circleTexture = useMemo(() => {
    if (typeof window !== "undefined") return createParticleTexture()
    return null
  }, [])

  const { directions, phases } = useMemo(() => {
    const count = 2200
    const directions = new Float32Array(count * 3)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      const surfX = Math.sin(phi) * Math.cos(theta)
      const surfY = Math.sin(phi) * Math.sin(theta)
      const surfZ = Math.cos(phi)

      directions[i * 3]     = surfX
      directions[i * 3 + 1] = surfY
      directions[i * 3 + 2] = surfZ

      phases[i] = Math.random()
    }

    return { directions, phases }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.12 },
      uMap: { value: circleTexture },
    }),
    [circleTexture]
  )

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002
      
      const material = ref.current.material as THREE.ShaderMaterial
      if (material && material.uniforms.uTime) {
        material.uniforms.uTime.value = state.clock.elapsedTime
      }
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[directions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={inwardVertexShader}
        fragmentShader={inwardFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Interactive Sparks Component: Ejects sparks when cursor exits sphere ────
interface Spark {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  age: number
  maxAge: number
  color: THREE.Color
}

function InteractiveSparks() {
  const pointsRef = useRef<THREE.Points>(null)
  const sparks = useRef<Spark[]>([])
  const prevPointerDistance = useRef<number>(0)
  const prevPointer = useRef(new THREE.Vector2(0, 0))
  
  // Pre-generate dynamic arrays for WebGL buffers (capped to 800 for high-fps physics loop)
  const maxSparks = 800
  const positions = useMemo(() => new Float32Array(maxSparks * 3), [])
  const colors = useMemo(() => new Float32Array(maxSparks * 3), [])

  const circleTexture = useMemo(() => {
    if (typeof window !== "undefined") return createParticleTexture()
    return null
  }, [])

  useFrame((state, delta) => {
    const currentPointer = state.pointer // [-1, 1] screen space
    const mouseX = currentPointer.x * 3.1
    const mouseY = currentPointer.y * 3.1
    const mousePos = new THREE.Vector2(mouseX, mouseY)
    const currDistance = mousePos.length()
    
    const prevDist = prevPointerDistance.current
    const mouseSpeed = mousePos.distanceTo(prevPointer.current) / Math.max(delta, 0.001)

    // Inner Core / Border Continuous Emission:
    // Any time the cursor is inside the sphere (radius <= 2.3) and moving,
    // we spawn a rich trail of sparks.
    if (currDistance <= 2.3 && mouseSpeed > 1.5) {
      // Spawn rate scaled to cursor speed
      const spawnRate = Math.min(22, Math.max(3, Math.floor(mouseSpeed * 1.3)))
      const centerDir = mousePos.clone().normalize()
      
      // Calculate mouse travel direction
      const diffX = mousePos.x - prevPointer.current.x
      const diffY = mousePos.y - prevPointer.current.y
      const mouseVelDir = new THREE.Vector3(diffX, diffY, 0).normalize()
      const radialDir = new THREE.Vector3(centerDir.x, centerDir.y, 0)

      const sparkColors = [
        new THREE.Color("#FFFFFF"),
        new THREE.Color("#ffd0bc"), // light peach
        new THREE.Color("#ffb59a"), // warm coral
        new THREE.Color("#f26f52"), // terracotta red-orange
      ]

      for (let i = 0; i < spawnRate; i++) {
        if (sparks.current.length >= maxSparks) {
          sparks.current.shift()
        }
        
        // Blend outward radial direction (65%) with the drag/swipe direction of the cursor (35%)
        // Plus a dynamic fan spread to create a gorgeous spray
        const angleSpread = (Math.random() - 0.5) * 1.2
        const dir = new THREE.Vector3().addVectors(
          radialDir.clone().multiplyScalar(0.65),
          mouseVelDir.clone().multiplyScalar(0.35)
        ).normalize()
        dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), angleSpread)
        
        // Travel speed: fast enough to escape the sphere boundary
        const speed = 2.8 + Math.random() * 4.0 + mouseSpeed * 0.12
        const vx = dir.x * speed
        const vy = dir.y * speed
        const vz = (Math.random() - 0.5) * 1.5

        sparks.current.push({
          x: mouseX,
          y: mouseY,
          z: (Math.random() - 0.5) * 0.4,
          vx,
          vy,
          vz,
          age: 0,
          maxAge: 0.8 + Math.random() * 0.9, // longer life so they can travel out
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        })
      }
    }

    // Cache coordinates for next frame check
    prevPointerDistance.current = currDistance
    prevPointer.current.copy(mousePos)

    // Gentle drag to allow particles to travel a long distance before stopping
    const drag = Math.pow(0.92, delta * 60)

    // Update particles physics simulation
    sparks.current = sparks.current.filter((spark) => {
      spark.x += spark.vx * delta
      spark.y += spark.vy * delta
      spark.z += spark.vz * delta

      spark.vx *= drag
      spark.vy *= drag
      spark.vz *= drag

      spark.age += delta
      return spark.age < spark.maxAge
    })

    // Fill buffer attributes arrays (0-out empty slots)
    positions.fill(0)
    colors.fill(0)

    sparks.current.forEach((spark, index) => {
      if (index >= maxSparks) return
      
      const idx3 = index * 3
      positions[idx3]     = spark.x
      positions[idx3 + 1] = spark.y
      positions[idx3 + 2] = spark.z

      // Quadratic ease-out fade
      const lifeRatio = spark.age / spark.maxAge
      const alpha = Math.max(0, 1.0 - (lifeRatio * lifeRatio))

      colors[idx3]     = spark.color.r * alpha
      colors[idx3 + 1] = spark.color.g * alpha
      colors[idx3 + 2] = spark.color.b * alpha
    })

    // Tell WebGL attributes to update
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute
      const colAttr = geom.getAttribute("color") as THREE.BufferAttribute
      
      
      if (posAttr) posAttr.needsUpdate = true
      if (colAttr) colAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
          count={maxSparks}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute 
          attach="attributes-color" 
          args={[colors, 3]} 
          count={maxSparks}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={circleTexture || undefined}
        alphaTest={0.001}
      />
    </points>
  )
}

// ─── Scene Composition ────────────────────────────────────────────────────────
function AnimatedScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport, size } = useThree()

  useFrame(() => {
    if (groupRef.current) {
      const { left, top, scale } = orbTransformRef.current
      
      // Calculate WebGL world offsets
      const offsetX = left - 50
      const offsetY = top - 50
      
      const x = (offsetX / 100) * viewport.width
      const y = -(offsetY / 100) * viewport.height
      
      // Calculate original scale factor to match the old HTML container size
      const oldH = Math.min(size.width, size.height) * 0.78 * 2.28
      const baseScale = oldH / size.height

      groupRef.current.position.set(x, y, 0)
      groupRef.current.scale.setScalar(baseScale * scale)
    }
  })

  return (
    <group ref={groupRef}>
      <BaseSphere />
      <InteriorParticles />
      <ExternalSparks />
      <InteractiveSparks />
    </group>
  )
}

export const ParticleSphere = memo(function ParticleSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.35]}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffd0bc" />
      <pointLight position={[-4, 2, 3]} intensity={45} color="#ff9576" />
      <pointLight position={[4, -2, -3]} intensity={20} color="#f26f52" />
      <AnimatedScene />
      <Environment preset="sunset" background={false} environmentIntensity={1.5} />
    </Canvas>
  )
})

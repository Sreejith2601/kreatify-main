"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"

function Network() {
  const pointsRef = useRef<THREE.Points>(null)

  const { nodes, linePositions } = useMemo(() => {
    const nodeCount = 90
    const nodes: THREE.Vector3[] = []
    const radius = 1.35

    for (let i = 0; i < nodeCount; i++) {
      // random points inside a sphere
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize()
      const r = radius * Math.cbrt(Math.random())
      nodes.push(dir.multiplyScalar(r))
    }

    // connect nearby nodes
    const linePts: number[] = []
    const threshold = 0.62
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          linePts.push(nodes[i].x, nodes[i].y, nodes[i].z)
          linePts.push(nodes[j].x, nodes[j].y, nodes[j].z)
        }
      }
    }

    return {
      nodes: new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])),
      linePositions: new Float32Array(linePts),
    }
  }, [])

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#f0c2ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

function Orb() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18
    }
  })

  return (
    <group ref={groupRef} position={[-1.4, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.25}
          roughness={0.05}
          ior={1.15}
          chromaticAberration={0.35}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.5}
          attenuationColor="#ee6060ff"
          color="#d76d3cff"
          transparent
          opacity={0.5}
        />
      </mesh>
      <Network />
    </group>
  )
}

export function GlassOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#108a1eff" />
      <pointLight position={[-4, 2, 3]} intensity={40} color="#dc740cff" />
      <pointLight position={[4, -2, -3]} intensity={15} color="#B8860B" />
      <Orb />
      <Environment preset="sunset" background={false} environmentIntensity={1.2} />
    </Canvas>
  )
}

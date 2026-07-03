"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

function MirrorBall() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
    }
  })

  return (
    <mesh ref={ref} position={[-1.6, 0, 0]}>
      <icosahedronGeometry args={[2.8, 12]} />
      <meshStandardMaterial
        metalness={1}
        roughness={0.12}
        flatShading
        envMapIntensity={1.6}
      />
    </mesh>
  )
}

export function DiscoBall() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} />
      {/* Colorful lights so mirror facets reflect pink / purple / yellow / blue */}
      <pointLight position={[5, 3, 5]} intensity={80} color="#ff4fa3" />
      <pointLight position={[-5, 2, 4]} intensity={80} color="#8a5cff" />
      <pointLight position={[3, -4, 6]} intensity={70} color="#ffd84f" />
      <pointLight position={[-4, -3, 3]} intensity={70} color="#4fb8ff" />
      <MirrorBall />
      <Environment preset="sunset" />
    </Canvas>
  )
}

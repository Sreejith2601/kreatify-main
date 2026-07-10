"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

const particleCount = 400

function DataSwarm() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // We use a dummy object to calculate matrix transformations efficiently
  const { dummy } = useMemo(() => {
    return {
      dummy: new THREE.Object3D(),
    }
  }, [])

  // Generate perfect spherical distribution of particles
  const particles = useMemo(() => {
    const temp = []
    const radius = 1.8
    for (let i = 0; i < particleCount; i++) {
      // Golden ratio spiral for even distribution
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      
      const r = radius * (0.8 + Math.random() * 0.2) // slight variation in radius

      const x = r * Math.cos(theta) * Math.sin(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(phi)

      temp.push({ 
        x, 
        y, 
        z, 
        rotation: Math.random() * Math.PI, 
        scale: 0.04 + Math.random() * 0.12 
      })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slowly rotate the entire swarm
      meshRef.current.rotation.y += delta * 0.1
      meshRef.current.rotation.x += delta * 0.05
      
      const t = state.clock.elapsedTime
      
      particles.forEach((p, i) => {
        // Individual particle gentle floating animation
        const yOffset = Math.sin(t * 0.8 + p.x) * 0.1
        
        dummy.position.set(p.x, p.y + yOffset, p.z)
        // Individual particle rotation
        dummy.rotation.set(p.rotation + t * 0.2, p.rotation + t * 0.3, p.rotation)
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()
        
        meshRef.current!.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      {/* A sharp, faceted geometric crystal shape */}
      <octahedronGeometry args={[1, 0]} />
      {/* Emerald & Champagne Gold Material */}
      <meshPhysicalMaterial
        color="#094A2D"           // Deep Emerald Green base
        emissive="#D4AF37"        // Champagne Gold glow
        emissiveIntensity={0.65}
        roughness={0.15}
        metalness={0.8}
        transmission={0.9}        // Glass-like transmission
        thickness={0.5}
        clearcoat={1}
      />
    </instancedMesh>
  )
}

export function GlassOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#D4AF37" />
      <pointLight position={[-4, 2, 3]} intensity={12} color="#094A2D" />
      <pointLight position={[4, -2, -3]} intensity={8} color="#F9E596" />
      <DataSwarm />
      {/* 'city' environment gives great sharp reflections for the metal/glass */}
      <Environment preset="city" environmentIntensity={0.6} />
    </Canvas>
  )
}

"use client"

import { useEffect, useRef, memo } from "react"

export const BackgroundRipples = memo(function BackgroundRipples() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) {
      console.warn("WebGL not supported in this browser.")
      return
    }

    // --- WebGL Shaders Setup ---
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseStrength;
      uniform float uAspect;
      uniform float uScrollPulse;

      void main() {
        // 1. Aspect correction for mouse distance calculations
        vec2 aspectUv = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0);
        vec2 aspectMouse = uMouse * vec2(uAspect, 1.0);
        float dist = distance(aspectUv, aspectMouse);

        // 2. Liquid Refraction Wave Ripple from Mouse (Fluid Distortion)
        // A propagating sine wave that decays exponentially with distance
        float wave = sin(dist * 15.0 - uTime * 4.5) * exp(-dist * 2.4) * uMouseStrength * 0.065;
        
        // Dynamic horizontal/vertical liquid swelling (swirl)
        float slowSwirlX = sin(vUv.y * 5.0 + uTime * 0.8) * 0.0035;
        float slowSwirlY = cos(vUv.x * 5.0 + uTime * 0.8) * 0.0035;
        
        // Scroll swell wave (vertical displacement wave)
        float scrollWave = sin(vUv.y * 8.0 - uTime * 5.0) * uScrollPulse * 0.016;

        // Displace the coordinates used to fetch the gradient
        vec2 distortedUv = vUv;
        if (dist > 0.001) {
          distortedUv.x += wave * ((aspectUv.x - aspectMouse.x) / dist) + slowSwirlX;
          distortedUv.y += wave * ((aspectUv.y - aspectMouse.y) / dist) + slowSwirlY + scrollWave;
        } else {
          distortedUv.x += slowSwirlX;
          distortedUv.y += slowSwirlY + scrollWave;
        }

        // 3. Base background gradient colors (using blueyard's exact tones)
        vec3 colorTop = vec3(0.97, 0.93, 0.78);    // #f8edc8
        vec3 colorMiddle = vec3(0.98, 0.85, 0.69); // #fad9b0
        vec3 colorBottom = vec3(0.98, 0.74, 0.58); // #f9bd94

        vec3 finalColor;
        if (distortedUv.y > 0.55) {
          float t = (distortedUv.y - 0.55) / 0.45;
          finalColor = mix(colorMiddle, colorTop, clamp(t, 0.0, 1.0));
        } else {
          float t = distortedUv.y / 0.55;
          finalColor = mix(colorBottom, colorMiddle, clamp(t, 0.0, 1.0));
        }

        // 4. Gradient Darkening under Mouse (Vortex Shading)
        // Adds dark copper vignette (#8a341c) based on mouse strength and scroll
        float darken = exp(-dist * dist * 3.5) * uMouseStrength * 0.28;
        darken += uScrollPulse * 0.12;

        vec3 darkColor = vec3(0.54, 0.20, 0.11);
        finalColor = mix(finalColor, darkColor, clamp(darken, 0.0, 0.5));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    // Compile shader helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER)
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL program link error:", gl.getProgramInfoLog(program))
      return
    }

    gl.useProgram(program)

    // Full screen quad geometry
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "uTime")
    const uMouseLoc = gl.getUniformLocation(program, "uMouse")
    const uMouseStrengthLoc = gl.getUniformLocation(program, "uMouseStrength")
    const uAspectLoc = gl.getUniformLocation(program, "uAspect")
    const uScrollPulseLoc = gl.getUniformLocation(program, "uScrollPulse")

    // --- Interaction State tracking ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0, speed: 0, lastX: 0, lastY: 0 }
    const scroll = { lastY: 0, speed: 0, pulse: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2.0 - 1.0
      mouse.targetY = -(e.clientY / window.innerHeight) * 2.0 + 1.0
      
      const dx = e.clientX - mouse.lastX
      const dy = e.clientY - mouse.lastY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      mouse.lastX = e.clientX
      mouse.lastY = e.clientY
      mouse.speed = mouse.speed * 0.85 + dist * 0.15

      mouse.targetStrength = 1.0
    }

    const handleMouseLeave = () => {
      mouse.targetStrength = 0.0
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = Math.abs(currentScrollY - scroll.lastY)
      scroll.lastY = currentScrollY
      
      if (diff > 5) {
        scroll.pulse = Math.min(1.5, scroll.pulse + diff * 0.06)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("scroll", handleScroll, { passive: true })

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationId: number
    let startTime = performance.now()

    // Render loop
    const render = () => {
      const time = (performance.now() - startTime) * 0.001

      // 1. Interpolations for fluid motion (lerping targets)
      mouse.x = mouse.x * 0.88 + mouse.targetX * 0.12
      mouse.y = mouse.y * 0.88 + mouse.targetY * 0.12
      
      // If mouse speed falls low, decay target strength to zero
      mouse.speed *= 0.90
      if (mouse.speed < 0.8) {
        mouse.targetStrength = 0.0
      }

      mouse.strength = mouse.strength * 0.92 + mouse.targetStrength * 0.08
      scroll.pulse *= 0.94

      // 2. Clear and bind
      gl.clear(gl.COLOR_BUFFER_BIT)

      // 3. Set Uniforms
      gl.uniform1f(uTimeLoc, time)
      gl.uniform2f(uMouseLoc, mouse.x, mouse.y)
      gl.uniform1f(uMouseStrengthLoc, mouse.strength)
      gl.uniform1f(uAspectLoc, canvas.width / canvas.height)
      gl.uniform1f(uScrollPulseLoc, scroll.pulse)

      // 4. Draw Full Screen Triangle Strip
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationId = requestAnimationFrame(render)
    }
    render()

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationId)
      
      gl.deleteBuffer(buffer)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
})

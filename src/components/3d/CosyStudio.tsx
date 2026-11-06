"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import gsap from "gsap";
import { InteractiveObject } from "./InteractiveObject";

/**
 * VideoTexture handles the loading and updating of a video element
 * to be used as a texture on a 3D mesh.
 */
function VideoScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    // Create the video element
    const video = document.createElement("video");
    video.src = "/video/gta_loop.mp4"; // Assuming the video is placed here
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    // To reduce stutter, we ensure the video is fully loaded before starting
    video.load();

    // Attempt to play immediately
    video.play().catch(err => {
      console.warn("Autoplay prevented. Video will start on first interaction.", err);
    });

    videoRef.current = video;
    textureRef.current = new THREE.VideoTexture(video);

    // High-performance settings for video texture
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;

    // Screen Flicker Effect: Subtle random brightness shifts
    let animationFrameId: number;
    const flicker = () => {
      if (materialRef.current) {
        // Randomly vary intensity between 0.9 and 1.1 for a subtle flicker
        const intensity = 0.9 + Math.random() * 0.2;
        materialRef.current.color.setRGB(intensity, intensity, intensity);
      }
      animationFrameId = requestAnimationFrame(flicker);
    };
    flicker();

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.pause();
      video.src = "";
      video.load();
      textureRef.current?.dispose();
    };
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.9, 1.1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={textureRef.current || null}
          toneMapped={false}
        />
      </mesh>
      {/* Scanline Overlay */}
      <mesh position={[0, 0, 0.061]}>
        <planeGeometry args={[1.9, 1.1]} />
        <meshBasicMaterial
          transparent
          opacity={0.15}
          color="#000"
          alphaTest={0.01}
          map={new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/grid.png')} // Using a generic grid as a scanline approximation if local asset is missing, but better to use a custom shader or CSS-like pattern.
          // Since I can't easily create a PNG, I'll use a repeated small texture or just a very subtle overlay.
        />
      </mesh>
    </group>
  );
}

/**
 * CosyStudio implements the "lived-in" room layout with organic offsets,
 * specific asset positioning for depth layering, and the requested lighting.
 *
 * Coordinate System: Y=up, X=left/right, Z=forward/backward
 */
export default function CosyStudio() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const children = groupRef.current.children;

    children.forEach((child, index) => {
      if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
        if (index > 0 && index < 6) {
          const originalPos = child.position.clone();
          const originalRot = child.rotation.clone();

          child.position.set(
            originalPos.x + (Math.random() - 0.5) * 2,
            originalPos.y + 10,
            originalPos.z + (Math.random() - 0.5) * 2
          );

          child.rotation.set(
            Math.random() * 0.5,
            Math.random() * 0.5,
            Math.random() * 0.5
          );

          gsap.to(child.position, {
            x: originalPos.x,
            y: originalPos.y,
            z: originalPos.z,
            duration: 1.5,
            delay: (index - 1) * 0.1,
            ease: "elastic.out(1, 0.5)",
          });

          gsap.to(child.rotation, {
            x: originalRot.x,
            y: originalRot.y,
            z: originalRot.z,
            duration: 1.2,
            delay: (index - 1) * 0.1,
            ease: "power2.out"
          });
        }
      }
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
        <Noise opacity={0.05} />
      </EffectComposer>

      {/* --- BASE ROOM LAYER --- */}
      {/* High-res background representation: The room shell */}
      <group position={[0, 0, 0]}>
        {/* Floor: Large plane with subtle reflection/roughness for ambient lighting */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Back Wall: Primary surface for the background image/texture and posters */}
        <mesh position={[0, 2.5, -5]} receiveShadow>
          <planeGeometry args={[20, 5]} />
          <meshStandardMaterial
            color="#222"
            roughness={0.9}
          />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[10, 5]} />
          <meshStandardMaterial color="#1d1d1d" />
        </mesh>

        {/* Right Wall */}
        <mesh position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[10, 5]} />
          <meshStandardMaterial color="#1d1d1d" />
        </mesh>
      </group>

      {/* --- COORDINATE SYSTEM FOR INTERACTIVE OBJECTS ---
          All objects are placed relative to the floor (y=0)
          and the back wall (z=-5).
      */}

      {/* Electric Guitar: Leaning against the back-left wall. */}
      <group position={[-2.5, 0.0, -4.8]} rotation={[0, 0, 15 * (Math.PI / 180)]} scale={[0.3, 1.5, 1]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Messi Jersey: Hanging on a hook on the left wall. "Lived-in" offset applied. */}
      <group position={[-9.7, 1.8, -2.2]} rotation={[0, 52 * (Math.PI / 180), 8 * (Math.PI / 180)]} scale={[0.6, 0.8, 1]}>
        <mesh receiveShadow>
          <planeGeometry args={[1, 1.4]} />
          <meshStandardMaterial color="#800" />
        </mesh>
      </group>

      {/* TV / Monitor: Central focal point. */}
      <group position={[0.3, 1.5, -4.9]} rotation={[0, 10 * (Math.PI / 180), 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.2, 0.1]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <VideoScreen />
      </group>

      {/* Bayern Flag: Placed on the back wall. "Lived-in" offset applied. */}
      <group position={[1.3, 2.3, -4.85]} rotation={[0, -12 * (Math.PI / 180), 6 * (Math.PI / 180)]} scale={[0.7, 1.0, 1]}>
        <mesh receiveShadow>
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial color="#d00" />
        </mesh>
      </group>

      {/* Karan Aujla Poster: Layered on the back wall. "Lived-in" offset applied. */}
      <group position={[1.6, 1.7, -4.88]} rotation={[0, -12 * (Math.PI / 180), -6 * (Math.PI / 180)]} scale={[0.5, 0.7, 1]}>
        <mesh receiveShadow>
          <planeGeometry args={[1, 1.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </group>

      {/* --- AMBIENT LIGHTING --- */}

      {/* Warm "Golden Hour" Lamp: Amber #ffb45e. Cinematic intensity and position. */}
      <pointLight
        position={[-3, 3.5, -2]}
        color="#ffb45e"
        intensity={25}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Cool "Screen Glow": Cyan #57e6ff emitting from TV. Cinematic focus. */}
      <pointLight
        position={[0.3, 1.5, -4.8]}
        color="#57e6ff"
        intensity={15}
        distance={5}
        decay={1.5}
      />
    </group>
  );
}

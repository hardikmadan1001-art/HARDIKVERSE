"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import { InteractiveObject } from "./InteractiveObject";

/**
 * VideoTexture handles the loading and updating of a video element
 * to be used as a texture on a 3D mesh.
 */
function VideoScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // Create the video element
    const video = document.createElement("video");
    video.src = "/video/gta_loop.mp4"; // Assuming the video is placed here
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    // Attempt to play immediately
    video.play().catch(err => {
      console.warn("Autoplay prevented. Video will start on first interaction.", err);
    });

    videoRef.current = video;
    textureRef.current = new THREE.VideoTexture(video);

    // High-performance settings for video texture
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;

    return () => {
      video.pause();
      video.src = "";
      video.load();
      textureRef.current?.dispose();
    };
  }, []);

  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[1.9, 1.1]} />
      <meshBasicMaterial
        map={textureRef.current || null}
        toneMapped={false}
      />
    </mesh>
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
        // Only animate the assets, not the lights or the walls/floor
        // Assets are the objects we want to drop in.
        // Based on the JSX, they are after the base room layer group.
        // Base room layer is at index 0. Assets start at index 1.
        if (index > 0 && index < 6) {
          const originalPos = child.position.clone();
          const originalRot = child.rotation.clone();

          // Start position: falling from above with some random X/Z offset
          child.position.set(
            originalPos.x + (Math.random() - 0.5) * 2,
            originalPos.y + 10,
            originalPos.z + (Math.random() - 0.5) * 2
          );

          // Entry rotation: random tilt
          child.rotation.set(
            Math.random() * 0.5,
            Math.random() * 0.5,
            Math.random() * 0.5
          );

          gsap.to(child.position, {
            x: originalPos.x,
            y: originalPos.y,
            z: originalPos.z,
            duration: 1.2,
            delay: (index - 1) * 0.1,
            ease: "bounce.out",
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
      <InteractiveObject
        position={[-2.5, 0.0, -4.8]}
        rotation={[0, 0, 15 * (Math.PI / 180)]}
        assetPath="/assets/interactive/guitar.png"
        label="Electric Guitar"
        description="Where the melodies come to life."
        scale={[0.3, 1.5, 1]}
      />

      {/* Messi Jersey: Hanging on a hook on the left wall. */}
      <InteractiveObject
        position={[-9.8, 1.8, -2.0]}
        rotation={[0, 45 * (Math.PI / 180), 5 * (Math.PI / 180)]}
        assetPath="/assets/interactive/messi_jersey.png"
        label="Messi Jersey"
        description="The legendary GOAT's jersey. A symbol of pure brilliance."
        scale={[0.6, 0.8, 1]}
      />

      {/* TV / Monitor: Central focal point. */}
      <group position={[0.3, 1.5, -4.9]} rotation={[0, 10 * (Math.PI / 180), 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.2, 0.1]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <VideoScreen />
      </group>

      {/* Bayern Flag: Placed on the back wall. */}
      <InteractiveObject
        position={[1.2, 2.2, -4.9]}
        rotation={[0, -5 * (Math.PI / 180), 2 * (Math.PI / 180)]}
        assetPath="/assets/interactive/bayern_flag.png"
        label="Bayern Munich Flag"
        description="Mia San Mia. The spirit of Bavarian football."
        scale={[0.7, 1.0, 1]}
      />

      {/* Karan Aujla Poster: Layered on the back wall. */}
      <InteractiveObject
        position={[1.5, 1.8, -4.9]}
        rotation={[0, -5 * (Math.PI / 180), 0]}
        assetPath="/assets/interactive/aujla_poster.png"
        label="Karan Aujla Poster"
        description="The Geetan Di Machine. Pure energy."
        scale={[0.5, 0.7, 1]}
      />

      {/* --- AMBIENT LIGHTING --- */}

      {/* Warm "Golden Hour" Lamp: Amber #ffb45e */}
      <pointLight
        position={[-3, 3, -2]}
        color="#ffb45e"
        intensity={15}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cool "Screen Glow": Cyan #57e6ff emitting from TV */}
      <pointLight
        position={[0.3, 1.5, -4.9]}
        color="#57e6ff"
        intensity={10}
        distance={4}
        decay={2}
      />
    </group>
  );
}

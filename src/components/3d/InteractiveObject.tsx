import React, { useState } from "react";
import * as THREE from "three";
import { Text, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface InteractiveObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  assetPath: string;
  label: string;
  description: string;
  scale?: [number, number, number];
  framed?: boolean;
  frameColor?: string;
  isFabric?: boolean;
}

export function InteractiveObject({
  position,
  rotation = [0, 0, 0],
  assetPath,
  label,
  description,
  scale = [1, 1, 1],
  framed = false,
  frameColor = "#333",
  isFabric = false,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      {framed && (
        <group position={[0, 0, -0.01]}>
          <mesh>
            <boxGeometry args={[1.1, 1.1, 0.05]} />
            <meshStandardMaterial
              color={frameColor}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Bevel effect: a slightly smaller, recessed inner frame to create a bevel look */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.05, 1.05, 0.01]} />
            <meshStandardMaterial
              color={frameColor}
              roughness={0.05}
              metalness={1}
            />
          </mesh>
        </group>
      )}
      {/* High-res PNG asset using Image from @react-three/drei */}
      <Image
        url={assetPath}
        transparent
        castShadow
        receiveShadow
      />

      {/* Hover Label */}
      {hovered && (
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}

      {/* Active Description - Simple implementation: appears above when clicked */}
      {active && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.1}
          color="#57e6ff"
          maxWidth={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {description}
        </Text>
      )}
    </group>
  );
}

import React, { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { Text, Image, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FabricMaterial } from "./FabricMaterial";

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
  isPaper?: boolean;
  isGlossy?: boolean;
  normalMap?: string;
  colorGrading?: {
    r: number;
    g: number;
    b: number;
  };
  shadowIntensity?: number;
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
  isPaper = false,
  isGlossy = false,
  normalMap,
  colorGrading,
  shadowIntensity = 0,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const fabricMaterial = useMemo(() => {
    if (!isFabric) return null;

    const texture = useTexture(assetPath);
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
      vertexShader: FabricMaterial.vertexShader,
      fragmentShader: FabricMaterial.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [isFabric, assetPath]);

  useFrame((state) => {
    if (fabricMaterial) {
      fabricMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    if (groupRef.current) {
      // Smoothly animate scale based on hover state using lerp
      const targetScale = hovered ? 1.05 : 1;
      const currentScaleX = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScaleX, targetScale, 0.1);
      groupRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      {/* Subtle shadow under the frame/object */}
      {shadowIntensity > 0 && (
        <mesh position={[0, 0, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial
            color="black"
            transparent
            opacity={shadowIntensity}
            depthWrite={false}
          />
        </mesh>
      )}
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
      {isPaper ? (
        <mesh castShadow receiveShadow>
          {/* Use PlaneGeometry with segments to allow for bending/curling */}
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshStandardMaterial
            map={useTexture(assetPath)}
            transparent
            roughness={1}
            metalness={0}
            onBeforeCompile={(shader) => {
              // Add a subtle vertex displacement for the "paper curl" effect
              shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `
                float dist = distance(position.xy, vec2(0.5, 0.5));
                float curl = smoothstep(0.2, 0.7, dist) * 0.05;
                vec3 transformed = position;
                transformed.z += curl * sin(position.x * 10.0);
                `
              );
            }}
          />
          {/* Overlay an antique paper texture for realism */}
          <mesh scale={[1.001, 1.001, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#f4ecd8"
              transparent
              opacity={0.2}
              roughness={1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </mesh>
      ) : isFabric ? (
        <mesh castShadow receiveShadow>
          <planeGeometry args={[1, 1, 64, 64]} />
          <primitive object={fabricMaterial!} />
        </mesh>
      ) : isGlossy ? (
        <mesh castShadow receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={useTexture(assetPath)}
            transparent
            roughness={0.05}
            metalness={0.9}
            envMapIntensity={1.5}
          />
          {/* Clearcoat layer for high-gloss finish */}
          <mesh scale={[1.001, 1.001, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshPhysicalMaterial
              transparent
              color="#ffffff"
              opacity={0.3}
              roughness={0}
              metalness={0}
              clearcoat={1.0}
              clearcoatRoughness={0}
              transmission={0.5}
              thickness={0.1}
            />
          </mesh>
        </mesh>
      ) : (
        <Image
          url={assetPath}
          transparent
          castShadow
          receiveShadow
          color={colorGrading ? new THREE.Color(`rgb(${colorGrading.r * 255}, ${colorGrading.g * 255}, ${colorGrading.b * 255})`) : "white"}
        />
      )}

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

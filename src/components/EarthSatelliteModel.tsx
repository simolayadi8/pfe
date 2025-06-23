import { useGLTF, Stars, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function EarthSatelliteModel() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/scene.gltf");
  const { theme } = useTheme(); // ✅ important

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
    }
  });

  // Update opacity on the model
  if (scene) {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            m.transparent = true;
            m.opacity = 0.7;
          });
        } else {
          mesh.material.transparent = true;
          mesh.material.opacity = 0.7;
        }
      }
    });
  }

  return (
    <>
      {/* Lumières */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.5} color={"#ffffff"} />

      {/* Fond étoilé */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
        color={theme === "dark" ? "white" : "black"} // ✅ écoute le thème
      />

      {/* Globe affiché uniquement en dark mode */}
      {theme === "dark" && (
        <primitive
          ref={ref}
          object={scene}
          scale={14}
          position={[0, 0.5, 0]}
        />
      )}

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

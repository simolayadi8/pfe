import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import { EarthSatelliteModel } from "@/components/EarthSatelliteModel";
import { useTheme } from "next-themes";

export default function EarthSatellite3D() {
  const { theme } = useTheme();

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      {/* Appliquer une couleur de fond correctement sans écraser le modèle */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 30 }}
      >
        {/* Changer dynamiquement la couleur du fond via un simple color management */}
        <color attach="background" args={[theme === "light" ? "#ffffff" : "#000000"]} />

        {/* Stars visibles seulement en mode dark */}
        {theme === "dark" && (
          <Stars
            radius={50}
            depth={50}
            count={8000}
            factor={4}
            fade
            speed={1}
          />
        )}

        {/* Particules flottantes */}
        <Sparkles
          count={100}
          speed={0.5}
          size={2}
          color={theme === "light" ? "black" : "white"}
          opacity={0.7}
          scale={[10, 10, 10]}
        />

        {/* Lumières */}
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        {/* Modèle 3D */}
        <EarthSatelliteModel />

        {/* OrbitControls */}
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}

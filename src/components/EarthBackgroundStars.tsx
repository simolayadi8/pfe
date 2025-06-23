import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useTheme } from "next-themes";

export default function EarthBackgroundStars() {
  const { theme } = useTheme();

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-20">
      <Canvas>
        {/* Fond noir ou blanc */}
        <color attach="background" args={[theme === "dark" ? "#000000" : "#ffffff"]} />
        
        {/* Étoiles visibles uniquement en dark */}
        
          <Stars
            radius={100}
            depth={50}
            count={6000}
            factor={4}
            fade
            speed={1}
          />
        
      </Canvas>
    </div>
  );
}

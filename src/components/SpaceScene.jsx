import { Canvas, useThree } from "@react-three/fiber";
import { useState, Suspense, useEffect} from "react";
import { Stars, OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei";

import Rocket from "./Rocket";
import Planets from "./Planets";
import LoadingScreen from "./LoadingScreen";

function SpaceBackground() {
	const bgTexture = useTexture("/models/textures/bg.jpg");
	const { scene } = useThree();
	
	useEffect(() => {
		scene.background = bgTexture;
	}, [scene, bgTexture]);
	
	return null;
}
	

export default function SpaceScene() {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
			{loading ? (
				<LoadingScreen/>
      ) : (
        <Canvas>
					
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <pointLight position={[-20, 30, 30]} color="#fff" intensity={3000}/>
					<ambientLight intensity={0.1} />
          <Suspense fallback={null}>
            <Rocket />
          </Suspense>
					<Planets />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true}/>
          <Stars radius={200} depth={10} count={1000} factor={4} saturation={0} fade={true}/>
          <OrbitControls />
					{/* <axesHelper args={[5]} /> */}
        </Canvas>
      )}
    </div>
  );
}

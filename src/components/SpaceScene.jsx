import React, { useRef, useState, Suspense, useEffect} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Planets from "./Planets";
import LoadingScreen from "./LoadingScreen";
import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

function Rocket() {
  const rocketRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const speed = 0.2;
	const rotationSpeed = 0.05;

  const materials = useLoader(MTLLoader, "/models/Toy Rocket.mtl");
  const obj = useLoader(
    OBJLoader,
    "/models/Toy Rocket.obj",
    (loader) => {
      if (materials) {
        loader.setMaterials(materials);
      }
    }
  );

	// Calculate forward direction based on current rotation
	const newPosition = [...position];
	const newRotation = [...rotation];
	const direction = new THREE.Vector3(0, 0, 1);
	const quaternion = new THREE.Quaternion();
	quaternion.setFromEuler(new THREE.Euler(newRotation[0], newRotation[1], newRotation[2]));
	direction.applyQuaternion(quaternion);
	direction.normalize();

  const handleKeyDown = (e) => {

		switch(e.key) {
			case "ArrowDown":
				// Move forward in the direction the rocket is pointing
				newPosition[0] += direction.x * speed;
				newPosition[1] += direction.y * speed;
				newPosition[2] += direction.z * speed;
				break;
			case "ArrowUp":
				// Move backward
				newPosition[0] -= direction.x * speed;
				newPosition[1] -= direction.y * speed;
				newPosition[2] -= direction.z * speed;
				break;
			case "ArrowLeft":
				// Rotate left around Y axis
				newRotation[1] += rotationSpeed;
				break;
			case "ArrowRight":
				// Rotate right around Y axis
				newRotation[1] -= rotationSpeed;
				break;
			case "w":
				// Pitch up
				newRotation[0] -= rotationSpeed;
				break;
			case "s":
				// Pitch down
				newRotation[0] += rotationSpeed;
				break;
		}

    setPosition(newPosition);
    setRotation(newRotation);
  };

  useFrame((state) => {
    if (rocketRef.current) {
      // Apply position and rotation directly to the rocket
      rocketRef.current.position.set(...position);
      rocketRef.current.rotation.set(...rotation);

      // Calculate camera position relative to the rocket
      const cameraOffset = new THREE.Vector3(0, 2, 8);
      cameraOffset.applyEuler(new THREE.Euler(...rotation));
      const cameraPosition = new THREE.Vector3(...position).add(cameraOffset);

      // Update camera
      state.camera.position.lerp(cameraPosition, 0.1);
      state.camera.lookAt(new THREE.Vector3(...position));
    }
  });

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, rotation]);

	return (
    <group ref={rocketRef} scale={[0.5, 0.5, 0.5]}>
			<primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} />
			{/* Bright point light near the rocket */}
			<pointLight position={[0, 0, 10]} color="#FFFFFF" intensity={5} distance={500} decay={2} />
			{/* Ambient light for overall illumination */}
			<ambientLight intensity={0.8} />
			{/* Spotlight for additional focus */}
			<spotLight
				position={[0, 5, 5]}
				color="#FFFFFF"
				intensity={5}
				angle={Math.PI / 6}
				penumbra={0.5}
			/>
		</group>
	);
	
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
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <Rocket />
          </Suspense>
					<Planets />
          <Stars />
          <OrbitControls />
					<axesHelper args={[5]} />
        </Canvas>
      )}
    </div>
  );
}
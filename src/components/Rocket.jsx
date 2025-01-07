import React, { useRef, useState, Suspense, useEffect} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export default function Rocket() {
  const rocketRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
	const [engineTurnOn, setEngineTurnOn] = useState(false);
  const speed = 0.01;
	const rotationSpeed = 0.01;
	

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
			case " ":
				 // Toggle engine on/off
				setEngineTurnOn((prev) => !prev);
				break;
			case "ArrowLeft":
				// Rotate left around Y axis
				newRotation[1] += rotationSpeed;
				break;
			case "ArrowRight":
				// Rotate right around Y axis
				newRotation[1] -= rotationSpeed;
				break;
			case "ArrowUp":
				// Pitch up
				newRotation[0] += rotationSpeed;
				break;
			case "ArrowDown":
				// Pitch down
				newRotation[0] -= rotationSpeed;
				break;
		}

    setPosition(newPosition);
    setRotation(newRotation);
  };
	useFrame((state) => {
		if (rocketRef.current) {
			// Calculate forward direction based on current rotation
			const direction = new THREE.Vector3(0, 0, 1);
			const quaternion = new THREE.Quaternion();
			quaternion.setFromEuler(new THREE.Euler(...rotation));
			direction.applyQuaternion(quaternion);
			direction.normalize();
	
			// Update position if engine is on
			if (engineTurnOn) {
				setPosition((prevPosition) => [
					prevPosition[0] - direction.x * speed,
					prevPosition[1] - direction.y * speed,
					prevPosition[2] - direction.z * speed,
				]);
			}
	
			setRotation((prevRotation) => [
				prevRotation[0],
				prevRotation[1],
				prevRotation[2] - 0.01, // Rotate along Z-axis
			]);
	
			// Apply position and rotation to the rocket
			rocketRef.current.position.set(...position);
			rocketRef.current.rotation.set(...rotation);
	
			// Calculate camera position relative to the rocket
			const cameraOffset = new THREE.Vector3(0, 2, 8);
			cameraOffset.applyEuler(new THREE.Euler(rotation[0], rotation[1], 0));
			const cameraPosition = new THREE.Vector3(...position).add(cameraOffset);
	
			// Update camera position and focus
			state.camera.position.lerp(cameraPosition, 0.1);
			state.camera.lookAt(new THREE.Vector3(...position));
		}
	});
	

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, rotation]);

	return (
    <group ref={rocketRef} scale={[0.3, 0.3, 0.3]}>
			<primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} />
			{/* Bright point light near the rocket */}
			<pointLight position={[0, 5, 10]} color="red" intensity={5} distance={5} decay={2} />
		</group>
	);
	
}
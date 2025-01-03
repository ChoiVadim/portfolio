import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from 'three';
import { Howl } from 'howler';

// Sound effects
const hoverSound = new Howl({
  src: ['/sounds/hover.mp3'],
  volume: 0.5
});

const clickSound = new Howl({
  src: ['/sounds/click.mp3'],
  volume: 0.5
});

// Particle System Component
function ParticleSystem({ color, count = 100, size = 0.02, radius = 1.5 }) {
  const particles = useRef();
  
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for(let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.2;
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    
    particles.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  }, [count, radius]);

  useFrame((state) => {
    particles.current.rotation.y += 0.001;
  });

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Orbit Ring Component
function OrbitRing({ radius, color }) {
  const ring = useRef();
  
  useFrame(() => {
    ring.current.rotation.z += 0.001;
    ring.current.rotation.x = Math.PI / 4;
  });

  return (
    <mesh ref={ring}>
      <ringGeometry args={[radius - 0.1, radius + 0.1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Planet Component (enhanced)
function Planet({ position, color, size, rotationSpeed, name, info }) {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  const handleHover = (isHovering) => {
    setHovered(isHovering);
    if (isHovering) {
      hoverSound.play();
      setTimeout(() => setShowInfo(true), 500);
    } else {
      setShowInfo(false);
    }
  };

  return (
    <group position={position}>
      <OrbitRing radius={size * 1.5} color={color} />
      <ParticleSystem color={color} radius={size * 2} />
      
      <mesh
        ref={planetRef}
        onPointerEnter={() => handleHover(true)}
        onPointerLeave={() => handleHover(false)}
        onClick={() => clickSound.play()}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.7}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      
      {showInfo && (
        <group position={[0, size + 1, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
          >
            {info}
          </Text>
        </group>
      )}
    </group>
  );
}

// Rest of your planetData and export remain the same...

const planetData = [
  {
    name: "Skills",
    position: [8, 0, -5],
    color: "#4444FF",
    size: 1,
    rotationSpeed: 0.01,
    info: "JavaScript • React • Three.js • Node.js"
  },
  {
    name: "Experience",
    position: [-8, 0, -5],
    color: "#44FF44",
    size: 1.2,
    rotationSpeed: 0.015,
    info: "5+ years of web development experience"
  },
  {
    name: "Projects",
    position: [0, 8, -5],
    color: "#FF4444",
    size: 1.1,
    rotationSpeed: 0.02,
    info: "Portfolio • E-commerce • Web Apps"
  },
  {
    name: "Education",
    position: [0, -8, -5],
    color: "#FFFF44",
    size: 0.9,
    rotationSpeed: 0.012,
    info: "Computer Science Degree"
  },
  {
    name: "About",
    position: [12, 6, -8],
    color: "#FF44FF",
    size: 1.3,
    rotationSpeed: 0.008,
    info: "Passionate developer from South Korea"
  },
  {
    name: "Contact",
    position: [-12, -6, -8],
    color: "#44FFFF",
    size: 0.8,
    rotationSpeed: 0.018,
    info: "Email • GitHub • LinkedIn"
  },
  {
    name: "Interests",
    position: [6, -12, -8],
    color: "#FFA500",
    size: 1,
    rotationSpeed: 0.014,
    info: "3D Graphics • Game Dev • AI"
  },
  {
    name: "Goals",
    position: [-6, 12, -8],
    color: "#8844FF",
    size: 1.1,
    rotationSpeed: 0.016,
    info: "Creating innovative web experiences"
  }
];


export default function Planets() {
  return (
    <>
      {planetData.map((planet, index) => (
        <Planet key={index} {...planet} />
      ))}
    </>
  );
}
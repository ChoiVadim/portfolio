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
function Planet({ position, texture, color, size, rotationSpeed, name, info }) {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const planetTexture = useTexture(texture);

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
      {/* <OrbitRing radius={size * 1.5} color={color} />
      <ParticleSystem color={color} radius={size * 2} /> */}
      
      <mesh
        ref={planetRef}
        onPointerEnter={() => handleHover(true)}
        onPointerLeave={() => handleHover(false)}
        onClick={() => clickSound.play()}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={planetTexture}
          transparent
          opacity={hovered ? 0.5 : 1}
        />
      </mesh>
      
      {showInfo && (
        <group position={[0, size + 1, 0]}>
          <Text
            position={[-5, -1, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
          <Text
            position={[-5, -2, 0]}
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

const planetData = [
  {
    name: "Introduction",
    position: [8, 0, -5],
    texture: "/models/textures/moon.jpg",
    color: "#44FFFF",
    size: 5,
    rotationSpeed: 0.0003,
    info: "Hi, I'm a web developer from South Korea"
  },
  {
    name: "Experience",
    position: [-20, 0, -30],
    texture: "/models/textures/2k_earth_daymap.jpg",
    color: "#44FF44",
    size: 7,
    rotationSpeed: 0.001,
    info: "5+ years of web development experience"
  },
  {
    name: "Projects",
    position: [-5, -5, -60],
    texture: "/models/textures/2k_mars.jpg",
    color: "#FF4444",
    size: 5,
    rotationSpeed: 0.002,
    info: "Portfolio • E-commerce • Web Apps"
  },
  {
    name: "Education",
    position: [0, -8, -90],
    texture: "/models/textures/2k_saturn.jpg",
    color: "#FFFF44",
    size: 7,
    rotationSpeed: 0.002,
    info: "Computer Science Degree"
  },
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
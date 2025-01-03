import React from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress } = useProgress();
  
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 1000,
      }}
    >
      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Welcome to My Space Portfolio</h1>
      <div style={{ width: '200px', height: '5px', background: '#333', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#fff',
            borderRadius: '5px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ marginTop: '10px' }}>{progress.toFixed(0)}% loaded</p>
    </div>
  );
}
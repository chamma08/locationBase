import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/models/model2.gltf');
  return <primitive object={gltf.scene} />;
};

const ThreeDModel = () => {
  return (
    <Canvas>
      <Suspense fallback={<span>Loading...</span>}>
        <ambientLight intensity={0.5}/>
        <pointLight position={[10, 10, 10]} />
        <Model />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ThreeDModel;

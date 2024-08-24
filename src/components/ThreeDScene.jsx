import React from 'react';
import { useGLTF } from '@react-three/drei';

const ThreeDScene = () => {
  const { scene } = useGLTF('/models/model2.gltf');

  return <primitive object={scene} scale={1.5} />;
};

export default ThreeDScene;

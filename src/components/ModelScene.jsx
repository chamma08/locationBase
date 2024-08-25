// src/components/ModelScene.jsx
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { useThree } from '@react-three/fiber';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[0.1, 0.1, 0.1]} />;
}

const SceneContent = ({ modelUrl }) => {
  const { gl } = useThree();

  useEffect(() => {
    // Append the ARButton to the document body for WebXR
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Cleanup function to remove the ARButton when the component unmounts
    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl]);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Model url={modelUrl} />
      <OrbitControls />
      <Environment preset="sunset" />
    </Suspense>
  );
};

const ModelScene = ({ modelUrl }) => {
  return (
    <Canvas>
      <SceneContent modelUrl={modelUrl} />
    </Canvas>
  );
};

export default ModelScene;

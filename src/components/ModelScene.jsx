// src/components/ModelScene.jsx
import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[0, 50, 0]} />;
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Position the camera to look at the sky
    camera.position.set(0, 10, 20); // Adjust as needed
    camera.lookAt(0, 50, 0); // Look towards the model in the sky

    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl, camera]);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={false} />
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

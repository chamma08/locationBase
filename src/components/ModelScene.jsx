// src/components/ModelScene.jsx
import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

function Model({ url, position }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={position} />;
}

const SceneContent = ({ modelUrl }) => {
  const { gl } = useThree();

  useEffect(() => {
    // Create AR Button and add it to the document body
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Cleanup: remove AR button when component unmounts
    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl]);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Model url={modelUrl} position={[0, 50, 0]} /> {/* Adjust the Y position to raise the model */}
      <OrbitControls enableZoom={true} enablePan={false} /> {/* Enable/disable based on your requirement */}
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

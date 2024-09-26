// src/components/ModelScene.jsx
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { useThree } from "@react-three/fiber";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} />;
}

const SceneContent = ({ modelUrl }) => {
  const { gl } = useThree();

  useEffect(() => {

    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl]);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={false} />{" "}
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

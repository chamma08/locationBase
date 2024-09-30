import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner"; // Import the Loading Spinner

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    // Slightly reduce scale and position to ensure it's within view
    <primitive object={scene} scale={[0.7, 0.7, 0.7]} position={[0, 5, 0]} /> 
  );
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Adjust the camera position to be closer and looking at the model
    camera.position.set(0, 2, 10); // Bring the camera closer
    camera.lookAt(0, 5, 0); // Look directly at the model's position

    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl, camera]);

  return (
    <Suspense
      fallback={
        <Html center>
          <LoadingSpinner />
        </Html>
      }
    >
      <ambientLight intensity={0.7} />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={true} />
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

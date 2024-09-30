import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner"; // Import the Loading Spinner

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    // Increase the scale to make the model bigger and move it higher in the sky by increasing the y-position
    <primitive object={scene} scale={[1, 1, 1]} position={[0, 20, 0]} /> 
  );
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Adjust the camera position and direction to view the model in the sky
    camera.position.set(0, 2, 10); // Adjust camera to be lower looking up
    camera.lookAt(0, 20, 0); // Look at the model's position in the sky

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

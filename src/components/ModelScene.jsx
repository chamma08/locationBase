import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner"; // Import the Loading Spinner

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    // Increase the y position to raise the model into the sky
    <primitive object={scene} scale={[0.5, 0.5, 0.5]} position={[0, 10, 0]} /> 
  );
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Adjust the camera for mobile devices
    camera.position.set(0, 1.5, 8); // Set the camera a bit farther back to view the model in the sky
    camera.lookAt(0, 10, 0); // Look at the model's new position in the sky
    camera.fov = 75; // Widen the field of view for mobile screens
    camera.updateProjectionMatrix(); // Update camera projection matrix

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
